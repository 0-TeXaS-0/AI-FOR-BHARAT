'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/contexts/OrderContext';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import SearchBar from '@/components/SearchBar';
import VendorCard from '@/components/VendorCard';
import SearchAnalytics from '@/components/SearchAnalytics';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import Button from '@/components/Button';
import AIAssistant from '@/components/AIAssistant';

// Add custom CSS for animations
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-in {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }
  
  .animate-slide-in {
    animation: slide-in 0.4s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

interface Vendor {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  location: string;
}

interface Product {
  id: number;
  name: string;
  nameHindi: string;
  category: string;
  vendors: Vendor[];
}

export default function Search() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCache, setSearchCache] = useState<{[key: string]: Product[]}>({});
  const [currentFilters, setCurrentFilters] = useState({ sortBy: 'relevance' as const });
  const [showOrders, setShowOrders] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const router = useRouter();
  const { orders } = useOrders();
  const { isAIOpen, setIsAIOpen } = useAIAssistant();

  const t = {
    en: {
      yourOrders: 'Your Orders',
      noOrders: 'No orders yet',
      viewOrders: 'View Orders',
      hideOrders: 'Hide Orders',
      orderDate: 'Order Date',
      status: 'Status',
      total: 'Total',
      quantity: 'Quantity',
      pending: 'Pending',
      confirmed: 'Confirmed',
      'out-for-delivery': 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    },
    hi: {
      yourOrders: 'आपके ऑर्डर',
      noOrders: 'अभी तक कोई ऑर्डर नहीं',
      viewOrders: 'ऑर्डर देखें',
      hideOrders: 'ऑर्डर छुपाएं',
      orderDate: 'ऑर्डर तारीख',
      status: 'स्थिति',
      total: 'कुल',
      quantity: 'मात्रा',
      pending: 'लंबित',
      confirmed: 'पुष्टि',
      'out-for-delivery': 'डिलीवरी के लिए',
      delivered: 'वितरित',
      cancelled: 'रद्द',
    },
  };

  const txt = t[language];

  const handleSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    
    // Create cache key with filters
    const cacheKey = `${query.toLowerCase()}_${currentFilters.sortBy}`;
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey]);
      setLoading(false);
      return;
    }
    
    try {
      const searchParams = new URLSearchParams({
        query: query,
        lang: 'en',
        sortBy: currentFilters.sortBy
      });
      
      const response = await fetch(`http://localhost:5000/api/search?${searchParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const products = result.data.products || [];
        setResults(products);
        // Cache the results
        setSearchCache(prev => ({
          ...prev,
          [cacheKey]: products
        }));
      } else {
        console.error('Search failed:', result.error);
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      
      // Show user-friendly error message
      alert(
        language === 'en' 
          ? '⚠️ Backend server is not running!\n\nPlease start the backend:\n1. Open a new terminal\n2. Run: cd backend\n3. Run: npm run dev\n\nThe backend should run on port 5000.'
          : '⚠️ बैकएंड सर्वर नहीं चल रहा है!\n\nकृपया बैकएंड शुरू करें:\n1. नया टर्मिनल खोलें\n2. चलाएं: cd backend\n3. चलाएं: npm run dev\n\nबैकएंड पोर्ट 5000 पर चलना चाहिए।'
      );
      
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
    // Re-run search with new filters if we have results
    if (hasSearched && results.length > 0) {
      // Get the last search query from cache keys or use a default
      const lastQuery = Object.keys(searchCache)[0]?.split('_')[0] || 'tomato';
      handleSearch(lastQuery);
    }
  };

  const handleVendorSelect = (vendorId: number) => {
    router.push(`/vendor/${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-gray-900">
      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch} 
        loading={loading} 
        showFilters={true}
        onFilterChange={handleFilterChange}
      />

      <div className="container mx-auto px-4 py-10">
        {/* Header with Language Toggle and Orders Button */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
              {language === 'en' ? 'Search Products' : 'उत्पाद खोजें'}
            </h1>
            <div className="flex gap-3">
              <Button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                variant="secondary"
                size="sm"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </Button>
              <Button
                onClick={() => setShowOrders(!showOrders)}
                variant={showOrders ? 'primary' : 'secondary'}
                size="sm"
              >
                {showOrders ? txt.hideOrders : txt.viewOrders} ({orders.length})
              </Button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-xl font-medium">
            {language === 'en' 
              ? 'Find the best prices from local vendors'
              : 'स्थानीय विक्रेताओं से सर्वोत्तम मूल्य खोजें'
            }
          </p>
        </div>

        {/* Your Orders Section */}
        {showOrders && (
          <div className="mb-8">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                  {txt.yourOrders}
                </h2>
                {orders.length === 0 ? (
                  <EmptyState 
                    message={txt.noOrders}
                    icon={
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {language === 'en' ? order.productName : order.productNameHindi}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language === 'en' ? order.vendorName : order.vendorNameHindi}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : order.status === 'out-for-delivery'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : order.status === 'confirmed'
                                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                          >
                            {txt[order.status as keyof typeof txt]}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">{txt.quantity}</p>
                            <p className="font-medium text-gray-900 dark:text-white">{order.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">{txt.total}</p>
                            <p className="font-medium text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">{txt.orderDate}</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(order.orderDate).toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {language === 'en' ? order.paymentMethod : order.paymentMethodHindi}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-orange-500 mb-8"></div>
            <div className="space-y-3">
              <p className="text-gray-800 dark:text-gray-200 text-2xl font-bold">
                {language === 'en' ? 'Searching...' : 'खोज रहे हैं...'}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Finding the best vendors for you | आपके लिए सबसे अच्छे विक्रेता खोज रहे हैं
              </p>
            </div>
            
            {/* Loading Skeleton */}
            <div className="mt-10 space-y-5 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-7 animate-pulse border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-teal-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/3"></div>
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-lg w-1/2"></div>
                    </div>
                    <div className="w-24 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-8">
            {results.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🥬</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                      {product.name} ({product.nameHindi})
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Category: {product.category} | श्रेणी: {product.category}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <span>🏪</span>
                    Available Vendors ({product.vendors.length}) | उपलब्ध विक्रेता
                  </h3>
                  
                  {/* Vendor Comparison Grid */}
                  <div className="grid gap-4 md:gap-6">
                    {(() => {
                      const prices = product.vendors.map(v => v.price);
                      const minPrice = Math.min(...prices);
                      const maxPrice = Math.max(...prices);
                      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
                      
                      return product.vendors.map((vendor) => (
                        <VendorCard
                          key={vendor.id}
                          vendor={vendor}
                          productName={product.name}
                          productNameHindi={product.nameHindi}
                          onClick={handleVendorSelect}
                          isLowestPrice={vendor.price === minPrice}
                          isHighestPrice={vendor.price === maxPrice}
                          averagePrice={avgPrice}
                        />
                      ));
                    })()}
                  </div>
                </div>

                {/* Enhanced Price Range Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      📊 Price Analysis | मूल्य विश्लेषण
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Price Range */}
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price Range</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                          ₹{Math.min(...product.vendors.map(v => v.price))} - ₹{Math.max(...product.vendors.map(v => v.price))}/kg
                        </div>
                      </div>
                      
                      {/* Average Price */}
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Price</div>
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          ₹{(product.vendors.reduce((sum, v) => sum + v.price, 0) / product.vendors.length).toFixed(0)}/kg
                        </div>
                      </div>
                      
                      {/* Potential Savings */}
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Savings</div>
                        <div className="text-lg font-bold text-[#2ECC40]">
                          💰 ₹{Math.max(...product.vendors.map(v => v.price)) - Math.min(...product.vendors.map(v => v.price))}/kg
                        </div>
                      </div>
                    </div>
                    
                    {/* Savings Calculator */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          💡 Tip: Choose the lowest price vendor to save up to ₹{Math.max(...product.vendors.map(v => v.price)) - Math.min(...product.vendors.map(v => v.price))} per kg
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-[#2ECC40] text-white px-2 py-1 rounded-full">
                            Best Deal: {product.vendors.find(v => v.price === Math.min(...product.vendors.map(p => p.price)))?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Welcome Message */}
        {!hasSearched && (
          <EmptyState 
            type="no-search" 
            onSuggestedSearch={handleSearch}
          />
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && (
          <EmptyState 
            type="no-results" 
            searchQuery={Object.keys(searchCache)[0]?.split('_')[0] || ''}
            onSuggestedSearch={handleSearch}
          />
        )}

        {/* Search Analytics */}
        {!loading && results.length > 0 && (
          <SearchAnalytics
            totalProducts={results.length}
            totalVendors={results.reduce((sum, product) => sum + product.vendors.length, 0)}
            searchQuery={Object.keys(searchCache)[0]?.split('_')[0] || ''}
            filters={currentFilters}
          />
        )}
      </div>

      {/* AI Assistant */}
      {isAIOpen && (
        <AIAssistant
          language={language}
          context={{}}
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