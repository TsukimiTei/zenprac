'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MASTERS } from '@/lib/constants';
import { MasterType } from '@/types';

const STEPS = [
  {
    title: '欢迎来到禅堂',
    content: '贫僧是引路僧，将为你介绍三位上师。参禅之路，不在远方，就在当下每一步。',
    emoji: '🙏',
  },
  {
    title: '释迦牟尼佛',
    content: '世尊以四谛八正道指引众生。他的言语庄严慈悲，如慈父般温暖。善于用比喻启发智慧。适合初次参禅，或想要探索苦与解脱之道的修行者。',
    emoji: '🙏',
    master: 'shakyamuni' as MasterType,
  },
  {
    title: '文殊菩萨',
    content: '文殊师利以般若利剑斩断迷惑。他的风格清冷空灵，言简意赅。善用反问和悖论打破你的思维定式。适合喜欢深度思辨，敢于直面「空」的修行者。',
    emoji: '⚔️',
    master: 'manjushri' as MasterType,
  },
  {
    title: '六祖慧能',
    content: '慧能大师不立文字、直指人心。他的语言朴素自然，如邻家长者。一字不识却能道破天机。适合喜欢在日常生活中参禅，追求当下顿悟的修行者。',
    emoji: '🍃',
    master: 'huineng' as MasterType,
  },
  {
    title: '选择你的禅师',
    content: '三位上师各有所长，无分高下。选择与你当下心境最契合的那一位，开始你的参禅之旅。你随时可以更换禅师。',
    emoji: '🪷',
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ is_onboarded: true })
        .eq('user_id', user.id);
    }
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in" key={step}>
        {/* Emoji avatar */}
        <div className="text-center">
          <div className="text-6xl mb-6">{current.emoji}</div>
          <h2 className="text-2xl font-semibold text-stone-100" style={{ fontFamily: 'var(--font-zen)' }}>
            {current.title}
          </h2>
        </div>

        {/* Content */}
        <div className="zen-card p-6">
          <p className="text-stone-300 leading-relaxed text-sm" style={{ fontFamily: 'var(--font-zen)' }}>
            {current.content}
          </p>

          {/* Master-specific theme preview */}
          {current.master && (
            <div
              className="mt-4 p-3 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${MASTERS[current.master].theme.primary}15, ${MASTERS[current.master].theme.secondary}10)`,
                borderLeft: `3px solid ${MASTERS[current.master].theme.primary}40`,
              }}
            >
              <p className="text-stone-400 text-xs">
                擅长 · {MASTERS[current.master].specialty}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-stone-500 text-sm hover:text-stone-300 transition-colors"
            >
              ← 上一步
            </button>
          ) : (
            <div />
          )}

          {isLast ? (
            <button
              onClick={handleComplete}
              className="zen-button bg-amber-800/80 text-amber-100 hover:bg-amber-700/80"
            >
              开始参禅
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              className="zen-button bg-stone-700 text-stone-200 hover:bg-stone-600"
            >
              继续 →
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? 'bg-amber-500 w-6' : i < step ? 'bg-stone-600' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
