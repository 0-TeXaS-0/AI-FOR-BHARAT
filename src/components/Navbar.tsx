'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-teal-600 text-white z-50 h-16 shadow-2xl backdrop-blur-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => router.push('/')}
        >
          <span className="text-3xl drop-shadow-lg">🏪</span>
          <h1 className="text-xl md:text-2xl font-extrabold drop-shadow-lg">
            मंडी <span className="text-white/90">Mandi</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="/search" 
            className="hover:text-white/80 transition-all font-bold text-lg hover:scale-105 duration-200"
          >
            Search | खोजें
          </a>
          <a 
            href="/vendor" 
            className="hover:text-white/80 transition-all font-bold text-lg hover:scale-105 duration-200"
          >
            Vendors | विक्रेता
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 hover:scale-110 transition-all duration-200 text-2xl backdrop-blur-sm shadow-lg"
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all text-xl backdrop-blur-sm"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 relative backdrop-blur-sm"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''
              }`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1.5 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1.5 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-gradient-to-r from-orange-600 to-teal-600 border-t border-white/20 transition-all duration-300 ease-in-out shadow-xl ${
        mobileMenuOpen 
          ? 'max-h-56 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-4 py-5 space-y-4">
          <a 
            href="/search" 
            className="block py-3 hover:text-white/80 transition-all font-bold text-lg transform hover:translate-x-2 duration-200 bg-white/10 rounded-xl px-4 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            🔍 Search | खोजें
          </a>
          <a 
            href="/vendor" 
            className="block py-3 hover:text-white/80 transition-all font-bold text-lg transform hover:translate-x-2 duration-200 bg-white/10 rounded-xl px-4 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            🏪 Vendors | विक्रेता
          </a>
          <div className="pt-3 border-t border-white/20">
            <p className="text-sm text-white/70 font-medium px-4">
              Multilingual Mandi v1.0
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}