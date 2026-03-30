import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black overflow-hidden font-sans">
      {/* Background decoration & Ambient Light */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neutral-900/30 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] mb-[-100px] bg-neutral-800/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-[0.03] mix-blend-overlay z-0"></div>

      <div className="relative z-10 text-center space-y-16 max-w-2xl px-6 pb-20 mt-10">
        {/* Main Title Section */}
        <div className="space-y-6 md:space-y-10 animate-fade-in opacity-0">
          <div className="inline-block relative">
            <div className="absolute -inset-8 bg-neutral-500/10 blur-3xl rounded-full" />
            <span className="text-7xl md:text-9xl opacity-90 drop-shadow-2xl">🪷</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-zen font-semibold text-transparent bg-clip-text bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500 tracking-wider">
            ZenPrac
          </h1>
          <p className="text-neutral-400 text-lg md:text-3xl font-zen font-light tracking-[0.3em] uppercase">
            参禅问道 · 直指本心
          </p>
        </div>

        {/* Features/Poetic Intros */}
        <div className="space-y-4 md:space-y-6 text-neutral-500 text-sm md:text-xl leading-loose font-light animate-fade-in delay-300 opacity-0 tracking-widest max-w-sm md:max-w-xl mx-auto">
          <p>与佛陀、文殊、六祖</p>
          <p>于此时 此地 当下</p>
          <div className="h-4 md:h-8"></div>
          <p className="opacity-60 text-xs md:text-sm">感知 · 呼吸 · 参禅</p>
        </div>

        {/* Call to action */}
        <div className="pt-12 md:pt-20 space-y-6 md:space-y-8 animate-fade-in delay-500 opacity-0">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center px-12 py-5 md:px-16 md:py-6 rounded-full bg-white/5 border border-white/10 text-white font-zen tracking-[0.2em] backdrop-blur-md overflow-hidden transition-all duration-700 hover:bg-white/10 hover:border-white/20 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span className="relative z-10 text-lg md:text-2xl">开始参禅</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
          <p className="text-neutral-600 text-xs md:text-sm tracking-widest font-zen">参禅贵精不贵多，每日十次足矣</p>
        </div>
      </div>

      {/* Epilogue Text */}
      <div className="fixed bottom-10 md:bottom-16 z-10 animate-fade-in delay-1000 opacity-0 pointer-events-none">
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-transparent to-neutral-600/50"></div>
          <p className="text-neutral-700 text-[10px] md:text-sm tracking-[0.4em] font-zen writing-horizontal-tb">
            菩提本无树 · 明镜亦非台
          </p>
        </div>
      </div>
    </div>
  );
}
