'use client';

import { useState, useRef, useEffect } from 'react';

interface AIMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  confidence?: number;
  isVoice?: boolean;
}

interface AIAssistantProps {
  language?: 'en' | 'hi';
  context?: {
    currentPrice?: number;
    productName?: string;
    vendorName?: string;
  };
  onClose?: () => void;
}

export default function AIAssistant({ 
  language = 'en', 
  context = {},
  onClose 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
      title: 'AI Shopping Assistant',
      subtitle: 'I\'m here to help you get the best deals!',
      placeholder: 'Ask me anything...',
      send: 'Send',
      startRecording: 'Start Voice',
      stopRecording: 'Stop',
      processing: 'Processing...',
      minimize: 'Minimize',
      close: 'Close',
      expand: 'Expand',
      aiAssistant: 'AI Assistant'
    },
    hi: {
      title: 'AI खरीदारी सहायक',
      subtitle: 'मैं आपको सबसे अच्छे सौदे दिलाने में मदद करूंगा!',
      placeholder: 'कुछ भी पूछें...',
      send: 'भेजें',
      startRecording: 'वॉयस शुरू करें',
      stopRecording: 'बंद करें',
      processing: 'प्रोसेसिंग...',
      minimize: 'छोटा करें',
      close: 'बंद करें',
      expand: 'बड़ा करें',
      aiAssistant: 'AI सहायक'
    }
  };

  const txt = t[language];

  useEffect(() => {
    // Send initial greeting
    sendInitialGreeting();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendInitialGreeting = async () => {
    const greeting = language === 'en'
      ? 'Hello! I\'m your AI shopping assistant. How can I help you today?'
      : 'नमस्ते! मैं आपका AI खरीदारी सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?';

    setMessages([{
      id: 1,
      text: greeting,
      sender: 'ai',
      timestamp: new Date(),
      confidence: 1.0
    }]);

    setSuggestions(language === 'en' 
      ? [
          'What\'s the best price?',
          'Tell me about quality',
          'Delivery options?'
        ]
      : [
          'सबसे अच्छी कीमत क्या है?',
          'गुणवत्ता के बारे में बताएं',
          'डिलीवरी विकल्प?'
        ]
    );
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage;
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          context
        })
      });

      const result = await response.json();

      if (result.success) {
        const aiMessage: AIMessage = {
          id: Date.now() + 1,
          text: result.data.response,
          sender: 'ai',
          timestamp: new Date(),
          confidence: result.data.confidence
        };

        setMessages(prev => [...prev, aiMessage]);
        
        if (result.data.suggestions) {
          setSuggestions(result.data.suggestions);
        }
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: AIMessage = {
        id: Date.now() + 1,
        text: language === 'en' 
          ? 'Sorry, I encountered an error. Please try again.'
          : 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          
          // Send to speech-to-text API
          setIsProcessing(true);
          try {
            const response = await fetch('http://localhost:5000/api/speech-to-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioData: base64Audio,
                language
              })
            });

            const result = await response.json();

            if (result.success) {
              // Add voice message
              const voiceMessage: AIMessage = {
                id: Date.now(),
                text: `🎤 ${result.data.text}`,
                sender: 'user',
                timestamp: new Date(),
                isVoice: true,
                confidence: result.data.confidence
              };
              setMessages(prev => [...prev, voiceMessage]);

              // Send transcribed text to AI
              await sendMessage(result.data.text);
            }
          } catch (error) {
            console.error('Speech-to-text error:', error);
          } finally {
            setIsProcessing(false);
          }
        };
        
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
      alert(language === 'en' 
        ? 'Could not access microphone. Please check permissions.'
        : 'माइक्रोफ़ोन एक्सेस नहीं कर सका। कृपया अनुमतियाँ जांचें।');
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

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-2xl p-4 transition-all duration-300 hover:scale-110 flex items-center gap-2"
        >
          <span className="text-2xl">🤖</span>
          <span className="font-semibold">{txt.aiAssistant}</span>
          {messages.length > 1 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length - 1}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-pulse">🤖</span>
            <div>
              <h3 className="font-bold text-lg">{txt.title}</h3>
              <p className="text-xs text-white/80">{txt.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              title={txt.minimize}
            >
              ➖
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                title={txt.close}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-purple-200 dark:border-purple-700 rounded-bl-md'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              {message.confidence && message.sender === 'ai' && (
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    message.confidence >= 0.9 ? 'bg-green-400' :
                    message.confidence >= 0.7 ? 'bg-yellow-400' : 'bg-orange-400'
                  }`}></div>
                  <span className="text-xs opacity-60">
                    {Math.round(message.confidence * 100)}% confident
                  </span>
                </div>
              )}
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-700 rounded-2xl px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{txt.processing}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-2">
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
              disabled={isProcessing}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              🎤 {txt.startRecording}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isProcessing && sendMessage()}
            placeholder={txt.placeholder}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isProcessing}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-2 rounded-lg font-bold transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            {txt.send}
          </button>
        </div>
      </div>
    </div>
  );
}
