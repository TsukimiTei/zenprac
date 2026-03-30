'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { GROWTH_STAGES, ENLIGHTENMENT_LEVELS, MASTERS, SESSION_MODES } from '@/lib/constants';
import { GrowthStage, EnlightenmentLevel, MasterType, SessionMode } from '@/types';
import BottomNav from '@/components/BottomNav';

interface SessionPoint {
  level: EnlightenmentLevel;
  levelName: string;
  color: string;
  date: string;
  masterName: string;
  modeName: string;
  score: number | null;
  coreQuestion: string | null;
  coreAnswer: string | null;
  masterComment: string | null;
}

interface Stats {
  totalSessions: number;
  totalScore: number;
  currentStage: GrowthStage;
  levelCounts: Record<EnlightenmentLevel, number>;
  recentDates: string[];
  sessionPoints: SessionPoint[];
}

const GOLDEN_ANGLE = 137.508;

export default function JourneyPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_sessions, total_score, current_stage')
        .eq('user_id', user.id)
        .single();

      const { data: sessions } = await supabase
        .from('sessions')
        .select('id, final_level, final_score, created_at, master_type, mode')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('created_at', { ascending: true });

      const { data: zenCards } = await supabase
        .from('zen_cards')
        .select('session_id, core_question, core_answer, master_comment')
        .eq('user_id', user.id);

      const cardMap = new Map<string, { core_question: string; core_answer: string; master_comment: string }>();
      (zenCards || []).forEach((c: { session_id: string; core_question: string; core_answer: string; master_comment: string }) => {
        cardMap.set(c.session_id, c);
      });

      const levelCounts: Record<EnlightenmentLevel, number> = { N: 0, R: 0, SR: 0, SSR: 0 };
      const recentDates: string[] = [];
      const sessionPoints: SessionPoint[] = [];

      (sessions || []).forEach((s: { id: string; final_level: string; final_score: number | null; created_at: string; master_type: string; mode: string }) => {
        const level = (s.final_level as EnlightenmentLevel) || 'N';
        const date = s.created_at.split('T')[0];
        const card = cardMap.get(s.id);
        const masterKey = s.master_type as MasterType;
        const modeKey = s.mode as SessionMode;

        sessionPoints.push({
          level,
          levelName: ENLIGHTENMENT_LEVELS[level].name,
          color: ENLIGHTENMENT_LEVELS[level].color,
          date,
          masterName: MASTERS[masterKey]?.name || '',
          modeName: SESSION_MODES[modeKey]?.name || '',
          score: s.final_score,
          coreQuestion: card?.core_question || null,
          coreAnswer: card?.core_answer || null,
          masterComment: card?.master_comment || null,
        });

        if (s.final_level && s.final_level in levelCounts) {
          levelCounts[s.final_level as EnlightenmentLevel]++;
        }
        if (!recentDates.includes(date)) recentDates.push(date);
      });

      setStats({
        totalSessions: profile?.total_sessions || 0,
        totalScore: profile?.total_score || 0,
        currentStage: (profile?.current_stage as GrowthStage) || 'mountain_gate',
        levelCounts,
        recentDates: recentDates.slice(0, 30),
        sessionPoints,
      });
      setLoading(false);
    }
    init();
  }, []);

  const stages = Object.entries(GROWTH_STAGES) as [GrowthStage, typeof GROWTH_STAGES[GrowthStage]][];
  const currentStageIndex = stats ? stages.findIndex(([key]) => key === stats.currentStage) : 0;
  const currentStageData = stats ? GROWTH_STAGES[stats.currentStage] : GROWTH_STAGES.mountain_gate;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const isEmpty = !stats || stats.totalSessions === 0;

  // Phyllotaxis garden
  const gardenPoints = useMemo(() => {
    if (!stats || stats.sessionPoints.length === 0) return [];
    const pts = stats.sessionPoints;
    const baseScale = 32;
    const maxR = Math.sqrt(pts.length) * baseScale;
    const scale = maxR > 160 ? 160 / maxR : 1;
    return pts.map((pt, i) => {
      const angle = (i * GOLDEN_ANGLE * Math.PI) / 180;
      const r = Math.sqrt(i + 1) * baseScale * scale;
      return {
        ...pt,
        cx: 200 + Math.cos(angle) * r,
        cy: 200 + Math.sin(angle) * r,
        size: pt.level === 'SSR' ? 14 : pt.level === 'SR' ? 10 : pt.level === 'R' ? 8 : 6,
      };
    });
  }, [stats]);

  const activeIdx = selectedIdx ?? hoveredIdx;
  const activePoint = activeIdx !== null ? gardenPoints[activeIdx] : null;
  const isExpanded = selectedIdx !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-stone-800 border-t-stone-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-500 font-serif tracking-widest animate-pulse">悟</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col lg:flex-row pb-24 lg:pb-0 font-serif">

      {/* ═══════ LEFT — Visualization + Hero Numbers ═══════ */}
      <div className="lg:fixed lg:w-[46%] lg:h-screen flex flex-col relative overflow-hidden">

        {/* Subtle atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900/30" />
        <svg className="absolute bottom-0 w-full h-[22%] pointer-events-none" viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0,200 L0,168 L55,142 L95,152 L155,118 L215,138 L275,98 L335,120 L375,85 L435,108 L495,75 L535,95 L595,128 L655,92 L715,115 L775,132 L800,140 L800,200Z" fill="#1c1917" opacity="0.2" />
          <path d="M0,200 L0,180 L75,162 L135,170 L195,148 L255,162 L315,138 L375,152 L435,128 L495,142 L555,156 L615,142 L675,165 L735,155 L800,170 L800,200Z" fill="#1c1917" opacity="0.35" />
        </svg>
        <div className="absolute inset-0 opacity-[0.01] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />

        {/* Title */}
        <header className="relative z-10 px-10 lg:px-14 pt-24 lg:pt-28">
          <h1 className="text-2xl text-stone-300 tracking-[0.3em] font-normal">修行历程</h1>
        </header>

        {/* Garden with interactive cards */}
        <div className="flex-1 relative flex items-center justify-center z-10" onClick={() => setSelectedIdx(null)}>
          {isEmpty ? (
            <div className="relative flex items-center justify-center animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-zen-gold/70 shadow-[0_0_30px_rgba(203,168,100,0.4)] animate-pulse-slow" />
              <div className="absolute w-24 h-24 rounded-full border border-white/[0.04] animate-spin-slow" style={{ animationDuration: '30s' }} />
            </div>
          ) : (
            <div className="relative w-full max-w-[440px] aspect-square animate-fade-in">
              <svg viewBox="0 0 400 400" className="w-full h-full" overflow="visible">
                <defs>
                  <radialGradient id="coreLight" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#cba864" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#cba864" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#cba864" stopOpacity="0" />
                  </radialGradient>
                  <filter id="softBlur"><feGaussianBlur stdDeviation="4" /></filter>
                </defs>
                <circle cx="200" cy="200" r={Math.min(50 + stats!.totalScore * 2, 140)} fill="url(#coreLight)">
                  <animate attributeName="r" values={`${Math.min(46 + stats!.totalScore * 2, 136)};${Math.min(54 + stats!.totalScore * 2, 144)};${Math.min(46 + stats!.totalScore * 2, 136)}`} dur="8s" repeatCount="indefinite" />
                </circle>

                {stats!.levelCounts.SSR > 0 && Array.from({ length: Math.min(stats!.levelCounts.SSR, 12) }).map((_, i, arr) => {
                  const a = ((360 / arr.length) * i - 90) * Math.PI / 180;
                  const cx = 200 + Math.cos(a) * 13, cy = 200 + Math.sin(a) * 13;
                  const tx = 200 + Math.cos(a) * 30, ty = 200 + Math.sin(a) * 30;
                  const p = a + Math.PI / 2;
                  return <path key={`p-${i}`} d={`M${cx},${cy} Q${(cx+tx)/2+Math.cos(p)*5},${(cy+ty)/2+Math.sin(p)*5} ${tx},${ty} Q${(cx+tx)/2-Math.cos(p)*5},${(cy+ty)/2-Math.sin(p)*5} ${cx},${cy}`} fill="#FFD700" opacity="0.1" filter="url(#softBlur)" />;
                })}

                {gardenPoints.map((pt, i) => {
                  const isActive = activeIdx === i;
                  return (
                    <g key={i} style={{ animation: `ethereal-fade 0.5s ease-out ${Math.min(i * 0.04, 2)}s both` }}>
                      {pt.level === 'SSR' && <circle cx={pt.cx} cy={pt.cy} r={pt.size * 3} fill={pt.color} opacity="0.08" filter="url(#softBlur)" />}
                      <circle
                        cx={pt.cx} cy={pt.cy}
                        r={isActive ? pt.size * 1.8 : pt.size}
                        fill={pt.color}
                        opacity={isActive ? 1 : pt.level === 'N' ? 0.35 : pt.level === 'R' ? 0.6 : 0.85}
                        style={{ transition: 'all 0.2s ease-out' }}
                      />
                      {(pt.level === 'SR' || pt.level === 'SSR') && <circle cx={pt.cx} cy={pt.cy} r={pt.size * 0.3} fill="white" opacity="0.4" />}
                      {isActive && <circle cx={pt.cx} cy={pt.cy} r={pt.size * 4} fill={pt.color} opacity="0.15" filter="url(#softBlur)" />}
                      <circle
                        cx={pt.cx} cy={pt.cy} r={14}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => { if (selectedIdx === null) setHoveredIdx(i); }}
                        onMouseLeave={() => { if (selectedIdx === null) setHoveredIdx(null); }}
                        onClick={(e) => { e.stopPropagation(); setSelectedIdx(selectedIdx === i ? null : i); setHoveredIdx(null); }}
                      />
                    </g>
                  );
                })}

                <circle cx="200" cy="200" r="4" fill="#cba864" opacity="0.9">
                  <animate attributeName="opacity" values="0.6;0.9;0.6" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="200" r="1.5" fill="white" opacity="0.3" />
              </svg>

              {/* ── Hover mini card ── */}
              {activePoint && !isExpanded && (
                <div
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: `${(activePoint.cx / 400) * 100}%`,
                    top: `${(activePoint.cy / 400) * 100}%`,
                    transform: 'translate(-50%, -120%)',
                  }}
                >
                  <div className="bg-stone-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 w-52 shadow-2xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-stone-200 text-[11px]">{activePoint.masterName}</span>
                      <span className="text-stone-500 text-[9px]">{activePoint.modeName}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium" style={{ color: activePoint.color }}>{activePoint.levelName}</span>
                      <span className="text-stone-500 text-[10px]">{activePoint.date}</span>
                    </div>
                    {activePoint.coreQuestion && (
                      <p className="text-stone-400 text-[10px] leading-relaxed line-clamp-2">
                        「{activePoint.coreQuestion}」
                      </p>
                    )}
                    <p className="text-stone-600 text-[8px] mt-2 tracking-wider">点击展开详情</p>
                  </div>
                </div>
              )}

              {/* ── Expanded card (click) ── */}
              {activePoint && isExpanded && (
                <div
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  onClick={(e) => { e.stopPropagation(); setSelectedIdx(null); }}
                >
                  {/* Backdrop dim */}
                  <div className="absolute inset-0 bg-stone-950/60 rounded-lg" />

                  <div
                    className="relative bg-stone-900/98 backdrop-blur-lg border border-white/10 rounded-2xl p-6 w-[85%] max-w-xs max-h-[80%] overflow-y-auto shadow-2xl zen-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close */}
                    <button
                      onClick={() => setSelectedIdx(null)}
                      className="absolute top-3 right-3 text-stone-500 hover:text-stone-300 text-xs transition-colors"
                    >
                      ✕
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-stone-200 text-sm">{activePoint.masterName}</span>
                      <span className="text-stone-600 text-[10px]">·</span>
                      <span className="text-stone-500 text-[10px]">{activePoint.modeName}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-sm font-medium" style={{ color: activePoint.color }}>{activePoint.levelName}</span>
                      <span className="text-stone-500 text-[10px]">{activePoint.date}</span>
                      {activePoint.score !== null && (
                        <span className="text-stone-500 text-[10px]">+{activePoint.score}分</span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="w-8 h-px bg-white/10 mb-5" />

                    {/* Core Q&A */}
                    {activePoint.coreQuestion && (
                      <div className="mb-4">
                        <p className="text-stone-500 text-[9px] tracking-[0.2em] mb-2">问</p>
                        <p className="text-stone-300 text-[13px] leading-relaxed tracking-wider">
                          {activePoint.coreQuestion}
                        </p>
                      </div>
                    )}
                    {activePoint.coreAnswer && (
                      <div className="mb-4">
                        <p className="text-stone-500 text-[9px] tracking-[0.2em] mb-2">答</p>
                        <p className="text-stone-300 text-[13px] leading-relaxed tracking-wider">
                          {activePoint.coreAnswer}
                        </p>
                      </div>
                    )}
                    {activePoint.masterComment && (
                      <div>
                        <p className="text-stone-500 text-[9px] tracking-[0.2em] mb-2">师评</p>
                        <p className="text-stone-400 text-[12px] leading-relaxed tracking-wider italic">
                          {activePoint.masterComment}
                        </p>
                      </div>
                    )}

                    {/* Empty state if no card */}
                    {!activePoint.coreQuestion && !activePoint.coreAnswer && (
                      <p className="text-stone-600 text-xs tracking-wider">此次参禅未生成禅卡</p>
                    )}
                  </div>
                </div>
              )}

              {/* Legend */}
              {!activePoint && gardenPoints.length > 0 && (
                <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-stone-500 text-[9px] tracking-[0.2em]">
                  悬停或点击光点 · 查看参禅记录
                </p>
              )}
            </div>
          )}
        </div>

        {/* Hero numbers */}
        <div className="relative z-10 px-10 lg:px-14 pb-12 lg:pb-20">
          <p className="text-stone-400 text-[10px] tracking-[0.3em] mb-5">
            {isEmpty ? '万物伊始' : '当前境界'}
          </p>
          {!isEmpty && (
            <p className="text-2xl lg:text-3xl tracking-[0.2em] mb-10 font-medium" style={{ color: currentStageData.color }}>
              {currentStageData.name}
            </p>
          )}
          <div className="flex items-baseline gap-12 lg:gap-16">
            <div>
              <p className="text-5xl lg:text-6xl font-extralight text-white leading-none">{stats?.totalSessions || 0}</p>
              <p className="text-stone-400 text-[10px] tracking-[0.2em] mt-3">参禅</p>
            </div>
            <div>
              <p className="text-5xl lg:text-6xl font-extralight text-zen-gold leading-none">{stats?.totalScore || 0}</p>
              <p className="text-stone-400 text-[10px] tracking-[0.2em] mt-3">积分</p>
            </div>
            <div>
              <p className="text-5xl lg:text-6xl font-extralight text-purple-400 leading-none">{stats?.levelCounts.SSR || 0}</p>
              <p className="text-stone-400 text-[10px] tracking-[0.2em] mt-3">顿悟</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT — Details ═══════ */}
      <div className="lg:w-[54%] lg:ml-[46%] lg:h-screen lg:overflow-y-auto zen-scrollbar p-8 md:p-12 lg:pl-16 lg:pr-20 lg:py-24 lg:border-l lg:border-white/[0.04]">
        <div className="max-w-xl">

          {/* Enlightenment breakdown */}
          <div className="mb-12 animate-fade-in">
            <p className="text-stone-400 text-[10px] tracking-[0.3em] mb-5">悟境分布</p>
            <div className="flex items-baseline gap-10 lg:gap-12">
              {(['SSR', 'SR', 'R', 'N'] as EnlightenmentLevel[]).map((level) => {
                const config = ENLIGHTENMENT_LEVELS[level];
                const count = stats?.levelCounts[level] || 0;
                return (
                  <div key={level}>
                    <p className="text-3xl lg:text-4xl font-extralight leading-none" style={{ color: count > 0 ? config.color : '#57534e' }}>
                      {count}
                    </p>
                    <p className="text-[10px] tracking-[0.15em] mt-2" style={{ color: count > 0 ? config.color : '#78716c', opacity: count > 0 ? 0.8 : 0.5 }}>
                      {config.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-12 animate-fade-in delay-100" style={{ animationFillMode: 'both' }}>
            <div className="flex items-baseline justify-between mb-5">
              <p className="text-stone-400 text-[10px] tracking-[0.3em]">修行日历</p>
              <p className="text-stone-500 text-[10px] tracking-[0.2em]">{year}.{String(month + 1).padStart(2, '0')}</p>
            </div>
            <div className="grid grid-cols-7 gap-y-1.5 gap-x-0 text-center">
              {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                <div key={d} className="text-stone-500 text-[9px] tracking-widest pb-2">{d}</div>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasSession = stats?.recentDates.includes(dateStr);
                const isToday = day === now.getDate();
                return (
                  <div key={day} className="flex justify-center py-0.5">
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs ${
                      hasSession
                        ? 'text-zen-gold bg-zen-gold/12'
                        : isToday
                        ? 'text-white ring-1 ring-stone-500'
                        : 'text-stone-400'
                    }`}>
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth path */}
          <div className="animate-fade-in delay-200" style={{ animationFillMode: 'both' }}>
            <p className="text-stone-400 text-[10px] tracking-[0.3em] mb-5">成长路径</p>
            <div className="flex items-center gap-0.5 mb-5">
              {stages.map(([key, stage], i) => {
                const isActive = i === currentStageIndex;
                const isPast = i < currentStageIndex;
                return (
                  <div key={key} className="flex items-center flex-1">
                    <div
                      className={`flex-shrink-0 rounded-full transition-all duration-700 ${isActive ? 'w-3 h-3' : 'w-1.5 h-1.5'}`}
                      style={{
                        background: isPast || isActive ? stage.color : '#44403c',
                        boxShadow: isActive ? `0 0 8px ${stage.color}80` : 'none',
                      }}
                    />
                    {i < stages.length - 1 && (
                      <div className="flex-1 h-px mx-1" style={{ background: isPast ? `${stage.color}60` : '#33302e' }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2.5">
              {stages.map(([key, stage], i) => {
                const isActive = i === currentStageIndex;
                const isPast = i < currentStageIndex;
                const isFuture = i > currentStageIndex;
                return (
                  <div key={key} className={`flex items-baseline justify-between transition-opacity duration-500 ${isFuture ? 'opacity-30' : ''}`}>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-sm tracking-[0.1em] ${isActive ? 'text-white' : isPast ? 'text-stone-300' : 'text-stone-500'}`}>
                        {stage.name}
                      </span>
                      {isActive && <span className="text-[9px] tracking-wider text-stone-500">← 当前</span>}
                    </div>
                    <span className="text-stone-500 text-[10px] tabular-nums">{stage.minSessions}+</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-8 lg:h-4" />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
