# Quick Reference

## Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build
npm run generate-calendars     # Generate ICS files

# Deployment
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/salat-sync.git
git push -u origin main

# Then connect to Netlify via dashboard or:
netlify init
netlify deploy --prod
```

## File Locations

| What | Where |
|------|-------|
| React components | `src/components/` |
| Main app | `src/App.tsx` |
| City config | `data/cities.json` + `public/data/cities.json` |
| ICS generation | `scripts/generate-ics.ts` |
| Generated calendars | `public/calendars/*.ics` |
| GitHub workflow | `.github/workflows/update-calendars.yml` |
| Deployment config | `netlify.toml` |

## URLs After Deployment

| URL | Purpose |
|-----|---------|
| `https://your-site.netlify.app` | Landing page |
| `https://your-site.netlify.app/calendars/jakarta.ics` | Jakarta calendar |
| `webcal://your-site.netlify.app/calendars/jakarta.ics` | Subscribe link |

## Adding a City

1. Edit `data/cities.json`:
   ```json
   {
     "slug": "city-name",
     "name": "City Name",
     "country": "Country",
     "countryCode": "XX",
     "latitude": 0.0,
     "longitude": 0.0,
     "timezone": "Region/City",
     "method": 2
   }
   ```

2. Copy to public:
   ```bash
   cp data/cities.json public/data/cities.json
   ```

3. Test:
   ```bash
   npm run generate-calendars
   ```

4. Deploy:
   ```bash
   git add .
   git commit -m "Add new city"
   git push
   ```

## Calculation Methods

| ID | Method | Best For |
|----|--------|----------|
| 1 | Karachi | Pakistan |
| 2 | ISNA | North America |
| 3 | MWL | Europe |
| 4 | Makkah | Saudi Arabia |
| 5 | Egypt | Africa/Middle East |
| 11 | Singapore | Southeast Asia |
| 13 | Turkey | Turkey |

## Troubleshooting

**Build fails:**
```bash
npm install
npm run build
```

**Calendar not showing:**
- Check `public/data/cities.json` exists
- Rebuild: `npm run build`

**ICS generation fails:**
```bash
# Check API
curl "https://api.aladhan.com/v1/timings/11-01-2026?latitude=-6.2088&longitude=106.8456&method=11"

# Regenerate
npm run generate-calendars
```

**GitHub Action not running:**
- Check `.github/workflows/update-calendars.yml` exists
- Go to repo → Actions tab
- Check workflow permissions (Settings → Actions → General)

## Key Features

- 📅 Subscribe via webcal:// link
- 🔄 Auto-updates daily via GitHub Actions
- 🌍 10 cities supported (easy to add more)
- 🆓 Completely free (Netlify + GitHub free tiers)
- 🔒 No tracking, no accounts, privacy-first
