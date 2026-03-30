'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MASTERS, ENLIGHTENMENT_LEVELS } from '@/lib/constants';
import { ZenCard, MasterType, EnlightenmentLevel } from '@/types';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

/*──────────────────────────────────────────────
  Card visuals = Master theme (card tint) × Level (stamp rarity)
  Master defines the card's ambient color:
    释迦牟尼 = warm gold      #B8860B
    文殊菩萨 = cool blue      #4A90D9
    六祖慧能 = natural green   #6B8E23
  Level defines the stamp intensity + shimmer:
    SSR = glowing stamp + shimmer
    SR  = solid stamp
    R   = subtle stamp
    N   = no stamp
──────────────────────────────────────────────*/

// Helpers to build master-tinted card styles from the theme color
function masterCardStyle(primary: string) {
  // Convert hex to rgb for use in rgba()
  const r = parseInt(primary.slice(1, 3), 16);
  const g = parseInt(primary.slice(3, 5), 16);
  const b = parseInt(primary.slice(5, 7), 16);
  const rgb = `${r},${g},${b}`;

  return {
    border: `1px solid rgba(${rgb}, 0.12)`,
    topEdge: `linear-gradient(90deg, transparent 5%, rgba(${rgb},0.35) 35%, rgba(${rgb},0.15) 55%, transparent 95%)`,
    innerGlow: `radial-gradient(ellipse at 30% 0%, rgba(${rgb},0.06) 0%, transparent 60%)`,
    accentDot: `rgba(${rgb}, 0.7)`,
    accentDotShadow: `0 0 6px rgba(${rgb}, 0.4)`,
    quoteMark: `rgba(${rgb}, 0.15)`,
    sideBar: `linear-gradient(to bottom, rgba(${rgb},0.4), transparent)`,
    rgb,
  };
}

// Level-specific stamp styling (independent of master)
const STAMP_STYLE: Record<EnlightenmentLevel, {
  classes: string;
  bg: string;
  glow: boolean;
}> = {
  SSR: {
    classes: 'text-amber-300 border-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.35)]',
    bg: 'linear-gradient(135deg, rgba(120,80,0,0.4), rgba(60,40,0,0.2))',
    glow: true,
  },
  SR: {
    classes: 'text-purple-300 border-purple-400/40 shadow-[0_0_16px_rgba(168,85,247,0.25)]',
    bg: 'linear-gradient(135deg, rgba(60,20,100,0.35), rgba(40,10,70,0.2))',
    glow: false,
  },
  R: {
    classes: 'text-emerald-400 border-emerald-500/30',
    bg: 'linear-gradient(135deg, rgba(10,60,40,0.3), rgba(5,40,25,0.15))',
    glow: false,
  },
  N: {
    classes: 'text-stone-500 border-stone-600/20',
    bg: 'rgba(30,30,30,0.3)',
    glow: false,
  },
};

const MASTER_ICON: Record<string, string> = {
  shakyamuni: '🙏',
  manjushri: '⚔️',
  huineng: '🍃',
};

