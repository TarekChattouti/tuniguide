// Guides page: profile cards with hover and interactive animations

importData();

function importData() {
  const s = document.createElement('script');
  s.src = 'js/data.js';
  s.onload = () => init();
  document.head.appendChild(s);
}

function init() {
  const grid = document.getElementById('guidesGrid');
  // Create a lightweight chat modal
  let chatModal = document.getElementById('chatModal');
  if (!chatModal) {
    chatModal = document.createElement('div');
    chatModal.id = 'chatModal';
    chatModal.className = 'fixed inset-0 z-50 hidden items-center justify-center bg-black/40 backdrop-blur-sm p-4';
    chatModal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center gap-2"><span class="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-brandBlue text-white">💬</span><p class="font-semibold">Chat</p></div>
          <button id="chatClose" class="px-2 py-1 rounded-lg border hover:border-brandBlue">Close</button>
        </div>
        <div id="chatBody" class="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          <div class="text-xs text-gray-600">Ask for tips, routes, or local insights. The assistant uses Gemini.</div>
        </div>
        <div class="p-3 flex gap-2 border-t">
          <input id="chatInput" type="text" placeholder="Type a message..." class="flex-1 px-3 py-2 rounded-lg border focus:outline-none" />
          <button id="chatSend" class="px-3 py-2 rounded-lg bg-brandBlue text-white hover:bg-brandRed">Send</button>
        </div>
      </div>`;
    document.body.appendChild(chatModal);
    const closeBtn = chatModal.querySelector('#chatClose');
    closeBtn.addEventListener('click', () => {
      chatModal.classList.add('hidden');
      chatModal.classList.remove('flex');
    });
  }
  TuniData.GUIDES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white shadow border border-gray-200 overflow-hidden hover:shadow-lg transition';
    card.innerHTML = `
      <div class="p-4 space-y-3">
        <div class="flex items-center gap-3">
          <img src="assets/images/logo1.webp" alt="${g.name}" class="w-14 h-14 rounded-full object-cover border"/>
          <div>
            <p class="font-semibold">${g.name}</p>
            <p class="text-xs text-gray-600">Languages: ${g.languages.join(', ')}</p>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-600">
          <span>⭐ ${g.rating}</span>
          <span>$${g.price}/hour</span>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1 rounded-full border hover:border-brandBlue">Message</button>
          <button class="bookBtn px-3 py-1 rounded-full bg-brandBlue text-white hover:bg-brandRed">Book</button>
        </div>
      </div>
    `;
    const btn = card.querySelector('.bookBtn');
    btn.addEventListener('click', () => {
      btn.textContent = 'Booked';
      btn.classList.add('pulse');
      btn.disabled = true;
      setTimeout(() => btn.classList.remove('pulse'), 1500);
    });

    const msgBtn = card.querySelector('button:not(.bookBtn)');
    msgBtn.addEventListener('click', () => {
      chatModal.classList.remove('hidden');
      chatModal.classList.add('flex');
      chatModal.dataset.guide = g.name;
      // Seed conversation with a greeting
      const body = document.getElementById('chatBody');
      if (!body.querySelector('[data-seeded]')) {
        const seed = document.createElement('div');
        seed.dataset.seeded = '1';
        seed.className = 'text-xs text-gray-600';
        seed.textContent = `Chatting with ${g.name}. Ask me anything about Tunisia!`;
        body.appendChild(seed);
      }
    });
    grid.appendChild(card);
  });

  // Chat send handler with Gemini API integration
  const sendBtn = document.getElementById('chatSend');
  const inputEl = document.getElementById('chatInput');
  const bodyEl = document.getElementById('chatBody');
  const API_KEY = 'AIzaSyDhEet3ff3IYoXCKkXW1oZAvMJMnW-l3p8';
  async function callGemini(prompt) {
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: prompt }] }
          ]
        })
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      return text;
    } catch (e) {
      return 'Error contacting Gemini.';
    }
  }

  if (sendBtn && inputEl && bodyEl) {
    sendBtn.addEventListener('click', async () => {
      const msg = inputEl.value.trim();
      if (!msg) return;
      inputEl.value = '';
      const userBubble = document.createElement('div');
      userBubble.className = 'text-sm p-2 rounded-lg bg-brandBlue/10';
      userBubble.textContent = msg;
      bodyEl.appendChild(userBubble);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      const thinking = document.createElement('div');
      thinking.className = 'text-xs text-gray-500';
      thinking.textContent = 'Assistant is typing…';
      bodyEl.appendChild(thinking);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      const reply = await callGemini(msg);
      thinking.remove();
      const botBubble = document.createElement('div');
      botBubble.className = 'text-sm p-2 rounded-lg bg-white border';
      botBubble.textContent = reply;
      bodyEl.appendChild(botBubble);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendBtn.click();
    });
  }
}
