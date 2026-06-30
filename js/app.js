/* ==================================================
   CHALO — app.js
   Global state, navigation, and app bootstrap
   ================================================== */

/* ---------- Global State ---------- */
const state = {
  user:          { name: '', city: '', mobile: '', email: '' },
  bucketList:    [],
  bookings:      [],
  cancellations: [],
  draft:         { mode: null, lastCalc: null },
  selectedHotel: null,
};

/* ---------- Auth + persistence glue ---------- */

// Write the signed-in user's data back to localStorage.
function persistData() {
  if (!state.user.email) return;
  saveUserData(state.user.email, {
    city:          state.user.city,
    bucketList:    state.bucketList,
    bookings:      state.bookings,
    cancellations: state.cancellations,
  });
}

// Keep the stored account record aligned with profile edits.
function syncAccount() {
  const acct = findUserByEmail(state.user.email);
  if (!acct) return;
  acct.name = state.user.name;
  acct.city = state.user.city;
  saveUserAccount(acct);
}

// Load an account + its saved data into app state.
function applyUser(user) {
  state.user = { name: user.name, city: user.city || '', mobile: user.mobile || '', email: user.email };
  const data = loadUserData(user.email) || {};
  state.bookings      = data.bookings      || [];
  state.cancellations = data.cancellations || [];
  state.bucketList    = data.bucketList    || [];
  if (data.city) state.user.city = data.city;
  renderProfile();
  renderCancelPageBookingList();
}

// Called by auth.js after a successful sign-in / sign-up.
function onAuthSuccess(user, silent) {
  applyUser(user);
  hideAuth();
  updateAuthHeader();
  goToPage('home');
  if (!silent) showToast(`Welcome, ${user.name.split(' ')[0]} 👋`);
}

function updateAuthHeader() {
  const greeting = document.getElementById('headerGreeting');
  const logoutBtn = document.getElementById('logoutBtn');
  if (state.user.name) {
    greeting.textContent = `Hi, ${state.user.name.split(' ')[0]}`;
    if (logoutBtn) logoutBtn.hidden = false;
  } else {
    greeting.textContent = '';
    if (logoutBtn) logoutBtn.hidden = true;
  }
}

function logout() {
  persistData();
  setSession(null);
  state.user          = { name: '', city: '', mobile: '', email: '' };
  state.bucketList    = [];
  state.bookings      = [];
  state.cancellations = [];
  state.draft         = { mode: null, lastCalc: null };
  state.selectedHotel = null;
  renderProfile();
  renderCancelPageBookingList();
  updateAuthHeader();
  showAuth();
}

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
  // Clear any stale results from a previous calculation
  document.getElementById('bookingResults').hidden = true;
  document.getElementById('formError').textContent = '';
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

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Init all pages
  renderHome();
  initBookingPage();
  initRecommendationPage();
  initHotelsPage();
  initProfilePage();
  initCancellationPage();
  initAuth();
  renderProfile();
  renderCancelPageBookingList();

  // Set initial nav state
  goToPage('home');

  // Auth gate: restore an existing session or show the login screen
  const sessionEmail = getSession();
  const sessionUser = sessionEmail ? findUserByEmail(sessionEmail) : null;
  if (sessionUser) {
    onAuthSuccess(sessionUser, true); // silent restore
  } else {
    showAuth();
  }
});