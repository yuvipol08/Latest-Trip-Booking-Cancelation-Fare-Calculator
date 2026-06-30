/* ==================================================
   CHALO — app.js
   Global state, navigation, and app bootstrap
   ================================================== */

/* ---------- Global State ---------- */
const state = {
  user:          { name: '', city: '' },
  bucketList:    [],
  bookings:      [],
  cancellations: [],
  draft:         { mode: null, lastCalc: null },
  selectedHotel: null,
};

/* ---------- Navigation ---------- */
function goToPage(pageKey) {
  document.querySelectorAll('.page').forEach(p =>
    p.classList.toggle('active', p.dataset.page === pageKey)
  );
  document.querySelectorAll('.nav-link').forEach(n =>
    n.classList.toggle('active', n.dataset.nav === pageKey)
  );
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mainNav').classList.remove('open');
  updateProgressBar(pageKey);
}

function updateProgressBar(pageKey) {
  const pages = ['home', 'booking', 'recommendation', 'hotels', 'profile', 'cancellation'];
  const idx = pages.indexOf(pageKey);
  const pct = idx < 0 ? 0 : ((idx + 1) / pages.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

function prefillBooking(from, to) {
  goToPage('booking');
  if (from) document.getElementById('fromCity').value = from;
  if (to)   document.getElementById('toCity').value = to;
  // Scroll to form
  setTimeout(() => {
    document.getElementById('step2').scrollIntoView({ behavior: 'smooth' });
  }, 200);
}

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {

  // Global nav clicks — wire every element that carries data-nav anywhere in the document
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.nav;
      if (!target) return;
      // Always keep profile counts in sync
      document.getElementById('bookingCount').textContent = state.bookings.length;
      document.getElementById('cancelCount').textContent = state.cancellations.length;
      if (target === 'profile') { renderProfile(); }
      if (target === 'cancellation') { renderCancelPageBookingList(); }
      if (target === 'hotels') { renderHotelsPage(); }
      goToPage(target);
    });
  });

  // Nav toggle (mobile)
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('mainNav').classList.toggle('open');
  });

  // Init all pages
  renderHome();
  initBookingPage();
  initRecommendationPage();
  initHotelsPage();
  initProfilePage();
  initCancellationPage();
  renderProfile();
  renderCancelPageBookingList();

  // Set initial nav state
  goToPage('home');
});