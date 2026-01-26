'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  showFilters?: boolean;
  onFilterChange?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating';
  category?: string;
}

export default function SearchBar({ 
  onSearch, 
  loading = false, 
  placeholder = "Search products... | उत्पाद खोजें...",
  showFilters = false,
  onFilterChange
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'relevance' });
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Enhanced suggestions with categories
  const suggestions = [
    { text: 'टमाटर', category: 'Vegetables', icon: '🍅' },
    { text: 'tomato', category: 'Vegetables', icon: '🍅' },
    { text: 'प्याज', category: 'Vegetables', icon: '🧅' },
    { text: 'onion', category: 'Vegetables', icon: '🧅' },
    { text: 'आलू', category: 'Vegetables', icon: '🥔' },
    { text: 'potato', category: 'Vegetables', icon: '🥔' }
  ];

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query.trim();
    if (finalQuery) {
      // Add to search history
      const newHistory = [finalQuery, ...searchHistory.filter(h => h !== finalQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      onSearch(finalQuery);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="sticky top-16 bg-white dark:bg-gray-900 shadow-md p-4 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto">
        {/* Main Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full pl-12 pr-24 py-4 bg-[#F5F5F5] dark:bg-gray-800 border-2 border-transparent focus:border-[#FF851B] focus:bg-white dark:focus:bg-gray-700 rounded-xl text-lg transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white"
            aria-label="Search products"
          />
          
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </div>
          
          {/* Clear Button */}
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          
          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF851B] hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            aria-label="Search"
          >
            {loading ? '⏳' : 'Search'}
          </button>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (query.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
              {/* Search History */}
              {searchHistory.length > 0 && query.length === 0 && (
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recent searches:</p>
                  {searchHistory.map((historyItem, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(historyItem)}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      🕒 {historyItem}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Filtered Suggestions */}
              {suggestions
                .filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
                .map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion.text)}
                    className="flex items-center w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-xl mr-3">{suggestion.icon}</span>
                    <div>
                      <div className="text-gray-800 dark:text-white font-medium">{suggestion.text}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{suggestion.category}</div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-4 mt-4 justify-center items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            {[
              { value: 'relevance', label: 'Relevance' },
              { value: 'price_low', label: 'Price: Low to High' },
              { value: 'price_high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Rating' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange({ sortBy: option.value as any })}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  filters.sortBy === option.value
                    ? 'bg-[#FF851B] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-[#FF851B] hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Popular:</span>
          {suggestions.slice(0, 6).map((suggestion) => (
            <button
              key={suggestion.text}
              onClick={() => handleSearch(suggestion.text)}
              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-[#FF851B] hover:text-white text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm transition-all duration-200 hover:scale-105"
            >
              <span>{suggestion.icon}</span>
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}