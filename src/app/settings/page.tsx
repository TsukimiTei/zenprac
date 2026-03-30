'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import BottomNav from '@/components/BottomNav';

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [voiceMode, setVoiceMode] = useState<'push_to_talk' | 'auto_detect'>('push_to_talk');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser({ id: user.id, email: user.email });

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      if (profile) setDisplayName(profile.display_name || '');
      setLoading(false);
    }
    init();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('user_id', user.id);
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 pb-24">
      <header className="px-6 pt-8 md:pt-32 pb-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-stone-100" style={{ fontFamily: 'var(--font-zen)' }}>
            设置
          </h1>
        </div>
      </header>

      <main className="px-6 max-w-lg mx-auto space-y-6">
        {/* Profile */}
        <div className="zen-card p-5 space-y-4">
          <h3 className="text-stone-400 text-sm font-medium">个人信息</h3>

          <div>
            <label className="text-stone-500 text-xs block mb-1">法号（显示名称）</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="zen-input"
              placeholder="输入你的法号"
            />
          </div>

          <div>
            <label className="text-stone-500 text-xs block mb-1">邮箱</label>
            <p className="text-stone-400 text-sm">{user?.email || ''}</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="zen-button bg-stone-700 text-stone-200 hover:bg-stone-600
                       disabled:opacity-50 text-sm"
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
        </div>

        {/* Voice settings */}
        <div className="zen-card p-5 space-y-4">
          <h3 className="text-stone-400 text-sm font-medium">语音设置</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="voiceMode"
                checked={voiceMode === 'push_to_talk'}
                onChange={() => setVoiceMode('push_to_talk')}
                className="accent-amber-600"
              />
              <div>
                <p className="text-stone-300 text-sm">按住说话</p>
                <p className="text-stone-600 text-xs">按住按钮时录音，松开发送</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="voiceMode"
                checked={voiceMode === 'auto_detect'}
                onChange={() => setVoiceMode('auto_detect')}
                className="accent-amber-600"
              />
              <div>
                <p className="text-stone-300 text-sm">自动检测</p>
                <p className="text-stone-600 text-xs">自动检测语音开始和结束</p>
              </div>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="zen-card p-5 space-y-3">
          <h3 className="text-stone-400 text-sm font-medium">关于</h3>
          <p className="text-stone-500 text-sm">ZenPrac v1.0.0</p>
          <p className="text-stone-600 text-xs">参禅问道，直指本心</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 text-center text-red-400/70 text-sm hover:text-red-400 transition-colors"
        >
          退出登录
        </button>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
