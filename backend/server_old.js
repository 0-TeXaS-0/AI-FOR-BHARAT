const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Enhanced mock data with comprehensive vendor and product information
const mockProducts = [
  {
    id: 'tomato-001',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताज़े टमाटर',
    category: 'Vegetables',
    categoryHindi: 'सब्जियां',
    unit: 'kg',
    unitHindi: 'किलो',
    description: 'Fresh, ripe tomatoes perfect for cooking',
    descriptionHindi: 'खाना पकाने के लिए बिल्कुल सही ताज़े, पके टमाटर',
    image: '/images/tomato.jpg',
    seasonality: 'Year-round',
    nutritionalInfo: 'Rich in Vitamin C and Lycopene',
    vendors: [
      { 
        id: 1, 
        name: 'राम किसान', 
        nameEn: 'Ram Kisan', 
        price: 25, 
        originalPrice: 30,
        location: 'Sector 14 Market',
        locationHindi: 'सेक्टर 14 मार्केट',
        rating: 4.5,
        totalReviews: 127,
        isOnline: true,
        responseTime: '< 5 minutes',
        specialties: ['Organic Vegetables', 'Farm Fresh'],
        specialtiesHindi: ['जैविक सब्जियां', 'फार्म फ्रेश'],
        established: '2018',
        verified: true,
        deliveryAvailable: true,
        minOrder: 1,
        maxOrder: 50
      },
      { 
        id: 2, 
        name: 'श्याम वेंडर', 
        nameEn: 'Shyam Vendor', 
        price: 30, 
        originalPrice: 35,
        location: 'Main Bazaar',
        locationHindi: 'मुख्य बाज़ार',
        rating: 4.2,
        totalReviews: 89,
        isOnline: true,
        responseTime: '< 10 minutes',
        specialties: ['Quality Produce', 'Competitive Prices'],
        specialtiesHindi: ['गुणवत्ता उत्पाद', 'प्रतिस्पर्धी कीमतें'],
        established: '2020',
        verified: true,
        deliveryAvailable: false,
        minOrder: 2,
        maxOrder: 25
      },
      { 
        id: 3, 
        name: 'गीता फ्रूट्स', 
        nameEn: 'Geeta Fruits', 
        price: 22, 
        originalPrice: 28,
        location: 'Vegetable Mandi',
        locationHindi: 'सब्जी मंडी',
        rating: 4.7,
        totalReviews: 203,
        isOnline: true,
        responseTime: '< 3 minutes',
        specialties: ['Premium Quality', 'Bulk Orders'],
        specialtiesHindi: ['प्रीमियम गुणवत्ता', 'थोक ऑर्डर'],
        established: '2015',
        verified: true,
        deliveryAvailable: true,
        minOrder: 1,
        maxOrder: 100
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
    description: 'High-quality onions for daily cooking needs',
    descriptionHindi: 'दैनिक खाना पकाने की जरूरतों के लिए उच्च गुणवत्ता वाले प्याज',
    image: '/images/onion.jpg',
    seasonality: 'Year-round',
    nutritionalInfo: 'Rich in antioxidants and vitamin C',
    vendors: [
      { 
        id: 4, 
        name: 'मोहन ट्रेडर', 
        nameEn: 'Mohan Trader', 
        price: 35, 
        originalPrice: 40,
        location: 'Wholesale Market',
        locationHindi: 'होलसेल मार्केट',
        rating: 4.3,
        totalReviews: 156,
        isOnline: true,
        responseTime: '< 15 minutes',
        specialties: ['Wholesale Prices', 'Bulk Supply'],
        specialtiesHindi: ['थोक कीमतें', 'थोक आपूर्ति'],
        established: '2012',
        verified: true,
        deliveryAvailable: true,
        minOrder: 5,
        maxOrder: 500
      },
      { 
        id: 5, 
        name: 'सुनील वेजी', 
        nameEn: 'Sunil Veji', 
        price: 40, 
        originalPrice: 45,
        location: 'Local Market',
        locationHindi: 'स्थानीय बाज़ार',
        rating: 4.0,
        totalReviews: 67,
        isOnline: false,
        responseTime: '< 30 minutes',
        specialties: ['Local Sourcing', 'Fresh Daily'],
        specialtiesHindi: ['स्थानीय सोर्सिंग', 'रोज़ाना ताज़ा'],
        established: '2019',
        verified: false,
        deliveryAvailable: false,
        minOrder: 1,
        maxOrder: 20
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
    description: 'Premium quality potatoes, perfect for all cooking methods',
    descriptionHindi: 'प्रीमियम गुणवत्ता वाले आलू, सभी खाना पकाने के तरीकों के लिए बिल्कुल सही',
    image: '/images/potato.jpg',
    seasonality: 'Year-round',
    nutritionalInfo: 'High in potassium and vitamin B6',
    vendors: [
      { 
        id: 6, 
        name: 'राजू आलू भंडार', 
        nameEn: 'Raju Potato Store', 
        price: 20, 
        originalPrice: 25,
        location: 'Subzi Mandi',
        locationHindi: 'सब्जी मंडी',
        rating: 4.4,
        totalReviews: 98,
        isOnline: true,
        responseTime: '< 5 minutes',
        specialties: ['Potato Specialist', 'Multiple Varieties'],
        specialtiesHindi: ['आलू विशेषज्ञ', 'कई किस्में'],
        established: '2016',
        verified: true,
        deliveryAvailable: true,
        minOrder: 2,
        maxOrder: 100
      },
      { 
        id: 7, 
        name: 'कृष्णा वेजिटेबल्स', 
        nameEn: 'Krishna Vegetables', 
        price: 18, 
        originalPrice: 22,
        location: 'New Market',
        locationHindi: 'न्यू मार्केट',
        rating: 4.6,
        totalReviews: 134,
        isOnline: true,
        responseTime: '< 8 minutes',
        specialties: ['Organic Options', 'Fair Prices'],
        specialtiesHindi: ['जैविक विकल्प', 'उचित कीमतें'],
        established: '2017',
        verified: true,
        deliveryAvailable: true,
        minOrder: 1,
        maxOrder: 75
      }
    ]
  }
];

// Enhanced translation mappings
const translations = {
  'What is your best price?': 'आपकी सबसे अच्छी कीमत क्या है?',
  'Can you reduce the price?': 'क्या आप कीमत कम कर सकते हैं?',
  'I will take 2 kg': 'मैं 2 किलो लूंगा',
  'How much for 5 kg?': '5 किलो के लिए कितना?',
  'Is this fresh?': 'क्या यह ताज़ा है?',
  'Do you have organic?': 'क्या आपके पास जैविक है?',
  'आपकी सबसे अच्छी कीमत क्या है?': 'What is your best price?',
  'मैं 20 रुपये प्रति किलो दे सकता हूं': 'I can give 20 rupees per kg',
  'ठीक है, 23 रुपये में दे देता हूं': 'Okay, I will give for 23 rupees',
  'यह बहुत ताज़ा है': 'This is very fresh',
  'हां, यह जैविक है': 'Yes, this is organic',
  'मैं 25 रुपये से कम नहीं दे सकता': 'I cannot give less than 25 rupees'
};

// Error handling middleware
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

// Success response helper
const sendSuccess = (res, data, message = 'Success') => {
  res.json({
    success: true,
    message,
    data
  });
};

// Input validation middleware
const validateSearchQuery = (req, res, next) => {
  const { query } = req.query;
  if (!query || query.trim().length === 0) {
    return handleError(res, { message: 'Search query is required' }, 400);
  }
  if (query.length > 100) {
    return handleError(res, { message: 'Search query too long (max 100 characters)' }, 400);
  }
  next();
};

const validateVendorId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return handleError(res, { message: 'Valid vendor ID is required' }, 400);
  }
  next();
};

// Enhanced API Routes with better structure and validation

// Product search with advanced filtering
app.get('/api/search', validateSearchQuery, (req, res) => {
  try {
    const { query, lang = 'en', sortBy = 'relevance', minPrice, maxPrice, category } = req.query;
    const startTime = Date.now();
    
    let results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.nameHindi.includes(query) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.categoryHindi.includes(query)
    );

    // Apply category filter
    if (category) {
      results = results.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply price filtering to vendors
    if (minPrice || maxPrice) {
      results = results.map(product => ({
        ...product,
        vendors: product.vendors.filter(vendor => {
          const price = vendor.price;
          return (!minPrice || price >= parseInt(minPrice)) && 
                 (!maxPrice || price <= parseInt(maxPrice));
        })
      })).filter(product => product.vendors.length > 0);
    }

    // Sort results
    if (sortBy === 'price_low') {
      results.forEach(product => {
        product.vendors.sort((a, b) => a.price - b.price);
      });
    } else if (sortBy === 'price_high') {
      results.forEach(product => {
        product.vendors.sort((a, b) => b.price - a.price);
      });
    } else if (sortBy === 'rating') {
      results.forEach(product => {
        product.vendors.sort((a, b) => b.rating - a.rating);
      });
    }

    const searchTime = Date.now() - startTime;
    
    const responseData = {
      products: results,
      totalResults: results.length,
      totalVendors: results.reduce((sum, product) => sum + product.vendors.length, 0),
      searchTime: `${searchTime}ms`,
      query: query,
      language: lang,
      filters: {
        sortBy,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        category: category || null
      }
    };
    
    sendSuccess(res, responseData, `Found ${results.length} products with ${responseData.totalVendors} vendors`);
  } catch (error) {
    handleError(res, error);
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(mockProducts.map(product => ({
      name: product.category,
      nameHindi: product.categoryHindi
    })))];
    
    sendSuccess(res, { categories }, 'Categories retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
});

// Enhanced vendor details with comprehensive information
app.get('/api/vendor/:id', validateVendorId, (req, res) => {
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
          unitHindi: product.unitHindi,
          description: product.description,
          descriptionHindi: product.descriptionHindi,
          image: product.image,
          seasonality: product.seasonality,
          nutritionalInfo: product.nutritionalInfo
        };
        break;
      }
    }
    
    if (vendor) {
      const responseData = {
        ...vendor,
        product: productInfo,
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        businessHours: '6:00 AM - 8:00 PM',
        languages: ['Hindi', 'English'],
        paymentMethods: ['Cash', 'UPI', 'Card'],
        lastSeen: new Date().toISOString(),
        averageResponseTime: vendor.responseTime,
        completedOrders: Math.floor(Math.random() * 500) + 100,
        customerSatisfaction: Math.round(vendor.rating * 20) // Convert to percentage
      };
      sendSuccess(res, responseData, 'Vendor details retrieved successfully');
    } else {
      handleError(res, { message: 'Vendor not found' }, 404);
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Get vendor reviews
app.get('/api/vendor/:id/reviews', validateVendorId, (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    const { page = 1, limit = 10 } = req.query;
    
    // Generate mock reviews
    const mockReviews = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      customerName: `Customer ${index + 1}`,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: index % 2 === 0 
        ? 'Great quality vegetables and good service!'
        : 'बहुत अच्छी गुणवत्ता और सेवा!',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      verified: Math.random() > 0.3,
      helpful: Math.floor(Math.random() * 10)
    }));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = mockReviews.slice(startIndex, endIndex);

    const responseData = {
      reviews: paginatedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(mockReviews.length / limit),
        totalReviews: mockReviews.length,
        hasNext: endIndex < mockReviews.length,
        hasPrev: page > 1
      }
    };

    sendSuccess(res, responseData, 'Reviews retrieved successfully');
  } catch (error) {
    handleError(res, error);
  }
});

