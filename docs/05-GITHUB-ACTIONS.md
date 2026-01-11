# GitHub Actions

## Overview

GitHub Actions handles the daily automation:
1. Fetch prayer times from Aladhan API
2. Generate ICS files for all cities
3. Commit and push changes
4. Netlify auto-deploys

---

## Workflow File

```yaml
# .github/workflows/update-calendars.yml

name: Update Prayer Calendars

on:
  # Run daily at 00:00 UTC
  schedule:
    - cron: '0 0 * * *'
  
  # Allow manual trigger from GitHub UI
  workflow_dispatch:
  
  # Also run when cities.json changes
  push:
    paths:
      - 'data/cities.json'

jobs:
  update-calendars:
    runs-on: ubuntu-latest
    
    permissions:
      contents: write
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate ICS calendars
        run: npm run generate-calendars
      
      - name: Check for changes
        id: changes
        run: |
          git diff --quiet public/calendars/ || echo "changed=true" >> $GITHUB_OUTPUT
      
      - name: Commit and push
        if: steps.changes.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add public/calendars/
          git commit -m "chore: update prayer calendars [$(date -u +%Y-%m-%d)]"
          git push
```

---

## Workflow Triggers

| Trigger | When | Purpose |
|---------|------|---------|
| `schedule` | Daily 00:00 UTC | Regular updates |
| `workflow_dispatch` | Manual | Testing, force update |
| `push` (cities.json) | Config change | Add new cities |

---

## npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "generate-calendars": "tsx scripts/generate-ics.ts",
    "preview": "vite preview"
  }
}
```

---

## Generation Script

```typescript
// scripts/generate-ics.ts

import { writeFileSync, mkdirSync } from 'fs';
import { createEvents, EventAttributes } from 'ics';
import { format, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import cities from '../data/cities.json';

const DAYS_AHEAD = 30;
const OUTPUT_DIR = 'public/calendars';

interface City {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  method: number;
}

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

async function fetchPrayerTimes(
  city: City, 
  date: Date
): Promise<PrayerTimes> {
  const dateStr = format(date, 'dd-MM-yyyy');
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.data.timings;
}

function parseTime(
  timeStr: string, 
  date: Date, 
  timezone: string
): [number, number, number, number, number] {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return [year, month, day, hours, minutes];
}

async function generateCityCalendar(city: City): Promise<void> {
  console.log(`Generating calendar for ${city.name}...`);
  
  const events: EventAttributes[] = [];
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
  
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const date = addDays(new Date(), i);
    const times = await fetchPrayerTimes(city, date);
    
    for (const prayer of prayers) {
      const timeStr = times[prayer];
      const start = parseTime(timeStr, date, city.timezone);
      
      events.push({
        title: prayer,
        start,
        duration: { minutes: 30 },
        uid: `${prayer.toLowerCase()}-${format(date, 'yyyyMMdd')}-${city.slug}@salat-sync.netlify.app`,
        description: `${prayer} prayer time for ${city.name}`,
        categories: ['Prayer'],
        calName: `Prayer Times - ${city.name}`,
      });
    }
    
    // Rate limiting: wait between API calls
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  const { value, error } = createEvents(events);
  
  if (error) {
    console.error(`Error generating ${city.slug}:`, error);
    return;
  }
  
  writeFileSync(`${OUTPUT_DIR}/${city.slug}.ics`, value!);
  console.log(`Generated ${city.slug}.ics with ${events.length} events`);
}

async function main() {
  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // Generate calendar for each city
  for (const city of cities.cities) {
    await generateCityCalendar(city as City);
  }
  
  console.log('Done!');
}

main().catch(console.error);
```

---

## Rate Limiting

Aladhan API is free but be respectful:

| Constraint | Value |
|------------|-------|
| Delay between requests | 200ms |
| Days to fetch | 30 |
| Requests per city | 30 |
| Total cities (MVP) | 10 |
| Total requests per run | ~300 |
| Estimated run time | ~1 minute |

---

## Error Handling

```typescript
async function fetchWithRetry(
  url: string, 
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error(`Failed after ${retries} retries`);
}
```

---

## Monitoring

Check workflow runs at:
```
https://github.com/{username}/salat-sync/actions
```

**Failed runs**: GitHub sends email notifications by default.

---

## Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Update Prayer Calendars**
3. Click **Run workflow**
4. Select branch and confirm

Useful for:
- Testing after changes
- Force update after adding cities
- Debugging issues
