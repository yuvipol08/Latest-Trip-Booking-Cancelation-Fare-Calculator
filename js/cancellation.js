/* ==================================================
   TravelEase — cancellation.js
   Booking cancellation and refund logic
   ================================================== */

function lookupBooking(idRaw) {
  const id = idRaw.trim().toUpperCase();
  return state.bookings.find(b => b.id === id) || null;
}

function renderCancelResult(booking) {
  const result = document.getElementById('cancelResult');

  if (!booking) {
    result.innerHTML = `
      <div class="banner banner-bad">
        <span class="banner-icon">✕</span>
        <div>
          No active booking found with that ID.
          Check your <button type="button" style="background:none;border:none;color:var(--rust);text-decoration:underline;cursor:pointer;font-size:inherit;padding:0;" data-nav="profile">booking history</button>
          or try another ID.
        </div>
      </div>`;
    result.querySelector('[data-nav]').addEventListener('click', e => {
      renderProfile();
      goToPage(e.target.dataset.nav);
    });
    return;
  }

  const days = daysBetweenToday(booking.date);
  const tier = getRefundTier(days);
  const refundAmount = Math.round(booking.totalCost * (tier.percent / 100));

  result.innerHTML = `
    <div class="ticket">
      <div class="ticket-header">
        <div>
          <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;">Cancellation preview</div>
          <div class="ticket-id">${booking.id}</div>
        </div>
        <span class="ticket-badge" style="background:var(--rust-soft);color:var(--rust);">PENDING CANCEL</span>
      </div>

      <div class="ticket-row"><span class="k">Route</span><span class="v">${booking.from} → ${booking.to}</span></div>
      <div class="ticket-row"><span class="k">Transport</span><span class="v">${MODES[booking.mode].icon} ${MODES[booking.mode].label}</span></div>
      <div class="ticket-row"><span class="k">Travel date</span><span class="v">${booking.date} (${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ${days >= 0 ? 'away' : 'ago'})</span></div>
      <div class="ticket-row"><span class="k">Original cost</span><span class="v">${formatCurrency(booking.totalCost)}</span></div>

      <table class="refund-tier-table">
        <tr class="${days > 7 ? 'active-tier' : ''}">
          <td>More than 7 days before travel</td>
          <td style="text-align:right;font-family:var(--font-mono);">Full refund (100%)</td>
        </tr>
        <tr class="${days >= 2 && days <= 7 ? 'active-tier' : ''}">
          <td>2–7 days before travel</td>
          <td style="text-align:right;font-family:var(--font-mono);">Partial refund (50%)</td>
        </tr>
        <tr class="${days < 2 ? 'active-tier' : ''}">
          <td>Less than 2 days before travel</td>
          <td style="text-align:right;font-family:var(--font-mono);">No refund (0%)</td>
        </tr>
      </table>

      <div style="font-size:13px;color:var(--text-dim);margin-bottom:6px;">Your refund — ${tier.label}:</div>
      <span class="refund-amount flip">${formatCurrency(refundAmount)}</span>

      <div class="ticket-actions">
        <button class="btn btn-danger" id="confirmCancelBtn">Confirm cancellation</button>
        <button class="btn btn-ghost" id="keepBookingBtn">Keep my booking</button>
      </div>
    </div>
  `;

  document.getElementById('keepBookingBtn').addEventListener('click', () => {
    result.innerHTML = '';
    document.getElementById('cancelBookingId').value = '';
  });

  document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    state.bookings = state.bookings.filter(b => b.id !== booking.id);
    state.cancellations.push({
      id: booking.id,
      from: booking.from,
      to: booking.to,
      refundPercent: tier.percent,
      refundAmount,
      cancelledOn: todayISO(),
    });
    if (typeof persistData === 'function') persistData();

    result.innerHTML = `
      <div class="banner banner-ok">
        <span class="banner-icon">✓</span>
        <div>
          ${booking.id} cancelled. Refund of <strong>${formatCurrency(refundAmount)}</strong> recorded.
          <button type="button" data-nav="profile" style="background:none;border:none;color:var(--green);text-decoration:underline;cursor:pointer;font-size:inherit;padding:0;margin-left:6px;">View history →</button>
        </div>
      </div>`;
    result.querySelector('[data-nav]').addEventListener('click', () => {
      renderProfile();
      goToPage('profile');
    });
    document.getElementById('cancelBookingId').value = '';
    renderCancelPageBookingList();
    showToast(`${booking.id} cancelled`);
  });
}

function renderCancelPageBookingList() {
  const el = document.getElementById('cancelPageBookingList');
  if (!el) return;
  if (!state.bookings.length) {
    el.innerHTML = `<p style="font-size:13px;color:var(--text-faint);">No active bookings.</p>`;
    return;
  }
  el.innerHTML = state.bookings.map(b => `
    <div class="booking-quick" data-prefill="${b.id}">
      <div class="bq-id">${b.id}</div>
      <div class="bq-route">${b.from} → ${b.to}</div>
      <div class="bq-use">Tap to look up</div>
    </div>
  `).join('');
  el.querySelectorAll('[data-prefill]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.prefill;
      document.getElementById('cancelBookingId').value = id;
      renderCancelResult(lookupBooking(id));
    });
  });

  // If the input already has a value (prefilled from profile), trigger lookup automatically
  const existingId = (document.getElementById('cancelBookingId') || {}).value || '';
  if (existingId.trim()) {
    renderCancelResult(lookupBooking(existingId));
  }
}

function initCancellationPage() {
  document.getElementById('cancelLookupForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('cancelBookingId').value;
    if (!id.trim()) return;
    renderCancelResult(lookupBooking(id));
  });
}