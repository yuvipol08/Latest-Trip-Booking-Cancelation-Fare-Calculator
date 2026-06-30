/* ==================================================
   CHALO — recommendation.js
   Route comparison logic
   ================================================== */

function runRecommendation(from, to) {
  const distance = lookupDistance(from, to);

  const rows = Object.entries(MODES).map(([key, m]) => {
    const cost = computeTravelCost(key, distance, 1);
    const hours = distance / m.speedKmph;
    return { key, label: m.label, icon: m.icon, cost, hours, desc: m.desc };
  });

  // Find insights
  const cheapest  = rows.reduce((a, b) => b.cost < a.cost ? b : a);
  const fastest   = rows.reduce((a, b) => b.hours < a.hours ? b : a);
  const costs     = rows.map(r => r.cost);
  const hoursArr  = rows.map(r => r.hours);
  const cMin = Math.min(...costs), cMax = Math.max(...costs);
  const hMin = Math.min(...hoursArr), hMax = Math.max(...hoursArr);

  const bestValue = rows.reduce((best, r) => {
    const normCost  = cMax === cMin ? 0 : (r.cost - cMin) / (cMax - cMin);
    const normHours = hMax === hMin ? 0 : (r.hours - hMin) / (hMax - hMin);
    r._score = 0.5 * normCost + 0.5 * normHours;
    return (!best || r._score < best._score) ? r : best;
  }, null);

  // Insight cards
  document.getElementById('insightRow').innerHTML = `
    <div class="insight-card animate-up">
      <div class="insight-tag">💰 Cheapest</div>
      <div class="insight-mode">${cheapest.icon} ${cheapest.label}</div>
      <div class="insight-detail">${formatCurrency(cheapest.cost)} per person</div>
    </div>
    <div class="insight-card animate-up" style="animation-delay:60ms">
      <div class="insight-tag">⚡ Fastest</div>
      <div class="insight-mode">${fastest.icon} ${fastest.label}</div>
      <div class="insight-detail">${formatDuration(fastest.hours)} journey</div>
    </div>
    <div class="insight-card animate-up" style="animation-delay:120ms">
      <div class="insight-tag">⭐ Best value</div>
      <div class="insight-mode">${bestValue.icon} ${bestValue.label}</div>
      <div class="insight-detail">Best balance of cost & speed</div>
    </div>
  `;

  document.getElementById('distanceInfo').textContent =
    `Route: ${from} → ${to} · Estimated distance: ~${distance} km`;

  // Comparison table
  document.getElementById('compareTable').innerHTML = `
    <div class="compare-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Transport</th>
            <th>Cost / person</th>
            <th>Duration</th>
            <th>Best for</th>
            <th>Highlights</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const isBest = r.key === bestValue.key;
            const badges = [];
            if (r.key === cheapest.key)  badges.push('<span class="pill pill-ok">Cheapest</span>');
            if (r.key === fastest.key)   badges.push('<span class="pill pill-warn">Fastest</span>');
            if (r.key === bestValue.key) badges.push('<span class="pill pill-rec">Best value</span>');
            return `
            <tr class="${isBest ? 'is-best' : ''}">
              <td class="mode-cell">${r.icon} ${r.label}</td>
              <td><strong>${formatCurrency(r.cost)}</strong></td>
              <td>${formatDuration(r.hours)}</td>
              <td>${r.desc}</td>
              <td>${badges.join(' ') || '—'}</td>
              <td>
                <button type="button" class="btn btn-sm btn-secondary" data-use-route-mode="${r.key}" data-from="${from}" data-to="${to}">
                  Book with ${r.label}
                </button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('[data-use-route-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.draft.mode = btn.dataset.useRouteMode;
      prefillBooking(btn.dataset.from, btn.dataset.to);
      renderModeGrid();
      showToast(`${MODES[state.draft.mode].icon} ${MODES[state.draft.mode].label} selected`);
    });
  });

  document.getElementById('recoResults').hidden = false;
}

function initRecommendationPage() {
  bindCityAutocomplete(document.getElementById('recoFrom'), document.getElementById('recoFromSuggestions'));
  bindCityAutocomplete(document.getElementById('recoTo'), document.getElementById('recoToSuggestions'));

  document.getElementById('recoForm').addEventListener('submit', e => {
    e.preventDefault();
    const from = document.getElementById('recoFrom').value.trim();
    const to   = document.getElementById('recoTo').value.trim();
    if (!from || !to) return;
    if (from.toLowerCase() === to.toLowerCase()) {
      showToast('From and To can\'t be the same city');
      return;
    }
    runRecommendation(from, to);
  });

  document.getElementById('swapCitiesBtn').addEventListener('click', () => {
    const fromEl = document.getElementById('recoFrom');
    const toEl   = document.getElementById('recoTo');
    [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  });
}