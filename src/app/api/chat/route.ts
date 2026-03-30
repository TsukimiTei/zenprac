import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt, buildZenCardPrompt } from '@/lib/prompts';
import { parseHiddenEval, calculateEnlightenmentLevel, hasSafetyFlag } from '@/lib/enlightenment';
import { ENLIGHTENMENT_LEVELS, MAX_DAILY_SESSIONS } from '@/lib/constants';
import { MasterType, SessionMode, HiddenEval } from '@/types';

// Truncate reply to ~100 chars at nearest sentence boundary
function truncateReply(text: string, maxLen = 100): string {
  if (text.length <= maxLen) return text;
  // Find last sentence-ending punctuation within limit
  const slice = text.slice(0, maxLen);
  const lastPunct = Math.max(
    slice.lastIndexOf('。'),
    slice.lastIndexOf('？'),
    slice.lastIndexOf('！'),
    slice.lastIndexOf('…')
  );
  if (lastPunct > 10) return text.slice(0, lastPunct + 1);
  // Fallback: cut at maxLen
  return slice;
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('[chat] auth check:', user?.id, authError?.message);
    if (authError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;
    console.log('[chat] action:', action, 'master:', body.masterType, 'mode:', body.mode);

    switch (action) {
      case 'start_session':
        return handleStartSession(supabase, user.id, body);
      case 'send_message':
        return handleSendMessage(supabase, user.id, body);
      case 'end_session':
        return handleEndSession(supabase, user.id, body);
      default:
        return NextResponse.json({ error: '无效操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '云雾遮山，稍候再试：' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

async function handleStartSession(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: { masterType: MasterType; mode: SessionMode; dailyQuestion?: string; skipDailyLimit?: boolean }
) {
  const { masterType, mode, dailyQuestion } = body;

  // Check daily limit (skipped if dev flag is set)
  const skipLimit = body.skipDailyLimit && process.env.NODE_ENV === 'development';
  let sessionsCount = 0;
  const today = new Date().toISOString().split('T')[0];
  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today);
  sessionsCount = count || 0;

  if (!skipLimit && sessionsCount >= MAX_DAILY_SESSIONS) {
    return NextResponse.json(
      { error: '今日参禅已满，明日再来' },
      { status: 429 }
    );
  }

  // Create session
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      master_type: masterType,
      mode,
    })
    .select()
    .single();

  if (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: '创建会话失败' }, { status: 500 });
  }

  // Build system prompt and get initial message
  const systemPrompt = buildSystemPrompt(masterType, mode, dailyQuestion);

  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const rawContent = completion.choices[0]?.message?.content || '';
  const parsed = parseHiddenEval(rawContent);
  const cleanContent = truncateReply(parsed.cleanContent);
  const hiddenEval = parsed.eval;

  // Save system prompt as hidden message
  await supabase.from('session_messages').insert({
    session_id: session.id,
    role: 'system',
    content: systemPrompt,
    round_number: 0,
  });

  // Save assistant's opening message
  await supabase.from('session_messages').insert({
    session_id: session.id,
    role: 'assistant',
    content: cleanContent,
    hidden_eval: hiddenEval,
    round_number: 1,
  });

  return NextResponse.json({
    sessionId: session.id,
    message: {
      role: 'assistant',
      content: cleanContent,
    },
    sessionsToday: sessionsCount + 1,
  });
}

