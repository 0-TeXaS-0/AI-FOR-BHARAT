'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-[#001f3f] text-white z-50 h-16 shadow-lg">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => router.push('/')}
        >
          <span className="text-2xl">🏪</span>
          <h1 className="text-xl font-bold">
            मंडी <span className="text-[#FF851B]">Mandi</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <a 
            href="/search" 
            className="hover:text-[#FF851B] transition-colors font-medium"
          >
            Search | खोजें
          </a>
          <a 
            href="/vendors" 
            className="hover:text-[#FF851B] transition-colors font-medium"
          >
            Vendors | विक्रेता
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-200"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 relative"
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''
              }`}></span>
              <span className={`block w-4 h-0.5 bg-white transition-all duration-300 mt-1 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block w-4 h-0.5 bg-white transition-all duration-300 mt-1 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-[#001f3f] border-t border-white/10 transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'max-h-48 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 py-4 space-y-3">
          <a 
            href="/search" 
            className="block py-2 hover:text-[#FF851B] transition-colors font-medium transform hover:translate-x-2 duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            🔍 Search | खोजें
          </a>
          <a 
            href="/vendors" 
            className="block py-2 hover:text-[#FF851B] transition-colors font-medium transform hover:translate-x-2 duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            🏪 Vendors | विक्रेता
          </a>
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-white/60">
              Multilingual Mandi v1.0
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}