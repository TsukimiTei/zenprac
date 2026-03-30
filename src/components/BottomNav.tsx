'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/home', label: '参禅' },
    { href: '/cards', label: '禅卡' },
    { href: '/journey', label: '修行' },
    { href: '/settings', label: '设置' },
  ];

  return (
    <nav className="fixed bottom-8 md:bottom-auto md:top-12 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-md md:max-w-3xl mx-auto flex justify-center gap-8 md:gap-24 bg-stone-900/80 md:bg-stone-900/40 backdrop-blur-md py-4 md:py-5 px-8 md:px-12 rounded-full border border-stone-800/60 md:border-stone-700/30 pointer-events-auto shadow-2xl shadow-black/50 md:shadow-black/20 transition-all duration-500">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`text-xs md:text-sm tracking-[0.3em] font-serif transition-all duration-500 hover:scale-105 ${
                isActive 
                  ? 'text-stone-200 border-b border-stone-500 pb-1' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
