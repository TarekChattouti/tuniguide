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

// Global floating AI chat widget (bottom-right)
(function initGlobalChat() {
  // Inject styles
  const style = document.createElement('style');
  style.innerHTML = `
    .tg-chat-fab { position: fixed; right: 16px; bottom: 16px; z-index: 60; }
    .tg-chat-fab button { box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
    .tg-chat-modal { position: fixed; inset: 0; z-index: 70; display: none; align-items: center; justify-content: flex-end; }
    .tg-chat-panel { width: 360px; max-width: 92vw; margin: 0 16px 16px; }
    @media (min-width: 1024px) { .tg-chat-panel { margin-right: 24px; margin-bottom: 24px; } }
  `;
  document.head.appendChild(style);

  // Floating button
  if (!document.querySelector('#tgChatFab')) {
    const fab = document.createElement('div');
    fab.id = 'tgChatFab';
    fab.className = 'tg-chat-fab';
    fab.innerHTML = `
      <button aria-label="Chat with AI" class="rounded-full bg-brandBlue text-white w-14 h-14 flex items-center justify-center hover:bg-brandRed transition">
        💬
      </button>
    `;
    document.body.appendChild(fab);
  }

  // Chat modal/panel
  if (!document.querySelector('#tgChatModal')) {
    const modal = document.createElement('div');
    modal.id = 'tgChatModal';
    modal.className = 'tg-chat-modal';
    modal.innerHTML = `
      <div class="tg-chat-panel rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div class="p-4 border-b flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="assets/images/logo.jpg" alt="TuniGuide" class="w-8 h-8 rounded-lg object-cover border border-brandBlue/20"/>
            <div>
              <p class="font-semibold">TuniGuide AI</p>
              <p class="text-xs text-gray-600">Ask about Tunisia: places, routes, culture, weather.</p>
            </div>
          </div>
          <button id="tgChatClose" class="px-2 py-1 rounded-lg border hover:border-brandBlue">Close</button>
        </div>
        <div id="tgChatBody" class="p-3 space-y-3 max-h-[50vh] overflow-y-auto">
          <div class="text-xs text-gray-600">Tips: try "3-day itinerary Tunis + Sidi Bou Said", "best beaches near Sousse", or "desert tour options from Tozeur".</div>
        </div>
        <div class="p-3 flex gap-2 border-t">
          <input id="tgChatInput" type="text" placeholder="Type your question…" class="flex-1 px-3 py-2 rounded-lg border focus:outline-none" />
          <button id="tgChatSend" class="px-3 py-2 rounded-lg bg-brandBlue text-white hover:bg-brandRed">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const fabBtn = document.querySelector('#tgChatFab button');
  const modalEl = document.getElementById('tgChatModal');
  const closeBtn = document.getElementById('tgChatClose');
  const bodyEl = document.getElementById('tgChatBody');
  const inputEl = document.getElementById('tgChatInput');
  const sendBtn = document.getElementById('tgChatSend');

  function openChat() {
    modalEl.style.display = 'flex';
  }
  function closeChat() {
    modalEl.style.display = 'none';
  }
  if (fabBtn) fabBtn.addEventListener('click', openChat);
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  const API_KEY = 'AIzaSyDhEet3ff3IYoXCKkXW1oZAvMJMnW-l3p8';
  async function callGemini(prompt) {
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }]}] })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      return text;
    } catch (e) {
      return 'Error contacting AI.';
    }
  }

  async function sendMessage(msg) {
    const user = document.createElement('div');
    user.className = 'text-sm p-2 rounded-lg bg-brandBlue/10';
    user.textContent = msg;
    bodyEl.appendChild(user);
    bodyEl.scrollTop = bodyEl.scrollHeight;

    const thinking = document.createElement('div');
    thinking.className = 'text-xs text-gray-500';
    thinking.textContent = 'Assistant is typing…';
    bodyEl.appendChild(thinking);
    bodyEl.scrollTop = bodyEl.scrollHeight;

    const context = localStorage.getItem('tuniguide_prefs');
    const prefix = context ? `User preferences: ${context}. ` : '';
    const reply = await callGemini(prefix + msg);
    thinking.remove();

    const bot = document.createElement('div');
    bot.className = 'text-sm p-2 rounded-lg bg-white border';
    bot.textContent = reply;
    bodyEl.appendChild(bot);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => {
      const msg = inputEl.value.trim();
      if (!msg) return;
      inputEl.value = '';
      sendMessage(msg);
    });
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendBtn.click();
    });
  }
})();
