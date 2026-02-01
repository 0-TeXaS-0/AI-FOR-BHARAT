// Translation Service for Multilingual Mandi
// Handles all translation operations with caching and error handling

interface TranslationResponse {
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  targetLanguage: string;
  confidence: number;
  translationMethod: string;
  suggestions?: string[];
  timestamp: string;
}

interface TranslationCache {
  [key: string]: TranslationResponse;
}

class TranslationService {
  private cache: TranslationCache = {};
  private readonly API_BASE = 'http://localhost:5000/api';
  
  // Cache key generator
  private getCacheKey(text: string, from?: string, to?: string): string {
    return `${text}_${from || 'auto'}_${to || 'auto'}`.toLowerCase();
  }
  
  // Main translation method
  async translate(
    text: string, 
    from?: string, 
    to?: string
  ): Promise<TranslationResponse> {
    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }
    
    const cacheKey = this.getCacheKey(text, from, to);
    
    // Return cached result if available
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }
    
    try {
      const response = await fetch(`${this.API_BASE}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim(), from, to }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Translation failed');
      }
      
      if (result.success) {
        const translated = result.data?.translatedText || text;
        this.cache[cacheKey] = translated;
        return translated;
      }
      
      throw new Error('Translation service returned no result');
    } catch (error) {
      console.log('Translation API unavailable, using original text');
      // Return original text if translation fails
      return text;
    }
  }
  
  // Batch translation for multiple texts
  async translateBatch(
    texts: string[], 
    from?: string, 
    to?: string
  ): Promise<TranslationResponse[]> {
    const promises = texts.map(text => this.translate(text, from, to));
    return Promise.all(promises);
  }
  
  // Auto-detect and translate
  async autoTranslate(text: string): Promise<TranslationResponse> {
    return this.translate(text); // API will auto-detect language
  }
  
  // Get translation with confidence check
  async getReliableTranslation(
    text: string, 
    minConfidence: number = 0.7,
    from?: string, 
    to?: string
  ): Promise<TranslationResponse | null> {
    const result = await this.translate(text, from, to);
    return result.confidence >= minConfidence ? result : null;
  }
  
  // Clear cache
  clearCache(): void {
    this.cache = {};
  }
  
  // Get cache size
  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }
  
  // Preload common phrases
  async preloadCommonPhrases(): Promise<void> {
    const commonPhrases = [
      'Hello',
      'Thank you',
      'What is your best price?',
      'Can you reduce the price?',
      'I will take it',
      'Is this fresh?',
      'Do you have organic?',
      'How much per kg?'
    ];
    
    try {
      await this.translateBatch(commonPhrases);
      console.log('Common phrases preloaded successfully');
    } catch (error) {
      console.error('Failed to preload common phrases:', error);
    }
  }
}

// Create singleton instance
export const translationService = new TranslationService();

// Export types for use in components
export type { TranslationResponse };

// Utility functions for components
export const formatTranslationDisplay = (
  translation: TranslationResponse,
  showOriginal: boolean = true
): string => {
  if (!showOriginal || translation.confidence < 0.5) {
    return translation.translatedText;
  }
  
  return `${translation.translatedText} (${translation.originalText})`;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.9) return 'text-green-600';
  if (confidence >= 0.7) return 'text-yellow-600';
  if (confidence >= 0.5) return 'text-orange-600';
  return 'text-red-600';
};

export const getConfidenceLabel = (confidence: number): string => {
  if (confidence >= 0.9) return 'High';
  if (confidence >= 0.7) return 'Good';
  if (confidence >= 0.5) return 'Fair';
  return 'Low';
};