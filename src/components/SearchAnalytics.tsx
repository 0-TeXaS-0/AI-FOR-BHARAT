interface SearchAnalyticsProps {
  totalProducts: number;
  totalVendors: number;
  searchQuery: string;
  searchTime?: string;
  filters: {
    sortBy: string;
    category?: string;
  };
}

export default function SearchAnalytics({
  totalProducts,
  totalVendors,
  searchQuery,
  searchTime = '0.15s',
  filters
}: SearchAnalyticsProps) {
  const getSortLabel = (sortBy: string) => {
    switch (sortBy) {
      case 'price_low': return 'Price (Low to High) | कीमत (कम से ज्यादा)';
      case 'price_high': return 'Price (High to Low) | कीमत (ज्यादा से कम)';
      case 'rating': return 'Rating | रेटिंग';
      default: return 'Relevance | प्रासंगिकता';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Search Results | खोज परिणाम
          </h2>
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
            <span>
              <strong>{totalProducts}</strong> products found | उत्पाद मिले
            </span>
            <span>•</span>
            <span>
              <strong>{totalVendors}</strong> vendors available | विक्रेता उपलब्ध
            </span>
            <span>•</span>
            <span>
              Search time: <strong>{searchTime}</strong>
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Query:</span> "{searchQuery}"
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Sorted by:</span> {getSortLabel(filters.sortBy)}
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Products</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalVendors}</div>
          <div className="text-xs text-green-700 dark:text-green-300">Vendors</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</div>
          <div className="text-xs text-orange-700 dark:text-orange-300">Fresh</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.5★</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Avg Rating</div>
        </div>
      </div>
    </div>
  );
}