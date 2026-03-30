import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { text, voiceId = 'alloy', voiceSpeed } = await request.json();
    console.log('[tts] request:', voiceId, 'speed:', voiceSpeed, text?.substring(0, 30));

    if (!text || text.length > 1000) {
      return NextResponse.json({ error: '文本无效' }, { status: 400 });
    }

    // Valid OpenAI TTS voices
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const voice = validVoices.includes(voiceId) ? voiceId : 'alloy';

    // Per-master speed: 0.82 (shakyamuni/slow) to 0.95 (huineng/natural), fallback 0.9
    const speed = typeof voiceSpeed === 'number' && voiceSpeed >= 0.5 && voiceSpeed <= 2.0
      ? voiceSpeed : 0.9;

    const mp3 = await getOpenAI().audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'TTS 生成失败' }, { status: 500 });
  }
}
