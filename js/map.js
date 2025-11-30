// Map page: render Mapbox map with animated markers and tooltips

// Load Mapbox and data
setup();

function setup() {
  const mapboxScript = document.createElement('script');
  mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
  mapboxScript.onload = importData;
  document.head.appendChild(mapboxScript);
}

function importData() {
  const s = document.createElement('script');
  s.src = 'js/data.js';
  s.onload = () => init();
  document.head.appendChild(s);
}

function init() {
  // Using Mapbox default pin markers; no custom marker CSS

  // Mapbox token and map init
  mapboxgl.accessToken = 'pk.eyJ1IjoidGFyZWtjaGF0dG91dGkiLCJhIjoiY21pa3NpdWQ4MTE0eTNkcjF4ejFtZXB0aiJ9.Lmmp--w18iHLtUuhFy9btg';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [9.5375, 33.8869], // Tunisia approx
    zoom: window.innerWidth < 640 ? 4.2 : 5
  });

  // Lock map interaction to Tunisia bounds and sensible zooms
  const maxBounds = [[7.2, 30.0], [11.6, 37.2]];
  map.setMaxBounds(maxBounds);
  map.setMinZoom(4.0);
  map.setMaxZoom(12);

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());

  const listEl = document.getElementById('placeList');
  // Coords in data are actual latitude (x) and longitude (y)

  // OpenWeather API helper
  const WEATHER_API_KEY = 'a83487fbb87d58e88adeed18eef7eaab';
  async function fetchWeather(lat, lng) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const temp = Math.round(data.main?.temp ?? 0);
      const cond = (data.weather && data.weather[0]?.main) || '—';
      const code = (data.weather && data.weather[0]?.id) || 0; // OpenWeather condition code
      return { temp, cond, code };
    } catch (e) {
      console.warn('Weather error', e);
      return { temp: null, cond: 'N/A', code: 0 };
    }
  }

  // Weather condition -> animated icon HTML factory
  function weatherIconByCode(code) {
    // Map using OpenWeather codes to avoid mismatches
    // 2xx Thunderstorm, 3xx Drizzle, 5xx Rain, 6xx Snow, 7xx Atmosphere, 800 Clear, 801-804 Clouds
    if (code === 800) {
      return `<svg class="wi wi-sun" viewBox="0 0 64 64" aria-label="Clear"><circle class='core' cx='32' cy='32' r='14'/><g class='rays'>${[0,45,90,135].map(a=>`<rect x='31' y='6' width='2' height='10' transform='rotate(${a} 32 32)'/>`).join('')}</g></svg>`;
    }
    if (code >= 801 && code <= 804) {
      return `<svg class="wi wi-cloud" viewBox="0 0 64 40" aria-label="Clouds"><path class='cloud' d='M20 34h20a10 10 0 0 0 0-20 14 14 0 0 0-27-4A12 12 0 0 0 13 34' /></svg>`;
    }
    if (code >= 200 && code < 300) {
      return `<svg class="wi wi-storm" viewBox="0 0 64 64" aria-label="Storm"><path class='cloud' d='M20 40h24a10 10 0 0 0 0-20 14 14 0 0 0-27-4A12 12 0 0 0 13 40' /><polygon class='bolt' points='30,44 38,32 33,32 40,20 30,28 35,28'/></svg>`;
    }
    if (code >= 500 && code < 600) {
      return `<svg class="wi wi-rain" viewBox="0 0 64 64" aria-label="Rain"><path class='cloud' d='M20 36h24a10 10 0 0 0 0-20 14 14 0 0 0-27-4A12 12 0 0 0 13 36' />${[22,30,38].map(x=>`<line class='drop' x1='${x}' y1='40' x2='${x}' y2='50'/>`).join('')}</svg>`;
    }
    if (code >= 300 && code < 400) {
      return `<svg class="wi wi-drizzle" viewBox="0 0 64 64" aria-label="Drizzle"><path class='cloud' d='M20 36h24a10 10 0 0 0 0-20 14 14 0 0 0-27-4A12 12 0 0 0 13 36' />${[26,34].map(x=>`<line class='drop' x1='${x}' y1='40' x2='${x}' y2='48'/>`).join('')}</svg>`;
    }
    if (code >= 600 && code < 700) {
      return `<svg class="wi wi-snow" viewBox="0 0 64 64" aria-label="Snow"><path class='cloud' d='M20 36h24a10 10 0 0 0 0-20 14 14 0 0 0-27-4A12 12 0 0 0 13 36' />${[24,32,40].map(x=>`<circle class='flake' cx='${x}' cy='44' r='3'/>`).join('')}</svg>`;
    }
    if (code >= 700 && code < 800) {
      return `<svg class="wi wi-fog" viewBox="0 0 64 64" aria-label="Fog">${[36,42,48].map(y=>`<rect class='fog' x='14' y='${y}' width='36' height='4' rx='2'/>`).join('')}<path class='cloud' d='M22 34h20a9 9 0 0 0 0-18 13 13 0 0 0-25-4A11 11 0 0 0 16 34' /></svg>`;
    }
    return `<svg class="wi wi-na" viewBox="0 0 32 32" aria-label="N/A"><text x='16' y='20' font-size='10' text-anchor='middle' fill='#6b7280'>N/A</text></svg>`;
  }

  // Inject animation CSS (only once)
  if (!document.getElementById('weather-anim-css')) {
    const wstyle = document.createElement('style');
    wstyle.id = 'weather-anim-css';
    wstyle.innerHTML = `
      .wi { width:34px; height:34px; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
      .wi-sun .core { fill:#FFC107; stroke:#FFB300; stroke-width:1; }
      .wi-sun .rays rect { fill:#FFC107; }
      .wi-cloud .cloud, .wi-rain .cloud, .wi-drizzle .cloud, .wi-snow .cloud, .wi-storm .cloud, .wi-fog .cloud { fill:#fff; stroke:#d1d5db; }
      .wi-rain .drop, .wi-drizzle .drop { stroke:#005BBB; }
      .wi-drizzle .drop { stroke:#4D8FD1; }
      .wi-snow .flake { fill:#fff; stroke:#e5e7eb; }
      .wi-storm .bolt { fill:#f59e0b; }
      .wi-fog .fog { fill:#ffffff; opacity:.55; }
      .wi-na text { font-family:Inter, sans-serif; }
    `;
    document.head.appendChild(wstyle);
  }

  TuniData.PLACES.forEach(async (place) => {
    const lat = place.coords.x; // latitude
    const lng = place.coords.y; // longitude

    // Tooltip
    const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
      .setHTML(`<div class='text-sm'><strong>${place.name}</strong><div class='text-xs text-gray-600'>⭐ ${place.rating}</div><div class='text-xs text-gray-600' id='w-${place.id}'>Loading weather...</div></div>`);

    // Default Mapbox pin marker (no points/animations)
    const marker = new mapboxgl.Marker({ color: '#E60023' })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Sidebar card
    const card = document.createElement('a');
    card.href = 'place-details.html#' + place.id;
    card.className = 'block rounded-xl border border-gray-200 p-3 hover:shadow transition bg-white';
    card.innerHTML = `
      <div class="flex gap-3">
        <img src="${place.images[0]}" alt="${place.name}" class="w-16 h-16 object-cover rounded-lg" />
        <div>
          <p class="font-semibold">${place.name}</p>
          <p class="text-xs text-gray-500">${place.city} • ⭐ ${place.rating}</p>
          <p class="text-xs text-gray-600">Weather: <span id='cw-${place.id}'>—</span></p>
          <p class="text-xs text-gray-600 line-clamp-2">${place.description}</p>
        </div>
      </div>
    `;
    listEl.appendChild(card);

    // Fetch and render weather
    const w = await fetchWeather(lat, lng);
    const text = w.temp !== null ? `${w.cond}, ${w.temp}°C` : 'N/A';
    // Update popup content directly (popup DOM isn't part of document until opened)
    popup.setHTML(`<div class='text-sm'><strong>${place.name}</strong><div class='text-xs text-gray-600'>⭐ ${place.rating}</div><div class='text-xs text-gray-600'>${weatherIconByCode(w.code)} <span class='align-middle text-xs'>${text}</span></div></div>`);
    // Update sidebar card weather
    const cardWeather = document.getElementById(`cw-${place.id}`);
    if (cardWeather) cardWeather.innerHTML = `${weatherIconByCode(w.code)} <span class='ml-1 text-xs'>${text}</span>`;
  });

  // Ensure map resizes correctly on orientation / viewport change (mobile address bar)
  window.addEventListener('resize', () => {
    map.resize();
  });
}
