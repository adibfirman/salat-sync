import { useState } from 'react'
import CitySelector from './components/CitySelector'
import SubscribeButton from './components/SubscribeButton'
import PrayerTimes from './components/PrayerTimes'

function App() {
  const [selectedCity, setSelectedCity] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🕌 Salat Sync
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            Prayer Times in Your Calendar
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Subscribe once, automatically updated daily
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Your City
              </label>
              <CitySelector onSelectCity={setSelectedCity} />
            </div>

            {/* Prayer Times Preview */}
            {selectedCity && (
              <PrayerTimes citySlug={selectedCity} />
            )}

            {/* Subscribe Button */}
            {selectedCity && (
              <SubscribeButton citySlug={selectedCity} />
            )}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Works Everywhere
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Google Calendar, Apple, Outlook, and more
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Auto-Updates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Daily updates without any action needed
            </p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Privacy First
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No account, no tracking, completely free
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
