'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) setError('登录失败，请重试');
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message === 'User already registered'
          ? '此邮箱已注册，请直接登录'
          : '注册失败：' + error.message);
      } else {
        window.location.href = '/home';
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : '登录失败：' + error.message);
      } else {
        window.location.href = '/home';
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-zen-dark)] relative overflow-hidden px-4">
      {/* Ambient background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-zen-gold)]/5 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[var(--color-zen-blue)]/5 rounded-full blur-[120px] animate-pulse-slow delay-1000 mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md space-y-12 relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6 animate-float">🪷</div>
          <h1 className="text-4xl font-bold text-stone-100 tracking-[0.2em] font-serif">
            ZenPrac
          </h1>
          <p className="text-stone-400/80 text-sm tracking-[0.3em] font-serif font-light">
            参禅问道 · 直指本心
          </p>
        </div>

        {/* Login form */}
        <div className="space-y-8 px-6 py-8 relative">
          {/* Subtle border instead of card */}
          <div className="absolute inset-0 border border-white/5 rounded-3xl bg-white/[0.01] backdrop-blur-sm -z-10" />

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 px-6 py-4 rounded-full
                       bg-white/5 border border-white/10 text-stone-200 font-serif tracking-widest text-sm
                       transition-all duration-500 ease-out hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5 opacity-90" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 账号登录
          </button>

          <div className="flex items-center gap-4 opacity-40">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-500 to-transparent" />
            <span className="text-stone-400 text-xs tracking-widest font-serif">或</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-500 to-transparent" />
          </div>

          {/* Email + Password */}
          <div className="space-y-6">
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="邮箱地址"
                className="input-zen text-center"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码（至少6位）"
                className="input-zen text-center"
                onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
              />
            </div>
            
            <button
              onClick={handleEmailAuth}
              disabled={!email || !password || password.length < 6 || loading}
              className="btn-zen w-full mt-4 bg-stone-800/50 border-stone-700/50 text-stone-300
                         hover:bg-stone-700/50 hover:text-stone-100 disabled:opacity-30 disabled:hover:scale-100"
            >
              {loading ? '请稍候...' : isSignUp ? '注 册' : '登 录'}
            </button>
            
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="w-full text-center text-stone-500/70 text-sm tracking-widest font-serif hover:text-stone-300 transition-colors mt-4"
            >
              {isSignUp ? '已有账号？登录' : '没有账号？注册'}
            </button>
          </div>

          {error && (
            <p className="text-red-400/80 text-sm text-center tracking-wider font-serif animate-fade-in mt-4">{error}</p>
          )}
        </div>

        <p className="text-center text-stone-600/50 text-xs tracking-widest font-serif absolute bottom-[-4rem] w-full left-0">
          登录即表示同意服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}
