# 🕌 Salat Sync

Automatically sync daily prayer times to your calendar. Subscribe once, updated daily.

## Features

- 📅 **Works Everywhere** - Google Calendar, Apple Calendar, Outlook, and more
- 🔄 **Auto-Updates** - Daily updates via GitHub Actions
- 🔒 **Privacy First** - No account needed, no tracking
- 🌍 **Multiple Cities** - 10+ cities supported (more coming!)
- 💯 **Free Forever** - Completely free and open source

## Quick Start

### For Users

1. Visit the website
2. Select your city
3. Click "Subscribe to Calendar"
4. Confirm in your calendar app

That's it! Your calendar will automatically update daily.

### For Developers

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate ICS files
npm run generate-calendars

# Build for production
npm run build
```

## Project Structure

```
salat-sync/
├── src/                  # React application
│   ├── components/       # UI components
│   ├── types/           # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── scripts/             # Build scripts
│   └── generate-ics.ts  # ICS generation
├── data/
│   └── cities.json      # Supported cities
├── public/
│   └── calendars/       # Generated ICS files
├── docs/                # Documentation
└── .github/workflows/   # GitHub Actions
```

## How It Works

1. **GitHub Action** runs daily at midnight UTC
2. Fetches prayer times from [Aladhan API](https://aladhan.com)
3. Generates ICS calendar files for each city
4. Commits changes to repository
5. Netlify auto-deploys updated site
6. User calendars sync automatically

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Automation**: GitHub Actions
- **Prayer API**: Aladhan API
- **Hosting**: Netlify
- **Calendar Format**: ICS (RFC 5545)

## Adding a New City

1. Add entry to `data/cities.json`:

```json
{
  "slug": "city-name",
  "name": "City Name",
  "country": "Country",
  "countryCode": "XX",
  "latitude": 0.0000,
  "longitude": 0.0000,
  "timezone": "Continent/City",
  "method": 2
}
```

2. Run `npm run generate-calendars` to test
3. Submit a pull request

## Supported Cities

- Jakarta, Indonesia
- Kuala Lumpur, Malaysia
- Singapore
- Dubai, UAE
- Riyadh, Saudi Arabia
- Cairo, Egypt
- Istanbul, Turkey
- London, UK
- New York, USA
- Los Angeles, USA

[View all cities](./data/cities.json)

## Documentation

- [Overview](./docs/01-OVERVIEW.md) - Architecture and how it works
- [Features](./docs/02-FEATURES.md) - Feature list and roadmap
- [Tech Stack](./docs/03-TECH-STACK.md) - Technologies used
- [Data Structure](./docs/04-DATA-STRUCTURE.md) - JSON and ICS formats
- [GitHub Actions](./docs/05-GITHUB-ACTIONS.md) - Automation setup
- [Timeline](./docs/06-TIMELINE.md) - Development plan
- [Resources](./docs/07-RESOURCES.md) - APIs and references

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Prayer times from [Aladhan API](https://aladhan.com)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)
- Hosted on [Netlify](https://netlify.com)
