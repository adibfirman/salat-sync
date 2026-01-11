# Tech Stack

## Technologies

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Vite + React | Static landing page |
| **Styling** | Tailwind CSS | Rapid UI development |
| **ICS Generation** | Node.js script | Generate calendar files |
| **Automation** | GitHub Actions | Daily cron job |
| **Prayer Times** | Aladhan API | Fetch accurate times |
| **Hosting** | Netlify | Static site hosting |
| **Data Storage** | JSON files in repo | City configs, cached times |

---

## Project Structure

```
salat-sync/
├── src/                          # React application
│   ├── components/
│   │   ├── CitySelector.tsx      # City dropdown/search
│   │   ├── SubscribeButton.tsx   # Subscribe CTA
│   │   ├── Instructions.tsx      # How-to for each app
│   │   └── PrayerTimes.tsx       # Display today's times
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/                      # Build scripts
│   ├── generate-ics.ts           # ICS generation script
│   └── fetch-prayer-times.ts     # Aladhan API client
├── data/
│   ├── cities.json               # Supported cities config
│   └── prayer-times/             # Cached prayer times (optional)
│       └── jakarta.json
├── public/
│   └── calendars/                # Generated ICS files
│       ├── jakarta.ics
│       ├── kuala-lumpur.ics
│       └── ...
├── .github/
│   └── workflows/
│       └── update-calendars.yml  # Daily cron workflow
├── docs/                         # Documentation
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── netlify.toml                  # Netlify configuration
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "ics": "^3.x",
    "date-fns": "^3.x",
    "date-fns-tz": "^2.x"
  }
}
```

---

## ICS Generation Script

```typescript
// scripts/generate-ics.ts (simplified)
import { createEvents } from 'ics';
import { format } from 'date-fns';

async function generateCalendar(city: City) {
  // Fetch prayer times for next 30 days
  const prayerTimes = await fetchPrayerTimes(city);
  
  // Convert to ICS events
  const events = prayerTimes.flatMap(day => 
    day.prayers.map(prayer => ({
      title: `${prayer.name} Prayer`,
      start: parseTime(prayer.time, day.date),
      duration: { minutes: 30 },
      // ...
    }))
  );
  
  // Write ICS file
  const { value } = createEvents(events);
  writeFile(`public/calendars/${city.slug}.ics`, value);
}
```

---

## GitHub Action Workflow

```yaml
# .github/workflows/update-calendars.yml
name: Update Prayer Calendars

on:
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight UTC
  workflow_dispatch:      # Allow manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - run: npm ci
      
      - run: npm run generate-calendars
      
      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add public/calendars/
          git diff --staged --quiet || git commit -m "Update prayer calendars"
          git push
```

---

## Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/calendars/*"
  [headers.values]
    Content-Type = "text/calendar; charset=utf-8"
    Access-Control-Allow-Origin = "*"
    Cache-Control = "public, max-age=3600"
```

---

## Calendar URL Format

```
https://salat-sync.netlify.app/calendars/{city-slug}.ics
```

**Subscribe URL (webcal):**
```
webcal://salat-sync.netlify.app/calendars/{city-slug}.ics
```

**Examples:**
- Jakarta: `webcal://salat-sync.netlify.app/calendars/jakarta.ics`
- New York: `webcal://salat-sync.netlify.app/calendars/new-york.ics`

---

## Why This Stack?

| Choice | Reason |
|--------|--------|
| **Vite** | Fast dev server, optimized builds |
| **React** | Component-based UI, wide ecosystem |
| **Tailwind** | Rapid styling, small bundle |
| **GitHub Actions** | Free CI/CD, cron support |
| **Netlify** | Free hosting, auto-deploy from git |
| **ICS files** | Universal calendar format |

---

## No Backend Needed

This architecture eliminates:
- Server costs
- Database management
- User authentication
- OAuth token handling
- API rate limiting concerns

Everything is static and cacheable!
