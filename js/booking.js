/* ==================================================
   CHALO — booking.js
   All booking page logic: form, calculation, confirmation
   ================================================== */

function renderModeGrid() {
  const grid = document.getElementById('modeGrid');
  grid.innerHTML = Object.entries(MODES).map(([key, m]) => `
    <button type="button" class="mode-btn${state.draft.mode === key ? ' selected' : ''}" data-mode="${key}">
      <span class="ic">${m.icon}</span>
      <span class="lbl">${m.label}</span>
      <span class="sub">${m.desc} · ${m.speedKmph} km/h</span>
    </button>
  `).join('');
  grid.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.draft.mode = btn.dataset.mode;
      renderModeGrid();
    });
  });
}

function readBookingForm() {
  return {
    from:     document.getElementById('fromCity').value.trim(),
    to:       document.getElementById('toCity').value.trim(),
    date:     document.getElementById('travelDate').value,
    nights:   parseInt(document.getElementById('tripNights').value, 10),
    people:   parseInt(document.getElementById('numPeople').value, 10),
    budget:   parseFloat(document.getElementById('totalBudget').value),
    stayTier: document.getElementById('stayTier').value,
  };
}

function validateBookingForm(f) {
  if (!state.draft.mode) return 'Pick a transport mode above first.';
  if (!f.from || !f.to)  return 'Enter both a "From" and "To" city.';
  if (f.from.toLowerCase() === f.to.toLowerCase()) return '"From" and "To" can\'t be the same city.';
  if (!f.date)           return 'Pick a travel date.';
  if (daysBetweenToday(f.date) < 0) return 'Travel date can\'t be in the past.';
  if (!f.nights || f.nights < 1)    return 'Trip needs at least 1 night.';
  if (!f.people || f.people < 1)    return 'Enter at least 1 traveller.';
  if (!f.budget || f.budget < 500)  return 'Enter a budget of at least ₹500.';
  return null;
}

