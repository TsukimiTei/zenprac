'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MASTERS, MAX_DAILY_SESSIONS } from '@/lib/constants';
import { MasterType } from '@/types';
import { getDevFlags } from '@/components/DevPanel';
import BottomNav from '@/components/BottomNav';

const MASTER_KEYS: MasterType[] = ['shakyamuni', 'manjushri', 'huineng'];

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<{ display_name?: string } | null>(null);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      setProfile(profileData);

      // Fetch session count
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);
      setSessionsToday(count || 0);

      setLoading(false);
    }
    init();
  }, []);

  const devNoLimit = getDevFlags().disableDailyLimit;
  const remaining = devNoLimit ? 999 : MAX_DAILY_SESSIONS - sessionsToday;
  
  const activeKey = MASTER_KEYS[currentIndex];
  const master = MASTERS[activeKey];

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % MASTER_KEYS.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + MASTER_KEYS.length) % MASTER_KEYS.length);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const userName = profile?.display_name || '修行者';

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 ease-in-out relative overflow-hidden flex flex-col"
      style={{ backgroundColor: master.theme.bg }}
    >
      {/* Abstract Visual Totems */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        {/* Shakyamuni: Golden Mandala / Sun */}
        <div 
          className={`absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full border-[1px] border-amber-500/20 transition-all duration-1000 ease-in-out
            ${activeKey === 'shakyamuni' ? 'opacity-100 scale-100 animate-spin-slow' : 'opacity-0 scale-50'}`}
          style={{
            background: 'radial-gradient(circle, rgba(184,134,11,0.15) 0%, transparent 70%)',
            boxShadow: '0 0 100px rgba(184,134,11,0.1), inset 0 0 100px rgba(184,134,11,0.1)'
          }}
        >
          <div className="absolute inset-4 rounded-full border-[1px] border-amber-400/10 border-dashed animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-12 rounded-full border-[1px] border-amber-300/10 animate-spin-slow" style={{ animationDuration: '30s' }} />
        </div>

        {/* Manjushri: Sharp Crystalline Sword / Geometry */}
        <div 
          className={`absolute w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] transition-all duration-1000 ease-in-out
            ${activeKey === 'manjushri' ? 'opacity-100 scale-100 animate-float-sharp' : 'opacity-0 scale-150 rotate-90'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-cyan-400/5 to-transparent backdrop-blur-sm border border-blue-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
          <div className="absolute inset-4 bg-gradient-to-bl from-indigo-500/10 via-blue-400/5 to-transparent border border-indigo-400/20" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        </div>

        {/* Huineng: Organic Morphing Shape / Ink */}
        <div 
          className={`absolute w-[70vw] h-[70vw] max-w-[500px] max-h-[500px] transition-all duration-1000 ease-in-out
            ${activeKey === 'huineng' ? 'opacity-100 scale-100 animate-morph' : 'opacity-0 scale-75'}`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(107,142,35,0.2) 0%, rgba(143,188,143,0.05) 50%, transparent 80%)',
            filter: 'blur(20px)'
          }}
        />

        {/* Global Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="px-8 md:px-16 pt-12 md:pt-12 pb-4 relative z-20 animate-fade-in flex justify-between items-start md:items-center">
        <div className="space-y-2 md:space-y-4 md:fixed md:top-16 md:left-16">
          <p className="text-stone-400 text-xs md:text-sm tracking-[0.3em] font-serif">善哉，{userName}</p>
          <p className="text-stone-600 text-[10px] md:text-xs tracking-widest font-serif">
            今日可参禅 {remaining} 次
          </p>
        </div>
        <div className="text-stone-600 text-xs md:text-sm tracking-[0.3em] font-serif writing-vertical-rl md:fixed md:top-16 md:right-16">
          {currentIndex + 1} / {MASTER_KEYS.length}
        </div>
      </header>

      {/* Main Content - Gallery Style */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full">
        {/* Left/Right Navigation Areas */}
        <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer z-20 flex items-center justify-start pl-4 md:pl-24 group" onClick={handlePrev}>
          <span className="text-stone-700 group-hover:text-stone-300 transition-colors text-2xl md:text-5xl font-serif opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-500">
            ←
          </span>
        </div>
        <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer z-20 flex items-center justify-end pr-4 md:pr-24 group" onClick={handleNext}>
          <span className="text-stone-700 group-hover:text-stone-300 transition-colors text-2xl md:text-5xl font-serif opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-500">
            →
          </span>
        </div>

        {/* Master Info */}
        <div className="text-center px-8 max-w-lg md:max-w-2xl pointer-events-none">
          <div className={`transition-all duration-700 ease-out ${isTransitioning ? 'opacity-0 blur-md scale-95' : 'opacity-100 blur-0 scale-100'}`}>
            <h2 
              className="text-5xl md:text-8xl font-serif tracking-[0.2em] mb-4 md:mb-8"
              style={{ 
                color: master.theme.accent,
                textShadow: `0 0 30px ${master.theme.primary}40`
              }}
            >
              {master.name}
            </h2>
            <p className="text-stone-400 text-sm md:text-xl tracking-[0.4em] font-serif mb-12 md:mb-16 opacity-80">
              {master.title}
            </p>
            
            <div className="space-y-6 md:space-y-8">
              <p className="text-stone-300 text-sm md:text-lg tracking-[0.2em] font-serif leading-loose max-w-sm md:max-w-xl mx-auto">
                {master.description}
              </p>
              <p className="text-stone-500 text-xs md:text-sm tracking-[0.3em] font-serif">
                {master.specialty}
              </p>
            </div>

            <div className="mt-20 md:mt-24 pointer-events-auto">
              {remaining > 0 ? (
                <button 
                  onClick={() => router.push(`/session?master=${activeKey}`)}
                  className="group relative inline-flex items-center justify-center px-12 py-4 md:px-16 md:py-6 overflow-hidden"
                >
                  <span className="absolute w-full h-[1px] bottom-0 left-0 bg-gradient-to-r from-transparent via-stone-500 to-transparent group-hover:via-white transition-all duration-500"></span>
                  <span className="relative text-sm md:text-lg tracking-[0.5em] font-serif text-stone-400 group-hover:text-white transition-colors duration-500">
                    入座
                  </span>
                </button>
              ) : (
                <p className="text-xs md:text-sm tracking-[0.4em] font-serif text-stone-600">
                  今日缘分已尽
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Master selector — always visible, shows all 3 */}
      <div className="relative z-20 flex items-center justify-center gap-8 md:gap-12 pb-28 md:pb-8">
        {MASTER_KEYS.map((key, i) => {
          const m = MASTERS[key];
          const isActive = i === currentIndex;
          return (
            <button
              key={key}
              onClick={() => {
                if (i === currentIndex || isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(i);
                setTimeout(() => setIsTransitioning(false), 800);
              }}
              className="flex flex-col items-center gap-2 transition-all duration-500 group"
            >
              <div
                className={`rounded-full transition-all duration-500 ${isActive ? 'w-2 h-2' : 'w-1 h-1 group-hover:w-1.5 group-hover:h-1.5'}`}
                style={{
                  backgroundColor: isActive ? m.theme.accent : '#57534e',
                  boxShadow: isActive ? `0 0 8px ${m.theme.accent}60` : 'none',
                }}
              />
              <span
                className={`text-[10px] md:text-xs tracking-[0.2em] font-serif transition-all duration-500 ${
                  isActive ? 'opacity-90' : 'opacity-30 group-hover:opacity-60'
                }`}
                style={{ color: isActive ? m.theme.accent : '#a8a29e' }}
              >
                {m.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Minimalist Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
