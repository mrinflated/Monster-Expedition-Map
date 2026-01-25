'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-primary-green text-white h-[40px] flex items-center justify-between px-4 shrink-0 shadow-sm relative z-20">
      <Link href="/" className="text-lg font-bold tracking-wide hover:opacity-90">
        A Monster&apos;s Expedition Walkthrough Map
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/about" className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity text-sm font-medium">
          <HelpCircle size={16} />
          About
        </Link>
      </nav>
    </div>
  );
}
