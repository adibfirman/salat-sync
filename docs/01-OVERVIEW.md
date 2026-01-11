# Overview

## What is Salat-Sync?

A static web application that generates ICS calendar files for prayer times. Users can subscribe to these calendars from any calendar app (Google Calendar, Apple Calendar, Outlook, etc.) and receive automatic daily updates.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Aladhan API    │     │  GitHub Action  │     │  ICS Files      │
│  (prayer times) │────>│  (daily cron)   │────>│  (in repo)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        v
                                                ┌─────────────────┐
                                                │  Netlify        │
                                                │  (static host)  │
                                                └─────────────────┘
                                                        │
                                                        v
┌─────────────────┐                             ┌─────────────────┐
│  Vite + React   │                             │  User subscribes│
│  Landing Page   │────────────────────────────>│  via webcal://  │
└─────────────────┘                             └─────────────────┘
                                                        │
                                                        v
                                                ┌─────────────────┐
                                                │  Any Calendar   │
                                                │  App syncs      │
                                                └─────────────────┘
```

---

## How It Works

1. **GitHub Action** runs daily (cron)
2. Fetches prayer times from **Aladhan API** for each supported city
3. Generates/updates **ICS files** in the repository
4. Commits and pushes changes
5. **Netlify** auto-deploys the updated site
6. User's calendar app fetches the updated ICS file

---

## Goals

1. Provide accurate prayer times via subscribable calendar
2. Support multiple cities/locations
3. Zero maintenance for users after subscribing
4. Works with any calendar app (Google, Apple, Outlook, etc.)
5. Completely free and open source

---

## User Flow

```
1. User visits salat-sync.netlify.app
2. User selects their city/location
3. User clicks "Subscribe to Calendar"
4. Browser/calendar app opens with webcal:// link
5. User confirms subscription
6. Done! Calendar updates automatically
```

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **No account needed** | Just click and subscribe |
| **Works everywhere** | Any calendar app that supports ICS |
| **Auto-updates** | Calendar refreshes automatically |
| **Free forever** | No server costs, all static |
| **Privacy friendly** | No user data stored |

---

## Supported Calendar Apps

| App | Platform | Method |
|-----|----------|--------|
| Google Calendar | Web/Mobile | webcal:// or URL import |
| Apple Calendar | macOS/iOS | webcal:// native |
| Microsoft Outlook | Web/Desktop | URL subscription |
| Thunderbird | Desktop | ICS subscription |
| Samsung Calendar | Android | ICS import |
| Any ICS-compatible | - | Direct URL |
