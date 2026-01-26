interface EmptyStateProps {
  type: 'no-search' | 'no-results';
  searchQuery?: string;
  onSuggestedSearch?: (query: string) => void;
}

export default function EmptyState({ type, searchQuery, onSuggestedSearch }: EmptyStateProps) {
  const suggestions = [
    { query: 'टमाटर', icon: '🍅', label: 'Tomatoes' },
    { query: 'प्याज', icon: '🧅', label: 'Onions' },
    { query: 'आलू', icon: '🥔', label: 'Potatoes' }
  ];

  if (type === 'no-search') {
    return (
      <div className="text-center py-16">
        <div className="text-8xl mb-6 animate-bounce">🛒</div>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Multilingual Mandi!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Start by searching for products in English or Hindi. Compare prices from local vendors and get the best deals.
          <br />
          <span className="text-base text-gray-500 dark:text-gray-400 mt-2 block">
            अंग्रेजी या हिंदी में उत्पादों की खोज करके शुरुआत करें।
          </span>
        </p>
        
        <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.query}
              onClick={() => onSuggestedSearch?.(suggestion.query)}
              className="bg-white dark:bg-gray-800 hover:bg-[#FF851B] hover:text-white border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {suggestion.icon}
              </div>
              <div className="text-sm">
                Search {suggestion.label}
                <br />
                <span className="text-xs opacity-75">{suggestion.query}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            💡 Tip: You can search in both English and Hindi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-6">🔍</div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
        No products found | कोई उत्पाद नहीं मिला
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-md mx-auto">
        We couldn't find any products matching "{searchQuery}". Try searching for something else.
      </p>
      
      <div className="space-y-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Try these popular searches:
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.query}
              onClick={() => onSuggestedSearch?.(suggestion.query)}
              className="bg-[#FF851B] hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span>{suggestion.icon}</span>
              <span>{suggestion.query}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl max-w-md mx-auto">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          💡 Search tips: Try using Hindi names like "टमाटर" or English names like "tomato"
        </p>
      </div>
    </div>
  );
}