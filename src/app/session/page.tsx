'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { MASTERS, SESSION_MODES } from '@/lib/constants';
import { MasterType, SessionMode } from '@/types';
import { getTodayQuestion } from '@/lib/questions';

function SessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const masterType = searchParams.get('master') as MasterType;
  const [dailyQuestion, setDailyQuestion] = useState('');
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);

  useEffect(() => {
    const q = getTodayQuestion();
    setDailyQuestion(q.question_text);
  }, []);

  if (!masterType || !MASTERS[masterType]) {
    router.push('/home');
    return null;
  }

  const master = MASTERS[masterType];

  const handleSelectMode = (mode: SessionMode) => {
    setSelectedMode(mode);
    setTimeout(() => {
      router.push(`/session/chat?master=${masterType}&mode=${mode}`);
    }, 1200);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{ backgroundColor: master.theme.bg }}
    >
      {/* Deep Space Background with Master's Totem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        {/* Abstract Visual Totem from Home Page (but fainter) */}
        {masterType === 'shakyamuni' && (
          <div 
            className="absolute w-[120vw] h-[120vw] max-w-[1000px] max-h-[1000px] rounded-full border-[1px] border-amber-500/10 animate-spin-slow opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%)',
              boxShadow: '0 0 100px rgba(184,134,11,0.05), inset 0 0 100px rgba(184,134,11,0.05)'
            }}
          >
            <div className="absolute inset-10 rounded-full border-[1px] border-amber-400/5 border-dashed animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          </div>
        )}
        {masterType === 'manjushri' && (
          <div className="absolute w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] animate-float-sharp opacity-40">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-cyan-400/5 to-transparent backdrop-blur-sm border border-blue-400/10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>
        )}
        {masterType === 'huineng' && (
          <div 
            className="absolute w-[110vw] h-[110vw] max-w-[900px] max-h-[900px] animate-morph opacity-40"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(107,142,35,0.12) 0%, rgba(143,188,143,0.03) 50%, transparent 80%)',
              filter: 'blur(30px)'
            }}
          />
        )}

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-[0.05] mix-blend-overlay"></div>
      </div>

      <button
        onClick={() => router.push('/home')}
        className="absolute top-12 left-8 md:left-12 text-stone-500 text-xs tracking-[0.4em] font-serif hover:text-stone-300 transition-colors z-20 opacity-60 hover:opacity-100"
      >
        ← 归去
      </button>

      <div className="relative z-10 w-full max-w-4xl px-6 py-20 flex flex-col items-center">
        
        {/* Master Title */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${selectedMode ? 'opacity-0 -translate-y-10' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-3xl md:text-5xl font-serif tracking-[0.3em] opacity-90" style={{ color: master.theme.accent, textShadow: `0 0 30px ${master.theme.primary}60` }}>
            {master.name}
          </h1>
          <p className="text-stone-500 text-xs md:text-sm tracking-[0.4em] font-serif mt-6">
            请择一法门
          </p>
        </div>

        {/* Modes List */}
        <div className="w-full flex flex-col gap-6 md:gap-8 items-center">
          {(Object.entries(SESSION_MODES) as [SessionMode, typeof SESSION_MODES[string]][]).map(
            ([mode, config], index) => {
              const isSelected = selectedMode === mode;
              const isOtherSelected = selectedMode !== null && selectedMode !== mode;

              return (
                <div 
                  key={mode} 
                  className={`transition-all duration-1000 ease-in-out w-full flex justify-center
                    ${isOtherSelected ? 'opacity-0 blur-xl scale-90 h-0 overflow-hidden my-0' : 'opacity-100'}
                    ${isSelected ? 'scale-110 md:scale-125 z-50 my-20' : ''}
                  `}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <button
                    onClick={() => handleSelectMode(mode)}
                    disabled={selectedMode !== null}
                    className={`group relative w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-700 animate-fade-in
                      ${isSelected ? 'border-white/20 bg-white/[0.05] shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'hover:border-white/10 hover:bg-white/[0.04]'}
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Giant Watermark Icon */}
                    <div className="absolute -right-8 -bottom-8 text-9xl opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                      {config.icon}
                    </div>

                    <div className="relative p-8 md:p-10 flex flex-col items-center text-center">
                      <h3 
                        className={`text-2xl md:text-3xl font-serif tracking-[0.3em] transition-all duration-700
                          ${isSelected ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'text-stone-300 group-hover:text-white'}
                        `}
                      >
                        {config.name}
                      </h3>
                      
                      <div className={`mt-6 transition-all duration-700 ${isSelected ? 'opacity-0 h-0 overflow-hidden mt-0' : 'opacity-80 group-hover:opacity-100'}`}>
                        <p className="text-stone-400 text-xs md:text-sm tracking-[0.2em] font-serif leading-loose">
                          {config.description}
                        </p>
                        {mode === 'daily' && dailyQuestion && (
                          <p className="text-stone-500 text-[10px] md:text-xs mt-4 tracking-[0.1em] font-serif italic">
                            「{dailyQuestion}」
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Deep Ripple Effect */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-3xl border border-white/30 animate-[ripple_1s_ease-out_forwards]" />
                        <div className="absolute inset-0 rounded-3xl border border-white/10 animate-[ripple_1.5s_ease-out_forwards_0.2s]" />
                      </>
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-stone-500 animate-pulse-slow text-sm tracking-[0.3em] font-serif">静候片刻...</div>
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}
