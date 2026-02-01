'use client';

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Card from './Card';

interface Message {
  id: number;
  text: string;
  sender: 'customer' | 'vendor';
  timestamp: Date;
  originalText?: string;
  translationConfidence?: number;
  translationMethod?: string;
  isVoice?: boolean;
  audioUrl?: string;
  imageUrl?: string;
}

interface CustomerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  orderId: string;
  productName: string;
  language: 'en' | 'hi';
}

export default function CustomerChatModal({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  orderId,
  productName,
  language,
}: CustomerChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: language === 'en' ? 'Hello! I placed an order for ' + productName : 'नमस्ते! मैंने ' + productName + ' का ऑर्डर दिया है',
      sender: 'customer',
      timestamp: new Date(Date.now() - 300000),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
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
      closeChat: 'Close Chat',
      orderDetails: 'Order Details',
    },
    hi: {
      chatWith: 'के साथ चैट',
      typeMessage: 'अपना संदेश लिखें...',
      send: 'भेजें',
      voiceMessage: 'आवाज़',
      sendImage: 'छवि',
      recording: 'रिकॉर्डिंग...',
      stopRecording: 'बंद करें',
      closeChat: 'चैट बंद करें',
      orderDetails: 'ऑर्डर विवरण',
    },
  };

  const txt = t[language];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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

    // Auto-response from customer (demo)
    setTimeout(() => {
      const responses = language === 'en' 
        ? ['Thank you!', 'Okay', 'Great!', 'Understood']
        : ['धन्यवाद!', 'ठीक है', 'बढ़िया!', 'समझ गया'];
      
      const customerResponse: Message = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'customer',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, customerResponse]);
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
      <Card className="max-w-2xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-t-xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold">💬 {txt.chatWith} {customerName}</h3>
              <p className="text-sm text-white/80">📞 {customerPhone}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-xs text-white/80">
            {txt.orderDetails}: {productName} (#{orderId})
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    message.sender === 'vendor'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
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
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                variant="primary"
                size="md"
              >
                {txt.send}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
