'use client';

import { useState, useEffect } from 'react';
import { translationService, TranslationResponse } from '@/services/translationService';
import TranslationIndicator from './TranslationIndicator';

interface TranslationToggleProps {
  text: string;
  from?: string;
  to?: string;
  className?: string;
  showIndicator?: boolean;
  showOriginal?: boolean;
  fallbackText?: string;
}

export default function TranslationToggle({
  text,
  from,
  to,
  className = '',
  showIndicator = true,
  showOriginal = false,
  fallbackText
}: TranslationToggleProps) {
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginalText, setShowOriginalText] = useState(showOriginal);
  
  useEffect(() => {
    if (text && text.trim()) {
      translateText();
    }
  }, [text, from, to]);
  
  const translateText = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await translationService.translate(text, from, to);
      setTranslation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleOriginal = () => {
    setShowOriginalText(!showOriginalText);
  };
  
  const getDisplayText = () => {
    if (loading) return 'Translating...';
    if (error) return fallbackText || text;
    if (!translation) return text;
    
    if (showOriginalText) {
      return translation.originalText;
    }
    
    return translation.translatedText;
  };
  
  const shouldShowTranslation = () => {
    return translation && 
           translation.translatedText !== translation.originalText &&
           translation.confidence > 0.3;
  };
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Main Text */}
      <span className={loading ? 'opacity-50' : ''}>
        {getDisplayText()}
      </span>
      
      {/* Loading Indicator */}
      {loading && (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      )}
      
      {/* Translation Indicator */}
      {showIndicator && shouldShowTranslation() && translation && (
        <TranslationIndicator
          translation={translation}
          compact={true}
          onToggleOriginal={toggleOriginal}
        />
      )}
      
      {/* Toggle Button */}
      {shouldShowTranslation() && (
        <button
          onClick={toggleOriginal}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          title={showOriginalText ? 'Show translation' : 'Show original'}
        >
          {showOriginalText ? '🔄' : '🌐'}
        </button>
      )}
      
      {/* Error Indicator */}
      {error && (
        <span 
          className="text-red-500 text-xs cursor-help" 
          title={`Translation error: ${error}`}
        >
          ⚠️
        </span>
      )}
    </div>
  );
}