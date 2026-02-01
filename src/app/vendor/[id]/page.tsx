'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useOrders } from '@/contexts/OrderContext';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import Button from '@/components/Button';
import Card from '@/components/Card';
import AIAssistant from '@/components/AIAssistant';

interface Message {
  id: number;
  text: string;
  sender: 'buyer' | 'vendor';
  timestamp: Date;
  originalText?: string;
  translationConfidence?: number;
  translationMethod?: string;
  isVoice?: boolean;
  audioUrl?: string;
  imageUrl?: string;
}

interface Vendor {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  location: string;
  locationHindi?: string;
  rating?: number;
  totalReviews?: number;
  isOnline?: boolean;
  responseTime?: string;
  specialties?: string[];
  specialtiesHindi?: string[];
  verified?: boolean;
  phone?: string;
  product: {
    name: string;
    nameHindi: string;
    category?: string;
    categoryHindi?: string;
    unit?: string;
    unitHindi?: string;
  };
}

export default function VendorChat() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [negotiationStep, setNegotiationStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(true);
  const [counterOffer, setCounterOffer] = useState<number>(0);
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState<number>(0);
  const router = useRouter();
  const params = useParams();
  const { addOrder } = useOrders();
  const { isAIOpen, setIsAIOpen } = useAIAssistant();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = {
    en: {
      buy: 'Buy Now',
      quantity: 'Quantity',
      paymentMethod: 'Payment Method',
      cash: 'Cash on Delivery',
      upi: 'UPI',
      card: 'Card',
      deliveryAddress: 'Delivery Address',
      phone: 'Phone Number',
      total: 'Total Amount',
      placeOrder: 'Place Order',
      cancel: 'Cancel',
      orderPlaced: 'Order Placed Successfully!',
      orderConfirmation: 'Your order has been confirmed. The vendor will contact you soon.',
      voiceMessage: 'Voice Message',
      sendImage: 'Send Image',
      recording: 'Recording...',
      stopRecording: 'Stop Recording',
      startRecording: 'Start Recording',
    },
    hi: {
      buy: 'अभी खरीदें',
      quantity: 'मात्रा',
      paymentMethod: 'भुगतान विधि',
      cash: 'कैश ऑन डिलीवरी',
      upi: 'यूपीआई',
      card: 'कार्ड',
      deliveryAddress: 'डिलीवरी का पता',
      phone: 'फ़ोन नंबर',
      total: 'कुल राशि',
      placeOrder: 'ऑर्डर करें',
      cancel: 'रद्द करें',
      orderPlaced: 'ऑर्डर सफलतापूर्वक दिया गया!',
      orderConfirmation: 'आपका ऑर्डर पुष्टि हो गया है। विक्रेता जल्द ही आपसे संपर्क करेगा।',
      voiceMessage: 'वॉयस संदेश',
      sendImage: 'फोटो भेजें',
      recording: 'रिकॉर्डिंग...',
      stopRecording: 'रिकॉर्डिंग बंद करें',
      startRecording: 'रिकॉर्डिंग शुरू करें',
    },
  };

  const txt = t[language];

  const calculateAISuggestion = () => {
    if (!vendor) return 0;
    
    const originalPrice = vendor.price;
    const minPrice = originalPrice * 0.85; // 15% discount max
    const maxPrice = originalPrice;
    
    // AI suggests a price between current and original based on negotiation progress
    const suggestionRange = 0.5 + (Math.random() * 0.1); // 50-60% between
    const suggested = Math.round(currentPrice + (originalPrice - currentPrice) * suggestionRange);
    
    return Math.max(minPrice, Math.min(maxPrice, suggested));
  };

  const calculateProfitMargin = () => {
    if (!vendor || !counterOffer) return 0;
    const margin = ((counterOffer / vendor.price) * 100);
    return Math.round(margin);
  };

  const calculateDealProbability = () => {
    if (!vendor || !counterOffer) return 0;
    
    const originalPrice = vendor.price;
    const priceRatio = counterOffer / originalPrice;
    
    if (priceRatio >= 0.95) return 95;
    if (priceRatio >= 0.90) return 85;
    if (priceRatio >= 0.85) return 70;
    if (priceRatio >= 0.80) return 50;
    return 40;
  };

  useEffect(() => {
    fetchVendor();
    initializeChat();
  }, []);

  useEffect(() => {
    if (vendor) {
      // Calculate AI suggested price based on current negotiation
      const suggested = calculateAISuggestion();
      setAiSuggestedPrice(suggested);
      setCounterOffer(suggested);
    }
  }, [vendor, currentPrice, negotiationStep]);

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

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceMessage: Message = {
          id: Date.now(),
          text: '[Voice Message]',
          sender: 'buyer',
          timestamp: new Date(),
          isVoice: true,
          audioUrl: audioUrl
        };
        
        setMessages(prev => [...prev, voiceMessage]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      let time = 0;
      recordingTimerRef.current = setInterval(() => {
        time++;
        setRecordingTime(time);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const imageMessage: Message = {
        id: Date.now(),
        text: '[Image]',
        sender: 'buyer',
        timestamp: new Date(),
        imageUrl: imageUrl
      };
      setMessages(prev => [...prev, imageMessage]);
      setShowImageUpload(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!vendor || !deliveryAddress || !phoneNumber) {
      alert(language === 'en' 
        ? 'Please fill all required fields' 
        : 'कृपया सभी आवश्यक फ़ील्ड भरें'
      );
      return;
    }

    const order = {
      vendorName: vendor.nameEn,
      vendorNameHindi: vendor.name,
      productName: vendor.product.name,
      productNameHindi: vendor.product.nameHindi,
      quantity: orderQuantity,
      price: currentPrice,
      totalAmount: currentPrice * orderQuantity,
      paymentMethod: paymentMethod,
      paymentMethodHindi: paymentMethod === 'cash' ? 'कैश ऑन डिलीवरी' : paymentMethod === 'upi' ? 'यूपीआई' : 'कार्ड',
      address: deliveryAddress,
      addressHindi: deliveryAddress,
      phone: phoneNumber
    };

    const success = await addOrder(order);
    
    if (success) {
      setOrderPlaced(true);
      setTimeout(() => {
        setShowBuyModal(false);
        setOrderPlaced(false);
        setOrderQuantity(1);
        setDeliveryAddress('');
        setPhoneNumber('');
      }, 3000);
    }
  };

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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Vendor Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-teal-500 rounded-2xl flex items-center justify-center text-5xl shadow-xl relative flex-shrink-0">
              🏪
              {vendor.verified && (
                <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-base shadow-lg">
                  ✓
                </div>
              )}
            </div>
            
            {/* Vendor Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {vendor.name}
                    </h1>
                    {vendor.verified && (
                      <span className="text-blue-500 text-sm font-semibold bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                    {vendor.isOnline && (
                      <span className="text-teal-700 dark:text-teal-400 text-sm font-semibold bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full">
                        🟢 Online
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                    ({vendor.nameEn})
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                    📍 {vendor.location} {vendor.locationHindi && `(${vendor.locationHindi})`}
                  </p>
                  
                  {/* Rating and Response Time */}
                  <div className="flex flex-wrap items-center gap-3">
                    {vendor.rating && (
                      <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {vendor.rating}
                        </span>
                        {vendor.totalReviews && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ({vendor.totalReviews} reviews)
                          </span>
                        )}
                      </div>
                    )}
                    {vendor.responseTime && (
                      <span className="text-xs text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full font-semibold">
                        ⚡ {vendor.responseTime}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Price Display */}
                <div className="text-right">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg mb-3">
                    💰 Current Price
                  </div>
                  <div className="text-5xl font-extrabold text-teal-600 dark:text-teal-400">
                    ₹{currentPrice}
                    <span className="text-xl text-gray-600 dark:text-gray-400 font-semibold">/{vendor.product.unit || 'kg'}</span>
                  </div>
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="mt-3 inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold">
                      📞 {vendor.phone}
                    </a>
                  )}
                </div>
              </div>
              
              {/* Specialties */}
              {vendor.specialties && vendor.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {vendor.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full font-medium"
                    >
                      {specialty}
                      {vendor.specialtiesHindi?.[index] && ` (${vendor.specialtiesHindi[index]})`}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Product Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                  📦 Product: {vendor.product.name} ({vendor.product.nameHindi})
                </p>
                {vendor.product.category && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Category: {vendor.product.category} {vendor.product.categoryHindi && `(${vendor.product.categoryHindi})`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">AI Negotiation Assistant</h3>
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                {getAISuggestion()}
              </p>
            </div>
            <button
              onClick={() => setShowAISidebar(!showAISidebar)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              {showAISidebar ? '← Hide AI' : 'Show AI →'}
            </button>
          </div>
        </div>

        {/* Chat Interface with AI Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Sidebar */}
          {showAISidebar && (
            <div className="lg:col-span-1 space-y-4">
              {/* AI Price Suggestion */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl">🤖</span>
                  <h3 className="font-bold text-lg">AI Suggestion</h3>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm mb-2">Recommended Counter Offer:</p>
                  <p className="text-4xl font-bold">₹{aiSuggestedPrice}</p>
                  <p className="text-xs mt-2 opacity-80">Based on market analysis & negotiation pattern</p>
                </div>
              </div>

              {/* Counter Offer Input */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Your Counter Offer</h3>
                <input
                  type="number"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-xl font-bold"
                  placeholder="Enter price"
                />
                <button
                  onClick={() => setCounterOffer(aiSuggestedPrice)}
                  className="w-full mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Use AI Suggestion
                </button>
              </div>

              {/* Profit Margin */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-teal-200 dark:border-teal-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-bold text-gray-800 dark:text-white">Profit Margin</h3>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold text-teal-600 dark:text-teal-400">
                    {calculateProfitMargin()}%
                  </p>
                  <div className="mt-3 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-green-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(calculateProfitMargin(), 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {calculateProfitMargin() >= 95 ? 'Excellent!' : calculateProfitMargin() >= 85 ? 'Good deal' : calculateProfitMargin() >= 75 ? 'Fair' : 'Consider negotiating'}
                  </p>
                </div>
              </div>

              {/* Deal Probability */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-bold text-gray-800 dark:text-white">Deal Probability</h3>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">
                    {calculateDealProbability()}%
                  </p>
                  <div className="mt-3 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${calculateDealProbability()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {calculateDealProbability() >= 85 ? 'Very likely to accept' : calculateDealProbability() >= 65 ? 'Good chance' : 'May need more negotiation'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setNewMessage(`Can you do ₹${counterOffer}?`);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Send Counter Offer
                  </button>
                  <button
                    onClick={() => {
                      setNewMessage(`I will buy at ₹${currentPrice}`);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Accept Current Price
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className={`${showAISidebar ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Chat Header */}
              <div className="p-5 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-600 to-teal-600 text-white">
                <h2 className="font-bold text-xl flex items-center gap-2">
                  💬 Chat with Vendor | विक्रेता से बात करें
                </h2>
                <p className="text-sm text-white/80 mt-1">Real-time translation enabled</p>
              </div>
              
              {/* Messages */}
              <div className="h-96 md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                  >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.sender === 'buyer'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}
                >
                  {/* Voice Message */}
                  {message.isVoice && message.audioUrl ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        🎤
                      </div>
                      <audio controls className="max-w-[200px]">
                        <source src={message.audioUrl} type="audio/wav" />
                      </audio>
                    </div>
                  ) : message.imageUrl ? (
                    /* Image Message */
                    <div>
                      <img 
                        src={message.imageUrl} 
                        alt="Shared image" 
                        className="max-w-full rounded-lg mb-2"
                      />
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ) : (
                    /* Text Message */
                    <p className="text-sm md:text-base">{message.text}</p>
                  )}
                  
                  {/* Translation Info */}
                  {message.originalText && !message.isVoice && !message.imageUrl && (
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

              {/* AI Suggestion */}
              <div className="px-4 md:px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  {getAISuggestion()}
                </p>
              </div>

              {/* Quick Messages and Actions */}
              <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {/* Buy Button */}
                <div className="mb-4">
                  <Button
                    onClick={() => setShowBuyModal(true)}
                    variant="primary"
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 text-lg"
                  >
                    🛒 {txt.buy}
                  </Button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                  {language === 'en' ? 'Quick messages' : 'त्वरित संदेश'}:
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(msg)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      {msg}
                    </button>
                  ))}
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  {/* Voice/Image Controls */}
                  <div className="flex gap-2">
                    {isRecording ? (
                      <button
                        onClick={stopVoiceRecording}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        ⏹️ {txt.stopRecording} ({recordingTime}s)
                      </button>
                    ) : (
                      <button
                        onClick={startVoiceRecording}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        🎤 {txt.voiceMessage}
                      </button>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      📷 {txt.sendImage}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      {language === 'en' ? 'हिं' : 'EN'}
                    </button>
                  </div>

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
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg"
                    >
                      {language === 'en' ? 'Send' : 'भेजें'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deal Summary */}
        {negotiationStep >= 2 && (
          <div className="mt-6 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/30 dark:to-green-900/30 border-2 border-teal-200 dark:border-teal-700 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-6">
                Deal Summary | सौदे का सारांश
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-teal-200 dark:border-teal-700 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Final Price</p>
                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">₹{currentPrice}/{vendor.product.unit || 'kg'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Product</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{vendor.product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">({vendor.product.nameHindi})</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Vendor</p>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{vendor.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">({vendor.nameEn})</p>
                  </div>
                </div>
              </div>
              <button className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 shadow-xl">
                Complete Transaction | लेन-देन पूरा करें
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {orderPlaced ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4 animate-bounce">✅</div>
                  <h2 className="text-2xl font-bold text-green-600 mb-3">
                    {txt.orderPlaced}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {txt.orderConfirmation}
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                    {txt.buy}
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Product Info */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {vendor?.product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {vendor?.name}
                      </p>
                      <p className="text-2xl font-bold text-teal-600 mt-2">
                        ₹{currentPrice}/{vendor?.product.unit}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {txt.quantity}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {txt.paymentMethod}
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="cash">{txt.cash}</option>
                        <option value="upi">{txt.upi}</option>
                        <option value="card">{txt.card}</option>
                      </select>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {txt.deliveryAddress}
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder={language === 'en' ? 'Enter delivery address' : 'डिलीवरी का पता दर्ज करें'}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {txt.phone}
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder={language === 'en' ? 'Enter phone number' : 'फ़ोन नंबर दर्ज करें'}
                      />
                    </div>

                    {/* Total */}
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-700">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {txt.total}:
                        </span>
                        <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{currentPrice * orderQuantity}
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => setShowBuyModal(false)}
                        variant="secondary"
                        className="flex-1"
                      >
                        {txt.cancel}
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        variant="primary"
                        className="flex-1"
                      >
                        {txt.placeOrder}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* AI Assistant */}
      {isAIOpen && vendor && (
        <AIAssistant
          language={language}
          context={{
            currentPrice,
            productName: vendor.product.name,
            vendorName: vendor.name
          }}
          onClose={() => setIsAIOpen(false)}
        />
      )}

      {/* AI Assistant Trigger Button (when not showing) */}
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