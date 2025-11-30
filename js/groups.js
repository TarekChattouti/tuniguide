// Groups page: static cards with hover and join animations

importData();

function importData() {
  const s = document.createElement('script');
  s.src = 'js/data.js';
  s.onload = () => init();
  document.head.appendChild(s);
}

function init() {
  const grid = document.getElementById('groupsGrid');
  TuniData.GROUPS.forEach(g => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white shadow border border-gray-200 overflow-hidden hover:shadow-lg transition';
    card.innerHTML = `
      <div class="p-4 space-y-2">
        <div class='flex items-center justify-between'>
          <p class="font-semibold">${g.name}</p>
          <span class='text-xs px-2 py-1 rounded bg-brandSand border'>${g.type}</span>
        </div>
        <p class="text-sm text-gray-600">${g.description}</p>
        <div class="flex items-center justify-between text-xs text-gray-600">
          <span>👥 ${g.members} members</span>
          <button class="joinBtn px-4 py-2 rounded-full bg-brandBlue text-white hover:bg-brandRed transition">Join</button>
        </div>
      </div>
    `;
    const btn = card.querySelector('.joinBtn');
    btn.addEventListener('click', () => {
      btn.textContent = 'Joined';
      btn.classList.add('pulse');
      btn.disabled = true;
      setTimeout(() => btn.classList.remove('pulse'), 1500);
    });
    grid.appendChild(card);
  });
}
