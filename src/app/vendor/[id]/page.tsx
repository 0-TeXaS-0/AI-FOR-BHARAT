'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Message {
  id: number;
  text: string;
  sender: 'buyer' | 'vendor';
  timestamp: Date;
  originalText?: string;
  translationConfidence?: number;
  translationMethod?: string;
}

interface Vendor {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  location: string;
  product: {
    name: string;
    nameHindi: string;
  };
}

export default function VendorChat() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [negotiationStep, setNegotiationStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchVendor();
    initializeChat();
  }, []);

  const fetchVendor = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/vendor/${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        setVendor(result.data);
        setCurrentPrice(result.data.price);
      } else {
        console.error('Failed to fetch vendor:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeChat = () => {
    setMessages([
      {
        id: 1,
        text: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?',
        sender: 'vendor',
        timestamp: new Date(),
        originalText: 'Hello! How can I help you?'
      }
    ]);
  };

  const translateText = async (text: string, from: string, to: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to })
      });
      const result = await response.json();
      
      if (result.success) {
        return {
          translatedText: result.data.translatedText,
          confidence: result.data.confidence,
          method: result.data.translationMethod
        };
      } else {
        console.error('Translation failed:', result.error);
        return { translatedText: text, confidence: 0.3, method: 'fallback' };
      }
    } catch (error) {
      console.error('Translation failed:', error);
      return { translatedText: text, confidence: 0.3, method: 'fallback' };
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'buyer',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Translate to Hindi for vendor
    const translationResult = await translateText(newMessage, 'en', 'hi');
    
    const translatedUserMessage: Message = {
      id: messages.length + 2,
      text: translationResult.translatedText,
      sender: 'buyer',
      timestamp: new Date(),
      originalText: newMessage,
      translationConfidence: translationResult.confidence,
      translationMethod: translationResult.method
    };

    setMessages(prev => [...prev, translatedUserMessage]);
    setNewMessage('');

    // Simulate vendor response based on negotiation flow
    setTimeout(() => {
      handleVendorResponse(newMessage);
    }, 1500);
  };

  const handleVendorResponse = async (userMessage: string) => {
    let vendorResponseHindi = '';
    let vendorResponseEnglish = '';

    if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('best')) {
      vendorResponseHindi = `मेरी सबसे अच्छी कीमत ${currentPrice} रुपये प्रति किलो है।`;
      vendorResponseEnglish = `My best price is ${currentPrice} rupees per kg.`;
    } else if (userMessage.toLowerCase().includes('reduce') || userMessage.toLowerCase().includes('less')) {
      // Use AI negotiation API
      try {
        const response = await fetch('http://localhost:5000/api/negotiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPrice: currentPrice,
            productType: 'vegetables',
            negotiationHistory: messages.slice(-3) // Last 3 messages for context
          })
        });
        const result = await response.json();
        
        if (result.success) {
          const newPrice = result.data.suggestedCounterOffer;
          setCurrentPrice(newPrice);
          vendorResponseHindi = `ठीक है, मैं ${newPrice} रुपये में दे सकता हूं।`;
          vendorResponseEnglish = `Okay, I can give for ${newPrice} rupees.`;
        } else {
          // Fallback to original logic
          const newPrice = Math.max(currentPrice - 3, currentPrice * 0.9);
          setCurrentPrice(newPrice);
          vendorResponseHindi = `ठीक है, मैं ${newPrice} रुपये में दे सकता हूं।`;
          vendorResponseEnglish = `Okay, I can give for ${newPrice} rupees.`;
        }
      } catch (error) {
        console.error('Negotiation API failed:', error);
        // Fallback to original logic
        const newPrice = Math.max(currentPrice - 3, currentPrice * 0.9);
        setCurrentPrice(newPrice);
        vendorResponseHindi = `ठीक है, मैं ${newPrice} रुपये में दे सकता हूं।`;
        vendorResponseEnglish = `Okay, I can give for ${newPrice} rupees.`;
      }
      setNegotiationStep(prev => prev + 1);
    } else if (userMessage.includes('kg') || userMessage.includes('किलो')) {
      vendorResponseHindi = 'ठीक है, कितना चाहिए?';
      vendorResponseEnglish = 'Okay, how much do you need?';
    } else {
      vendorResponseHindi = 'मैं समझ गया। और कुछ?';
      vendorResponseEnglish = 'I understand. Anything else?';
    }

    const vendorMessage: Message = {
      id: messages.length + 3,
      text: vendorResponseHindi,
      sender: 'vendor',
      timestamp: new Date(),
      originalText: vendorResponseEnglish
    };

    setMessages(prev => [...prev, vendorMessage]);
  };

  const getAISuggestion = () => {
    if (negotiationStep === 0) {
      return "💡 AI Suggestion: Ask 'What is your best price?' to start negotiation";
    } else if (negotiationStep === 1) {
      return "💡 AI Suggestion: Try 'Can you reduce the price?' for better deal";
    } else {
      return "💡 AI Suggestion: Say 'I will take 2 kg' to close the deal";
    }
  };

  const quickMessages = [
    'What is your best price?',
    'Can you reduce the price?',
    'I will take 2 kg'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF851B] mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading vendor...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Vendor not found</h2>
          <button
            onClick={() => router.push('/search')}
            className="bg-[#FF851B] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/search')}
          className="flex items-center gap-2 text-[#FF851B] hover:text-orange-600 mb-6 font-semibold transition-colors"
        >
          ← Back to Search | खोज पर वापस जाएं
        </button>

        {/* Vendor Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2ECC40] to-green-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              🏪
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    {vendor.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-1">
                    ({vendor.nameEn})
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    📍 {vendor.location}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold mb-2 inline-block">
                    🟢 Online
                  </div>
                  <div className="text-3xl font-bold text-[#2ECC40]">
                    ₹{currentPrice}
                    <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/kg</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-[#F5F5F5] dark:bg-gray-700 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Product:</span> {vendor.product.name} ({vendor.product.nameHindi})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl p-4 md:p-6 mb-6">
          <p className="text-blue-800 dark:text-blue-200 font-medium text-center">
            {getAISuggestion()}
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-[#001f3f] text-white">
            <h2 className="font-bold text-lg md:text-xl flex items-center gap-2">
              💬 Chat with Vendor | विक्रेता से बात करें
            </h2>
          </div>
          
          {/* Messages */}
          <div className="h-96 md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === 'buyer'
                      ? 'bg-[#FF851B] text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm md:text-base">{message.text}</p>
                  
                  {/* Translation Info */}
                  {message.originalText && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs opacity-75 italic">
                        Original: {message.originalText}
                      </p>
                      {message.translationConfidence && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            message.translationConfidence >= 0.9 ? 'bg-green-400' :
                            message.translationConfidence >= 0.7 ? 'bg-yellow-400' :
                            message.translationConfidence >= 0.5 ? 'bg-orange-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs opacity-60">
                            {Math.round(message.translationConfidence * 100)}% confidence
                          </span>
                          {message.translationMethod && message.translationMethod !== 'exact' && (
                            <span className="text-xs opacity-60" title={`Method: ${message.translationMethod}`}>
                              ⚠️
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Messages */}
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              Quick messages | त्वरित संदेश:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => setNewMessage(msg)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-[#FF851B] hover:text-white text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  {msg}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message... | अपना संदेश लिखें..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF851B] bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#FF851B] hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Deal Summary */}
        {negotiationStep >= 2 && (
          <div className="mt-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-2xl p-6 md:p-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
                Deal Summary | सौदे का सारांश
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-700">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Final Price:</span> ₹{currentPrice}/kg
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Product:</span> {vendor.product.name} ({vendor.product.nameHindi})
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Vendor:</span> {vendor.name} ({vendor.nameEn})
                </p>
              </div>
              <button className="bg-[#2ECC40] hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                Complete Transaction | लेन-देन पूरा करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}