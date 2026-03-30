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
  const [hoveredAlt, setHoveredAlt] = useState<SessionMode | null>(null);

  useEffect(() => {
    const q = getTodayQuestion();
    setDailyQuestion(q.question_text);
  }, []);

  if (!masterType || !MASTERS[masterType]) {
    router.push('/home');
    return null;
  }

  const master = MASTERS[masterType];

  const handleSelect = (mode: SessionMode) => {
    if (selectedMode) return;
    setSelectedMode(mode);
    setTimeout(() => {
      router.push(`/session/chat?master=${masterType}&mode=${mode}`);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-serif"
      style={{ backgroundColor: master.theme.bg }}
    >
      {/* Background totem (faint) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {masterType === 'shakyamuni' && (
          <div
            className="absolute w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] rounded-full border border-amber-500/10 animate-spin-slow opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, transparent 70%)' }}
          />
        )}
        {masterType === 'manjushri' && (
          <div className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] animate-float-sharp opacity-30">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-cyan-400/5 to-transparent border border-blue-400/10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          </div>
        )}
        {masterType === 'huineng' && (
          <div
            className="absolute w-[90vw] h-[90vw] max-w-[700px] max-h-[700px] animate-morph opacity-30"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(107,142,35,0.1) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />
        )}
      </div>

      {/* Back */}
      <button
        onClick={() => router.push('/home')}
        className="absolute top-12 left-8 md:left-12 text-stone-500 text-xs tracking-[0.4em] hover:text-stone-300 transition-colors z-20"
      >
        ←
      </button>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center text-center px-8 transition-all duration-1000 ${selectedMode ? 'scale-105 opacity-0 blur-md' : ''}`}>

        {/* Master name */}
        <h1
          className="text-4xl md:text-6xl tracking-[0.25em] mb-4"
          style={{ color: master.theme.accent, textShadow: `0 0 40px ${master.theme.primary}30` }}
        >
          {master.name}
        </h1>
        <p className="text-stone-500 text-xs tracking-[0.4em] mb-20 md:mb-28">{master.title}</p>

        {/* Primary action — 禅师出题 (the natural default) */}
        <button
          onClick={() => handleSelect('master_question')}
          className="group relative mb-16 md:mb-20"
        >
          <span className="text-lg md:text-xl tracking-[0.5em] text-stone-300 group-hover:text-white transition-colors duration-500">
            入座参禅
          </span>
          <div className="mt-3 h-px w-0 group-hover:w-full bg-gradient-to-r from-transparent via-stone-400 to-transparent transition-all duration-700 mx-auto" />
          <p className="text-stone-600 text-[10px] tracking-[0.2em] mt-4 group-hover:text-stone-500 transition-colors">
            {SESSION_MODES.master_question.description}
          </p>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-6 mb-12 md:mb-14">
          <div className="w-12 h-px bg-stone-800" />
          <span className="text-stone-600 text-[10px] tracking-[0.3em]">或</span>
          <div className="w-12 h-px bg-stone-800" />
        </div>

        {/* Alternative modes — compact, inline */}
        <div className="flex items-center gap-8 md:gap-14">
          <button
            onClick={() => handleSelect('daily')}
            onMouseEnter={() => setHoveredAlt('daily')}
            onMouseLeave={() => setHoveredAlt(null)}
            className="group text-center"
          >
            <span className="text-sm md:text-base tracking-[0.2em] text-stone-500 group-hover:text-stone-200 transition-colors duration-500">
              {SESSION_MODES.daily.name}
            </span>
            <p className="text-stone-700 text-[9px] tracking-wider mt-2 group-hover:text-stone-500 transition-colors">
              {SESSION_MODES.daily.description}
            </p>
          </button>

          <div className="w-px h-6 bg-stone-800" />

          <button
            onClick={() => handleSelect('free')}
            onMouseEnter={() => setHoveredAlt('free')}
            onMouseLeave={() => setHoveredAlt(null)}
            className="group text-center"
          >
            <span className="text-sm md:text-base tracking-[0.2em] text-stone-500 group-hover:text-stone-200 transition-colors duration-500">
              {SESSION_MODES.free.name}
            </span>
            <p className="text-stone-700 text-[9px] tracking-wider mt-2 group-hover:text-stone-500 transition-colors">
              {SESSION_MODES.free.description}
            </p>
          </button>
        </div>

        {/* Daily question preview — appears when hovering 当日禅题 */}
        <div className={`mt-10 max-w-sm transition-all duration-500 ${hoveredAlt === 'daily' && dailyQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <p className="text-stone-500 text-[11px] tracking-wider leading-relaxed italic">
            {dailyQuestion.replace(/\|\|\|/g, ' ')}
          </p>
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
