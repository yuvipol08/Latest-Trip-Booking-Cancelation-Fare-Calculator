/* ==================================================
   TravelEase — engine.js
   All pricing calculations and business logic
   ================================================== */

function normalizeCity(name) {
  let c = (name || '').trim().toLowerCase();
  if (CITY_ALIASES[c]) c = CITY_ALIASES[c];
  return c;
}

function hashDistance(a, b) {
  const s = [a, b].sort().join('|');
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return 200 + (hash % 1800);
}

function lookupDistance(fromRaw, toRaw) {
  const from = normalizeCity(fromRaw), to = normalizeCity(toRaw);
  if (!from || !to) return 0;
  if (from === to) return 5;
  for (const [a, b, km] of DISTANCES) {
    if ((a === from && b === to) || (a === to && b === from)) return km;
  }
  return hashDistance(from, to);
}

function computeTravelCost(modeKey, distanceKm, people) {
  const m = MODES[modeKey];
  const perUnit = m.base + m.perKm * distanceKm;
  if (m.perVehicle) {
    const vehicles = Math.ceil(people / 4);
    return Math.round(perUnit * vehicles);
  }
  return Math.round(perUnit * people);
}

function getTiming(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const travel = new Date(dateStr); travel.setHours(0, 0, 0, 0);
  const days = Math.round((travel - today) / 86400000);
  if (days <= 2)  return { mult: 1.25, label: 'Last-minute booking', tone: 'immediate', note: 'Travelling within 2 days adds a 25% last-minute surcharge.', days };
  if (days <= 14) return { mult: 1.0,  label: 'Standard booking',    tone: 'standard',  note: 'Booking 3–14 days ahead — standard fares apply.',            days };
  return             { mult: 0.85, label: 'Early-bird booking',   tone: 'early',     note: 'Booking 15+ days ahead gives a 15% early-bird discount.',    days };
}

function computeFoodCost(nights, people) {
  const days = nights + 1;
  return Math.round(FOOD_PER_DAY_PER_PERSON * days * people);
}

function computeAccommodationCost(stayTierKey, nights, people) {
  const tier = STAY_TIERS[stayTierKey];
  const rooms = Math.ceil(people / 2);
  return Math.round(tier.perNight * rooms * nights);
}

function getRefundTier(days) {
  if (days > 7)  return { percent: 100, label: 'Full refund',    tone: 'ok' };
  if (days >= 2) return { percent: 50,  label: 'Partial refund', tone: 'warn' };
  return               { percent: 0,   label: 'No refund',       tone: 'bad' };
}

function generateCombos(distanceKm, nights, people, dateStr, budget) {
  const tm = getTiming(dateStr);
  const food = computeFoodCost(nights, people);
  const combos = [];

  for (const modeKey in MODES) {
    const travel = Math.round(computeTravelCost(modeKey, distanceKm, people) * tm.mult);
    for (const tierKey in STAY_TIERS) {
      const stay = computeAccommodationCost(tierKey, nights, people);
      const total = travel + food + stay;
      combos.push({
        modeKey, tierKey, travel, food, stay, total,
        withinBudget: total <= budget,
        comfort: MODES[modeKey].comfort + STAY_TIERS[tierKey].comfort,
      });
    }
  }

  // Best = highest comfort within budget, tie-break by lowest cost
  const within = combos.filter(c => c.withinBudget);
  let recommended = null;
  if (within.length) {
    recommended = within.reduce((best, c) => {
      if (!best) return c;
      if (c.comfort > best.comfort) return c;
      if (c.comfort === best.comfort && c.total < best.total) return c;
      return best;
    }, null);
  }

  combos.sort((a, b) => {
    if (a.withinBudget !== b.withinBudget) return a.withinBudget ? -1 : 1;
    return a.total - b.total;
  });

  return { combos, recommended, timing: tm, foodCost: food };
}