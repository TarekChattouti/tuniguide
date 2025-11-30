// Place details page: cards, modal with carousel, reviews modal

// Ensure data is loaded
importData();

function importData() {
  const s = document.createElement('script');
  s.src = 'js/data.js';
  s.onload = () => init();
  document.head.appendChild(s);
}

function init() {
  const grid = document.getElementById('placesGrid');
  const hashId = parseInt(location.hash.replace('#','')); // optional preselect

  TuniData.PLACES.forEach(place => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white shadow border border-gray-200 overflow-hidden hover:shadow-lg transition';
    card.innerHTML = `
      <div class="relative">
        <img src="${place.images[0]}" alt="${place.name}" class="w-full h-40 object-cover" />
        <div class="absolute top-3 left-3 px-2 py-1 text-xs rounded bg-white/80 border">${place.city}</div>
      </div>
      <div class="p-4 space-y-2">
        <p class="font-semibold">${place.name}</p>
        <p class="text-sm text-gray-600 line-clamp-2">${place.description}</p>
        <div class="flex items-center justify-between text-xs text-gray-600">
          <span>⭐ ${place.rating}</span>
          <span>$${place.hotelPrice}/night</span>
        </div>
        <div class="flex gap-2 flex-wrap text-xs">
          ${place.activities.slice(0,3).map(a=>`<span class='px-2 py-1 rounded-full bg-brandSand border'>${a}</span>`).join('')}
        </div>
        <button class="mt-2 px-4 py-2 rounded-full bg-brandBlue text-white hover:bg-brandRed transition">Details</button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => openModal(place));
    grid.appendChild(card);

    if (hashId && hashId === place.id) {
      setTimeout(() => openModal(place), 100);
    }
  });

  // Modal logic
  const modal = document.getElementById('placeModal');
  const closeBtn = document.getElementById('modalClose');
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

  const reviewsModal = document.getElementById('reviewsModal');
  const reviewsClose = document.getElementById('reviewsClose');
  reviewsClose.addEventListener('click', () => reviewsModal.classList.add('hidden'));

  function openModal(place) {
    document.getElementById('modalTitle').textContent = place.name;

    const track = document.getElementById('carouselTrack');
    track.innerHTML = '';
    place.images.forEach(src => {
      const slide = document.createElement('div');
      slide.className = 'min-w-full h-64';
      slide.innerHTML = `<img src='${src}' class='w-full h-full object-cover'/>`;
      track.appendChild(slide);
    });

    let current = 0;
    function updateCarousel() {
      track.style.transform = `translateX(-${current*100}%)`;
    }
    document.getElementById('prevSlide').onclick = () => { current = (current - 1 + place.images.length) % place.images.length; updateCarousel(); };
    document.getElementById('nextSlide').onclick = () => { current = (current + 1) % place.images.length; updateCarousel(); };

    const content = document.getElementById('modalContent');
    content.innerHTML = `
      <p class='text-gray-700'>${place.description}</p>
      <p class='text-gray-600'><strong>Transport:</strong> ${place.transport}</p>
      <p class='text-gray-600'><strong>Hotel price:</strong> $${place.hotelPrice}/night</p>
      <div class='flex gap-2 flex-wrap text-xs'>
        ${place.activities.map(a=>`<span class='px-2 py-1 rounded-full bg-brandSand border'>${a}</span>`).join('')}
      </div>
    `;

    document.getElementById('openReviews').onclick = () => openReviews(place);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    updateCarousel();
  }

  function openReviews(place) {
    const list = document.getElementById('reviewsList');
    list.innerHTML = '';
    place.reviews.forEach(r => {
      const item = document.createElement('div');
      item.className = 'rounded-xl border p-3 bg-brandSand';
      item.innerHTML = `<p class='font-semibold text-sm'>${r.name} • ⭐ ${r.rating}</p><p class='text-sm text-gray-700'>${r.text}</p>`;
      list.appendChild(item);
    });
    const reviewsModal = document.getElementById('reviewsModal');
    reviewsModal.classList.remove('hidden');
    reviewsModal.classList.add('flex');
  }
}
