import { useState } from 'react'

interface SubscribeButtonProps {
  citySlug: string
}

export default function SubscribeButton({ citySlug }: SubscribeButtonProps) {
  const [showInstructions, setShowInstructions] = useState(false)
  
  const baseUrl = window.location.origin
  const icsUrl = `${baseUrl}/calendars/${citySlug}.ics`
  const webcalUrl = icsUrl.replace('https://', 'webcal://').replace('http://', 'webcal://')

  const copyToClipboard = () => {
    navigator.clipboard.writeText(icsUrl)
    alert('Calendar URL copied to clipboard!')
  }

  return (
    <div className="space-y-4">
      {/* Main Subscribe Button */}
      <a
        href={webcalUrl}
        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold 
                   py-4 px-6 rounded-lg text-center transition-colors shadow-lg"
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
