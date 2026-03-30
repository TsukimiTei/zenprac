'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { MASTERS, ENLIGHTENMENT_LEVELS } from '@/lib/constants';
import { MasterType, SessionMode, EnlightenmentLevel } from '@/types';
import { getTodayQuestion } from '@/lib/questions';
import { VoiceSpeaker } from '@/lib/voice';
import VoiceButton from '@/components/session/VoiceButton';
import SpeakerButton from '@/components/session/SpeakerButton';
import { getDevFlags } from '@/components/DevPanel';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const masterType = searchParams.get('master') as MasterType;
  const mode = searchParams.get('mode') as SessionMode;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [finalLevel, setFinalLevel] = useState<EnlightenmentLevel | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speakerRef = useRef<VoiceSpeaker | null>(null);

  const master = masterType ? MASTERS[masterType] : null;

  useEffect(() => {
    speakerRef.current = new VoiceSpeaker();
    return () => speakerRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!masterType || !mode || !master) return;

    async function startSession() {
      try {
        const dailyQuestion = mode === 'daily' ? getTodayQuestion().question_text : undefined;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'start_session',
            masterType,
            mode,
            dailyQuestion,
            skipDailyLimit: getDevFlags().disableDailyLimit,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || '云雾遮山，稍候再试');
          setIsStarting(false);
          return;
        }

        const data = await res.json();
        setSessionId(data.sessionId);
        setMessages([{
          id: '1',
          role: 'assistant',
          content: data.message.content,
        }]);
        setIsStarting(false);

        // Play opening message voice
        if (voiceEnabled && master && speakerRef.current) {
          speakerRef.current.speak(
            data.message.content,
            master.voiceId,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false),
            master.voiceSpeed
          );
        }
      } catch {
        setError('云雾遮山，稍候再试');
        setIsStarting(false);
      }
    }

    startSession();
  }, [masterType, mode]);

  // Focus input automatically when it's user's turn
  useEffect(() => {
    if (!isLoading && !isStarting && !isComplete && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isLoading, isStarting, isComplete]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !sessionId || isComplete) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          sessionId,
          content: userMessage.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || '云雾遮山，稍候再试');
        setIsLoading(false);
        return;
      }

      const data = await res.json();

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message.content,
      }]);

      if (voiceEnabled && master && speakerRef.current) {
        speakerRef.current.speak(
          data.message.content,
          master.voiceId,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          master.voiceSpeed
        );
      }

      if (data.sessionEnded) {
        setIsComplete(true);
        setFinalLevel(data.finalLevel);
        setTimeout(() => setShowResult(true), voiceEnabled ? 3000 : 1500);
      }
    } catch {
      setError('云雾遮山，稍候再试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end_session',
          sessionId,
        }),
      });

      const data = await res.json();
      setIsComplete(true);
      setFinalLevel(data.finalLevel);
      setTimeout(() => setShowResult(true), 500);
    } catch {
      setError('结束会话失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!masterType || !mode || !master) {
    router.push('/home');
    return null;
  }

  // Get the latest exchange (up to 2 messages: user + assistant)
  const latestMessages = messages.slice(-2);
  const olderMessages = messages.slice(0, -2);

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden font-serif"
      style={{ backgroundColor: master.theme.bg }}
    >
      {/* Deep Space Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-1/4 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[150px] animate-breath-bg"
          style={{ backgroundColor: `${master.theme.primary}10` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] rounded-full blur-[200px] animate-breath-bg delay-1000"
          style={{ backgroundColor: `${master.theme.secondary}05` }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Minimalist Controls - fade out when typing or speaking */}
      <header className={`absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-start transition-opacity duration-1000 ${input.length > 0 || isSpeaking ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => {
            if (!isComplete && sessionId) {
              if (confirm('确定要离开吗？当前参禅将结束。')) {
                handleEndSession();
              }
            } else {
              router.push('/home');
            }
          }}
          className="text-stone-500 hover:text-stone-300 transition-colors text-xs tracking-[0.4em] opacity-50 hover:opacity-100"
        >
          ← 归去
        </button>

        <div className="flex flex-col items-end gap-4">
          {!isComplete && sessionId && master && (
            <SpeakerButton
              enabled={voiceEnabled}
              onToggle={setVoiceEnabled}
              accentColor={master.theme.accent}
            />
          )}
          {!isComplete && sessionId && (
            <button
              onClick={handleEndSession}
              className="text-stone-600 text-[10px] hover:text-stone-300 transition-colors tracking-[0.3em] opacity-50 hover:opacity-100"
            >
              结束参禅
            </button>
          )}
        </div>
      </header>

      {/* Mind Stream Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-20">
        
        {/* Older Messages fading into the background */}
        <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none overflow-hidden flex flex-col justify-end items-center pb-12 mask-gradient">
          {olderMessages.slice(-3).map((msg, idx) => (
            <div 
              key={msg.id}
              className={`text-center max-w-2xl mb-8 animate-float-up`}
              style={{
                opacity: 0.1 + (idx * 0.1),
                transform: `scale(${0.8 + (idx * 0.05)})`,
                filter: `blur(${4 - idx}px)`
              }}
            >
              <p className="text-sm md:text-base tracking-widest text-stone-500 line-clamp-2">
                {msg.content}
              </p>
            </div>
          ))}
        </div>

        {/* Current Focus Area */}
        <div className="w-full max-w-3xl space-y-16 mt-20">
          {isStarting && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="text-6xl animate-pulse-slow opacity-80" style={{ textShadow: `0 0 50px ${master.theme.primary}` }}>
                {masterType === 'shakyamuni' ? '🙏' : masterType === 'manjushri' ? '⚔️' : '🍃'}
              </div>
              <p className="text-sm tracking-[0.5em] font-serif" style={{ color: master.theme.text, opacity: 0.4 }}>
                {master.name}正在入定...
              </p>
            </div>
          )}

          {latestMessages.map((msg) => {
            // Per-master typography for assistant messages
            const masterTextStyle = msg.role === 'assistant' ? ({
              shakyamuni: 'text-2xl md:text-4xl leading-[2.8] md:leading-[2.8] tracking-[0.2em]',
              manjushri: 'text-xl md:text-3xl leading-[2.2] md:leading-[2.2] tracking-[0.15em]',
              huineng: 'text-lg md:text-2xl leading-[2.0] md:leading-[2.0] tracking-[0.1em]',
            }[masterType] || 'text-xl md:text-3xl leading-[2.5] md:leading-[2.5] tracking-[0.15em]') : 'text-xl md:text-3xl leading-[2.5] md:leading-[2.5] tracking-[0.15em]';

            return (
            <div
              key={msg.id}
              className="w-full flex justify-center"
            >
              <div
                className={`max-w-[90%] md:max-w-[80%] ${
                  msg.role === 'user'
                    ? 'text-center animate-fade-in'
                    : 'text-center animate-ink-reveal'
                }`}
              >
                {/* Detect koan story separator ||| for two-part display */}
                {msg.role === 'assistant' && msg.content.includes('|||') ? (
                  <div className="space-y-8">
                    <p
                      className="text-base md:text-lg leading-[2.4] tracking-[0.08em] whitespace-pre-wrap text-stone-400/70 italic"
                      style={{ textShadow: `0 0 20px ${master.theme.primary}15` }}
                    >
                      {msg.content.split('|||')[0].trim()}
                    </p>
                    <p
                      className={`${masterTextStyle} whitespace-pre-wrap text-stone-200`}
                      style={{ textShadow: `0 0 40px ${master.theme.primary}40` }}
                    >
                      {msg.content.split('|||')[1].trim()}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`${masterTextStyle} whitespace-pre-wrap ${
                      msg.role === 'user' ? 'text-stone-400/80' : 'text-stone-200'
                    }`}
                    style={{
                      textShadow: msg.role === 'assistant' ? `0 0 40px ${master.theme.primary}40` : 'none'
                    }}
                  >
                    {msg.content}
                  </p>
                )}
              </div>
            </div>
            );
          })}

          {isLoading && (
            <div className="w-full flex justify-center animate-fade-in">
              <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: master.theme.accent, boxShadow: `0 0 20px ${master.theme.accent}` }} />
            </div>
          )}

          {error && (
            <div className="w-full flex justify-center">
              <p className="text-red-400/50 text-sm tracking-[0.3em] font-serif">{error}</p>
            </div>
          )}
        </div>

        {/* Void Input Area */}
        {!isComplete && !isStarting && !isLoading && (
          <div className="absolute bottom-20 left-0 right-0 px-6 md:px-20 flex flex-col items-center animate-fade-in">
            {/* Voice button above input */}
            <div className="mb-3 opacity-40 hover:opacity-100 transition-opacity duration-500">
              <VoiceButton
                onTranscript={(text) => {
                  setInput(prev => prev + text);
                }}
                disabled={isLoading || isSpeaking}
                accentColor={master.theme.primary}
              />
            </div>

            <div className="w-full max-w-3xl relative group">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="写下你的心念..."
                rows={1}
                className="w-full bg-transparent border-none text-center text-xl md:text-2xl text-stone-300 placeholder-stone-700/50 outline-none resize-none py-4 tracking-[0.2em] font-serif transition-all duration-700 focus:placeholder-transparent"
                style={{
                  minHeight: '60px',
                  maxHeight: '200px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                }}
              />

              {/* Subtle visual hint for input */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-stone-600/30 to-transparent transition-all duration-1000 ${input.length > 0 ? 'w-full opacity-100' : 'w-1/3 opacity-0 group-hover:opacity-100 group-hover:w-1/2'}`} />

              <div className={`absolute -right-12 bottom-4 transition-all duration-500 ${input.length > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-white transition-colors"
                >
                  <span className="text-2xl font-serif">↑</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Result overlay - The Stamp of Enlightenment */}
      {showResult && finalLevel && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 px-4 transition-all duration-1000">
          <div className="max-w-2xl w-full text-center space-y-20 relative">
            
            {/* Massive Halo */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none transition-all duration-2000 ease-out ${finalLevel !== 'N' ? 'opacity-30 scale-100' : 'opacity-0 scale-50'}`}
                 style={{ backgroundColor: ENLIGHTENMENT_LEVELS[finalLevel].color }} />
            
            <div className="space-y-12 relative z-10">
              {finalLevel !== 'N' ? (
                <>
                  <div className="flex justify-center">
                    <div className={`animate-stamp flex items-center justify-center ${
                      finalLevel === 'SSR' ? 'text-amber-500 border-amber-500/80 shadow-[0_0_100px_rgba(245,158,11,0.5)] w-64 h-64 border-[6px] text-7xl' :
                      finalLevel === 'SR' ? 'text-purple-400 border-purple-400/80 shadow-[0_0_60px_rgba(192,132,252,0.4)] w-48 h-48 border-4 text-6xl' :
                      'text-emerald-500 border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.3)] w-40 h-40 border-2 text-5xl'
                    } rounded-full bg-black/80 backdrop-blur-md font-bold tracking-[0.3em] -rotate-[15deg]`}>
                      {ENLIGHTENMENT_LEVELS[finalLevel].name}
                    </div>
                  </div>
                  <p className="text-stone-300 text-2xl md:text-3xl tracking-[0.4em] font-serif animate-fade-in delay-1000" style={{ textShadow: `0 0 20px ${ENLIGHTENMENT_LEVELS[finalLevel].color}` }}>
                    {ENLIGHTENMENT_LEVELS[finalLevel].description}
                  </p>
                </>
              ) : (
                <div className="space-y-12 animate-fade-in">
                  <div className="text-7xl opacity-50 animate-float">🪷</div>
                  <div className="space-y-4">
                    <p className="text-stone-400 text-xl tracking-[0.4em] font-serif">
                      此次参禅已记录
                    </p>
                    <p className="text-stone-600 text-sm tracking-[0.3em] font-serif">
                      路在脚下，不急于一时
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-8 pt-12 animate-fade-in delay-1500 relative z-10 flex flex-col items-center">
              <button
                onClick={() => router.push('/cards')}
                className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden"
              >
                <span className="absolute w-full h-[1px] bottom-0 left-0 bg-gradient-to-r from-transparent via-stone-500 to-transparent group-hover:via-white transition-all duration-500"></span>
                <span className="relative text-sm tracking-[0.5em] font-serif text-stone-300 group-hover:text-white transition-colors duration-500">
                  查看禅卡
                </span>
              </button>
              
              <button
                onClick={() => router.push('/home')}
                className="text-stone-600 hover:text-stone-400 transition-colors tracking-[0.4em] font-serif text-xs opacity-60 hover:opacity-100"
              >
                归去
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-stone-500 animate-pulse-slow text-sm tracking-[0.3em] font-serif">静候片刻...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
