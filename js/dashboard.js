// Dashboard: mock stats, simple canvas chart, table of reviews

importData();

function importData() {
  const s = document.createElement('script');
  s.src = 'js/data.js';
  s.onload = () => init();
  document.head.appendChild(s);
}

function init() {
  // Stats
  document.getElementById('statUsers').textContent = 1234;
  document.getElementById('statGuides').textContent = TuniData.GUIDES.length;
  document.getElementById('statGroups').textContent = TuniData.GROUPS.length;

  // Chart using vanilla canvas
  const canvas = document.getElementById('chartCanvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = canvas.clientHeight;
  const data = [12, 18, 10, 22, 30, 26, 34];
  const max = Math.max(...data);

  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#005BBB';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = (i/(data.length-1)) * (w-20) + 10;
    const y = h - (v/max) * (h-20) - 10;
    if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  // points
  ctx.fillStyle = '#E60023';
  data.forEach((v, i) => {
    const x = (i/(data.length-1)) * (w-20) + 10;
    const y = h - (v/max) * (h-20) - 10;
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();
  });

  // Reviews table (latest 10 from first place)
  const tbody = document.getElementById('reviewsTable');
  const reviews = TuniData.PLACES[0].reviews.slice(0,10);
  reviews.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class='py-2'>${r.name}</td>
      <td class='py-2'>${TuniData.PLACES[0].name}</td>
      <td class='py-2'>${r.rating}</td>
      <td class='py-2'>${r.text}</td>
    `;
    tbody.appendChild(tr);
  });
}
