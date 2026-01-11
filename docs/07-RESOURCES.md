# Resources

## Cost Breakdown

### Completely Free!

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Netlify** | 100GB bandwidth/mo | More than enough |
| **GitHub Actions** | 2,000 mins/mo | ~1 min/day = 30 mins/mo |
| **Aladhan API** | Unlimited | Free, no API key |
| **Domain** | - | Optional, use netlify.app subdomain |

**Total cost: $0/month**

---

## External APIs

### Aladhan Prayer Times API

**Base URL:** `https://api.aladhan.com/v1`

**Endpoint:** `/timings/{date}`

| Parameter | Type | Description |
|-----------|------|-------------|
| date | string | DD-MM-YYYY format |
| latitude | float | Location latitude |
| longitude | float | Location longitude |
| method | int | Calculation method (1-15) |

**Example:**
```
https://api.aladhan.com/v1/timings/11-01-2026?latitude=-6.2088&longitude=106.8456&method=11
```

**Rate Limits:** No official limit, but be respectful (add delays).

---

## Libraries

| Library | Purpose | Install |
|---------|---------|---------|
| `ics` | Generate ICS files | `npm i ics` |
| `date-fns` | Date manipulation | `npm i date-fns` |
| `date-fns-tz` | Timezone handling | `npm i date-fns-tz` |
| `tsx` | Run TypeScript scripts | `npm i -D tsx` |

---

## Documentation Links

| Resource | URL |
|----------|-----|
| Vite | https://vitejs.dev |
| React | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| ics npm | https://www.npmjs.com/package/ics |
| Aladhan API | https://aladhan.com/prayer-times-api |
| GitHub Actions | https://docs.github.com/en/actions |
| Netlify | https://docs.netlify.com |
| ICS Format (RFC 5545) | https://icalendar.org/RFC-Specifications |

---

## Calendar App Guides

### Google Calendar
1. Click subscribe link (webcal://)
2. Or: Settings > Add calendar > From URL
3. Paste: `https://salat-sync.netlify.app/calendars/{city}.ics`

### Apple Calendar (macOS/iOS)
1. Click webcal:// link (opens automatically)
2. Or: File > New Calendar Subscription
3. Paste URL

### Outlook
1. Add calendar > Subscribe from web
2. Paste ICS URL
3. Set refresh interval

### Samsung Calendar
1. Menu > Add calendar > Add from URL
2. Paste ICS URL

---

## ICS Format Reference

### Required Properties

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salat-Sync//EN
METHOD:PUBLISH

BEGIN:VEVENT
UID:unique-id@domain
DTSTAMP:20260111T000000Z
DTSTART:20260111T043000
SUMMARY:Event Title
END:VEVENT

END:VCALENDAR
```

### Useful Properties

| Property | Example | Purpose |
|----------|---------|---------|
| `REFRESH-INTERVAL` | PT12H | Suggest refresh rate |
| `X-WR-CALNAME` | Calendar Name | Display name |
| `DESCRIPTION` | Details | Event description |
| `CATEGORIES` | Prayer | Categorization |
| `VALARM` | ... | Reminders |

---

## Similar Projects

| Project | Description | Link |
|---------|-------------|------|
| Muslim Pro | Mobile app | muslimpro.com |
| Athan | Prayer app | athan.com |
| IslamicFinder | Web times | islamicfinder.org |
| Pray Times | Open source | praytimes.org |

---

## Troubleshooting

### Calendar not updating

**Google Calendar:** 
- Refresh can take up to 24 hours
- Force: Remove and re-add subscription

**Apple Calendar:**
- Right-click calendar > Refresh

### Wrong prayer times

1. Check city coordinates in `cities.json`
2. Verify calculation method is appropriate
3. Check timezone setting

### GitHub Action failing

1. Check Actions tab for error logs
2. Verify API is responding
3. Check for rate limiting issues

---

## Glossary

| Term | Definition |
|------|------------|
| **ICS** | iCalendar format (.ics files) |
| **webcal://** | Calendar subscription protocol |
| **Fajr** | Dawn prayer |
| **Dhuhr** | Noon prayer |
| **Asr** | Afternoon prayer |
| **Maghrib** | Sunset prayer |
| **Isha** | Night prayer |
| **Hijri** | Islamic lunar calendar |

---

## Contributing

### Adding a New City

1. Find coordinates (Google Maps)
2. Determine appropriate calculation method
3. Add to `data/cities.json`:

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

4. Submit pull request

---

## Contact

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
