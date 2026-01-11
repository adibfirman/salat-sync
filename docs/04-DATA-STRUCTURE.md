# Data Structure

## Overview

All data is stored as JSON files in the repository. No database needed.

---

## Cities Configuration

```json
// data/cities.json
{
  "cities": [
    {
      "slug": "jakarta",
      "name": "Jakarta",
      "country": "Indonesia",
      "countryCode": "ID",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "timezone": "Asia/Jakarta",
      "method": 11
    },
    {
      "slug": "kuala-lumpur",
      "name": "Kuala Lumpur",
      "country": "Malaysia",
      "countryCode": "MY",
      "latitude": 3.139,
      "longitude": 101.6869,
      "timezone": "Asia/Kuala_Lumpur",
      "method": 3
    },
    {
      "slug": "new-york",
      "name": "New York",
      "country": "United States",
      "countryCode": "US",
      "latitude": 40.7128,
      "longitude": -74.006,
      "timezone": "America/New_York",
      "method": 2
    }
  ]
}
```

### City Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-friendly identifier |
| `name` | string | Display name |
| `country` | string | Country name |
| `countryCode` | string | ISO 3166-1 alpha-2 |
| `latitude` | number | Location latitude |
| `longitude` | number | Location longitude |
| `timezone` | string | IANA timezone |
| `method` | number | Aladhan calculation method ID |

---

## Calculation Methods Reference

| ID | Method Name |
|----|-------------|
| 1 | University of Islamic Sciences, Karachi |
| 2 | Islamic Society of North America (ISNA) |
| 3 | Muslim World League (MWL) |
| 4 | Umm Al-Qura University, Makkah |
| 5 | Egyptian General Authority of Survey |
| 7 | Institute of Geophysics, University of Tehran |
| 8 | Gulf Region |
| 9 | Kuwait |
| 10 | Qatar |
| 11 | Majlis Ugama Islam Singapura |
| 12 | Union Organization Islamic de France |
| 13 | Diyanet Isleri Baskanligi, Turkey |
| 14 | Spiritual Administration of Muslims of Russia |

---

## Generated ICS File Structure

```
public/calendars/
├── jakarta.ics
├── kuala-lumpur.ics
├── singapore.ics
├── dubai.ics
├── riyadh.ics
├── cairo.ics
├── istanbul.ics
├── london.ics
├── new-york.ics
└── los-angeles.ics
```

---

## ICS File Format

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salat-Sync//Prayer Times//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Prayer Times - Jakarta
X-WR-TIMEZONE:Asia/Jakarta
REFRESH-INTERVAL;VALUE=DURATION:PT12H

BEGIN:VTIMEZONE
TZID:Asia/Jakarta
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0700
TZOFFSETTO:+0700
END:STANDARD
END:VTIMEZONE

BEGIN:VEVENT
UID:fajr-20260111-jakarta@salat-sync.netlify.app
DTSTAMP:20260111T000000Z
DTSTART;TZID=Asia/Jakarta:20260111T043000
DTEND;TZID=Asia/Jakarta:20260111T050000
SUMMARY:Fajr
DESCRIPTION:Fajr prayer time for Jakarta
CATEGORIES:Prayer
END:VEVENT

BEGIN:VEVENT
UID:dhuhr-20260111-jakarta@salat-sync.netlify.app
DTSTAMP:20260111T000000Z
DTSTART;TZID=Asia/Jakarta:20260111T120000
DTEND;TZID=Asia/Jakarta:20260111T123000
SUMMARY:Dhuhr
DESCRIPTION:Dhuhr prayer time for Jakarta
CATEGORIES:Prayer
END:VEVENT

... (Asr, Maghrib, Isha)

... (repeat for each day, ~30 days ahead)

END:VCALENDAR
```

---

## ICS Key Properties

| Property | Value | Purpose |
|----------|-------|---------|
| `REFRESH-INTERVAL` | PT12H | Hint to refresh every 12 hours |
| `X-WR-CALNAME` | Prayer Times - {City} | Calendar display name |
| `UID` | {prayer}-{date}-{city}@domain | Unique event ID |
| `CATEGORIES` | Prayer | Event categorization |

---

## Cached Prayer Times (Optional)

For faster generation, cache Aladhan responses:

```json
// data/prayer-times/jakarta-2026-01.json
{
  "city": "jakarta",
  "month": "2026-01",
  "generated": "2026-01-01T00:00:00Z",
  "days": [
    {
      "date": "2026-01-11",
      "hijri": "11 Rajab 1447",
      "prayers": {
        "fajr": "04:30",
        "sunrise": "05:48",
        "dhuhr": "12:00",
        "asr": "15:21",
        "maghrib": "18:10",
        "isha": "19:22"
      }
    }
  ]
}
```

---

## TypeScript Types

```typescript
// src/types/index.ts

interface City {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  method: number;
}

interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface DayPrayers {
  date: string;        // YYYY-MM-DD
  hijri: string;       // Hijri date display
  prayers: PrayerTimes;
}

interface CityCalendarData {
  city: string;
  month: string;       // YYYY-MM
  generated: string;   // ISO timestamp
  days: DayPrayers[];
}
```

---

## Adding a New City

1. Add entry to `data/cities.json`
2. Run `npm run generate-calendars` locally to test
3. Commit and push
4. GitHub Action will generate ICS on next run
5. Netlify auto-deploys

```json
{
  "slug": "melbourne",
  "name": "Melbourne",
  "country": "Australia",
  "countryCode": "AU",
  "latitude": -37.8136,
  "longitude": 144.9631,
  "timezone": "Australia/Melbourne",
  "method": 3
}
```
