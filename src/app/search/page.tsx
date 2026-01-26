'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import VendorCard from '@/components/VendorCard';
import SearchAnalytics from '@/components/SearchAnalytics';
import EmptyState from '@/components/EmptyState';

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
  const router = useRouter();

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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Search Products | उत्पाद खोजें
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find the best prices from local vendors
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF851B] mb-6"></div>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300 text-xl font-semibold">
                Searching... | खोज रहे हैं...
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Finding the best vendors for you | आपके लिए सबसे अच्छे विक्रेता खोज रहे हैं
              </p>
            </div>
            
            {/* Loading Skeleton */}
            <div className="mt-8 space-y-4 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
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
    </div>
  );
}