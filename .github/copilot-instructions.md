# Copilot Instructions for TuniGuide

Goal: Help AI agents be immediately productive in this static frontend project.

## Big Picture
- Architecture: Pure static site (HTML + Tailwind via CDN + vanilla JS). No build step, no package manager, no backend.
- Data flow: Mock data in `js/data.js` drives all pages. Page-specific controllers read from `localStorage` (onboarding prefs) and `data.js`, then render DOM.
- Pages: `index.html` (landing), `onboarding.html` (collect preferences), `map.html`, `place-details.html`, `groups.html`, `guides.html`, `dashboard.html` (admin-like demo).
- State: Preferences persisted in `localStorage` by onboarding; other pages read those keys to personalize content.
- Offline: Basic PWA using `manifest.webmanifest` and `sw.js` for cache; no dynamic sync.

## Key Files & Responsibilities
- `js/data.js`: Central mock datasets (places, guides, groups) and helper accessors. Treat as the single source of truth for content.
- `js/onboarding.js`: Multi-step wizard; writes user prefs to `localStorage`. Keep key names stable.
- `js/map.js`: Renders personalized map markers and interactions based on prefs + `data.js`.
- `js/place-details.js`: Builds cards, modal/carousel, reviews; reads selected place id from URL or state.
- `js/guides.js`, `js/groups.js`: List pages with interactions (hover/join/book); filter via prefs.
- `js/dashboard.js`: Demo admin: stats, chart, table. Uses mock data only.
- `sw.js`: Registers service worker and caches core assets for offline.
- `manifest.webmanifest`: PWA metadata (name, icons, start_url).

## Conventions & Patterns
- DOM-first: No frameworks. Query/update DOM directly; minimal helpers.
- Tailwind via CDN: Use utility classes inline; do not add build tooling.
- Data contracts: Keep `data.js` object shapes stable (ids, names, categories, tags, coordinates). Add fields conservatively and document here.
- Storage keys: `localStorage` keys like `preferences`, `selectedPlaceId`. Read/write consistently across pages.
- Navigation/state passing: Prefer URL parameters (e.g., `?place=123`) or `localStorage` for cross-page state.
- Accessibility: Favor semantic HTML and ARIA for modals/carousels; keep focus management simple.

## Developer Workflows
- Run locally:
  - Open `index.html` directly, or serve:
    - PowerShell: `python -m http.server 8080 ; Start-Process http://localhost:8080`
  - Edge direct open: `powershell -Command "Start-Process microsoft-edge:index.html"`
- Debugging:
  - Use browser devtools; no source maps.
  - Inspect `localStorage` for prefs; clear via devtools or `localStorage.clear()`.
- Testing (manual):
  - Onboard → ensure prefs saved.
  - Visit map/guides/groups → filtered/personalized listings.
  - Open place details → modal/carousel and reviews work.
  - Toggle offline: simulate with devtools; pages should load cached assets.

## Integration Points
- Service Worker: Cache only static assets listed in `sw.js`. If you add files, update the cache list.
- PWA: Ensure new pages are referenced by `manifest.webmanifest` and cached for offline.
- Assets: Use `assets/images/` and royalty-free placeholders. Do not introduce external CDNs beyond Tailwind provided.

## Example Patterns
- Read preferences:
  ```js
  const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
  const preferredTags = prefs.tags || [];
  const places = getPlaces().filter(p => preferredTags.some(t => p.tags.includes(t)));
  ```
- Pass selected place to details:
  ```js
  // set
  localStorage.setItem('selectedPlaceId', String(place.id));
  // read in place-details.js
  const placeId = Number(localStorage.getItem('selectedPlaceId'));
  const place = getPlaceById(placeId);
  ```
- URL param fallback:
  ```js
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('place') || localStorage.getItem('selectedPlaceId'));
  ```

## When Adding Features
- Keep it static: No NPM, bundlers, or frameworks.
- Extend `data.js` first; then consume from page scripts.
- Maintain storage key compatibility; if introducing new keys, document here.
- Update `sw.js` cache list and verify offline behavior.

## Known Constraints
- No backend; avoid fetch calls except local assets.
- Performance: Keep JS light; defer heavy loops until DOM ready.
- Mobile: Folder present; ensure layouts remain responsive with Tailwind.

If any section is unclear or you need deeper examples (e.g., exact data shapes in `js/data.js`), tell me which parts to refine, and I’ll iterate.