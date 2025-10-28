import React from 'react';
import { Home } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-neutral-700" aria-hidden />
          <span className="font-semibold tracking-tight text-neutral-900">Blank Page</span>
        </div>
        <div className="text-sm text-neutral-500">A clean slate to build on</div>
      </div>
    </header>
  );
}
