import { useState } from 'react'
import type { City } from '../types'

interface SubscribeButtonProps {
  city: City
}

export default function SubscribeButton({ city }: SubscribeButtonProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  const isCustomCity = city.slug.startsWith('custom-')
  const baseUrl = window.location.origin

  // For pre-configured cities, use the static ICS file
  // For custom cities, generate a dynamic URL with parameters
  const icsUrl = isCustomCity
    ? `${baseUrl}/api/calendar?lat=${city.latitude}&lng=${city.longitude}&method=${city.method}&tz=${encodeURIComponent(city.timezone)}&name=${encodeURIComponent(city.name)}`
    : `${baseUrl}/calendars/${city.slug}.ics`

  const webcalUrl = icsUrl.replace('https://', 'webcal://').replace('http://', 'webcal://')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(icsUrl)
    alert('Calendar URL copied to clipboard!')
  }

  return (
    <div className="space-y-4">
      {/* Custom City Notice */}
      {isCustomCity && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm">
          <p className="text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Custom city calendars are generated on-demand. 
            The subscribe feature requires the dynamic calendar API to be set up.
            For now, you can view prayer times above.
          </p>
        </div>
      )}

      {/* Main Subscribe Button */}
      <a
        href={webcalUrl}
        className={`block w-full font-semibold py-4 px-6 rounded-lg text-center transition-colors shadow-lg
          ${isCustomCity 
            ? 'bg-gray-400 cursor-not-allowed text-white' 
            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        onClick={(e) => isCustomCity && e.preventDefault()}
      >
        📅 Subscribe to Calendar
      </a>

      {/* Instructions Toggle */}
      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        {showInstructions ? '▼' : '▶'} How to subscribe
      </button>

      {/* Instructions */}
      {showInstructions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              📱 Google Calendar (Mobile)
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Click "Subscribe to Calendar" button above</li>
              <li>Your calendar app will open automatically</li>
              <li>Confirm the subscription</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              💻 Google Calendar (Web)
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Go to Google Calendar settings</li>
              <li>Click "Add calendar" → "From URL"</li>
              <li>Paste this URL:</li>
            </ol>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={icsUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                           rounded text-xs font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              🍎 Apple Calendar
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              Click "Subscribe to Calendar" button - it opens automatically in Calendar app.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              📧 Outlook
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Go to Outlook Calendar</li>
              <li>Add calendar → Subscribe from web</li>
              <li>Paste the URL above</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
