import { useState, useCallback, useRef, useEffect } from "react";
import type { City } from "~/types";

interface CitySearchProps {
  cities: City[];
  onSelectCity: (city: City) => void;
  initialValue?: string;
}

export default function CitySearch({ cities, onSelectCity, initialValue = '' }: CitySearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<City[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Filter cities from the pre-configured list
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = cities.filter(city => 
      city.name.toLowerCase().includes(lowerQuery) ||
      city.country.toLowerCase().includes(lowerQuery) ||
      city.countryCode.toLowerCase().includes(lowerQuery)
    );
    
    setResults(filtered);
    setShowResults(true);
    setSelectedIndex(-1);
  }, [cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSelectResult = (city: City) => {
    setShowResults(false);
    setQuery(`${city.name}, ${city.country}`);
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
          placeholder="Search from available cities..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
          {results.map((city, index) => (
            <button
              key={city.slug}
              onClick={() => handleSelectResult(city)}
              className={`w-full px-4 py-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 
                         border-b border-gray-100 dark:border-gray-700 last:border-0
                         ${index === selectedIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {city.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {city.country}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 text-center text-gray-500 dark:text-gray-400">
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
}
