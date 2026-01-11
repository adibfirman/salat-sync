import { useState, useEffect } from "react";
import type { City } from "~/types";
import CitySearch from "~/components/CitySearch";

interface CitySelectorProps {
  selectedCity: City | null
  onSelectCity: (city: City) => void
}

export default function CitySelector({ selectedCity, onSelectCity }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([])
  const [activeTab, setActiveTab] = useState<'popular' | 'search'>('popular')

  useEffect(() => {
    // Load cities from JSON
    fetch('/data/cities.json')
      .then(res => res.json())
      .then(data => setCities(data.cities))
      .catch(err => console.error('Failed to load cities:', err))
  }, [])

  // Sync active tab based on selected city type
  useEffect(() => {
    if (selectedCity) {
      const isPopularCity = cities.some(c => c.slug === selectedCity.slug)
      setActiveTab(isPopularCity ? 'popular' : 'search')
    }
  }, [selectedCity, cities])

  const handleSelectPopular = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value
    if (slug) {
      const city = cities.find(c => c.slug === slug)
      if (city) {
        onSelectCity(city)
      }
    }
  }

  const handleSearchSelect = (city: City) => {
    onSelectCity(city)
  }

  // Get the selected slug for the dropdown
  const selectedSlug = selectedCity && !selectedCity.slug.startsWith('custom-') 
    ? selectedCity.slug 
    : ''

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
        <button
          onClick={() => setActiveTab('popular')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'popular' 
              ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Popular Cities
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${activeTab === 'search' 
              ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          Search Any City
        </button>
      </div>

      {/* Content */}
      {activeTab === 'popular' ? (
        <select
          value={selectedSlug}
          onChange={handleSelectPopular}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     cursor-pointer"
        >
          <option value="">Choose a city...</option>
          {cities.map(city => (
            <option key={city.slug} value={city.slug}>
              {city.name}, {city.country}
            </option>
          ))}
        </select>
      ) : (
        <CitySearch 
          onSelectCity={handleSearchSelect} 
          initialValue={selectedCity?.slug.startsWith('custom-') ? `${selectedCity.name}, ${selectedCity.country}` : ''}
        />
      )}
    </div>
  )
}
