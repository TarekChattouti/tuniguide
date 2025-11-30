// Main shared script: mobile menu, smooth scroll, basic animations

// Smooth anchor scroll
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a) {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
});

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== '0px';
    mobileMenu.style.maxHeight = open ? '0px' : mobileMenu.scrollHeight + 'px';
  });
}

// Simple fade-in and slide-in utility classes
// These rely on Tailwind's arbitrary values and transition classes via CSS animations
(function injectAnimations() {
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-fade-in { animation: fadeIn 0.8s ease both; }
    .animate-slide-in { animation: slideIn 0.8s ease both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-8px);} to { opacity: 1; transform: translateX(0);} }
    .pulse { animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    /* Vibe splash animations - Stable */
    .loading-card { animation: cardIn 500ms ease both; }
    @keyframes cardIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-breathe { animation: breathe 2s ease-in-out infinite; }
    @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
    .animate-spin-slow { animation: spin 6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .shine { animation: shineMove 2.4s ease-in-out infinite; }
    @keyframes shineMove { 0% { transform: translateX(0); opacity: 0.0; }
      40% { opacity: 0.5; }
      50% { transform: translateX(220%); opacity: 0.6; }
      100% { transform: translateX(220%); opacity: 0.0; } }
  `;
  document.head.appendChild(style);
})();

// Auto-show CTA modal on landing (once per session)
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('ctaModal');
  const splash = document.getElementById('vibeSplash');
  if (splash) {
    splash.classList.remove('hidden');
    splash.classList.add('flex');
    setTimeout(() => {
      splash.classList.add('hidden');
      splash.classList.remove('flex');
    }, 3000);
  }
  if (!modal) return;
  const dismissed = sessionStorage.getItem('tuniguide_cta_dismissed');
  if (!dismissed) {
    setTimeout(() => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }, 400);
  }
  const dismiss = document.getElementById('ctaDismiss');
  if (dismiss) {
    dismiss.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      sessionStorage.setItem('tuniguide_cta_dismissed', '1');
    });
  }
});

// Client-side router: intercept nav links and load pages without refresh
(function enableRouter() {
  const supported = typeof window.history.pushState === 'function' && typeof window.fetch === 'function';
  if (!supported) return;

  async function loadRoute(url, replace = false) {
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newMain = doc.querySelector('main');
      const currentMain = document.querySelector('main');
      if (!newMain || !currentMain) return window.location.href = url;
      // animate out current
      currentMain.style.transition = 'opacity 250ms, transform 250ms';
      currentMain.style.opacity = '0';
      currentMain.style.transform = 'translateY(8px)';
      await new Promise(r => setTimeout(r, 250));
      // swap content
      currentMain.innerHTML = newMain.innerHTML;
      // animate in
      currentMain.style.opacity = '0';
      currentMain.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        currentMain.style.opacity = '1';
        currentMain.style.transform = 'translateY(0)';
      });
      // update title
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent || document.title;
      // run page-specific scripts if any
      const srcs = Array.from(doc.querySelectorAll('script[src]')).map(s => s.getAttribute('src'));
      srcs.forEach(src => {
        // Load only JS under js/ and not main.js again
        if (src && src.startsWith('js/') && !src.includes('main.js')) {
          const s = document.createElement('script');
          s.src = src;
          document.body.appendChild(s);
        }
      });
      if (!replace) history.pushState({ url }, '', url);
    } catch (err) {
      console.error('Router load failed', err);
      window.location.href = url;
    }
  }

  // intercept clicks on nav links to .html pages
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href$=".html"]');
    if (!a) return;
    const url = a.getAttribute('href');
    // same-origin and not external
    if (url && !url.startsWith('http')) {
      e.preventDefault();
      loadRoute(url);
    }
  });

  // handle back/forward
  window.addEventListener('popstate', (e) => {
    const url = (e.state && e.state.url) || window.location.pathname.split('/').pop() || 'index.html';
    loadRoute(url, true);
  });
})();

// PWA: inject manifest if missing and register Service Worker
(function initPWA() {
  // Add manifest link if not present (covers non-index pages loaded directly)
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = 'manifest.webmanifest';
    document.head.appendChild(link);
  }
  // Ensure theme-color meta exists for better UX
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#005BBB';
    document.head.appendChild(meta);
  }

  if ('serviceWorker' in navigator) {
    // Register after load for reliability with SPA routing
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .catch(err => console.warn('SW registration failed', err));
    });
  }
})();
