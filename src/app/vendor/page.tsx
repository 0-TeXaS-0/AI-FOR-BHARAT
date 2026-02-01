'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useVendor } from '@/contexts/VendorContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CustomerChatModal from '@/components/CustomerChatModal';
import BuyerRequestChatModal from '@/components/BuyerRequestChatModal';
import AIAssistant from '@/components/AIAssistant';

export default function VendorPage() {
  const router = useRouter();
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    buyerRequests,
    respondToRequest,
    requestHistory,
    language,
    toggleLanguage,
    profile,
    updateProfile,
    analytics,
    refreshAnalytics,
    notifications,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useVendor();
  
  const { orders, updateOrderStatus } = useOrders();
  
  // Filter orders for this vendor
  const vendorOrders = useMemo(() => {
    return orders.filter(order => 
      order.vendorName === profile.nameEn ||
      order.vendorName === profile.name ||
      order.vendorNameHindi === profile.name ||
      order.vendorNameHindi === profile.nameEn
    );
  }, [orders, profile.nameEn, profile.name]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    nameHindi: '',
    category: 'Vegetables',
    categoryHindi: 'सब्जियां',
    unit: 'kg',
    price: '',
    marketMin: '',
    marketMax: '',
    stock: '100',
    image: null as string | null,
  });

  const [profileEdit, setProfileEdit] = useState(profile);
  const [chatMessage, setChatMessage] = useState('');
  const [chatImage, setChatImage] = useState<string | null>(null);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<string | null>(null);
  const [selectedRequestForChat, setSelectedRequestForChat] = useState<string | null>(null);
  const { isAIOpen, setIsAIOpen } = useAIAssistant();

  const text = {
    en: {
      header: 'Vendor Workspace',
      subtitle: 'Manage products & respond to buyers',
      langBadge: 'EN',
      addProductBtn: '+ Add Product',
      myProducts: 'My Products',
      buyerRequests: 'Buyer Requests',
      analytics: 'Analytics Dashboard',
      profile: 'Profile Settings',
      history: 'Request History',
      noProducts: 'No products added yet. Add your first product!',
      noRequests: 'No buyer requests at the moment',
      productName: 'Product Name (English)',
      productNameHindi: 'उत्पाद का नाम (Hindi)',
      category: 'Category',
      unit: 'Unit',
      yourPrice: 'Your Price',
      marketRange: 'Market Range',
      stock: 'Stock Quantity',
      image: 'Product Image',
      cancel: 'Cancel',
      save: 'Save',
      backToHome: '← Back',
      competitive: 'Competitive',
      aboveMarket: 'Above Market',
      belowMarket: 'Below Market',
      lowStock: 'Low Stock!',
      outOfStock: 'Out of Stock',
      quantity: 'Qty',
      offer: 'Offer',
      viewChat: 'View Chat',
      chatWith: 'Chat with',
      send: 'Send',
      aiSuggestion: 'AI Price Suggestion',
      counterOffer: 'Counter ₹',
      accept: 'Accept',
      decline: 'Decline',
      search: 'Search products...',
      allCategories: 'All Categories',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      grains: 'Grains',
      bulkAction: 'Bulk Actions',
      deleteSelected: 'Delete Selected',
      edit: 'Edit',
      delete: 'Delete',
      totalProducts: 'Total Products',
      totalRevenue: 'Revenue',
      totalSold: 'Items Sold',
      activeReq: 'Active Requests',
      bestSelling: 'Best Selling Products',
      acceptanceRate: 'Acceptance Rate',
      shopName: 'Shop Name',
      phone: 'Phone Number',
      location: 'Location',
      hours: 'Operating Hours',
      payment: 'Payment Methods',
      specialties: 'Specialties',
      update: 'Update Profile',
      uploadImage: 'Upload Image',
      voiceMessage: '🎤 Voice',
      sendImage: '📷 Image',
      pending: 'Pending',
      accepted: 'Accepted',
      declined: 'Declined',
      countered: 'Countered',
      sold: 'sold',
      revenue: 'revenue',
      inStock: 'in stock',
      notifications: 'Notifications',
      orders: 'Customer Orders',
      noOrders: 'No orders yet',
      customerName: 'Customer',
      orderDetails: 'Order Details',
      acceptOrder: 'Accept Order',
      outForDelivery: 'Out for Delivery',
      markDelivered: 'Mark as Delivered',
      cancelOrder: 'Cancel',
      outForDeliveryStatus: 'Out for Delivery',
      chatWithCustomer: 'Chat',
    },
    hi: {
      header: 'विक्रेता कार्यक्षेत्र',
      subtitle: 'उत्पाद प्रबंधित करें और खरीदारों को जवाब दें',
      langBadge: 'हिं',
      addProductBtn: '+ उत्पाद जोड़ें',
      myProducts: 'मेरे उत्पाद',
      buyerRequests: 'खरीदार अनुरोध',
      analytics: 'विश्लेषण डैशबोर्ड',
      profile: 'प्रोफ़ाइल सेटिंग्स',
      history: 'अनुरोध इतिहास',
      noProducts: 'अभी तक कोई उत्पाद नहीं जोड़ा गया। अपना पहला उत्पाद जोड़ें!',
      noRequests: 'फिलहाल कोई खरीदार अनुरोध नहीं',
      productName: 'उत्पाद का नाम (English)',
      productNameHindi: 'उत्पाद का नाम (Hindi)',
      category: 'श्रेणी',
      unit: 'इकाई',
      yourPrice: 'आपकी कीमत',
      marketRange: 'बाजार रेंज',
      stock: 'स्टॉक मात्रा',
      image: 'उत्पाद छवि',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      backToHome: '← वापस',
      competitive: 'प्रतिस्पर्धी',
      aboveMarket: 'बाजार से ऊपर',
      belowMarket: 'बाजार से नीचे',
      lowStock: 'कम स्टॉक!',
      outOfStock: 'स्टॉक खत्म',
      quantity: 'मात्रा',
      offer: 'प्रस्ताव',
      viewChat: 'चैट देखें',
      chatWith: 'के साथ चैट',
      send: 'भेजें',
      aiSuggestion: 'AI मूल्य सुझाव',
      counterOffer: 'काउंटर ₹',
      accept: 'स्वीकार',
      decline: 'अस्वीकार',
      search: 'उत्पाद खोजें...',
      allCategories: 'सभी श्रेणियां',
      vegetables: 'सब्जियां',
      fruits: 'फल',
      grains: 'अनाज',
      bulkAction: 'थोक क्रियाएं',
      deleteSelected: 'चयनित हटाएं',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      totalProducts: 'कुल उत्पाद',
      totalRevenue: 'राजस्व',
      totalSold: 'बेचे गए आइटम',
      activeReq: 'सक्रिय अनुरोध',
      bestSelling: 'सबसे अधिक बिकने वाले उत्पाद',
      acceptanceRate: 'स्वीकृति दर',
      shopName: 'दुकान का नाम',
      phone: 'फोन नंबर',
      location: 'स्थान',
      hours: 'संचालन समय',
      payment: 'भुगतान विधियां',
      specialties: 'विशेषताएं',
      update: 'प्रोफ़ाइल अपडेट करें',
      uploadImage: 'छवि अपलोड करें',
      voiceMessage: '🎤 आवाज़',
      sendImage: '📷 छवि',
      pending: 'लंबित',
      accepted: 'स्वीकृत',
      declined: 'अस्वीकृत',
      countered: 'काउंटर किया',
      sold: 'बेचा',
      revenue: 'राजस्व',
      inStock: 'स्टॉक में',
      notifications: 'सूचनाएं',
      orders: 'ग्राहक ऑर्डर',
      noOrders: 'अभी तक कोई ऑर्डर नहीं',
      customerName: 'ग्राहक',
      orderDetails: 'ऑर्डर विवरण',
      acceptOrder: 'ऑर्डर स्वीकार करें',
      outForDelivery: 'डिलीवरी के लिए',
      markDelivered: 'डिलीवर के रूप में चिह्नित करें',
      cancelOrder: 'रद्द करें',
      outForDeliveryStatus: 'डिलीवरी के लिए',
      chatWithCustomer: 'चैट',
    },
  };

  const t = text[language];

  const categories = {
    en: ['Vegetables', 'Fruits', 'Grains', 'Spices', 'Other'],
    hi: ['सब्जियां', 'फल', 'अनाज', 'मसाले', 'अन्य'],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;

    await addProduct({
      name: newProduct.name,
      nameHindi: newProduct.nameHindi || newProduct.name,
      category: newProduct.category,
      categoryHindi: newProduct.categoryHindi,
      unit: newProduct.unit,
      price: parseFloat(newProduct.price),
      marketMin: parseFloat(newProduct.marketMin) || parseFloat(newProduct.price) - 5,
      marketMax: parseFloat(newProduct.marketMax) || parseFloat(newProduct.price) + 5,
      stock: parseInt(newProduct.stock),
      image: newProduct.image,
    });

    showSuccessMessage(language === 'en' ? 'Product added successfully! ✅' : 'उत्पाद सफलतापूर्वक जोड़ा गया! ✅');
    setNewProduct({
      name: '',
      nameHindi: '',
      category: 'Vegetables',
      categoryHindi: 'सब्जियां',
      unit: 'kg',
      price: '',
      marketMin: '',
      marketMax: '',
      stock: '100',
      image: null,
    });
    setShowAddProduct(false);
  };

  const handleBulkDelete = async () => {
    for (const id of selectedProducts) {
      await removeProduct(id);
    }
    setSelectedProducts([]);
    showSuccessMessage(language === 'en' ? 'Products deleted! 🗑️' : 'उत्पाद हटाए गए! 🗑️');
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRespondToRequest = async (id: string, action: string, price?: number) => {
    await respondToRequest(id, action, price, chatMessage || undefined);
    showSuccessMessage(
      action === 'accepted'
        ? language === 'en'
          ? 'Request accepted! 🎉'
          : 'अनुरोध स्वीकार किया गया! 🎉'
        : language === 'en'
        ? 'Response sent! ✅'
        : 'प्रतिक्रिया भेजी गई! ✅'
    );
    setSelectedRequest(null);
    setChatMessage('');
  };

  const getPriceStatus = (price: number, min: number, max: number) => {
    const avg = (min + max) / 2;
    if (price < avg - 2) return { text: t.belowMarket, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (price > avg + 2) return { text: t.aboveMarket, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
    return { text: t.competitive, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' };
  };

  const getAISuggestion = (offerPrice: number, yourPrice: number) => {
    const diff = yourPrice - offerPrice;
    if (diff <= 2) return offerPrice;
    return Math.round(offerPrice + diff / 2);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameHindi.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900 pb-16">
      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl">
            <p className="font-bold text-lg">{successMessage}</p>
          </div>
        </div>
      )}

      <Container className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold transition-colors"
          >
            {t.backToHome}
          </button>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                🔔
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              {t.langBadge}
            </button>
          </div>
        </div>

        {/* Vendor Header */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                  {t.header}
                </h1>
                {profile.verified && <span className="text-2xl">✅</span>}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
                {t.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="font-semibold">📍</span>{' '}
                  {language === 'en' ? profile.location : profile.locationHindi}
                </div>
                <div>
                  <span className="font-semibold">🕐</span>{' '}
                  {language === 'en' ? profile.operatingHours : profile.operatingHoursHindi}
                </div>
                <div>
                  <span className="font-semibold">⭐</span> {profile.rating} ({profile.totalOrders} orders)
                </div>
              </div>
            </div>
            <Button onClick={() => setShowProfile(!showProfile)} variant="outline" size="md">
              {showProfile ? t.cancel : t.profile}
            </Button>
          </div>
        </Card>

        {/* Profile Edit */}
        {showProfile && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t.profile}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.shopName} (EN)
                </label>
                <input
                  type="text"
                  value={profileEdit.nameEn}
                  onChange={(e) => setProfileEdit({ ...profileEdit, nameEn: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.shopName} (HI)
                </label>
                <input
                  type="text"
                  value={profileEdit.name}
                  onChange={(e) => setProfileEdit({ ...profileEdit, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  value={profileEdit.phone}
                  onChange={(e) => setProfileEdit({ ...profileEdit, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.hours} (EN)
                </label>
                <input
                  type="text"
                  value={profileEdit.operatingHours}
                  onChange={(e) => setProfileEdit({ ...profileEdit, operatingHours: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t.payment}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(language === 'en' ? profileEdit.paymentMethods : profileEdit.paymentMethodsHindi).map((method, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg font-semibold"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={() => {
                  updateProfile(profileEdit);
                  setShowProfile(false);
                  showSuccessMessage(language === 'en' ? 'Profile updated! ✅' : 'प्रोफ़ाइल अपडेट किया गया! ✅');
                }}
                variant="accent"
                size="lg"
                className="w-full"
              >
                {t.update}
              </Button>
            </div>
          </Card>
        )}

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.analytics}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card variant="elevated" padding="md">
                <div className="text-center">
                  <div className="text-3xl mb-2">📦</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{analytics.totalProducts}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.totalProducts}</div>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">₹{analytics.totalRevenue}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.totalRevenue}</div>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalSold}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.totalSold}</div>
                </div>
              </Card>
              <Card variant="elevated" padding="md">
                <div className="text-center">
                  <div className="text-3xl mb-2">📬</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{analytics.activeRequests}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.activeReq}</div>
                </div>
              </Card>
            </div>

            {/* Best Selling */}
            {analytics.bestSelling.length > 0 && (
              <Card variant="elevated" padding="lg" className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🏆 {t.bestSelling}</h3>
                <div className="space-y-3">
                  {analytics.bestSelling.map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {language === 'en' ? product.name : product.nameHindi}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {product.sold} {t.sold} • ₹{product.revenue} {t.revenue}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Products Section - Continuing in next message due to length */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.myProducts} ({products.length})</h2>
            <div className="flex gap-2">
              {selectedProducts.length > 0 && (
                <Button onClick={handleBulkDelete} variant="outline" size="md">
                  🗑️ {t.deleteSelected} ({selectedProducts.length})
                </Button>
              )}
              <Button onClick={() => setShowAddProduct(!showAddProduct)} variant="primary" size="md">
                {showAddProduct ? t.cancel : t.addProductBtn}
              </Button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">{t.allCategories}</option>
              {categories.en.map((cat, i) => (
                <option key={cat} value={cat}>
                  {language === 'en' ? cat : categories.hi[i]}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <Card variant="elevated" padding="lg" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.productName}
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Fresh Tomatoes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.productNameHindi}
                  </label>
                  <input
                    type="text"
                    value={newProduct.nameHindi}
                    onChange={(e) => setNewProduct({ ...newProduct, nameHindi: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="ताज़े टमाटर"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.category}
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      const index = categories.en.indexOf(e.target.value);
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                        categoryHindi: categories.hi[index],
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.en.map((cat, i) => (
                      <option key={cat} value={cat}>
                        {language === 'en' ? cat : categories.hi[i]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.unit}</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="kg">kg (किलो)</option>
                    <option value="piece">piece (पीस)</option>
                    <option value="dozen">dozen (दर्जन)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.yourPrice} (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.stock}
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="100"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.marketRange} (Min - Max)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      value={newProduct.marketMin}
                      onChange={(e) => setNewProduct({ ...newProduct, marketMin: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Min: 25"
                    />
                    <input
                      type="number"
                      value={newProduct.marketMax}
                      onChange={(e) => setNewProduct({ ...newProduct, marketMax: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Max: 35"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t.image}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button onClick={() => imageInputRef.current?.click()} variant="outline" size="md">
                      📷 {t.uploadImage}
                    </Button>
                    {newProduct.image && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                        <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={handleAddProduct} variant="accent" size="lg" className="w-full">
                  {t.save}
                </Button>
              </div>
            </Card>
          )}

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <Card variant="outlined" padding="lg">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noProducts}</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const status = getPriceStatus(product.price, product.marketMin, product.marketMax);
                const isLowStock = product.stock < 20;
                const isOutOfStock = product.stock === 0;

                return (
                  <Card key={product.id} variant="elevated" padding="md">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                          }
                        }}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      {product.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                          {language === 'en' ? product.name : product.nameHindi}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {language === 'en' ? product.nameHindi : product.name}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${status.color}`}>
                            {status.text}
                          </span>
                          {isOutOfStock && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                              {t.outOfStock}
                            </span>
                          )}
                          {isLowStock && !isOutOfStock && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-500 text-white">
                              {t.lowStock}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t.yourPrice}</span>
                        <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          ₹{product.price}/{product.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t.stock}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {product.stock} {t.inStock}
                        </span>
                      </div>
                      {product.sold !== undefined && product.sold > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{t.sold}</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {product.sold} {product.unit}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => {
                            setEditingProduct(product.id);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          ✏️ {t.edit}
                        </Button>
                        <Button
                          onClick={async () => {
                            await removeProduct(product.id);
                            showSuccessMessage(language === 'en' ? 'Product deleted! 🗑️' : 'उत्पाद हटाया गया! 🗑️');
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          🗑️ {t.delete}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Buyer Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.buyerRequests} ({buyerRequests.length})
            </h2>
            {requestHistory.length > 0 && (
              <Button onClick={() => setShowHistory(!showHistory)} variant="outline" size="md">
                📜 {t.history} ({requestHistory.length})
              </Button>
            )}
          </div>

          {/* Request History */}
          {showHistory && requestHistory.length > 0 && (
            <Card variant="elevated" padding="lg" className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.history}</h3>
              <div className="space-y-3">
                {requestHistory.map((req) => (
                  <div key={req.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">{req.buyerName}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === 'accepted'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                            : req.status === 'declined'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {req.status === 'accepted'
                          ? t.accepted
                          : req.status === 'declined'
                          ? t.declined
                          : t.countered}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {req.product} • {req.quantity} {req.product.includes('kg') ? 'kg' : 'pcs'} • ₹{req.offerPrice}
                      {req.counterPrice && ` → ₹${req.counterPrice}`}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {buyerRequests.length === 0 ? (
            <Card variant="outlined" padding="lg">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noRequests}</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {buyerRequests.map((request) => {
                const yourProduct = products.find((p) => p.name === request.product);
                const aiSuggestion = yourProduct ? getAISuggestion(request.offerPrice, yourProduct.price) : request.offerPrice;
                const isOpen = selectedRequest === request.id;

                return (
                  <Card key={request.id} variant="elevated" padding="lg">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{request.buyerName}</h3>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold">
                            {t.pending}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {request.product} • {request.quantity} {yourProduct?.unit || 'kg'}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          💬 {language === 'en' ? request.message : request.messageHindi}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t.offer}</div>
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{request.offerPrice}
                        </div>
                        {yourProduct && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t.yourPrice}: ₹{yourProduct.price}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isOpen ? (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setSelectedRequestForChat(request.id)} 
                          variant="secondary" 
                          size="md" 
                          className="flex-1 border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          💬 {t.chatWithCustomer}
                        </Button>
                        <Button 
                          onClick={() => setSelectedRequest(request.id)} 
                          variant="primary" 
                          size="md"
                          className="flex-1"
                        >
                          {t.viewChat}
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                        {/* AI Suggestion */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-4 mb-4 border-2 border-blue-200 dark:border-blue-700">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">💡</span>
                            <span className="font-bold text-blue-900 dark:text-blue-200">{t.aiSuggestion}</span>
                          </div>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">
                            {t.counterOffer}
                            {aiSuggestion} - 85% {language === 'en' ? 'confidence' : 'विश्वास'}
                          </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <Button
                            onClick={() => handleRespondToRequest(request.id, 'accepted', request.offerPrice)}
                            variant="accent"
                            size="md"
                          >
                            ✅ {t.accept} ₹{request.offerPrice}
                          </Button>
                          <Button
                            onClick={() => handleRespondToRequest(request.id, 'countered', aiSuggestion)}
                            variant="primary"
                            size="md"
                          >
                            {t.counterOffer}
                            {aiSuggestion}
                          </Button>
                        </div>

                        {/* Chat Input with Voice & Image */}
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder={language === 'en' ? 'Type message...' : 'संदेश लिखें...'}
                              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <Button
                              onClick={() => handleRespondToRequest(request.id, 'custom', yourProduct?.price)}
                              variant="primary"
                              size="md"
                            >
                              {t.send}
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setVoiceRecording(!voiceRecording)}
                              variant="outline"
                              size="sm"
                              className={voiceRecording ? 'bg-red-100 dark:bg-red-900/30' : ''}
                            >
                              {t.voiceMessage} {voiceRecording && '●'}
                            </Button>
                            <Button onClick={() => imageInputRef.current?.click()} variant="outline" size="sm">
                              {t.sendImage}
                            </Button>
                            <Button
                              onClick={() => handleRespondToRequest(request.id, 'declined')}
                              variant="outline"
                              size="sm"
                            >
                              ❌ {t.decline}
                            </Button>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedRequest(null)}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mt-3"
                        >
                          {t.cancel}
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer Orders Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t.orders} ({vendorOrders.length})
          </h2>

          {vendorOrders.length === 0 ? (
            <Card variant="outlined" padding="lg">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t.noOrders}</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {vendorOrders.map((order) => (
                <Card key={order.id} variant="elevated" padding="lg">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {language === 'en' ? order.productName : order.productNameHindi}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : order.status === 'out-for-delivery'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : order.status === 'confirmed'
                              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {order.status === 'pending'
                            ? t.pending
                            : order.status === 'confirmed'
                            ? t.accepted
                            : order.status === 'out-for-delivery'
                            ? t.outForDeliveryStatus
                            : order.status === 'delivered'
                            ? t.markDelivered.replace('Mark as ', '').replace('के रूप में चिह्नित करें', '')
                            : t.cancelOrder}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t.customerName}:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {order.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t.quantity}:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            {order.quantity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t.yourPrice}:</span>
                          <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                            ₹{order.price}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">{t.totalRevenue}:</span>
                          <span className="ml-2 font-semibold text-teal-600 dark:text-teal-400">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            📍 {language === 'en' ? 'Delivery Address' : 'डिलीवरी पता'}:
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {language === 'en' ? order.address : order.addressHindi}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'en' ? 'Order Date' : 'ऑर्डर तारीख'}:{' '}
                        {new Date(order.orderDate).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN')}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {/* Chat Button - Always visible */}
                      <Button
                        onClick={() => setSelectedOrderForChat(order.id)}
                        variant="secondary"
                        size="md"
                        className="border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        💬 {t.chatWithCustomer}
                      </Button>

                      {order.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            variant="primary"
                            size="md"
                          >
                            ✅ {t.acceptOrder}
                          </Button>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            variant="outline"
                            size="md"
                          >
                            ❌ {t.cancelOrder}
                          </Button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}
                          variant="primary"
                          size="md"
                        >
                          🚚 {t.outForDelivery}
                        </Button>
                      )}
                      {order.status === 'out-for-delivery' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          variant="primary"
                          size="md"
                        >
                          ✅ {t.markDelivered}
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                          <div className="text-2xl mb-1">✅</div>
                          <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {language === 'en' ? 'Completed' : 'पूर्ण'}
                          </div>
                        </div>
                      )}
                      {order.status === 'cancelled' && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                          <div className="text-2xl mb-1">❌</div>
                          <div className="text-sm font-semibold text-red-700 dark:text-red-400">
                            {language === 'en' ? 'Cancelled' : 'रद्द'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Customer Chat Modal */}
      {selectedOrderForChat && vendorOrders.find(o => o.id === selectedOrderForChat) && (
        <CustomerChatModal
          isOpen={!!selectedOrderForChat}
          onClose={() => setSelectedOrderForChat(null)}
          customerName={vendorOrders.find(o => o.id === selectedOrderForChat)!.phone}
          customerPhone={vendorOrders.find(o => o.id === selectedOrderForChat)!.phone}
          orderId={selectedOrderForChat}
          productName={
            language === 'en'
              ? vendorOrders.find(o => o.id === selectedOrderForChat)!.productName
              : vendorOrders.find(o => o.id === selectedOrderForChat)!.productNameHindi
          }
          language={language}
        />
      )}

      {/* Buyer Request Chat Modal */}
      {selectedRequestForChat && buyerRequests.find(r => r.id === selectedRequestForChat) && (() => {
        const request = buyerRequests.find(r => r.id === selectedRequestForChat)!;
        const yourProduct = products.find(p => p.name === request.product);
        return (
          <BuyerRequestChatModal
            isOpen={!!selectedRequestForChat}
            onClose={() => setSelectedRequestForChat(null)}
            buyerName={request.buyerName}
            productName={request.product}
            quantity={request.quantity}
            offerPrice={request.offerPrice}
            yourPrice={yourProduct?.price || 0}
            language={language}
            onAccept={() => {
              handleRespondToRequest(request.id, 'accepted', request.offerPrice);
              setSelectedRequestForChat(null);
            }}
            onDecline={() => {
              handleRespondToRequest(request.id, 'declined');
              setSelectedRequestForChat(null);
            }}
            onCounter={(price) => {
              handleRespondToRequest(request.id, 'countered', price);
            }}
          />
        );
      })()}

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
