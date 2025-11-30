// Onboarding multi-step wizard with animated transitions

// Steps definition
const steps = [
  {
    id: 'persona',
    title: 'Who are you?',
    subtitle: 'We tailor suggestions differently for locals and visitors.',
    options: ['Tourist', 'Tunisian'],
  },
  {
    id: 'hobbies',
    title: 'Select your hobbies',
    subtitle: 'Pick as many as you like.',
    options: ['Photography','Hiking','Beach','Museums','Food Tours','Cycling','Shopping','Music']
  },
  {
    id: 'food',
    title: 'Favorite food styles',
    subtitle: 'We love brik, kafteji and fresh seafood! 🍤',
    options: ['Street Food','Seafood','Traditional','Vegetarian','Pastries']
  },
  {
    id: 'activities',
    title: 'Preferred activities',
    subtitle: 'Tune the vibe for your trip.',
    options: ['Culture','Nature','Adventure','Relax','Nightlife']
  },
  {
    id: 'budget',
    title: 'Budget per day (USD)',
    subtitle: 'An estimate helps us prioritize places and activities.',
    options: ['< 50', '50 - 100', '100 - 150', '> 150']
  }
];

const state = {
  current: 0,
  answers: {}
};

const stepsContainer = document.getElementById('stepsContainer');
const progressBar = document.getElementById('progressBar');
const stepLabel = document.getElementById('stepLabel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');

function renderStep(index, direction = 1) {
  const step = steps[index];
  stepLabel.textContent = `Step ${index+1} of ${steps.length}`;
  progressBar.style.width = `${((index)/(steps.length-1))*100}%`;

  const old = stepsContainer.firstElementChild;
  const el = document.createElement('div');
  el.className = `space-y-5 animate-fade-in`;
  el.innerHTML = `
    <div class="space-y-1">
      <h2 class="text-2xl font-semibold">${step.title}</h2>
      ${step.subtitle ? `<p class='text-sm text-gray-600'>${step.subtitle}</p>` : ''}
    </div>
    <div class="grid sm:grid-cols-2 gap-3">
      ${step.options.map(opt => `
        <button type="button" data-opt="${opt}" class="option-btn group px-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-brandBlue transition relative overflow-hidden">
          <span class="relative z-10">${opt}</span>
          <span class="check hidden absolute right-3 top-3 w-6 h-6 rounded-full bg-brandBlue text-white items-center justify-center">✓</span>
          <span class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-brandBlue/5 to-brandRed/5"></span>
        </button>`).join('')}
    </div>
  `;
  stepsContainer.appendChild(el);
  if (old) {
    old.classList.add('opacity-0');
    setTimeout(() => old.remove(), 250);
  }

  el.querySelectorAll('button[data-opt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const opt = btn.dataset.opt;
      const id = step.id;
      if (!Array.isArray(state.answers[id])) state.answers[id] = [];
      if (['persona','budget'].includes(id)) {
        state.answers[id] = opt;
        // exclusive selection visuals
        el.querySelectorAll('.option-btn').forEach(b => {
          b.classList.remove('ring-2','ring-brandBlue');
          b.querySelector('.check').classList.add('hidden');
        });
        btn.classList.add('ring-2','ring-brandBlue');
        btn.querySelector('.check').classList.remove('hidden');
      } else {
        const arr = state.answers[id];
        const i = arr.indexOf(opt);
        if (i >= 0) arr.splice(i,1); else arr.push(opt);
        btn.classList.toggle('ring-2');
        btn.classList.toggle('ring-brandBlue');
        btn.querySelector('.check').classList.toggle('hidden');
      }
    });
  });

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === steps.length - 1 ? 'Finish' : 'Next';
}

function next() {
  if (state.current < steps.length - 1) {
    state.current++;
    renderStep(state.current, 1);
  } else {
    // Finish: save preferences in localStorage and go to map
    localStorage.setItem('tuniguide_preferences', JSON.stringify(state.answers));
    window.location.href = 'map.html';
  }
}

function prev() {
  if (state.current > 0) {
    state.current--;
    renderStep(state.current, -1);
  }
}

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
skipBtn.addEventListener('click', () => {
  window.location.href = 'map.html';
});

// init
// Intro animation on load
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('animate-fade-in');
});

renderStep(0);
