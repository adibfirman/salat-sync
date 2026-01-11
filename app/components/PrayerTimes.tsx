import { useState, useEffect } from "react";
import { format } from "date-fns";
import type { City, PrayerTimes as PrayerTimesType } from "~/types";

interface PrayerTimesProps {
  city: City
}

export default function PrayerTimes({ city }: PrayerTimesProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!city) return

    setLoading(true)
    setPrayerTimes(null)

    // Fetch today's prayer times from Aladhan API
    const dateStr = format(new Date(), 'dd-MM-yyyy')
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`

    fetch(url)
      .then(response => response.json())
      .then(data => setPrayerTimes(data.data.timings))
      .catch(err => console.error('Failed to load prayer times:', err))
      .finally(() => setLoading(false))
  }, [city])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading prayer times...</p>
      </div>
    )
  }

  if (!prayerTimes) return null

  const prayers = [
    { name: 'Fajr', time: prayerTimes.Fajr, icon: '🌅' },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr, icon: '☀️' },
    { name: 'Asr', time: prayerTimes.Asr, icon: '🌤️' },
    { name: 'Maghrib', time: prayerTimes.Maghrib, icon: '🌆' },
    { name: 'Isha', time: prayerTimes.Isha, icon: '🌙' },
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Prayer Times for {city.name}, {city.country}
      </h3>
      <div className="space-y-2">
        {prayers.map(prayer => (
          <div 
            key={prayer.name} 
            className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-0"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {prayer.icon} {prayer.name}
            </span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Times for {format(new Date(), 'MMMM d, yyyy')}
      </p>
    </div>
  )
}
