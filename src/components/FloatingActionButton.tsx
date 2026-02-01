'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAIAssistant } from '@/contexts/AIAssistantContext';

export default function FloatingActionButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAIOpen } = useAIAssistant();

  // Hide/show based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Different actions based on current page
  const getButtonConfig = () => {
    if (pathname === '/') {
      return {
        icon: '🛒',
        action: () => router.push('/search'),
        title: 'Start Shopping | खरीदारी शुरू करें'
      };
    } else if (pathname === '/search') {
      return {
        icon: '🏠',
        action: () => router.push('/'),
        title: 'Go Home | होम जाएं'
      };
    } else if (pathname.startsWith('/vendor/')) {
      return {
        icon: '🔍',
        action: () => router.push('/search'),
        title: 'Search Again | फिर से खोजें'
      };
    } else {
      return {
        icon: '🛒',
        action: () => router.push('/search'),
        title: 'Start Shopping | खरीदारी शुरू करें'
      };
    }
  };

  const { icon, action, title } = getButtonConfig();

  return (
    <button
      onClick={action}
      className={`fixed ${isAIOpen ? 'bottom-[30rem]' : 'bottom-6'} right-6 w-14 h-14 bg-[#2ECC40] hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 z-50 flex items-center justify-center text-2xl group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
      title={title}
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:scale-110 transition-all duration-150"></div>
    </button>
  );
}