/* ==================================================
   TravelEase — hotels.js
   Hotel browse, filter, and selection logic
   ================================================== */

// Active tier filter for the hotels page ('' = all tiers).
let hotelTierFilter = '';

function starHTML(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function renderHotelCard(h, isSelected) {
  const tierColor = { budget: 'var(--teal)', midrange: 'var(--violet)', premium: 'var(--amber)' }[h.tier];
  const tierLabel = { budget: 'Budget', midrange: 'Comfort', premium: 'Premium' }[h.tier];
  return `
    <div class="hotel-card${isSelected ? ' hotel-selected' : ''}" data-hotel-id="${h.id}">
      <div class="hotel-card-top">
        <div class="hotel-emoji">${h.img}</div>
        <div class="hotel-header-info">
          <div class="hotel-tier-pill" style="background:${tierColor}20;color:${tierColor};">${tierLabel}</div>
          <div class="hotel-stars" title="${h.stars} stars">${starHTML(h.stars)}</div>
        </div>
      </div>
      <div class="hotel-name">${h.name}</div>
      <div class="hotel-neighborhood">📍 ${h.neighborhood}, ${h.city}</div>
      <div class="hotel-highlight">✦ ${h.highlight}</div>
      <p class="hotel-desc">${h.desc}</p>
      <div class="hotel-amenities">
        ${h.amenities.map(a => `<span class="hotel-amenity-tag">${a}</span>`).join('')}
      </div>
      <div class="hotel-footer">
        <div class="hotel-price-block">
          <span class="hotel-price">${formatCurrency(h.pricePerNight)}</span>
          <span class="hotel-per-night">/ night</span>
        </div>
        <div class="hotel-rating-block">
          <span class="hotel-rating-val">${h.rating}</span>
          <span class="hotel-rating-count">(${h.reviews.toLocaleString('en-IN')} reviews)</span>
        </div>
      </div>
      <button class="btn hotel-select-btn ${isSelected ? 'btn-green' : 'btn-primary'}" data-select-hotel="${h.id}">
        ${isSelected ? '✓ Selected' : 'Select & Book'}
      </button>
    </div>
  `;
}

function renderHotelsPage() {
  const cityInput  = document.getElementById('hotelCityInput');
  const grid       = document.getElementById('hotelGrid');
  const noResults  = document.getElementById('hotelNoResults');
  const selectedBanner = document.getElementById('hotelSelectedBanner');

  const city = (cityInput.value || '').trim();
  const tier = hotelTierFilter; // '' | 'budget' | 'midrange' | 'premium'

  let hotels = getHotelsForCity(city);
  if (tier) hotels = hotels.filter(h => h.tier === tier);

  // Selected hotel banner
  if (state.selectedHotel) {
    const sh = state.selectedHotel;
    selectedBanner.hidden = false;
    selectedBanner.innerHTML = `
      <div class="banner banner-ok" style="align-items:center;">
        <span class="banner-icon">🏨</span>
        <div style="flex:1;">
          <strong>${sh.name}</strong> selected — ${formatCurrency(sh.pricePerNight)}/night · ${sh.neighborhood}, ${sh.city}
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0;">
          <button class="btn btn-sm btn-primary" id="goBookWithHotel">Book this trip →</button>
          <button class="btn btn-sm btn-ghost" id="clearHotelSelection">✕ Clear</button>
        </div>
      </div>
    `;
    document.getElementById('clearHotelSelection').addEventListener('click', () => {
      state.selectedHotel = null;
      renderHotelsPage();
    });
    document.getElementById('goBookWithHotel').addEventListener('click', () => {
      // Pre-select the tier on booking page and navigate
      const tier = state.selectedHotel.tier;
      document.getElementById('stayTier').value = tier;
      document.querySelectorAll('.stay-btn').forEach(sb => {
        sb.classList.toggle('selected', sb.dataset.tier === tier);
      });
      if (state.selectedHotel.city) {
        document.getElementById('toCity').value = state.selectedHotel.city;
      }
      showToast(`${state.selectedHotel.name} locked in 🏨`);
      goToPage('booking');
      setTimeout(() => document.getElementById('step2').scrollIntoView({ behavior: 'smooth' }), 200);
    });
  } else {
    selectedBanner.hidden = true;
  }

  if (!city) {
    grid.innerHTML = '';
    noResults.hidden = false;
    noResults.innerHTML = `
      <div class="hotel-empty">
        <span class="hotel-empty-icon">🏨</span>
        <strong>Search a destination above</strong>
        <span>We have hotels for Goa, Manali, Ladakh, Delhi, Mumbai, Jaipur, Udaipur and more.</span>
      </div>
    `;
    return;
  }

  if (!hotels.length) {
    grid.innerHTML = '';
    noResults.hidden = false;
    noResults.innerHTML = `
      <div class="hotel-empty">
        <span class="hotel-empty-icon">🔍</span>
        <strong>No hotels found</strong>
        <span>Try a different city or tier filter. We currently cover major tourist destinations.</span>
      </div>
    `;
    return;
  }

  noResults.hidden = true;
  grid.innerHTML = hotels.map(h => renderHotelCard(h, state.selectedHotel && state.selectedHotel.id === h.id)).join('');

  grid.querySelectorAll('[data-select-hotel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.selectHotel;
      const allHotels = Object.values(HOTELS).flat();
      const hotel = allHotels.find(h => h.id === id);
      if (!hotel) return;

      if (state.selectedHotel && state.selectedHotel.id === id) {
        // Deselect
        state.selectedHotel = null;
        showToast('Hotel deselected');
      } else {
        state.selectedHotel = hotel;
        showToast(`${hotel.name} selected ✓`);
      }
      renderHotelsPage();
    });
  });
}

function initHotelsPage() {
  const cityInput  = document.getElementById('hotelCityInput');

  // City autocomplete for hotel search — re-render the grid when a city is picked
  bindCityAutocomplete(cityInput, document.getElementById('hotelCitySuggestions'), renderHotelsPage);

  cityInput.addEventListener('input', () => {
    // Debounce already in bindCityAutocomplete; also re-render on change
    setTimeout(renderHotelsPage, 180);
  });

  // Tier quick-filter buttons
  document.querySelectorAll('.hotel-tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hotel-tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      hotelTierFilter = btn.dataset.tier || '';
      renderHotelsPage();
    });
  });

  // Initial render (empty state)
  renderHotelsPage();
}
