import React, { useState, useRef, useCallback } from 'react';
import { useQuerySuggestions } from '@/common/apis/services/search/queryStringSuggestion';
import { useDebounce } from 'react-use';
import classNames from '@/common/utils/classNames';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSuggestionSelect,
  placeholder = "جستجوی پزشک، تخصص، نام مرکز درمانی...",
  isLoading = false,
  className = "",
}) => {
  const [debouncedQuery, setDebouncedQuery] = useState<string>(value);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionContainerRef = useRef<HTMLDivElement>(null);

  // Debounce search query for suggestions
  useDebounce(() => {
    setDebouncedQuery(value);
  }, 300, [value]);

  // API hook for suggestions
  const suggestionsQuery = useQuerySuggestions(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length > 1 && showSuggestions }
  );

  const suggestions = suggestionsQuery.data?.entity?.topQuerySuggestions || [];

  // Handle input focus/blur
  const handleInputFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Delay hiding suggestions to allow click
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  }, [onSuggestionSelect]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
    }
  }, []);

  return (
    <div className={classNames("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          style={{ textAlign: 'right' }}
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionContainerRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[1001] max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-right hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50 transition-colors duration-150"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span className="text-gray-800">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && suggestionsQuery.isSuccess && suggestions.length === 0 && debouncedQuery.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[1001]">
          <div className="px-4 py-3 text-right text-gray-500 text-sm">
            پیشنهادی یافت نشد
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;