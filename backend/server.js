const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced middleware stack
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Enhanced mock data
const mockProducts = [
  {
    id: 'tomato-001',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताज़े टमाटर',
    category: 'Vegetables',
    categoryHindi: 'सब्जियां',
    unit: 'kg',
    unitHindi: 'किलो',
    vendors: [
      { 
        id: 1, 
        name: 'राम किसान', 
        nameEn: 'Ram Kisan', 
        price: 25, 
        location: 'Sector 14 Market',
        locationHindi: 'सेक्टर 14 मार्केट',
        rating: 4.5,
        totalReviews: 127,
        isOnline: true,
        responseTime: '< 5 minutes',
        specialties: ['Organic Vegetables', 'Farm Fresh'],
        specialtiesHindi: ['जैविक सब्जियां', 'फार्म फ्रेश'],
        verified: true
      },
      { 
        id: 2, 
        name: 'श्याम वेंडर', 
        nameEn: 'Shyam Vendor', 
        price: 30, 
        location: 'Main Bazaar',
        locationHindi: 'मुख्य बाज़ार',
        rating: 4.2,
        totalReviews: 89,
        isOnline: true,
        responseTime: '< 10 minutes',
        specialties: ['Quality Produce', 'Competitive Prices'],
        specialtiesHindi: ['गुणवत्ता उत्पाद', 'प्रतिस्पर्धी कीमतें'],
        verified: true
      },
      { 
        id: 3, 
        name: 'गीता फ्रूट्स', 
        nameEn: 'Geeta Fruits', 
        price: 22, 
        location: 'Vegetable Mandi',
        locationHindi: 'सब्जी मंडी',
        rating: 4.7,
        totalReviews: 203,
        isOnline: true,
        responseTime: '< 3 minutes',
        specialties: ['Premium Quality', 'Bulk Orders'],
        specialtiesHindi: ['प्रीमियम गुणवत्ता', 'थोक ऑर्डर'],
        verified: true
      }
    ]
  },
  {
    id: 'onion-001',
    name: 'Fresh Onions',
    nameHindi: 'ताज़े प्याज',
    category: 'Vegetables',
    categoryHindi: 'सब्जियां',
    unit: 'kg',
    unitHindi: 'किलो',
    vendors: [
      { 
        id: 4, 
        name: 'मोहन ट्रेडर', 
        nameEn: 'Mohan Trader', 
        price: 35, 
        location: 'Wholesale Market',
        locationHindi: 'होलसेल मार्केट',
        rating: 4.3,
        totalReviews: 156,
        isOnline: true,
        responseTime: '< 15 minutes',
        specialties: ['Wholesale Prices', 'Bulk Supply'],
        specialtiesHindi: ['थोक कीमतें', 'थोक आपूर्ति'],
        verified: true
      },
      { 
        id: 5, 
        name: 'सुनील वेजी', 
        nameEn: 'Sunil Veji', 
        price: 40, 
        location: 'Local Market',
        locationHindi: 'स्थानीय बाज़ार',
        rating: 4.0,
        totalReviews: 67,
        isOnline: false,
        responseTime: '< 30 minutes',
        specialties: ['Local Sourcing', 'Fresh Daily'],
        specialtiesHindi: ['स्थानीय सोर्सिंग', 'रोज़ाना ताज़ा'],
        verified: false
      }
    ]
  },
  {
    id: 'potato-001',
    name: 'Fresh Potatoes',
    nameHindi: 'ताज़े आलू',
    category: 'Vegetables',
    categoryHindi: 'सब्जियां',
    unit: 'kg',
    unitHindi: 'किलो',
    vendors: [
      { 
        id: 6, 
        name: 'राजू आलू भंडार', 
        nameEn: 'Raju Potato Store', 
        price: 20, 
        location: 'Subzi Mandi',
        locationHindi: 'सब्जी मंडी',
        rating: 4.4,
        totalReviews: 98,
        isOnline: true,
        responseTime: '< 5 minutes',
        specialties: ['Potato Specialist', 'Multiple Varieties'],
        specialtiesHindi: ['आलू विशेषज्ञ', 'कई किस्में'],
        verified: true
      },
      { 
        id: 7, 
        name: 'कृष्णा वेजिटेबल्स', 
        nameEn: 'Krishna Vegetables', 
        price: 18, 
        location: 'New Market',
        locationHindi: 'न्यू मार्केट',
        rating: 4.6,
        totalReviews: 134,
        isOnline: true,
        responseTime: '< 8 minutes',
        specialties: ['Organic Options', 'Fair Prices'],
        specialtiesHindi: ['जैविक विकल्प', 'उचित कीमतें'],
        verified: true
      }
    ]
  }
];

