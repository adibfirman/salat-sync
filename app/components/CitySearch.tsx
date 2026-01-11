import { useState, useCallback, useRef, useEffect } from "react";
import {
  searchCities,
  getTimezone,
  getCalculationMethod,
  type GeocodingResult,
} from "~/services/geocoding";
import type { City } from "~/types";

interface CitySearchProps {
  onSelectCity: (city: City) => void;
  initialValue?: string;
}

export default function CitySearch({ onSelectCity, initialValue = '' }: CitySearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchCities(searchQuery);
      setResults(searchResults);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce the search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleSelectResult = (result: GeocodingResult) => {
    setShowResults(false);
    setQuery(`${result.name}, ${result.country}`);

    // Get timezone for the selected location (now synchronous)
    const timezone = getTimezone(result.latitude, result.longitude, result.countryCode);
    const method = getCalculationMethod(result.countryCode);

    // Create slug from name
    const slug = `custom-${result.name.toLowerCase().replace(/\s+/g, '-')}-${result.latitude.toFixed(2)}-${result.longitude.toFixed(2)}`;

    const city: City = {
      slug,
      name: result.name,
      country: result.country,
      countryCode: result.countryCode,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone,
      method,
    };

    onSelectCity(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for any city worldwide..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={`${result.latitude}-${result.longitude}`}
              onClick={() => handleSelectResult(result)}
              className={`w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 
                         border-b border-gray-100 dark:border-gray-700 last:border-0
                         ${index === selectedIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {result.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {result.displayName}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center text-gray-500 dark:text-gray-400">
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
}