export default function CardsPage() {
  const [cards, setCards] = useState<ZenCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<MasterType | 'all'>('all');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);
    }
    init();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function loadCards() {
      let query = supabase
        .from('zen_cards')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('master_type', filter);
      }

      const { data } = await query;
      setCards((data as ZenCard[]) || []);
      setLoading(false);
    }
    loadCards();
  }, [userId, filter]);

  const levelCounts = cards.reduce((acc, c) => {
    const l = c.enlightenment_level as EnlightenmentLevel;
    acc[l] = (acc[l] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[var(--color-zen-dark)] relative overflow-x-hidden">
      {/* Very subtle ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-900/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-900/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pb-32">
        {/* Header */}
        <header className="pt-20 md:pt-28 pb-4 px-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif tracking-[0.15em] text-stone-100">
              禅卡收藏
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-px bg-stone-700" />
              <p className="text-stone-500 text-sm tracking-[0.2em]">
                {cards.length} 张禅卡
              </p>
              {/* Inline tier counts */}
              {cards.length > 0 && (
                <div className="flex items-center gap-3 ml-2">
                  {(['SSR', 'SR', 'R'] as EnlightenmentLevel[]).map(lv => {
                    const c = levelCounts[lv] || 0;
                    if (c === 0) return null;
                    return (
                      <span key={lv} className="text-[11px] tracking-[0.15em]" style={{ color: ENLIGHTENMENT_LEVELS[lv].color + '99' }}>
                        {ENLIGHTENMENT_LEVELS[lv].name}×{c}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="px-6 mt-4 mb-8">
          <div className="max-w-5xl mx-auto flex gap-3">
            {[
              { key: 'all' as const, label: '全部' },
              ...Object.entries(MASTERS).map(([k, m]) => ({ key: k as MasterType, label: m.name })),
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full text-xs tracking-[0.2em] font-serif transition-all duration-500 border ${
                  filter === key
                    ? 'bg-white/[0.06] border-white/[0.12] text-stone-200'
                    : 'bg-transparent border-stone-800/40 text-stone-600 hover:text-stone-400 hover:border-stone-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center h-[40vh]">
                <div className="w-10 h-10 rounded-full border border-stone-800 border-t-stone-600 animate-spin" />
              </div>
            ) : cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[55vh] text-center">
                <div className="w-24 h-24 rounded-2xl border border-dashed border-stone-800/50 flex items-center justify-center mb-8 opacity-30">
                  <span className="text-4xl">🃏</span>
                </div>
                <p className="text-stone-400 text-base tracking-[0.3em] font-serif mb-2">空空如也</p>
                <p className="text-stone-600 text-xs tracking-[0.2em] mb-10">参禅后，禅卡将在此显现</p>
                <Link
                  href="/home"
                  className="text-stone-400 text-xs tracking-[0.3em] font-serif border-b border-stone-600 pb-1 hover:text-stone-200 hover:border-stone-400 transition-all duration-500"
                >
                  开始参禅
                </Link>
              </div>
            ) : (
              /* ── 2-column masonry-ish grid ── */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {cards.map((card, index) => {
                  const master = MASTERS[card.master_type as MasterType];
                  const level = card.enlightenment_level as EnlightenmentLevel;
                  const mStyle = masterCardStyle(master.theme.primary);
                  const stamp = STAMP_STYLE[level];
                  const levelCfg = ENLIGHTENMENT_LEVELS[level];
                  const date = new Date(card.created_at).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={card.id}
                      className="group relative rounded-[20px] overflow-hidden bg-[var(--color-zen-surface)]
                                 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-2xl animate-fade-in"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        border: mStyle.border,
                        boxShadow: `0 4px 50px -12px rgba(${mStyle.rgb}, 0.10)`,
                      }}
                    >
                      {/* Top edge light — tinted by master */}
                      <div
                        className="absolute inset-x-0 top-0 h-[1px] z-20"
                        style={{ background: mStyle.topEdge }}
                      />

                      {/* Inner ambient glow — master tinted */}
                      <div
                        className="absolute inset-0 pointer-events-none z-0"
                        style={{ background: mStyle.innerGlow }}
                      />

                      {/* SSR: animated shimmer using master color */}
                      {level === 'SSR' && (
                        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[20px]">
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(105deg, transparent 35%, rgba(${mStyle.rgb},0.12) 42%, rgba(${mStyle.rgb},0.05) 48%, transparent 55%)`,
                              backgroundSize: '300% 100%',
                              animation: 'zen-shimmer 5s ease-in-out infinite',
                            }}
                          />
                        </div>
                      )}

                      {/* Card content */}
                      <div className="relative z-10 p-6 md:p-7 flex flex-col min-h-[280px]">
                        {/* Header: master + date ──── stamp */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-2.5">
                            <span className="text-base opacity-80">{MASTER_ICON[card.master_type] || '🪷'}</span>
                            <div>
                              <p className="text-xs tracking-[0.18em] font-serif" style={{ color: master.theme.accent + 'cc' }}>
                                {master.name}
                              </p>
                              <p className="text-[10px] text-stone-600 tracking-[0.1em] mt-0.5">{date}</p>
                            </div>
                          </div>

                          {/* Enlightenment stamp — level color, independent of master */}
                          {level !== 'N' && (
                            <div
                              className={`px-4 py-1.5 rounded-full border font-serif font-bold
                                tracking-[0.2em] text-sm -rotate-[6deg]
                                transition-all duration-500 group-hover:rotate-0 group-hover:scale-105
                                ${stamp.classes}`}
                              style={{ background: stamp.bg }}
                            >
                              {levelCfg.name}
                            </div>
                          )}
                        </div>

                        {/* Core question — sidebar colored by master */}
                        <div className="flex-1">
                          <div className="relative pl-4 mb-5">
                            <div
                              className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
                              style={{ background: mStyle.sideBar }}
                            />
                            <h3 className="text-stone-100 text-base md:text-[17px] font-serif leading-[2] tracking-[0.06em]">
                              {card.core_question}
                            </h3>
                          </div>

                          {/* Core answer — quote mark in master color */}
                          <div className="relative pl-4 pr-2">
                            <span
                              className="absolute -left-1 -top-3 text-4xl font-serif select-none"
                              style={{ color: mStyle.quoteMark }}
                            >
                              &ldquo;
                            </span>
                            <p className="text-stone-400 text-sm font-serif leading-[2.2] tracking-[0.04em]">
                              {card.core_answer}
                            </p>
                          </div>
                        </div>

                        {/* Master comment — accent dot in master color */}
                        <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-start gap-2.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-[9px] shrink-0"
                            style={{
                              backgroundColor: mStyle.accentDot,
                              boxShadow: mStyle.accentDotShadow,
                            }}
                          />
                          <p className="text-stone-500 text-xs font-serif italic leading-relaxed tracking-[0.06em]">
                            {card.master_comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
