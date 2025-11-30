# TuniGuide – Personalized Tunisian Travel Guide

Static frontend hackathon project using TailwindCSS + vanilla JavaScript.

## Run Locally

No build is required.

1. Open `index.html` in your browser.
2. Or, start a simple local server:

```powershell
# Windows PowerShell
cd c:\hackathon\tuniguide
powershell -Command "Start-Process microsoft-edge:index.html"
```

Alternatively:
```powershell
cd c:\hackathon\tuniguide
python -m http.server 8080 ; Start-Process http://localhost:8080
```

## Structure

- `index.html` – Landing page
- `onboarding.html` – Multi-step personalization wizard
- `map.html` – Personalized map with animated markers
- `place-details.html` – Place cards + modal + carousel + reviews modal
- `groups.html` – Group cards with hover + join animations
- `guides.html` – Guide profile cards with interactions
- `dashboard.html` – Admin dashboard with stats, chart, table
- `assets/images/` – Mock images (use any royalty-free placeholders)
- `js/` – Page scripts and mock data

## Notes

- Styling is 100% TailwindCSS via CDN.
- Animations implemented with CSS keyframes + JS triggers.
- Mock data provided in `js/data.js`; no backend calls.
- Preferences from onboarding are saved to `localStorage`.