function runCalculation() {
  const f = readBookingForm();
  const err = validateBookingForm(f);
  const errEl = document.getElementById('formError');

  if (err) {
    errEl.textContent = err;
    document.getElementById('bookingResults').hidden = true;
    return;
  }
  errEl.textContent = '';

  const distance = lookupDistance(f.from, f.to);
  const timing = getTiming(f.date);
  const travelCost = Math.round(computeTravelCost(state.draft.mode, distance, f.people) * timing.mult);
  const foodCost = computeFoodCost(f.nights, f.people);
  const accommodationCost = computeAccommodationCost(f.stayTier, f.nights, f.people);
  const totalCost = travelCost + foodCost + accommodationCost;
  const { combos, recommended } = generateCombos(distance, f.nights, f.people, f.date, f.budget);

  state.draft.lastCalc = { f, distance, timing, travelCost, foodCost, accommodationCost, totalCost, combos, recommended };

  renderTimingStep(timing);
  renderCostStep(travelCost, foodCost, accommodationCost, totalCost);
  renderBudgetCheck(totalCost, f.budget);
  renderBudgetSplit(f.budget, travelCost, foodCost, accommodationCost);
  renderCombos(combos, recommended, f.budget);

  // Reset confirm area
  document.getElementById('bookingTicket').hidden = true;
  document.getElementById('confirmArea').hidden = false;
  const confirmBtn = document.getElementById('confirmBookingBtn');
  if (confirmBtn) confirmBtn.disabled = false;
  document.getElementById('bookingResults').hidden = false;

  // Scroll to results
  setTimeout(() => {
    document.getElementById('step3').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderTimingStep(timing) {
  const tb = document.getElementById('timingBanner');
  tb.className = `timing-banner ${timing.tone}`;
  const dayLabel = timing.days === 0 ? 'today' : `${Math.abs(timing.days)} day${Math.abs(timing.days) === 1 ? '' : 's'} ${timing.days > 0 ? 'away' : 'ago'}`;
  tb.innerHTML = `
    <span class="timing-badge">${timing.label}</span>
    <span class="timing-note">${timing.note} Travel date is <strong>${dayLabel}</strong>.</span>
  `;
}

function renderCostStep(travel, food, accommodation, total) {
  document.getElementById('costGrid').innerHTML = `
    <div class="cost-card">
      <div class="cost-lbl">Transport</div>
      <span class="cost-amt flip">${formatCurrency(travel)}</span>
    </div>
    <div class="cost-card">
      <div class="cost-lbl">Food estimate</div>
      <span class="cost-amt flip">${formatCurrency(food)}</span>
    </div>
    <div class="cost-card">
      <div class="cost-lbl">Accommodation</div>
      <span class="cost-amt flip">${formatCurrency(accommodation)}</span>
    </div>
    <div class="cost-card total">
      <div class="cost-lbl">Total estimate</div>
      <span class="cost-amt flip">${formatCurrency(total)}</span>
    </div>
  `;
}

function renderBudgetCheck(totalCost, budget) {
  const over = totalCost > budget;
  const pct = Math.min(Math.round((totalCost / budget) * 100), 200);
  const gaugeColor = over ? 'var(--rust)' : (pct > 85 ? 'var(--amber)' : 'var(--green)');

  document.getElementById('budgetCheck').innerHTML = `
    <div class="budget-check-banner ${over ? 'over' : 'ok'}">
      <span>${over ? '⚠️' : '✓'}</span>
      <span>
        ${over
          ? `This plan is <strong>${formatCurrency(totalCost - budget)}</strong> over your budget. Check step 7 for cheaper combos.`
          : `Fits your budget with <strong>${formatCurrency(budget - totalCost)}</strong> to spare.`}
      </span>
    </div>
  `;
  document.getElementById('budgetGaugeWrap').innerHTML = `
    <div class="gauge-track" style="margin-top:12px;">
      <div class="gauge-fill" style="width:${Math.min(pct, 100)}%; background:${gaugeColor};"></div>
    </div>
    <div class="gauge-labels">
      <span>₹0</span>
      <span>${formatCurrency(totalCost)} spent</span>
      <span>Budget: ${formatCurrency(budget)}</span>
    </div>
  `;
}

function renderBudgetSplit(budget, travel, food, accommodation) {
  document.getElementById('budgetEcho').textContent = budget.toLocaleString('en-IN');
  const buffer = Math.max(budget - travel - food - accommodation, 0);
  const splitDefs = [
    { key: 'Transport',      amt: travel,        pct: travel / budget,        color: 'var(--violet)' },
    { key: 'Food',           amt: food,           pct: food / budget,           color: 'var(--teal)' },
    { key: 'Accommodation',  amt: accommodation,  pct: accommodation / budget,  color: 'var(--green)' },
    { key: 'Buffer',         amt: buffer,         pct: buffer / budget,         color: '#B2ADCB' },
  ].filter(s => s.pct > 0);

  document.getElementById('splitBar').innerHTML = splitDefs.map(s => `
    <div class="split-seg" style="width:${Math.max(s.pct * 100, 2)}%; background:${s.color};">
      ${s.pct > 0.12 ? Math.round(s.pct * 100) + '%' : ''}
    </div>
  `).join('');

  document.getElementById('splitLegend').innerHTML = splitDefs.map(s => `
    <div class="item">
      <span class="dot" style="background:${s.color};"></span>
      <span>${s.key}</span>
      <span class="amt">${formatCurrency(s.amt)}</span>
    </div>
  `).join('');
}

function renderCombos(combos, recommended, budget) {
  const withinCount = combos.filter(c => c.withinBudget).length;
  document.getElementById('comboTable').innerHTML = `
    ${withinCount === 0 ? `<div class="banner banner-warn" style="margin-bottom:14px;"><span class="banner-icon">⚠️</span><div>No combo fits your budget. Raise it or try a smaller number of nights/people.</div></div>` : ''}
    <div class="combo-wrap">
      <table class="combo-table">
        <thead>
          <tr>
            <th>Transport</th>
            <th>Stay</th>
            <th>Travel</th>
            <th>Stay cost</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${combos.map(c => {
            const isRec = recommended && c.modeKey === recommended.modeKey && c.tierKey === recommended.tierKey;
            return `
            <tr class="${isRec ? 'is-rec' : ''} ${!c.withinBudget ? 'is-over' : ''}">
              <td class="mode-cell">${MODES[c.modeKey].icon} ${MODES[c.modeKey].label}</td>
              <td>${STAY_TIERS[c.tierKey].label}</td>
              <td>${formatCurrency(c.travel)}</td>
              <td>${formatCurrency(c.stay)}</td>
              <td><strong>${formatCurrency(c.total)}</strong></td>
              <td>
                ${isRec
                  ? '<span class="pill pill-rec">✓ Best pick</span>'
                  : c.withinBudget
                    ? '<span class="pill pill-ok">Within budget</span>'
                    : '<span class="pill pill-over">Over budget</span>'}
              </td>
              <td>
                <button type="button" class="btn btn-sm btn-secondary" data-use-mode="${c.modeKey}" data-use-tier="${c.tierKey}">
                  Use this
                </button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  document.querySelectorAll('[data-use-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.draft.mode = btn.dataset.useMode;
      document.getElementById('stayTier').value = btn.dataset.useTier;
      // Sync stay selector UI
      document.querySelectorAll('.stay-btn').forEach(sb => {
        sb.classList.toggle('selected', sb.dataset.tier === btn.dataset.useTier);
      });
      renderModeGrid();
      runCalculation();
    });
  });
}