// Enhanced translation mappings with comprehensive phrase coverage
const translations = {
  // Basic greetings and interactions
  'Hello': 'नमस्ते',
  'Hi': 'हाय',
  'Good morning': 'सुप्रभात',
  'Good evening': 'शुभ संध्या',
  'Thank you': 'धन्यवाद',
  'Please': 'कृपया',
  'Yes': 'हां',
  'No': 'नहीं',
  'Okay': 'ठीक है',
  'Sorry': 'माफ करें',
  
  // Price negotiation phrases
  'What is your best price?': 'आपकी सबसे अच्छी कीमत क्या है?',
  'Can you reduce the price?': 'क्या आप कीमत कम कर सकते हैं?',
  'This is too expensive': 'यह बहुत महंगा है',
  'Can you give a discount?': 'क्या आप छूट दे सकते हैं?',
  'What is the final price?': 'अंतिम कीमत क्या है?',
  'I will take it': 'मैं इसे ले लूंगा',
  'I will buy this': 'मैं यह खरीदूंगा',
  
  // Quantity and measurements
  'I will take 2 kg': 'मैं 2 किलो लूंगा',
  'How much for 5 kg?': '5 किलो के लिए कितना?',
  'I need 1 kg': 'मुझे 1 किलो चाहिए',
  'Do you sell by piece?': 'क्या आप पीस के हिसाब से बेचते हैं?',
  'How much per kg?': 'प्रति किलो कितना?',
  'What is the weight?': 'वजन कितना है?',
  
  // Quality and freshness
  'Is this fresh?': 'क्या यह ताज़ा है?',
  'Do you have organic?': 'क्या आपके पास जैविक है?',
  'This looks good': 'यह अच्छा लग रहा है',
  'Is this good quality?': 'क्या यह अच्छी गुणवत्ता है?',
  'When did this arrive?': 'यह कब आया?',
  'Is this local produce?': 'क्या यह स्थानीय उत्पाद है?',
  
  // Location and delivery
  'Where is your shop?': 'आपकी दुकान कहां है?',
  'Do you deliver?': 'क्या आप डिलीवरी करते हैं?',
  'What is the delivery charge?': 'डिलीवरी चार्ज क्या है?',
  'Can you come to my location?': 'क्या आप मेरी जगह आ सकते हैं?',
  
  // Payment and transaction
  'Do you accept cash?': 'क्या आप नकद लेते हैं?',
  'Do you accept UPI?': 'क्या आप UPI लेते हैं?',
  'What payment methods do you accept?': 'आप कौन से पेमेंट तरीके स्वीकार करते हैं?',
  'Can I pay later?': 'क्या मैं बाद में पे कर सकता हूं?',
  
  // Common vendor responses (Hindi to English)
  'नमस्ते': 'Hello',
  'आपकी सबसे अच्छी कीमत क्या है?': 'What is your best price?',
  'मैं 20 रुपये प्रति किलो दे सकता हूं': 'I can give 20 rupees per kg',
  'ठीक है, 23 रुपये में दे देता हूं': 'Okay, I will give for 23 rupees',
  'यह बहुत ताज़ा है': 'This is very fresh',
  'हां, यह जैविक है': 'Yes, this is organic',
  'मैं 25 रुपये से कम नहीं दे सकता': 'I cannot give less than 25 rupees',
  'आज सुबह आया है': 'It came this morning',
  'यह स्थानीय है': 'This is local',
  'हां, मैं डिलीवरी करता हूं': 'Yes, I do delivery',
  'डिलीवरी फ्री है': 'Delivery is free',
  'नकद और UPI दोनों चलता है': 'Both cash and UPI work',
  'कोई समस्या नहीं': 'No problem',
  'धन्यवाद': 'Thank you',
  
  // Product names (bidirectional)
  'tomato': 'टमाटर',
  'टमाटर': 'tomato',
  'onion': 'प्याज',
  'प्याज': 'onion',
  'potato': 'आलू',
  'आलू': 'potato',
  'carrot': 'गाजर',
  'गाजर': 'carrot',
  'cabbage': 'पत्ता गोभी',
  'पत्ता गोभी': 'cabbage',
  'cauliflower': 'फूल गोभी',
  'फूल गोभी': 'cauliflower',
  'spinach': 'पालक',
  'पालक': 'spinach',
  'cucumber': 'खीरा',
  'खीरा': 'cucumber',
  'green beans': 'हरी फली',
  'हरी फली': 'green beans',
  'bell pepper': 'शिमला मिर्च',
  'शिमला मिर्च': 'bell pepper'
};

// Helper functions
const handleError = (res, error, statusCode = 500) => {
  console.error('API Error:', error);
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      message: error.message || 'An error occurred',
      details: error.details || null
    }
  });
};

const sendSuccess = (res, data, message = 'Success') => {
  res.json({
    success: true,
    message,
    data
  });
};