async function handleSendMessage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: { sessionId: string; content: string }
) {
  const { sessionId, content } = body;

  // Verify session belongs to user
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single();

  if (!session) {
    return NextResponse.json({ error: '会话不存在' }, { status: 404 });
  }

  if (session.is_completed) {
    return NextResponse.json({ error: '此次参禅已结束' }, { status: 400 });
  }

  // Get all previous messages
  const { data: prevMessages } = await supabase
    .from('session_messages')
    .select('role, content, round_number')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  // Count user messages to determine round number
  const userMessageCount = (prevMessages || []).filter(m => m.role === 'user').length;
  const roundNumber = userMessageCount + 1;

  // Save user message
  await supabase.from('session_messages').insert({
    session_id: sessionId,
    role: 'user',
    content,
    round_number: roundNumber,
  });

  // Build messages array for OpenAI
  const apiMessages = (prevMessages || []).map(m => ({
    role: m.role as 'system' | 'user' | 'assistant',
    content: m.content,
  }));
  apiMessages.push({ role: 'user', content });

  // Get AI response
  const completion = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: apiMessages,
    temperature: 0.8,
    max_tokens: 200,
  });

  const rawContent = completion.choices[0]?.message?.content || '';
  const parsed = parseHiddenEval(rawContent);
  const cleanContent = truncateReply(parsed.cleanContent);
  const hiddenEval = parsed.eval;
  const safetyFlag = hasSafetyFlag(rawContent);

  // Save assistant message
  await supabase.from('session_messages').insert({
    session_id: sessionId,
    role: 'assistant',
    content: cleanContent,
    hidden_eval: hiddenEval,
    round_number: roundNumber,
  });

  // Check if session should end
  let sessionEnded = false;
  let finalLevel = null;

  if (hiddenEval?.should_end) {
    // Get all evals for this session
    const { data: allMessages } = await supabase
      .from('session_messages')
      .select('hidden_eval')
      .eq('session_id', sessionId)
      .not('hidden_eval', 'is', null);

    const allEvals = (allMessages || [])
      .map(m => m.hidden_eval as HiddenEval)
      .filter(Boolean);

    finalLevel = calculateEnlightenmentLevel(allEvals);
    sessionEnded = true;

    // Update session
    await supabase
      .from('sessions')
      .update({
        is_completed: true,
        final_level: finalLevel,
        final_score: allEvals.length > 0
          ? allEvals.reduce((sum, e) => sum + e.round_score, 0) / allEvals.length
          : 0,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // Update profile stats
    const points = ENLIGHTENMENT_LEVELS[finalLevel].points;
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_sessions, total_score')
      .eq('user_id', userId)
      .single();

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          total_sessions: profile.total_sessions + 1,
          total_score: profile.total_score + points,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    // Generate zen card
    try {
      const userMessages = (prevMessages || [])
        .filter(m => m.role !== 'system')
        .concat([
          { role: 'user', content, round_number: roundNumber },
          { role: 'assistant', content: cleanContent, round_number: roundNumber },
        ]);

      const cardPrompt = buildZenCardPrompt(
        userMessages.map(m => ({ role: m.role, content: m.content })),
        session.master_type as MasterType,
        finalLevel
      );

      const cardCompletion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: cardPrompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      const cardRaw = cardCompletion.choices[0]?.message?.content || '';
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonMatch = cardRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cardData = JSON.parse(jsonMatch[0]);
        await supabase.from('zen_cards').insert({
          session_id: sessionId,
          user_id: userId,
          master_type: session.master_type,
          core_question: cardData.core_question,
          core_answer: cardData.core_answer,
          master_comment: cardData.master_comment,
          enlightenment_level: finalLevel,
          score: allEvals.length > 0
            ? allEvals.reduce((sum, e) => sum + e.round_score, 0) / allEvals.length
            : 0,
        });
      }
    } catch (cardError) {
      console.error('Zen card generation error:', cardError);
      // Non-critical, don't fail the response
    }
  }

  return NextResponse.json({
    message: {
      role: 'assistant',
      content: cleanContent,
    },
    sessionEnded,
    finalLevel,
    safetyFlag,
  });
}

async function handleEndSession(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  body: { sessionId: string }
) {
  const { sessionId } = body;

  // Check if user actually participated (sent at least one message)
  const { count: userMessageCount } = await supabase
    .from('session_messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
    .eq('role', 'user');

  const hasUserInput = (userMessageCount || 0) > 0;

  if (!hasUserInput) {
    // No user input — just close the session silently, no card, no level, no stats
    await supabase
      .from('sessions')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return NextResponse.json({
      finalLevel: null,
      points: 0,
    });
  }

  // Get all evals
  const { data: allMessages } = await supabase
    .from('session_messages')
    .select('hidden_eval')
    .eq('session_id', sessionId)
    .not('hidden_eval', 'is', null);

  const allEvals = (allMessages || [])
    .map(m => m.hidden_eval as HiddenEval)
    .filter(Boolean);

  const finalLevel = calculateEnlightenmentLevel(allEvals);

  // Update session
  await supabase
    .from('sessions')
    .update({
      is_completed: true,
      final_level: finalLevel,
      final_score: allEvals.length > 0
        ? allEvals.reduce((sum, e) => sum + e.round_score, 0) / allEvals.length
        : 0,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  // Update profile stats
  const points = ENLIGHTENMENT_LEVELS[finalLevel].points;
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_sessions, total_score')
    .eq('user_id', userId)
    .single();

  if (profile) {
    await supabase
      .from('profiles')
      .update({
        total_sessions: profile.total_sessions + 1,
        total_score: profile.total_score + points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  }

  // Generate zen card
  try {
    const { data: sessionMessages } = await supabase
      .from('session_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .neq('role', 'system')
      .order('created_at', { ascending: true });

    const { data: session } = await supabase
      .from('sessions')
      .select('master_type')
      .eq('id', sessionId)
      .single();

    if (sessionMessages && session) {
      const cardPrompt = buildZenCardPrompt(
        sessionMessages.map(m => ({ role: m.role, content: m.content })),
        session.master_type as MasterType,
        finalLevel
      );

      const cardCompletion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: cardPrompt }],
        temperature: 0.7,
        max_tokens: 300,
      });

      const cardRaw = cardCompletion.choices[0]?.message?.content || '';
      const jsonMatch = cardRaw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cardData = JSON.parse(jsonMatch[0]);
        await supabase.from('zen_cards').insert({
          session_id: sessionId,
          user_id: userId,
          master_type: session.master_type,
          core_question: cardData.core_question,
          core_answer: cardData.core_answer,
          master_comment: cardData.master_comment,
          enlightenment_level: finalLevel,
          score: allEvals.length > 0
            ? allEvals.reduce((sum, e) => sum + e.round_score, 0) / allEvals.length
            : 0,
        });
      }
    }
  } catch (cardError) {
    console.error('Zen card generation error:', cardError);
  }

  return NextResponse.json({
    finalLevel,
    points: ENLIGHTENMENT_LEVELS[finalLevel].points,
  });
}
