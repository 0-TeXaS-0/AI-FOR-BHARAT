'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import Container from '@/components/Container';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
  const router = useRouter();
  const [demoText, setDemoText] = useState('What is your best price?');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const { isAIOpen, setIsAIOpen } = useAIAssistant();

  const translateDemo = async (text: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          from: 'auto',
          to: 'hi'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setTranslatedText(result.data.translatedText);
      } else {
        setTranslatedText('Translation unavailable');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation service offline');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextChange = (text: string) => {
    setDemoText(text);
    translateDemo(text);
  };

  // Translate initial text on mount
  useEffect(() => {
    translateDemo(demoText);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Container className="py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="mb-8 inline-block">
            <div className="text-7xl md:text-9xl animate-bounce bg-gradient-to-r from-orange-500 to-teal-500 p-6 rounded-3xl shadow-2xl">
              🏪
            </div>
          </div>
          <Typography variant="h1" className="text-gray-900 dark:text-white mb-6 text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
            Multilingual Mandi
          </Typography>
          <Typography variant="bilingual" className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-teal-500 bg-clip-text text-transparent mb-4">
            बहुभाषी मंडी
          </Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Empowering local markets with AI-driven price discovery and instant translation
          </Typography>
        </div>

        {/* Main CTA Section */}
        <Container size="sm" className="mb-20">
          <Card variant="elevated" padding="xl">
            <Typography variant="h3" className="text-center mb-10 text-gray-900 dark:text-white text-3xl font-bold">
              Get Started | शुरू करें
            </Typography>
            
            <Button
              onClick={() => router.push('/search')}
              variant="primary"
              size="xl"
              className="w-full mb-5 text-xl font-bold shadow-xl hover:shadow-2xl"
            >
              🛒 Start Shopping | खरीदारी शुरू करें
            </Button>
            
            <Button
              onClick={() => router.push('/vendor')}
              variant="secondary"
              size="xl"
              className="w-full text-lg font-bold shadow-lg hover:shadow-xl"
            >
              🏪 I'm a Vendor | मैं विक्रेता हूं
            </Button>
          </Card>
        </Container>

        {/* Translation Demo Section */}
        <div className="mb-20">
          <Typography variant="h3" className="text-center mb-10 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
            Try Our Translation | हमारा अनुवाद आज़माएं
          </Typography>
          <Card variant="elevated" padding="xl" className="max-w-3xl mx-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <Typography variant="h4" className="mb-4 text-gray-800 dark:text-white">
                  Live Translation Demo | लाइव अनुवाद डेमो
                </Typography>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Type any phrase and see instant translation between English and Hindi
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Enter text to translate:
                  </label>
                  <input
                    type="text"
                    value={demoText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200"
                    placeholder="Type something..."
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600 min-h-[120px] flex flex-col justify-center">
                  <Typography variant="body" className="text-gray-800 dark:text-gray-200 mb-3 font-semibold text-base">
                    Translation Result:
                  </Typography>
                  {isTranslating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600 dark:text-gray-400">Translating...</span>
                    </div>
                  ) : (
                    <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                      {translatedText || 'Type something to see translation'}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Typography variant="caption" className="text-gray-700 dark:text-gray-300 font-semibold mr-2 self-center">
                    Try these:
                  </Typography>
                  {[
                    'Hello',
                    'Thank you',
                    'How much?',
                    'Is this fresh?',
                    'Can you reduce the price?'
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => handleTextChange(phrase)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-orange-500 hover:text-white text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <Typography variant="h3" className="text-center mb-12 text-gray-900 dark:text-white text-3xl md:text-4xl font-bold">
            Why Choose Us? | हमें क्यों चुनें?
          </Typography>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <Card variant="interactive" padding="lg" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl md:text-6xl mb-6 text-center">🌐</div>
              <Typography variant="h4" className="mb-4 text-center text-gray-900 dark:text-white font-bold text-xl">
                Bilingual Support
              </Typography>
              <Typography variant="caption" className="text-center text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                English & Hindi translation | अंग्रेजी और हिंदी अनुवाद
              </Typography>
            </Card>
            
            <Card variant="interactive" padding="lg" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <div className="text-5xl md:text-6xl mb-6 text-center">💰</div>
              <Typography variant="h4" className="mb-4 text-center text-gray-900 dark:text-white font-bold text-xl">
                Price Discovery
              </Typography>
              <Typography variant="caption" className="text-center text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                Compare prices instantly | तुरंत कीमतों की तुलना करें
              </Typography>
            </Card>
            
            <Card variant="interactive" padding="lg" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="text-5xl md:text-6xl mb-6 text-center">🤝</div>
              <Typography variant="h4" className="mb-4 text-center text-gray-900 dark:text-white font-bold text-xl">
                Smart Negotiation
              </Typography>
              <Typography variant="caption" className="text-center text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                AI-powered deal assistance | AI सहायता से बेहतर सौदे
              </Typography>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card variant="default" className="bg-gradient-to-r from-orange-600 via-teal-600 to-blue-600 text-white text-center shadow-2xl border-none">
          <Typography variant="h3" className="mb-10 text-3xl md:text-4xl font-bold">
            Join the Revolution | क्रांति में शामिल हों
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-200">
              <Typography variant="h2" className="text-white mb-3 text-5xl font-bold drop-shadow-lg">100+</Typography>
              <Typography variant="body" className="text-white/90 text-lg font-medium">Local Vendors | स्थानीय विक्रेता</Typography>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-200">
              <Typography variant="h2" className="text-white mb-3 text-5xl font-bold drop-shadow-lg">24/7</Typography>
              <Typography variant="body" className="text-white/90 text-lg font-medium">Price Updates | कीमत अपडेट</Typography>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all duration-200">
              <Typography variant="h2" className="text-white mb-3 text-5xl font-bold drop-shadow-lg">2</Typography>
              <Typography variant="body" className="text-white/90 text-lg font-medium">Languages | भाषाएं</Typography>
            </div>
          </div>
        </Card>
      </Container>

      {/* AI Assistant */}
      {isAIOpen && (
        <AIAssistant
          language={language}
          context={{}}
          onClose={() => setIsAIOpen(false)}
        />
      )}

      {/* AI Assistant Trigger Button */}
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-2xl p-4 transition-all duration-300 hover:scale-110 flex items-center gap-2"
          title={language === 'en' ? 'Open AI Assistant' : 'AI सहायक खोलें'}
        >
          <span className="text-2xl">🤖</span>
          <span className="font-semibold hidden md:inline">
            {language === 'en' ? 'AI Help' : 'AI मदद'}
          </span>
        </button>
      )}
    </div>
  );
}