// API Routes
app.get('/api/search', (req, res) => {
  try {
    const { query, lang = 'en', sortBy = 'relevance' } = req.query;
    
    if (!query) {
      return sendSuccess(res, { products: [], totalResults: 0 }, 'No query provided');
    }
    
    let results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.nameHindi.includes(query)
    );

    // Sort results
    if (sortBy === 'price_low') {
      results.forEach(product => {
        product.vendors.sort((a, b) => a.price - b.price);
      });
    } else if (sortBy === 'rating') {
      results.forEach(product => {
        product.vendors.sort((a, b) => b.rating - a.rating);
      });
    }
    
    const responseData = {
      products: results,
      totalResults: results.length,
      totalVendors: results.reduce((sum, product) => sum + product.vendors.length, 0),
      query: query,
      language: lang
    };
    
    sendSuccess(res, responseData, `Found ${results.length} products`);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/vendor/:id', (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    let vendor = null;
    let productInfo = null;
    
    for (const product of mockProducts) {
      vendor = product.vendors.find(v => v.id === vendorId);
      if (vendor) {
        productInfo = { 
          id: product.id,
          name: product.name, 
          nameHindi: product.nameHindi,
          category: product.category,
          categoryHindi: product.categoryHindi,
          unit: product.unit,
          unitHindi: product.unitHindi
        };
        break;
      }
    }
    
    if (vendor) {
      const responseData = {
        ...vendor,
        product: productInfo,
        phone: '+91-9876543210'
      };
      sendSuccess(res, responseData, 'Vendor found');
    } else {
      handleError(res, { message: 'Vendor not found' }, 404);
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Translation helper functions
const findBestTranslation = (text, targetLang) => {
  // Direct match
  if (translations[text]) {
    return { translation: translations[text], confidence: 0.95, method: 'exact' };
  }
  
  // Case-insensitive match
  const lowerText = text.toLowerCase();
  const lowerKey = Object.keys(translations).find(key => key.toLowerCase() === lowerText);
  if (lowerKey) {
    return { translation: translations[lowerKey], confidence: 0.90, method: 'case_insensitive' };
  }
  
  // Partial match for common phrases
  const partialMatches = Object.keys(translations).filter(key => 
    key.toLowerCase().includes(lowerText) || lowerText.includes(key.toLowerCase())
  );
  
  if (partialMatches.length > 0) {
    // Return the best partial match (longest match)
    const bestMatch = partialMatches.reduce((a, b) => a.length > b.length ? a : b);
    return { translation: translations[bestMatch], confidence: 0.70, method: 'partial' };
  }
  
  // Word-by-word translation for compound phrases
  const words = text.split(' ');
  const translatedWords = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, '');
    return translations[cleanWord] || translations[word] || word;
  });
  
  if (translatedWords.some(word => word !== words[words.indexOf(word)])) {
    return { translation: translatedWords.join(' '), confidence: 0.60, method: 'word_by_word' };
  }
  
  // No translation found
  return { translation: text, confidence: 0.30, method: 'fallback' };
};

const detectLanguage = (text) => {
  // Simple language detection based on character sets
  const hindiPattern = /[\u0900-\u097F]/;
  const englishPattern = /[a-zA-Z]/;
  
  if (hindiPattern.test(text)) {
    return 'hi';
  } else if (englishPattern.test(text)) {
    return 'en';
  }
  return 'unknown';
};

app.post('/api/translate', (req, res) => {
  try {
    const { text, from, to } = req.body;
    
    if (!text || typeof text !== 'string') {
      return handleError(res, { message: 'Text is required and must be a string' }, 400);
    }
    
    if (text.trim().length === 0) {
      return handleError(res, { message: 'Text cannot be empty' }, 400);
    }
    
    // Auto-detect language if not provided
    const sourceLanguage = from || detectLanguage(text);
    const targetLanguage = to || (sourceLanguage === 'hi' ? 'en' : 'hi');
    
    // Find best translation
    const result = findBestTranslation(text.trim(), targetLanguage);
    
    const responseData = {
      originalText: text,
      translatedText: result.translation,
      originalLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      confidence: result.confidence,
      translationMethod: result.method,
      suggestions: result.method === 'fallback' ? [
        'Try using simpler words',
        'Check spelling',
        'Use common phrases from our dictionary'
      ] : [],
      timestamp: new Date().toISOString()
    };
    
    sendSuccess(res, responseData, 'Translation completed');
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/negotiate', (req, res) => {
  try {
    const { currentPrice, productType = 'vegetables' } = req.body;
    
    if (!currentPrice) {
      return handleError(res, { message: 'Current price is required' }, 400);
    }
    
    // Generate reasonable counter-offer (5-15% reduction)
    const reductionPercentage = 0.05 + Math.random() * 0.10;
    const suggestedPrice = Math.round(currentPrice * (1 - reductionPercentage));
    
    const responseData = {
      suggestedCounterOffer: suggestedPrice,
      negotiationTips: [
        'Ask about bulk discounts',
        'Mention you\'re a regular customer',
        'Be polite and respectful'
      ],
      phrases: {
        en: `Can you do ${suggestedPrice} rupees per kg?`,
        hi: `क्या आप ${suggestedPrice} रुपये प्रति किलो में दे सकते हैं?`
      }
    };
    
    sendSuccess(res, responseData, 'Negotiation suggestion generated');
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  
  sendSuccess(res, { 
    status: 'healthy',
    uptime: `${Math.floor(uptime)}s`,
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }, 'Service is healthy');
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      availableEndpoints: [
        'GET /api/health',
        'GET /api/search',
        'GET /api/vendor/:id',
        'POST /api/translate',
        'POST /api/negotiate'
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Multilingual Mandi API Server`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`✅ Server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});