import { useState } from 'react';
import { Menu, X, Shield, User, Settings } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 via-blue-500 to-orange-400" />
            <span className="font-semibold text-gray-900 text-lg tracking-tight flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" /> RedTeam AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#exercises" className="text-sm text-gray-700 hover:text-gray-900">Exercises</a>
            <a href="#playground" className="text-sm text-gray-700 hover:text-gray-900">Playground</a>
            <a href="#admin" className="text-sm text-gray-700 hover:text-gray-900">Admin</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
              <User className="h-4 w-4" /> Sign in
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black">
              <Settings className="h-4 w-4" /> Admin
            </button>
          </div>
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-gray-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-2 pt-2">
              <a onClick={() => setOpen(false)} href="#exercises" className="px-2 py-2 rounded hover:bg-gray-50">Exercises</a>
              <a onClick={() => setOpen(false)} href="#playground" className="px-2 py-2 rounded hover:bg-gray-50">Playground</a>
              <a onClick={() => setOpen(false)} href="#admin" className="px-2 py-2 rounded hover:bg-gray-50">Admin</a>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50">
                  <User className="h-4 w-4" /> Sign in
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black">
                  <Settings className="h-4 w-4" /> Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
