'use client';

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Card from './Card';

interface Message {
  id: number;
  text: string;
  sender: 'buyer' | 'vendor' | 'ai';
  timestamp: Date;
  originalText?: string;
  isVoice?: boolean;
  audioUrl?: string;
  imageUrl?: string;
}

interface BuyerRequestChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyerName: string;
  productName: string;
  quantity: number;
  offerPrice: number;
  yourPrice: number;
  language: 'en' | 'hi';
  onAccept: () => void;
  onDecline: () => void;
  onCounter: (price: number) => void;
}

export default function BuyerRequestChatModal({
  isOpen,
  onClose,
  buyerName,
  productName,
  quantity,
  offerPrice,
  yourPrice,
  language,
  onAccept,
  onDecline,
  onCounter,
}: BuyerRequestChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [counterPrice, setCounterPrice] = useState(yourPrice);
  const [showAIBot, setShowAIBot] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      chatWith: 'Chat with',
      typeMessage: 'Type your message...',
      send: 'Send',
      voiceMessage: 'Voice',
      sendImage: 'Image',
      recording: 'Recording...',
      stopRecording: 'Stop',
      requestDetails: 'Request Details',
      theirOffer: 'Their Offer',
      yourPrice: 'Your Price',
      quantity: 'Quantity',
      counterOffer: 'Counter Offer',
      accept: 'Accept',
      decline: 'Decline',
      sendCounter: 'Send Counter',
      aiNegotiator: '🤖 AI Negotiation Bot',
      aiSuggestion: 'AI Suggests',
      hideAI: 'Hide AI',
      showAI: 'Show AI',
    },
    hi: {
      chatWith: 'के साथ चैट',
      typeMessage: 'अपना संदेश लिखें...',
      send: 'भेजें',
      voiceMessage: 'आवाज़',
      sendImage: 'छवि',
      recording: 'रिकॉर्डिंग...',
      stopRecording: 'बंद करें',
      requestDetails: 'अनुरोध विवरण',
      theirOffer: 'उनका प्रस्ताव',
      yourPrice: 'आपकी कीमत',
      quantity: 'मात्रा',
      counterOffer: 'काउंटर ऑफर',
      accept: 'स्वीकार',
      decline: 'अस्वीकार',
      sendCounter: 'काउंटर भेजें',
      aiNegotiator: '🤖 AI वार्ता बॉट',
      aiSuggestion: 'AI सुझाव',
      hideAI: 'AI छुपाएं',
      showAI: 'AI दिखाएं',
    },
  };

  const txt = t[language];

  useEffect(() => {
    if (isOpen) {
      // Initialize with buyer's request message
      const initialMessages: Message[] = [
        {
          id: 1,
          text: language === 'en'
            ? `Hi! I need ${quantity} kg of ${productName}. Can you do ₹${offerPrice}/kg?`
            : `नमस्ते! मुझे ${quantity} किलो ${productName} चाहिए। क्या आप ₹${offerPrice}/किलो कर सकते हैं?`,
          sender: 'buyer',
          timestamp: new Date(Date.now() - 300000),
        },
      ];

      // Add AI suggestion
      const aiSuggestedPrice = getAISuggestion();
      const aiMessage: Message = {
        id: 2,
        text: language === 'en'
          ? `💡 I suggest counter-offering at ₹${aiSuggestedPrice}/kg. This is ${((aiSuggestedPrice / yourPrice) * 100).toFixed(0)}% of your price and ${(((yourPrice - aiSuggestedPrice) / (yourPrice - offerPrice)) * 100).toFixed(0)}% closer to the buyer.`
          : `💡 मैं ₹${aiSuggestedPrice}/किलो पर काउंटर ऑफर करने का सुझाव देता हूं। यह आपकी कीमत का ${((aiSuggestedPrice / yourPrice) * 100).toFixed(0)}% है और खरीदार के ${(((yourPrice - aiSuggestedPrice) / (yourPrice - offerPrice)) * 100).toFixed(0)}% करीब है।`,
        sender: 'ai',
        timestamp: new Date(Date.now() - 290000),
      };

      setMessages([...initialMessages, aiMessage]);
      setCounterPrice(aiSuggestedPrice);
      scrollToBottom();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAISuggestion = () => {
    const diff = yourPrice - offerPrice;
    if (diff <= 2) return offerPrice + 1;
    if (diff <= 5) return Math.round(offerPrice + diff * 0.5);
    return Math.round(offerPrice + diff * 0.6);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'vendor',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // AI analyzes the message and provides suggestion
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: language === 'en'
          ? `💡 AI Tip: Consider emphasizing the quality and freshness of your products to justify your price.`
          : `💡 AI सुझाव: अपनी कीमत को उचित ठहराने के लिए अपने उत्पादों की गुणवत्ता और ताजगी पर जोर दें।`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Buyer response
      setTimeout(() => {
        const buyerResponses = language === 'en'
          ? ['Let me think about it', 'Can you do any better?', 'Okay, seems fair']
          : ['मुझे सोचने दें', 'क्या आप कुछ और बेहतर कर सकते हैं?', 'ठीक है, उचित लगता है'];

        const buyerResponse: Message = {
          id: Date.now() + 2,
          text: buyerResponses[Math.floor(Math.random() * buyerResponses.length)],
          sender: 'buyer',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, buyerResponse]);
      }, 1500);
    }, 1000);
  };

  const handleSendCounter = () => {
    const counterMessage: Message = {
      id: Date.now(),
      text: language === 'en'
        ? `I can offer you ${productName} at ₹${counterPrice}/kg for ${quantity} kg. Total: ₹${counterPrice * quantity}`
        : `मैं आपको ${productName} ₹${counterPrice}/किलो पर ${quantity} किलो के लिए दे सकता हूं। कुल: ₹${counterPrice * quantity}`,
      sender: 'vendor',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, counterMessage]);
    onCounter(counterPrice);

    // AI feedback
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: language === 'en'
          ? `✅ Great! Your counter-offer is reasonable. The buyer is likely to accept.`
          : `✅ बढ़िया! आपका काउंटर ऑफर उचित है। खरीदार इसे स्वीकार करने की संभावना है।`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

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
          sender: 'vendor',
          timestamp: new Date(),
          isVoice: true,
          audioUrl: audioUrl,
        };

        setMessages((prev) => [...prev, voiceMessage]);
        stream.getTracks().forEach((track) => track.stop());
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
        sender: 'vendor',
        timestamp: new Date(),
        imageUrl: imageUrl,
      };
      setMessages((prev) => [...prev, imageMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold">💬 {txt.chatWith} {buyerName}</h3>
              <p className="text-sm text-white/80">{txt.requestDetails}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-4 text-xs text-white/90">
            <span>{productName} • {txt.quantity}: {quantity} kg</span>
            <span>{txt.theirOffer}: ₹{offerPrice}</span>
            <span>{txt.yourPrice}: ₹{yourPrice}</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'vendor'
                        ? 'justify-end'
                        : message.sender === 'ai'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                        message.sender === 'vendor'
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
                          : message.sender === 'ai'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl max-w-[85%]'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-bl-md'
                      }`}
                    >
                      {message.isVoice && message.audioUrl ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            🎤
                          </div>
                          <audio controls className="max-w-[200px]">
                            <source src={message.audioUrl} type="audio/wav" />
                          </audio>
                        </div>
                      ) : message.imageUrl ? (
                        <div>
                          <img
                            src={message.imageUrl}
                            alt="Shared"
                            className="max-w-full rounded-lg mb-2"
                          />
                          <p className="text-sm">{message.text}</p>
                        </div>
                      ) : (
                        <p className="text-sm md:text-base">{message.text}</p>
                      )}

                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                </div>

                {/* Message Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={txt.typeMessage}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()} variant="primary" size="md">
                    {txt.send}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Bot Sidebar */}
          {showAIBot && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {txt.aiNegotiator}
                </h3>
                <button
                  onClick={() => setShowAIBot(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
                >
                  {txt.hideAI}
                </button>
              </div>

              <div className="space-y-4">
                {/* AI Price Suggestion */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    💡 {txt.aiSuggestion}
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    ₹{getAISuggestion()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {language === 'en'
                      ? 'Based on market analysis and negotiation patterns'
                      : 'बाजार विश्लेषण और वार्ता पैटर्न के आधार पर'}
                  </div>
                </div>

                {/* Counter Offer Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {txt.counterOffer}
                  </label>
                  <input
                    type="number"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(parseInt(e.target.value) || yourPrice)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                  />
                  <Button onClick={handleSendCounter} variant="primary" size="md" className="w-full mb-2">
                    {txt.sendCounter}
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={onAccept} variant="primary" size="sm">
                      ✅ {txt.accept}
                    </Button>
                    <Button onClick={onDecline} variant="outline" size="sm">
                      ❌ {txt.decline}
                    </Button>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-xs space-y-2">
                  <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📊 {language === 'en' ? 'Quick Insights' : 'त्वरित जानकारी'}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'en' ? 'Profit Margin' : 'लाभ मार्जिन'}:
                    </span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {((counterPrice / yourPrice) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'en' ? 'Deal Probability' : 'सौदे की संभावना'}:
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {counterPrice <= yourPrice && counterPrice >= offerPrice
                        ? '85%'
                        : counterPrice > yourPrice
                        ? '95%'
                        : '40%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Show AI Button (when hidden) */}
        {!showAIBot && (
          <button
            onClick={() => setShowAIBot(true)}
            className="absolute right-4 top-24 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            🤖 {txt.showAI}
          </button>
        )}
      </Card>
    </div>
  );
}
