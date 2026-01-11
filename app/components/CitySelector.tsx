import { useState, useEffect } from "react";
import type { City } from "~/types";

interface CitySelectorProps {
  selectedCity: City | null
  onSelectCity: (city: City) => void
}

export default function CitySelector({ selectedCity, onSelectCity }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([])

  useEffect(() => {
    // Load cities from JSON
    fetch('/data/cities.json')
      .then(res => res.json())
      .then(data => setCities(data.cities))
      .catch(err => console.error('Failed to load cities:', err))
  }, [])

  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value
    if (slug) {
      const city = cities.find(c => c.slug === slug)
      if (city) {
        onSelectCity(city)
      }
    }
  }

  // Get the selected slug for the dropdown
  const selectedSlug = selectedCity?.slug || ''

  return (
    <select
      value={selectedSlug}
      onChange={handleSelectCity}
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
  )
}
