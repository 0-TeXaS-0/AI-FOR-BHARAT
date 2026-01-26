'use client';

import { useState } from 'react';
import { TranslationResponse, getConfidenceColor, getConfidenceLabel } from '@/services/translationService';

interface TranslationIndicatorProps {
  translation: TranslationResponse;
  showDetails?: boolean;
  compact?: boolean;
  onToggleOriginal?: () => void;
}

export default function TranslationIndicator({ 
  translation, 
  showDetails = false, 
  compact = false,
  onToggleOriginal 
}: TranslationIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const confidenceColor = getConfidenceColor(translation.confidence);
  const confidenceLabel = getConfidenceLabel(translation.confidence);
  
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1">
        <div 
          className={`w-2 h-2 rounded-full ${
            translation.confidence >= 0.9 ? 'bg-green-500' :
            translation.confidence >= 0.7 ? 'bg-yellow-500' :
            translation.confidence >= 0.5 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          title={`Translation confidence: ${confidenceLabel} (${Math.round(translation.confidence * 100)}%)`}
        />
        {translation.translationMethod !== 'exact' && (
          <span className="text-xs text-gray-500">🔄</span>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div 
        className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onToggleOriginal}
      >
        {/* Translation Status Icon */}
        <div className="flex items-center gap-1">
          <span className="text-blue-500">🌐</span>
          <span className={`font-medium ${confidenceColor}`}>
            {confidenceLabel}
          </span>
        </div>
        
        {/* Language Direction */}
        <div className="text-gray-600 dark:text-gray-300">
          {translation.originalLanguage.toUpperCase()} → {translation.targetLanguage.toUpperCase()}
        </div>
        
        {/* Method Indicator */}
        {translation.translationMethod !== 'exact' && (
          <div className="text-yellow-600" title={`Method: ${translation.translationMethod}`}>
            ⚠️
          </div>
        )}
      </div>
      
      {/* Detailed Tooltip */}
      {showTooltip && showDetails && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Original:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{translation.originalText}</p>
            </div>
            
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Translation:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{translation.translatedText}</p>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className={`font-medium ${confidenceColor}`}>
                {Math.round(translation.confidence * 100)}% confidence
              </span>
              <span className="text-gray-500 capitalize">
                {translation.translationMethod.replace('_', ' ')}
              </span>
            </div>
            
            {translation.suggestions && translation.suggestions.length > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Suggestions:</span>
                <ul className="mt-1 space-y-1">
                  {translation.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}