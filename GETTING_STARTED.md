# Getting Started with Salat-Sync

## Project Status: ✅ Ready to Deploy

The MVP is complete and ready for deployment!

---

## What's Been Built

### ✅ Completed

1. **Frontend (Vite + React + TypeScript)**
   - Landing page with hero section
   - City selector dropdown
   - Prayer times preview (live from Aladhan API)
   - Subscribe button with instructions modal
   - Responsive design with Tailwind CSS

2. **ICS Generation**
   - Script to generate calendar files for 10 cities
   - 30 days of prayer times per city
   - 150 events per calendar (5 prayers × 30 days)
   - Proper ICS format with timezones

3. **Automation**
   - GitHub Action workflow (daily cron at midnight UTC)
   - Automatic commit and push of updated calendars
   - Manual trigger support

4. **Configuration**
   - Netlify deployment config
   - 10 cities pre-configured
   - Proper CORS and content-type headers

---

## Next Steps

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Salat-Sync MVP"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Create repository named `salat-sync`
3. Don't initialize with README (we already have one)
4. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/salat-sync.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Netlify

**Option A: Connect via Netlify Dashboard**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select `salat-sync` repo
4. Build settings are auto-detected from `netlify.toml`
5. Click "Deploy"

**Option B: Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 4. Test the Deployment

1. Visit your Netlify URL (e.g., `https://salat-sync.netlify.app`)
2. Select a city
3. Click "Subscribe to Calendar"
4. Test in Google Calendar or Apple Calendar

### 5. Verify GitHub Action

The workflow will run:
- Daily at midnight UTC
- When you push changes to `data/cities.json`
- Manually from the Actions tab

**To test manually:**
1. Go to your GitHub repo
2. Click "Actions" tab
3. Select "Update Prayer Calendars"
4. Click "Run workflow"

---

## Local Development

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

### Generate Calendars Locally

```bash
npm run generate-calendars
```

Check `public/calendars/` for generated ICS files.

### Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Project Structure

```
salat-sync/
├── src/                      # React app
│   ├── components/
│   │   ├── CitySelector.tsx
│   │   ├── PrayerTimes.tsx
│   │   └── SubscribeButton.tsx
│   ├── types/index.ts
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── generate-ics.ts       # ICS generation script
├── data/
│   └── cities.json           # City configurations
├── public/
│   └── calendars/            # Generated ICS files
│       ├── jakarta.ics
│       ├── new-york.ics
│       └── ...
├── .github/workflows/
│   └── update-calendars.yml  # Daily automation
├── docs/                     # Documentation
└── netlify.toml              # Deployment config
```

---

## Adding More Cities

1. Edit `data/cities.json`:

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

2. Test locally:

```bash
npm run generate-calendars
```

3. Commit and push:

```bash
git add data/cities.json
git commit -m "Add Melbourne"
git push
```

GitHub Action will automatically generate the new calendar!

---

## Troubleshooting

### "Can't find cities.json in browser"

The file needs to be in `public/data/`:

```bash
mkdir -p public/data
cp data/cities.json public/data/
```

Update `vite.config.ts` if needed.

### "Calendar not updating in app"

- Google Calendar: Can take up to 24 hours
- Try removing and re-subscribing
- Or use manual refresh in calendar settings

### GitHub Action failing

- Check Actions tab for error logs
- Verify API is responding
- Check rate limiting (add more delay between requests)

---

## What's Next?

### Phase 2 Enhancements

- [ ] Add 20+ more cities
- [ ] Location search with autocomplete
- [ ] Dark mode toggle
- [ ] PWA (Progressive Web App) support
- [ ] Custom calculation method selection
- [ ] Hijri date in event descriptions

### Phase 3 Advanced

- [ ] Custom location (lat/long input)
- [ ] Ramadan mode
- [ ] Multiple languages (i18n)
- [ ] Analytics
- [ ] API for developers

---

## Support

- **Documentation**: See `docs/` folder
- **Issues**: GitHub Issues
- **Aladhan API**: https://aladhan.com/prayer-times-api

---

## Success Checklist

- [x] Project initialized
- [x] Dependencies installed
- [x] ICS generation working
- [x] Frontend built
- [x] GitHub Action configured
- [x] Netlify config ready
- [ ] Git repository created
- [ ] Pushed to GitHub
- [ ] Deployed to Netlify
- [ ] Tested calendar subscription

---

**You're ready to deploy! 🚀**
