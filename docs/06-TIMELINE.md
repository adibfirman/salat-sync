# Implementation Timeline

## Overview

Simplified 2-week implementation plan for MVP.

---

## Week 1: Core Functionality

### Day 1-2: Project Setup

- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up project structure
- [ ] Create `data/cities.json` with initial cities
- [ ] Set up Netlify deployment

### Day 3-4: ICS Generation

- [ ] Install `ics` and `date-fns` packages
- [ ] Create `scripts/generate-ics.ts`
- [ ] Implement Aladhan API client
- [ ] Generate sample ICS file
- [ ] Test ICS import in calendar apps

### Day 5-7: GitHub Action

- [ ] Create workflow file
- [ ] Test manual trigger
- [ ] Verify auto-commit works
- [ ] Confirm Netlify receives updates
- [ ] Add error handling

---

## Week 2: Frontend & Polish

### Day 1-2: Landing Page

- [ ] Hero section with value proposition
- [ ] City selector component (dropdown/search)
- [ ] Display selected city's prayer times
- [ ] "Subscribe to Calendar" button

### Day 3-4: Subscribe Flow

- [ ] Generate webcal:// URL for selected city
- [ ] Instructions modal for different apps
- [ ] Copy URL button for manual import
- [ ] Test on various calendar apps

### Day 5-6: Polish

- [ ] Responsive design (mobile-first)
- [ ] Loading states
- [ ] Error handling UI
- [ ] Add more cities
- [ ] SEO (meta tags, OG image)

### Day 7: Launch

- [ ] Final testing
- [ ] Custom domain setup (optional)
- [ ] Announce / share

---

## Milestones

| Milestone | Description | Target |
|-----------|-------------|--------|
| **M1** | ICS generation working | Day 4 |
| **M2** | GitHub Action running daily | Day 7 |
| **M3** | Landing page complete | Day 10 |
| **M4** | MVP launched | Day 14 |

---

## Task Breakdown

### ICS Generation (Priority 1)

| Task | Effort | Dependency |
|------|--------|------------|
| Aladhan API client | 2 hrs | - |
| ICS event creation | 3 hrs | API client |
| File writing | 1 hr | Events |
| Timezone handling | 2 hrs | Events |
| Test with calendars | 2 hrs | Files |

### GitHub Action (Priority 2)

| Task | Effort | Dependency |
|------|--------|------------|
| Workflow YAML | 1 hr | - |
| Git commit logic | 1 hr | Generation |
| Cron schedule | 0.5 hr | Workflow |
| Error notifications | 0.5 hr | Workflow |

### Frontend (Priority 3)

| Task | Effort | Dependency |
|------|--------|------------|
| City selector | 3 hrs | cities.json |
| Prayer times display | 2 hrs | Selector |
| Subscribe button | 2 hrs | Selector |
| Instructions modal | 2 hrs | Button |
| Styling & responsive | 4 hrs | Components |

---

## Definition of Done (MVP)

- [ ] User can select a city
- [ ] User can see today's prayer times
- [ ] User can click subscribe button
- [ ] Calendar app opens with subscription prompt
- [ ] ICS files update daily automatically
- [ ] Works on mobile devices

---

## Post-MVP Roadmap

### Week 3-4
- Add 20+ more cities
- Location search autocomplete
- Hijri date display
- Dark mode

### Month 2
- PWA (installable app)
- Custom location input (lat/long)
- Calculation method override
- Multiple language support

### Month 3+
- Ramadan special mode
- Yearly PDF download
- API for developers
- Community city requests