// Enhanced translation endpoint
app.post('/api/translate', (req, res) => {
  try {
    const { text, from = 'en', to = 'hi' } = req.body;
    
    if (!text) {
      return handleError(res, { message: 'Text is required for translation' }, 400);
    }
    
    const translatedText = translations[text] || text;
    const confidence = translations[text] ? 0.95 : 0.5;
    
    const responseData = {
      originalText: text,
      translatedText: translatedText,
      originalLanguage: from,
      targetLanguage: to,
      confidence: confidence
    };
    
    sendSuccess(res, responseData, 'Translation completed');
  } catch (error) {
    handleError(res, error);
  }
});

// New negotiation endpoint
app.post('/api/negotiate', (req, res) => {
  try {
    const { currentPrice, productType = 'vegetables', negotiationHistory = [] } = req.body;
    
    if (!currentPrice) {
      return handleError(res, { message: 'Current price is required' }, 400);
    }
    
    // Generate reasonable counter-offer (5-15% reduction)
    const reductionPercentage = 0.05 + Math.random() * 0.10; // 5-15%
    const suggestedPrice = Math.round(currentPrice * (1 - reductionPercentage));
    
    const responseData = {
      suggestedCounterOffer: suggestedPrice,
      negotiationTips: [
        'Ask about bulk discounts',
        'Mention you\'re a regular customer',
        'Be polite and respectful',
        'Consider the quality of the product'
      ],
      phrases: {
        en: `Can you do ${suggestedPrice} rupees per kg?`,
        hi: `क्या आप ${suggestedPrice} रुपये प्रति किलो में दे सकते हैं?`
      },
      reasoning: `Counter-offer is ${(reductionPercentage * 100).toFixed(1)}% below asking price, within reasonable negotiation range`
    };
    
    sendSuccess(res, responseData, 'Negotiation suggestion generated');
  } catch (error) {
    handleError(res, error);
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: isDevelopment ? err.message : null,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  const responseTime = Date.now() - req.startTime;
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      availableEndpoints: [
        'GET /api/health',
        'GET /api/search',
        'GET /api/categories',
        'GET /api/vendor/:id',
        'GET /api/vendor/:id/reviews',
        'POST /api/translate',
        'POST /api/negotiate'
      ],
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    }
  });
});

// Response timing middleware (add to all responses)
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - req.startTime;
    
    // Add timing header
    res.set('X-Response-Time', `${responseTime}ms`);
    
    // If it's a JSON response, add timing to the response body
    if (res.get('Content-Type')?.includes('application/json')) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData && typeof parsedData === 'object') {
          parsedData.responseTime = `${responseTime}ms`;
          parsedData.timestamp = new Date().toISOString();
          data = JSON.stringify(parsedData);
        }
      } catch (e) {
        // If parsing fails, just add the header
      }
    }
    
    originalSend.call(this, data);
  };
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 Multilingual Mandi API Server`);
  console.log(`📍 Running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation available at endpoints`);
  console.log('✅ Server ready for connections');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Enhanced health check endpoint with system information
app.get('/api/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  sendSuccess(res, { 
    status: 'healthy',
    uptime: `${Math.floor(uptime)}s`,
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
    },
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      search: '/api/search',
      categories: '/api/categories',
      vendor: '/api/vendor/:id',
      reviews: '/api/vendor/:id/reviews',
      translate: '/api/translate',
      negotiate: '/api/negotiate'
    }
  }, 'Service is healthy and ready');
});