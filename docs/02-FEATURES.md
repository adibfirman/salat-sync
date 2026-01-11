# Features

## Phase 1: MVP

### Landing Page
- [ ] Hero section explaining the service
- [ ] City/location selector (dropdown or search)
- [ ] "Subscribe to Calendar" button
- [ ] Instructions for different calendar apps
- [ ] List of supported cities

### ICS Generation
- [ ] GitHub Action to fetch prayer times daily
- [ ] Generate ICS files for each supported city
- [ ] Include all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
- [ ] Proper timezone handling
- [ ] Commit and push updated files

### Calendar Events
- [ ] Prayer name as event title
- [ ] Correct start time based on location
- [ ] 30-minute default duration
- [ ] Optional: Hijri date in description

---

## Phase 2: Enhancements

- [ ] More cities/locations support
- [ ] Calculation method selection per city
- [ ] Custom reminder settings (via ICS VALARM)
- [ ] Hijri calendar display on website
- [ ] Dark mode for website
- [ ] PWA support (installable)
- [ ] Multiple languages (i18n)

---

## Phase 3: Advanced

- [ ] Custom location (lat/long input)
- [ ] Generate personalized ICS on-demand (edge function)
- [ ] Jummah prayer special handling (Fridays)
- [ ] Ramadan mode (Suhoor/Iftar times)
- [ ] Yearly calendar download (PDF)

---

## ICS Event Format

Each prayer event in the ICS file:

```ics
BEGIN:VEVENT
DTSTART;TZID=Asia/Jakarta:20260111T043000
DTEND;TZID=Asia/Jakarta:20260111T050000
SUMMARY:Fajr Prayer
DESCRIPTION:Fajr prayer time for Jakarta\nHijri: 11 Rajab 1447
UID:fajr-2026-01-11-jakarta@salat-sync
END:VEVENT
```

| Field | Example | Description |
|-------|---------|-------------|
| DTSTART | 20260111T043000 | Prayer start time |
| DTEND | 20260111T050000 | Event end (start + duration) |
| SUMMARY | Fajr Prayer | Event title |
| DESCRIPTION | Prayer details | Optional info |
| UID | unique-id | Prevents duplicates |

---

## Supported Cities (MVP)

Start with major cities, expand later:

| City | Country | Timezone | Method |
|------|---------|----------|--------|
| Jakarta | Indonesia | Asia/Jakarta | Singapore |
| Kuala Lumpur | Malaysia | Asia/Kuala_Lumpur | JAKIM |
| Singapore | Singapore | Asia/Singapore | Singapore |
| Dubai | UAE | Asia/Dubai | Makkah |
| Riyadh | Saudi Arabia | Asia/Riyadh | Makkah |
| Cairo | Egypt | Africa/Cairo | Egypt |
| Istanbul | Turkey | Europe/Istanbul | Turkey |
| London | UK | Europe/London | MWL |
| New York | USA | America/New_York | ISNA |
| Los Angeles | USA | America/Los_Angeles | ISNA |

---

## Calculation Methods

| Code | Name | Used In |
|------|------|---------|
| MWL | Muslim World League | Europe, Far East |
| ISNA | Islamic Society of North America | North America |
| Egypt | Egyptian General Authority | Africa, Middle East |
| Makkah | Umm Al-Qura | Arabian Peninsula |
| Karachi | University of Islamic Sciences | Pakistan |
| Tehran | Institute of Geophysics | Iran |
| Singapore | MUIS | Southeast Asia |
| Turkey | Diyanet | Turkey |
| JAKIM | Jabatan Kemajuan Islam Malaysia | Malaysia |
