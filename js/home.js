/* ==================================================
   TravelEase — home.js
   Landing page render logic
   ================================================== */

function renderHome() {
  // Mood board
  const board = document.getElementById('moodBoard');
  board.innerHTML = MOODS.map((m, i) => `
    <button class="board-row animate-up" style="animation-delay:${i * 80}ms" data-to="${m.dest}">
      <span class="board-mood">${m.emoji} ${m.mood}</span>
      <span class="board-dest">${m.dest}</span>
      <span class="board-status">${m.status}</span>
    </button>
  `).join('');
  board.querySelectorAll('.board-row').forEach(row => {
    row.addEventListener('click', () => prefillBooking('', row.dataset.to));
  });

  // Popular trips
  const trips = document.getElementById('popularTrips');
  trips.innerHTML = POPULAR_TRIPS.map((t, i) => `
    <button class="trip-card animate-up" style="animation-delay:${i * 60}ms" data-from="${t.from}" data-to="${t.to}">
      <div style="font-size:28px;margin-bottom:8px;">${t.emoji}</div>
      <div class="route">${t.from} → ${t.to}</div>
      <div class="meta">${t.bookings} bookings this month</div>
      <span class="card-tag">${t.tag}</span>
    </button>
  `).join('');
  trips.querySelectorAll('.trip-card').forEach(card => {
    card.addEventListener('click', () => prefillBooking(card.dataset.from, card.dataset.to));
  });

  // Testimonials
  const test = document.getElementById('testimonials');
  test.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial">
      <p>${t.quote}</p>
      <div class="who">— ${t.who}</div>
    </div>
  `).join('');
}