function confirmBooking() {
  const calc = state.draft.lastCalc;
  if (!calc) return;

  // Prevent double-booking if button is clicked twice
  const confirmBtn = document.getElementById('confirmBookingBtn');
  if (confirmBtn) confirmBtn.disabled = true;

  const booking = {
    id:              generateBookingId(),
    from:            calc.f.from,
    to:              calc.f.to,
    date:            calc.f.date,
    nights:          calc.f.nights,
    people:          calc.f.people,
    mode:            state.draft.mode,
    stayTier:        calc.f.stayTier,
    travelCost:      calc.travelCost,
    foodCost:        calc.foodCost,
    accommodationCost: calc.accommodationCost,
    totalCost:       calc.totalCost,
    budget:          calc.f.budget,
    bookedOn:        todayISO(),
    status:          'active',
    distance:        calc.distance,
  };
  state.bookings.push(booking);
  if (typeof persistData === 'function') persistData();

  document.getElementById('confirmArea').hidden = true;
  const ticket = document.getElementById('bookingTicket');
  ticket.hidden = false;
  ticket.innerHTML = `
    <div class="ticket-header">
      <div>
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;">Booking confirmed</div>
        <div class="ticket-id flip">${booking.id}</div>
      </div>
      <span class="ticket-badge">CONFIRMED</span>
    </div>
    <div class="ticket-row"><span class="k">Route</span><span class="v">${booking.from} → ${booking.to}</span></div>
    <div class="ticket-row"><span class="k">Transport</span><span class="v">${MODES[booking.mode].icon} ${MODES[booking.mode].label}</span></div>
    <div class="ticket-row"><span class="k">Travel date</span><span class="v">${booking.date}</span></div>
    <div class="ticket-row"><span class="k">Travellers</span><span class="v">${booking.people} people · ${booking.nights} nights</span></div>
    <div class="ticket-row"><span class="k">Stay</span><span class="v">${
      state.selectedHotel && state.selectedHotel.city.toLowerCase() === booking.to.toLowerCase()
        ? `${state.selectedHotel.img} ${state.selectedHotel.name}`
        : STAY_TIERS[booking.stayTier].label
    }</span></div>
    <div class="ticket-row"><span class="k">Distance</span><span class="v">~${booking.distance} km</span></div>
    <div class="ticket-row"><span class="k">Total cost</span><span class="v" style="color:var(--violet);font-size:16px;">${formatCurrency(booking.totalCost)}</span></div>
    <div class="ticket-actions">
      <button class="btn btn-secondary btn-sm" data-nav="profile">View in profile</button>
      <button class="btn btn-ghost btn-sm" id="planAnotherBtn">Plan another trip</button>
    </div>
  `;

  ticket.querySelector('[data-nav]').addEventListener('click', () => {
    renderProfile();
    goToPage('profile');
  });
  ticket.querySelector('#planAnotherBtn').addEventListener('click', resetBookingWizard);
  showToast(`✓ Booking ${booking.id} confirmed!`);
}

function resetBookingWizard() {
  document.getElementById('fromCity').value = '';
  document.getElementById('toCity').value = '';
  document.getElementById('tripNights').value = 3;
  document.getElementById('numPeople').value = 2;
  document.getElementById('totalBudget').value = '';
  document.getElementById('stayTier').value = 'midrange';
  document.querySelectorAll('.stay-btn').forEach(sb => {
    sb.classList.toggle('selected', sb.dataset.tier === 'midrange');
  });
  state.draft.mode = null;
  state.draft.lastCalc = null;
  renderModeGrid();
  document.getElementById('bookingResults').hidden = true;
  document.getElementById('bookingTicket').hidden = true;
  document.getElementById('formError').textContent = '';

  // Reset confirm area to its default state
  const confirmArea = document.getElementById('confirmArea');
  confirmArea.hidden = false;
  confirmArea.innerHTML = `
    <p class="step-desc">Happy with this plan? Confirm to generate your booking ID.</p>
    <button class="btn btn-primary btn-lg" id="confirmBookingBtn">Confirm booking →</button>
  `;
  document.getElementById('confirmBookingBtn').addEventListener('click', confirmBooking);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBookingPage() {
  renderModeGrid();

  // Date default: 7 days from now
  const dateInput = document.getElementById('travelDate');
  dateInput.min = todayISO();
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  dateInput.value = defaultDate.toISOString().slice(0, 10);

  // Number stepper buttons
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const val = parseInt(target.value, 10) || 0;
      const step = 1;
      const min = parseInt(target.min, 10) || 1;
      const max = parseInt(target.max, 10) || Infinity;
      if (btn.dataset.action === 'inc') target.value = Math.min(max, val + step);
      if (btn.dataset.action === 'dec') target.value = Math.max(min, val - step);
    });
  });

  // Clamp manual entry in the number inputs to their min/max
  document.querySelectorAll('.number-input-wrap input[type="number"]').forEach(input => {
    input.addEventListener('change', () => {
      const min = parseInt(input.min, 10) || 1;
      const max = parseInt(input.max, 10) || Infinity;
      let v = parseInt(input.value, 10);
      if (isNaN(v)) v = min;
      input.value = Math.min(max, Math.max(min, v));
    });
  });

  // Stay selector
  document.querySelectorAll('.stay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stay-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('stayTier').value = btn.dataset.tier;
    });
  });

  // City autocomplete
  bindCityAutocomplete(document.getElementById('fromCity'), document.getElementById('fromSuggestions'));
  bindCityAutocomplete(document.getElementById('toCity'), document.getElementById('toSuggestions'));

  document.getElementById('calculateBtn').addEventListener('click', runCalculation);
  document.getElementById('confirmBookingBtn').addEventListener('click', confirmBooking);
}