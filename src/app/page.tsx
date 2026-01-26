'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Container from '@/components/Container';
import Typography from '@/components/Typography';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TranslationToggle from '@/components/TranslationToggle';

export default function Home() {
  const router = useRouter();
  const [demoText, setDemoText] = useState('What is your best price?');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-white to-[#F5F5F5] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Container className="py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6">
            <span className="text-6xl md:text-8xl animate-bounce">🏪</span>
          </div>
          <Typography variant="h1" className="text-gray-800 dark:text-white mb-4">
            Multilingual Mandi
          </Typography>
          <Typography variant="bilingual" className="text-[#FF851B] font-semibold mb-2">
            बहुभाषी मंडी - Your Local Trade Bridge
          </Typography>
          <Typography variant="body" className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Empowering local markets with AI-driven price discovery and instant translation
          </Typography>
        </div>

        {/* Main CTA Section */}
        <Container size="sm" className="mb-16">
          <Card variant="elevated" padding="lg">
            <Typography variant="h3" className="text-center mb-8 text-gray-800 dark:text-white">
              Get Started | शुरू करें
            </Typography>
            
            <Button
              onClick={() => router.push('/search')}
              variant="primary"
              size="xl"
              className="w-full mb-4"
            >
              🛒 Start Shopping | खरीदारी शुरू करें
            </Button>
            
            <Button
              disabled
              variant="ghost"
              size="xl"
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              🏪 I'm a Vendor | मैं विक्रेता हूं (Coming Soon)
            </Button>
          </Card>
        </Container>

        {/* Translation Demo Section */}
        <div className="mb-16">
          <Typography variant="h3" className="text-center mb-8 text-gray-800 dark:text-white">
            Try Our Translation | हमारा अनुवाद आज़माएं
          </Typography>
          <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <Typography variant="h4" className="mb-4 text-gray-800 dark:text-white">
                  Live Translation Demo | लाइव अनुवाद डेमो
                </Typography>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Type any phrase and see instant translation between English and Hindi
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter text to translate:
                  </label>
                  <input
                    type="text"
                    value={demoText}
                    onChange={(e) => setDemoText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF851B] bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Type something..."
                  />
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <Typography variant="body" className="text-gray-700 dark:text-gray-300 mb-2">
                    Translation Result:
                  </Typography>
                  <div className="text-lg font-medium">
                    <TranslationToggle
                      text={demoText}
                      showIndicator={true}
                      className="text-[#FF851B]"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Typography variant="caption" className="text-gray-600 dark:text-gray-400 mr-2">
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
                      onClick={() => setDemoText(phrase)}
                      className="bg-gray-200 dark:bg-gray-700 hover:bg-[#FF851B] hover:text-white text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm transition-all duration-200"
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
        <div className="mb-16">
          <Typography variant="h3" className="text-center mb-8 text-gray-800 dark:text-white">
            Why Choose Us? | हमें क्यों चुनें?
          </Typography>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card variant="interactive" padding="lg">
              <div className="text-4xl md:text-5xl mb-4 text-center">🌐</div>
              <Typography variant="h4" className="mb-3 text-center text-gray-800 dark:text-white">
                Bilingual Support
              </Typography>
              <Typography variant="caption" className="text-center">
                English & Hindi translation | अंग्रेजी और हिंदी अनुवाद
              </Typography>
            </Card>
            
            <Card variant="interactive" padding="lg">
              <div className="text-4xl md:text-5xl mb-4 text-center">💰</div>
              <Typography variant="h4" className="mb-3 text-center text-gray-800 dark:text-white">
                Price Discovery
              </Typography>
              <Typography variant="caption" className="text-center">
                Compare prices instantly | तुरंत कीमतों की तुलना करें
              </Typography>
            </Card>
            
            <Card variant="interactive" padding="lg" className="sm:col-span-2 lg:col-span-1">
              <div className="text-4xl md:text-5xl mb-4 text-center">🤝</div>
              <Typography variant="h4" className="mb-3 text-center text-gray-800 dark:text-white">
                Smart Negotiation
              </Typography>
              <Typography variant="caption" className="text-center">
                AI-powered deal assistance | AI सहायता से बेहतर सौदे
              </Typography>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card variant="default" className="bg-[#001f3f] text-white text-center">
          <Typography variant="h3" className="mb-6">
            Join the Revolution | क्रांति में शामिल हों
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography variant="h2" className="text-[#2ECC40] mb-2">100+</Typography>
              <Typography variant="body">Local Vendors | स्थानीय विक्रेता</Typography>
            </div>
            <div>
              <Typography variant="h2" className="text-[#FF851B] mb-2">24/7</Typography>
              <Typography variant="body">Price Updates | कीमत अपडेट</Typography>
            </div>
            <div>
              <Typography variant="h2" className="text-[#2ECC40] mb-2">2</Typography>
              <Typography variant="body">Languages | भाषाएं</Typography>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}