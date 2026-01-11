# Salat-Sync Documentation

Automatic prayer time calendar sync - subscribe once, updated daily.

---

## Quick Links

| Document | Description |
|----------|-------------|
| [01-OVERVIEW.md](./01-OVERVIEW.md) | Architecture, how it works, user flow |
| [02-FEATURES.md](./02-FEATURES.md) | Features by phase, ICS format, supported cities |
| [03-TECH-STACK.md](./03-TECH-STACK.md) | Vite + React, project structure, Netlify config |
| [04-DATA-STRUCTURE.md](./04-DATA-STRUCTURE.md) | JSON configs, ICS file format, TypeScript types |
| [05-GITHUB-ACTIONS.md](./05-GITHUB-ACTIONS.md) | Workflow, generation script, automation |
| [06-TIMELINE.md](./06-TIMELINE.md) | 2-week implementation plan |
| [07-RESOURCES.md](./07-RESOURCES.md) | APIs, libraries, troubleshooting |

---

## Project Summary

**Salat-Sync** generates ICS calendar files for prayer times that users can subscribe to from any calendar app.

### How It Works

```
GitHub Action (daily) → Fetch prayer times → Generate ICS files → Commit to repo
                                                      ↓
User selects city → Clicks "Subscribe" → Calendar app subscribes to ICS URL
                                                      ↓
                                         Calendar auto-updates!
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Automation | GitHub Actions (daily cron) |
| Prayer API | Aladhan (free) |
| Hosting | Netlify (free) |
| Data | JSON files + ICS files |

---

## Key Features

- **No account needed** - Just click subscribe
- **Works with any calendar** - Google, Apple, Outlook, etc.
- **Auto-updates daily** - Via GitHub Actions
- **Completely free** - No server costs
- **Privacy friendly** - No user data collected

---

## Timeline

| Week | Focus |
|------|-------|
| 1 | ICS generation + GitHub Action |
| 2 | Frontend + Launch |

---

## Getting Started

1. Read [03-TECH-STACK.md](./03-TECH-STACK.md) for project structure
2. Check [06-TIMELINE.md](./06-TIMELINE.md) for implementation tasks
3. Reference [05-GITHUB-ACTIONS.md](./05-GITHUB-ACTIONS.md) for automation setup
