/* ==================================================
   TravelEase — utils.js
   Pure utility functions with no side effects
   ================================================== */

function formatCurrency(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function generateBookingId() {
  const part = () => Math.random().toString(36).slice(2, 5).toUpperCase();
  return `TRP-${part()}-${part()}`;
}

function formatDuration(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h <= 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetweenToday(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Autocomplete helper
function filterCities(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return KNOWN_CITIES.filter(c => c.toLowerCase().startsWith(q)).slice(0, 6);
}

function bindCityAutocomplete(inputEl, dropdownEl, onSelect) {
  const handler = debounce(() => {
    const matches = filterCities(inputEl.value);
    if (!matches.length || !inputEl.value.trim()) {
      dropdownEl.innerHTML = '';
      dropdownEl.classList.remove('open');
      return;
    }
    dropdownEl.innerHTML = matches.map(c =>
      `<div class="city-suggestion-item" data-city="${c}">
        <span class="city-icon">📍</span>${c}
      </div>`
    ).join('');
    dropdownEl.classList.add('open');
    dropdownEl.querySelectorAll('.city-suggestion-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        inputEl.value = item.dataset.city;
        dropdownEl.classList.remove('open');
        dropdownEl.innerHTML = '';
        // Let callers react to a picked suggestion (e.g. re-render hotel results).
        if (typeof onSelect === 'function') onSelect(item.dataset.city);
      });
    });
  }, 150);

  inputEl.addEventListener('input', handler);
  inputEl.addEventListener('blur', () => {
    setTimeout(() => { dropdownEl.classList.remove('open'); }, 200);
  });
  inputEl.addEventListener('focus', () => {
    if (inputEl.value.length >= 2) handler();
  });
}