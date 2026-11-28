/**
 * Unified Pure-White Sensibull Option Chain Engine (option-chain-engine.js)
 * Shared across Admin Live Option Chain, Admin 3-Strike Modal, and Subscriber Dashboard.
 * Strictly Read-Only market data module (zero order execution capability).
 */
(function (global) {
  "use strict";

  // ========================================================
  // 1. MULTI-INDEX CATALOG & EXACT BASELINES (NSE / BSE)
  // ========================================================
  const OC_INDEX_CATALOG = {
    NIFTY: {
      symbol: "NIFTY",
      label: "NIFTY 50",
      exchange: "NSE",
      dhanId: 13,
      dhanSeg: "IDX_I",
      step: 50,
      lotSize: 65,
      weeklyDay: 2, // Tuesday
      hasWeekly: true,
      baseSpot: 25607.20,
      prevClose: 25884.50,
      baseIv: 14.20,
      ivPercentile: "63.00 - High",
      strikeSpan: 10 // ATM +/- 10 strikes
    },
    BANKNIFTY: {
      symbol: "BANKNIFTY",
      label: "BANK NIFTY",
      exchange: "NSE",
      dhanId: 25,
      dhanSeg: "IDX_I",
      step: 100,
      lotSize: 30,
      weeklyDay: 2,
      hasWeekly: false,
      baseSpot: 63040.90,
      prevClose: 63535.30,
      baseIv: 15.80,
      ivPercentile: "54.00 - Medium",
      strikeSpan: 10
    },
    FINNIFTY: {
      symbol: "FINNIFTY",
      label: "FINNIFTY",
      exchange: "NSE",
      dhanId: 27,
      dhanSeg: "IDX_I",
      step: 50,
      lotSize: 65,
      weeklyDay: 2,
      hasWeekly: false,
      baseSpot: 28337.15,
      prevClose: 28718.90,
      baseIv: 14.90,
      ivPercentile: "58.00 - Medium",
      strikeSpan: 10
    },
    MIDCPNIFTY: {
      symbol: "MIDCPNIFTY",
      label: "MIDCPNIFTY",
      exchange: "NSE",
      dhanId: 442,
      dhanSeg: "IDX_I",
      step: 25,
      lotSize: 120,
      weeklyDay: 2,
      hasWeekly: false,
      baseSpot: 14360.25,
      prevClose: 14340.60,
      baseIv: 16.40,
      ivPercentile: "49.00 - Medium",
      strikeSpan: 10
    },
    SENSEX: {
      symbol: "SENSEX",
      label: "SENSEX",
      exchange: "BSE",
      dhanId: 51,
      dhanSeg: "IDX_I",
      step: 100,
      lotSize: 20,
      weeklyDay: 4, // Thursday
      hasWeekly: true,
      baseSpot: 83339.26,
      prevClose: 84328.59,
      baseIv: 14.50,
      ivPercentile: "61.00 - High",
      strikeSpan: 10
    }
  };

  // Exact NIFTY 50 Reference Strikes from User's Dhan/Sensibull Screenshot (25200..26150)
  const NIFTY_SCREENSHOT_SNAPSHOT = {
    25200: { ceLtp: 413.20, ceChgPct: -44.40, ceOi: 4.48,   ceOiChgPct: -0.01,  peLtp: 26.65,  peChgPct: 106.59, peOi: 70.54, peOiChgPct: -8.98 },
    25250: { ceLtp: 369.55, ceChgPct: -47.04, ceOi: 1.41,   ceOiChgPct: 3.14,   peLtp: 35.10,  peChgPct: 121.45, peOi: 25.49, peOiChgPct: 6.70 },
    25300: { ceLtp: 331.45, ceChgPct: -49.02, ceOi: 6.02,   ceOiChgPct: -20.75, peLtp: 44.80,  peChgPct: 135.41, peOi: 58.76, peOiChgPct: -5.10 },
    25350: { ceLtp: 292.90, ceChgPct: -51.35, ceOi: 2.49,   ceOiChgPct: 10.78,  peLtp: 57.65,  peChgPct: 146.90, peOi: 18.69, peOiChgPct: 14.97 },
    25400: { ceLtp: 257.75, ceChgPct: -53.92, ceOi: 13.28,  ceOiChgPct: -29.50, peLtp: 71.60,  peChgPct: 153.45, peOi: 59.50, peOiChgPct: 9.73 },
    25450: { ceLtp: 225.00, ceChgPct: -56.20, ceOi: 4.20,   ceOiChgPct: 68.98,  peLtp: 89.70,  peChgPct: 161.14, peOi: 23.67, peOiChgPct: 6.29 },
    25500: { ceLtp: 194.55, ceChgPct: -58.80, ceOi: 33.94,  ceOiChgPct: 31.78,  peLtp: 110.50, peChgPct: 166.59, peOi: 74.87, peOiChgPct: -1.16 },
    25550: { ceLtp: 167.10, ceChgPct: -61.19, ceOi: 11.20,  ceOiChgPct: 250.68, peLtp: 133.40, peChgPct: 166.53, peOi: 18.32, peOiChgPct: 9.65 },
    25600: { ceLtp: 143.75, ceChgPct: -63.16, ceOi: 53.94,  ceOiChgPct: 351.73, peLtp: 158.25, peChgPct: 164.41, peOi: 55.10, peOiChgPct: -10.28 },
    25650: { ceLtp: 122.00, ceChgPct: -65.25, ceOi: 29.21,  ceOiChgPct: 648.83, peLtp: 187.25, peChgPct: 161.52, peOi: 18.45, peOiChgPct: -9.44 },
    25700: { ceLtp: 103.10, ceChgPct: -67.21, ceOi: 79.01,  ceOiChgPct: 352.85, peLtp: 218.85, peChgPct: 154.62, peOi: 44.34, peOiChgPct: -5.98 },
    25750: { ceLtp: 88.35,  ceChgPct: -68.60, ceOi: 48.17,  ceOiChgPct: 372.61, peLtp: 252.10, peChgPct: 146.79, peOi: 16.12, peOiChgPct: -39.38 },
    25800: { ceLtp: 74.60,  ceChgPct: -70.09, ceOi: 135.19, ceOiChgPct: 239.71, peLtp: 290.85, peChgPct: 145.19, peOi: 46.95, peOiChgPct: -15.26 },
    25850: { ceLtp: 62.55,  ceChgPct: -71.47, ceOi: 77.72,  ceOiChgPct: 336.69, peLtp: 328.35, peChgPct: 135.71, peOi: 13.95, peOiChgPct: -30.27 },
    25900: { ceLtp: 52.65,  ceChgPct: -72.64, ceOi: 115.14, ceOiChgPct: 88.03,  peLtp: 371.00, peChgPct: 130.72, peOi: 28.59, peOiChgPct: -41.95 },
    25950: { ceLtp: 44.60,  ceChgPct: -73.25, ceOi: 52.17,  ceOiChgPct: 73.21,  peLtp: 408.15, peChgPct: 120.15, peOi: 6.37,  peOiChgPct: -53.06 },
    26000: { ceLtp: 37.30,  ceChgPct: -74.00, ceOi: 181.39, ceOiChgPct: 66.72,  peLtp: 454.10, peChgPct: 114.19, peOi: 25.85, peOiChgPct: -28.29 },
    26050: { ceLtp: 31.30,  ceChgPct: -74.26, ceOi: 37.50,  ceOiChgPct: 126.26, peLtp: 495.00, peChgPct: 105.59, peOi: 1.86,  peOiChgPct: -30.01 },
    26100: { ceLtp: 25.70,  ceChgPct: -75.13, ceOi: 89.03,  ceOiChgPct: 127.00, peLtp: 540.25, peChgPct: 98.73,  peOi: 3.95,  peOiChgPct: -19.61 },
    26150: { ceLtp: 21.20,  ceChgPct: -75.50, ceOi: 38.42,  ceOiChgPct: 34.14,  peLtp: 589.00, peChgPct: 92.90,  peOi: 0.98,  peOiChgPct: -16.21 }
  };

  // ========================================================
  // 2. IST MARKET-HOURS CLOCK & REAL-TIME STATE
  // ========================================================
  function getISTNow() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + 5.5 * 3600000);
  }

  function isIndianMarketOpen(istDate) {
    const d = istDate || getISTNow();
    const day = d.getDay(); // 0 = Sun, 6 = Sat (Open Mon-Fri)
    if (day === 0 || day === 6) return false;
    const mins = d.getHours() * 60 + d.getMinutes();
    return mins >= (9 * 60) && mins <= (15 * 60 + 40);
  }

  function formatISTDateISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatShortDate(d) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }

  function formatExpiryTag(daysLeft, isWeekly) {
    if (daysLeft <= 0) return { sub: "Today", isWeekly };
    if (daysLeft === 1) return { sub: "1 day", isWeekly };
    if (daysLeft < 14) return { sub: `${daysLeft} days`, isWeekly };
    const wks = Math.floor(daysLeft / 7);
    return { sub: `${wks} week${wks > 1 ? "s" : ""}`, isWeekly };
  }

  // Generate dynamic upcoming expiries anchored cleanly to current IST date
  function buildExpiriesForIndex(symbol) {
    const cfg = OC_INDEX_CATALOG[symbol] || OC_INDEX_CATALOG.NIFTY;
    const istNow = getISTNow();
    const todayMidnight = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
    const results = [];

    if (cfg.hasWeekly) {
      // Find next target weeklyDay (2 = Tuesday for NIFTY, 4 = Thursday for SENSEX)
      const cursor = new Date(todayMidnight);
      let diff = (cfg.weeklyDay - cursor.getDay() + 7) % 7;
      if (diff === 0 && (istNow.getHours() * 60 + istNow.getMinutes()) > (15 * 60 + 40)) {
        diff = 7;
      }
      cursor.setDate(cursor.getDate() + diff);

      for (let i = 0; i < 6; i++) {
        const expDate = new Date(cursor);
        expDate.setDate(cursor.getDate() + i * 7);
        const daysLeft = Math.round((expDate - todayMidnight) / 86400000);
        const nextWeek = new Date(expDate);
        nextWeek.setDate(expDate.getDate() + 7);
        const isMonthly = nextWeek.getMonth() !== expDate.getMonth();
        const tag = formatExpiryTag(daysLeft, !isMonthly);
        const iso = formatISTDateISO(expDate);
        const short = formatShortDate(expDate);
        const ddMonYyyy = `${String(expDate.getDate()).padStart(2, "0")}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][expDate.getMonth()]}-${expDate.getFullYear()}`;
        results.push({
          iso,
          key: ddMonYyyy,
          short,
          label: `${short} (${tag.sub})`,
          daysLeft: Math.max(1, daysLeft),
          isWeekly: !isMonthly,
          isMonthly
        });
      }
    } else {
      // Monthly contracts (last Tuesday/Thursday of each month)
      for (let mOff = 0; mOff < 5; mOff++) {
        const y = todayMidnight.getFullYear() + Math.floor((todayMidnight.getMonth() + mOff) / 12);
        const m = (todayMidnight.getMonth() + mOff) % 12;
        const lastDay = new Date(y, m + 1, 0);
        const back = (lastDay.getDay() - cfg.weeklyDay + 7) % 7;
        lastDay.setDate(lastDay.getDate() - back);
        if (lastDay >= todayMidnight) {
          const daysLeft = Math.max(1, Math.round((lastDay - todayMidnight) / 86400000));
          const tag = formatExpiryTag(daysLeft, false);
          const iso = formatISTDateISO(lastDay);
          const short = formatShortDate(lastDay);
          const ddMonYyyy = `${String(lastDay.getDate()).padStart(2, "0")}-${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][lastDay.getMonth()]}-${lastDay.getFullYear()}`;
          results.push({
            iso,
            key: ddMonYyyy,
            short,
            label: `${short} (${tag.sub})`,
            daysLeft,
            isWeekly: false,
            isMonthly: true
          });
        }
      }
    }
    return results;
  }

  // ========================================================
  // 3. BLACK-SCHOLES PRICING & GREEKS CALCULATOR
  // ========================================================
  function normCdf(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.SQRT2;
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return 0.5 * (1.0 + sign * y);
  }

  function normPdf(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  function calcBlackScholes(spot, strike, daysToExpiry, ivPct, type) {
    const T = Math.max(1, daysToExpiry) / 365.0;
    const sigma = Math.max(0.05, (ivPct || 14.2) / 100.0);
    const r = 0.068;
    const sqrtT = Math.sqrt(T);

    const d1 = (Math.log(spot / strike) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;
    const pdfD1 = normPdf(d1);

    let price, delta, theta;
    if (type === "CE") {
      price = spot * normCdf(d1) - strike * Math.exp(-r * T) * normCdf(d2);
      delta = normCdf(d1);
      theta = (-(spot * pdfD1 * sigma) / (2 * sqrtT) - r * strike * Math.exp(-r * T) * normCdf(d2)) / 365.0;
    } else {
      price = strike * Math.exp(-r * T) * normCdf(-d2) - spot * normCdf(-d1);
      delta = normCdf(d1) - 1;
      theta = (-(spot * pdfD1 * sigma) / (2 * sqrtT) + r * strike * Math.exp(-r * T) * normCdf(-d2)) / 365.0;
    }

    const gamma = pdfD1 / (spot * sigma * sqrtT);
    const vega = (spot * pdfD1 * sqrtT) / 100.0;

    return {
      price: Math.max(0.05, +price.toFixed(2)),
      delta: +delta.toFixed(2),
      gamma: +gamma.toFixed(4),
      theta: +theta.toFixed(2),
      vega: +vega.toFixed(2)
    };
  }

  // Deterministic pseudo-random helper so non-NIFTY OI bars look natural and consistent
  function seededWeight(seed) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  // ========================================================
  // 4. STATE STORE & MULTI-INDEX SYNTHESIS / DHAN OVERRIDE
  // ========================================================
  // Cloudflare Worker URL wired for BOTH Admin Panel & Public Frontend (index.html)
  const DEFAULT_PUBLIC_WORKER_URL = "https://optionselling.mehul26587.workers.dev";

  const _hosts = new Set();

  function getStoredWorkerUrl() {
    try {
      const explicit = (localStorage.getItem("liveipo_worker_url") || "").trim();
      if (explicit) return explicit.replace(/\/+$/, "");
      const raw = localStorage.getItem("liveipo_dhan_config");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.proxyUrl) return String(parsed.proxyUrl).trim().replace(/\/+$/, "");
      }
    } catch (e) {}
    return DEFAULT_PUBLIC_WORKER_URL.trim().replace(/\/+$/, "");
  }

  const _state = {
    activeSymbol: "NIFTY",
    activeViewMode: "OI", // "OI" | "GREEKS"
    demoLivePreview: false, // Toggle to simulate ticks outside IST market hours when no Dhan feed active
    workerUrl: typeof localStorage !== "undefined" ? getStoredWorkerUrl() : DEFAULT_PUBLIC_WORKER_URL,
    workerOnline: false,
    workerTokenValid: false,
    workerTokenExpiresAt: null,
    workerStorage: "none",
    dhanLiveActive: false,
    dhanLastSync: null,
    dhanError: null,
    dhanRawChain: {}, // Keyed by `${symbol}|${expiryIso}`
    officialExpiriesLoaded: {},
    indices: {}
  };

  function initIndexState(symbol) {
    const cfg = OC_INDEX_CATALOG[symbol];
    const expiries = buildExpiriesForIndex(symbol);
    const selectedExpiry = expiries[0] ? expiries[0].iso : "2026-12-01";
    const atm = Math.round(cfg.baseSpot / cfg.step) * cfg.step;

    const strikeMap = {};
    const spotMovePct = ((cfg.baseSpot - cfg.prevClose) / cfg.prevClose) * 100;

    for (let i = -cfg.strikeSpan - 2; i <= cfg.strikeSpan + 2; i++) {
      const s = atm + i * cfg.step;
      const snap = (symbol === "NIFTY") ? NIFTY_SCREENSHOT_SNAPSHOT[s] : null;

      if (snap) {
        strikeMap[s] = {
          strike: s,
          ceBaseLtp: snap.ceLtp,
          ceChgPct: snap.ceChgPct,
          ceOi: snap.ceOi,
          ceOiChgPct: snap.ceOiChgPct,
          peBaseLtp: snap.peLtp,
          peChgPct: snap.peChgPct,
          peOi: snap.peOi,
          peOiChgPct: snap.peOiChgPct,
          iv: +(cfg.baseIv + Math.abs(s - cfg.baseSpot) / 1400).toFixed(2),
          lastCeMove: 0,
          lastPeMove: 0
        };
      } else {
        const dte = expiries[0] ? expiries[0].daysLeft : 4;
        const localIv = +(cfg.baseIv + Math.min(3.5, Math.abs(s - cfg.baseSpot) / (cfg.step * 6))).toFixed(2);
        const bsCe = calcBlackScholes(cfg.baseSpot, s, dte, localIv, "CE");
        const bsPe = calcBlackScholes(cfg.baseSpot, s, dte, localIv, "PE");
        const prevBsCe = calcBlackScholes(cfg.prevClose, s, dte + 1, localIv + 0.5, "CE");
        const prevBsPe = calcBlackScholes(cfg.prevClose, s, dte + 1, localIv + 0.5, "PE");

        const ceChgPct = +(((bsCe.price - prevBsCe.price) / Math.max(1, prevBsCe.price)) * 100).toFixed(2);
        const peChgPct = +(((bsPe.price - prevBsPe.price) / Math.max(1, prevBsPe.price)) * 100).toFixed(2);

        const isRound500 = (s % (cfg.step * 5) === 0);
        const isRound1000 = (s % (cfg.step * 10) === 0);
        const callBias = s >= cfg.baseSpot ? 1.4 : 0.35;
        const putBias = s <= cfg.baseSpot ? 1.4 : 0.35;
        const roundBoost = isRound1000 ? 2.4 : (isRound500 ? 1.55 : 0.65);

        const ceOi = +(Math.max(1.2, (14 + seededWeight(s * 0.13) * 42) * callBias * roundBoost)).toFixed(2);
        const peOi = +(Math.max(1.2, (13 + seededWeight(s * 0.29) * 38) * putBias * roundBoost)).toFixed(2);
        const ceOiChg = +(spotMovePct < 0 ? (25 + seededWeight(s + 1) * 180) : (-25 + seededWeight(s + 2) * 60)).toFixed(2);
        const peOiChg = +(spotMovePct < 0 ? (-35 + seededWeight(s + 3) * 55) : (20 + seededWeight(s + 4) * 140)).toFixed(2);

        strikeMap[s] = {
          strike: s,
          ceBaseLtp: bsCe.price,
          ceChgPct,
          ceOi,
          ceOiChgPct: ceOiChg,
          peBaseLtp: bsPe.price,
          peChgPct,
          peOi,
          peOiChgPct: peOiChg,
          iv: localIv,
          lastCeMove: 0,
          lastPeMove: 0
        };
      }
    }

    _state.indices[symbol] = {
      cfg,
      spot: cfg.baseSpot,
      prevClose: cfg.prevClose,
      expiries,
      selectedExpiry,
      baseDte: expiries[0] ? expiries[0].daysLeft : 3,
      strikes: strikeMap
    };
  }

  Object.keys(OC_INDEX_CATALOG).forEach(initIndexState);

  // ========================================================
  // 5. CORS-FREE READ-ONLY DHANHQ REAL-TIME CONNECTOR
  // ========================================================
  function normalizeSymbolKey(sym) {
    const up = String(sym || "").toUpperCase().replace(/\s+/g, "");
    if (up.includes("BANK")) return "BANKNIFTY";
    if (up.includes("FIN")) return "FINNIFTY";
    if (up.includes("MID")) return "MIDCPNIFTY";
    if (up.includes("SENSEX") || up.includes("BSE")) return "SENSEX";
    if (OC_INDEX_CATALOG[up]) return up;
    return "NIFTY";
  }

  function getDhanConfigSafe() {
    try {
      const raw = localStorage.getItem("liveipo_dhan_config");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function inspectJwtExpiry(jwt) {
    if (!jwt || jwt.split(".").length < 2) return { valid: false, reason: "Invalid JWT format" };
    try {
      const b64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
      const payload = JSON.parse(atob(padded));
      const nowSec = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp && payload.exp <= nowSec;
      return {
        valid: !isExpired,
        exp: payload.exp ? new Date(payload.exp * 1000) : null,
        clientId: payload.dhanClientId || "",
        reason: isExpired ? "Token Expired (24h validity ended)" : "Token Valid"
      };
    } catch (e) {
      return { valid: false, reason: "Unable to decode JWT" };
    }
  }

  function applyOfficialExpiries(symbol, expArray) {
    const idxState = _state.indices[symbol];
    if (!idxState || !Array.isArray(expArray) || expArray.length === 0) return;

    const istNow = getISTNow();
    const todayMidnight = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate());
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const cfg = idxState.cfg;

    const mapped = expArray.slice(0, 6).map((iso, idx, arr) => {
      const parts = String(iso).split("-");
      const expDate = parts.length === 3
        ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
        : todayMidnight;
      const daysLeft = Math.max(1, Math.round((expDate - todayMidnight) / 86400000));
      const nextDate = new Date(expDate);
      nextDate.setDate(expDate.getDate() + 7);
      const isMonthly = !cfg.hasWeekly || (nextDate.getMonth() !== expDate.getMonth());
      const tag = formatExpiryTag(daysLeft, !isMonthly);
      const short = formatShortDate(expDate);
      const key = `${String(expDate.getDate()).padStart(2, "0")}-${months[expDate.getMonth()]}-${expDate.getFullYear()}`;
      return {
        iso,
        key,
        short,
        label: `${short} (${tag.sub})`,
        daysLeft,
        isWeekly: !isMonthly,
        isMonthly
      };
    });

    idxState.expiries = mapped;
    const stillValid = mapped.some(e => e.iso === idxState.selectedExpiry);
    if (!stillValid && mapped[0]) {
      idxState.selectedExpiry = mapped[0].iso;
      idxState.baseDte = mapped[0].daysLeft;
    }
  }

  async function checkWorkerStatus(overrideUrl) {
    const base = (overrideUrl || _state.workerUrl || getStoredWorkerUrl() || "").trim().replace(/\/+$/, "");
    _state.workerUrl = base;
    if (!base) {
      _state.workerOnline = false;
      _state.workerTokenValid = false;
      return { ok: false, reason: "NO_WORKER_URL" };
    }

    try {
      const res = await fetch(`${base}/live/status`, { method: "GET" });
      if (!res.ok) {
        _state.workerOnline = false;
        return { ok: false, reason: `HTTP_${res.status}` };
      }
      const json = await res.json();
      if (json && json.ok) {
        _state.workerOnline = true;
        _state.workerTokenValid = Boolean(json.tokenValid);
        _state.workerTokenExpiresAt = json.tokenExpiresAt || null;
        _state.workerStorage = json.storage || "none";
        if (!_state.workerTokenValid) {
          _state.dhanLiveActive = false;
          _state.dhanError = json.tokenStatus || "Dhan Token Expired or Not Set in Worker";
        }
        return json;
      }
    } catch (err) {
      _state.workerOnline = false;
    }
    return { ok: false, reason: "UNREACHABLE" };
  }

  async function fetchWorkerExpiries(symbol) {
    const base = (_state.workerUrl || "").trim().replace(/\/+$/, "");
    if (!base || !_state.workerOnline) return;
    try {
      const res = await fetch(`${base}/live/expiries?symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.status === "success" && Array.isArray(json.expiries) && json.expiries.length > 0) {
        applyOfficialExpiries(symbol, json.expiries);
        _state.officialExpiriesLoaded[symbol] = true;
      }
    } catch (_) {}
  }

  let _fetchInFlight = false;

  async function fetchDhanOptionChainReadOnly(symbol, expiryIso) {
    if (_fetchInFlight) return { ok: false, reason: "BUSY" };
    _fetchInFlight = true;

    try {
      const sym = normalizeSymbolKey(symbol || _state.activeSymbol);
      const idxState = _state.indices[sym];
      const exp = expiryIso || (idxState && idxState.selectedExpiry) || "";
      const workerBase = (_state.workerUrl || getStoredWorkerUrl() || "").trim().replace(/\/+$/, "");

      // MODE 1: Public / Shared Cloudflare Worker Feed (Admin + Frontend Visitors)
      if (workerBase) {
        if (!_state.officialExpiriesLoaded[sym] && _state.workerOnline) {
          await fetchWorkerExpiries(sym);
        }
        const effectiveExp = (idxState && idxState.selectedExpiry) || exp;
        try {
          const workerUrl = `${workerBase}/live/optionchain?symbol=${encodeURIComponent(sym)}&expiry=${encodeURIComponent(effectiveExp)}`;
          const res = await fetch(workerUrl, { method: "GET" });
          const json = await res.json();

          if (res.ok && json && json.status === "success" && json.data) {
            _state.workerOnline = true;
            _state.workerTokenValid = true;
            ingestDhanResponse(sym, json.expiry || effectiveExp, json.data);
            _state.dhanLiveActive = true;
            _state.dhanLastSync = new Date();
            _state.dhanError = null;
            renderAllMountedOptionChains();
            if (typeof global.dispatchEvent === "function" && typeof CustomEvent === "function") {
              global.dispatchEvent(new CustomEvent("oc-dhan-updated", { detail: { symbol: sym, expiry: json.expiry || effectiveExp } }));
            }
            return { ok: true, data: json.data, source: "cloudflare-worker" };
          }

          if (json && json.reason === "TOKEN_EXPIRED") {
            _state.workerOnline = true;
            _state.workerTokenValid = false;
            _state.dhanLiveActive = false;
            _state.dhanError = json.detail || "Token Expired";
            return { ok: false, reason: "TOKEN_EXPIRED", detail: json.detail, expDate: json.expiresAt ? new Date(json.expiresAt) : null };
          }

          if (json && json.reason === "MISSING_CREDS") {
            _state.workerOnline = true;
            _state.workerTokenValid = false;
            _state.dhanLiveActive = false;
            _state.dhanError = json.detail || "Worker credentials not configured";
            return { ok: false, reason: "MISSING_CREDS", detail: json.detail };
          }
        } catch (_) {
          // Fall through gracefully to local relay if localhost:8787 style proxy is used
        }
      }

      // MODE 2: Legacy Local Relay (node dhan-proxy.mjs) requiring local Admin credentials
      const cfg = getDhanConfigSafe();
      if (!cfg || !cfg.clientId || !cfg.accessToken) {
        return { ok: false, reason: "MISSING_CREDS" };
      }

      const jwtStatus = inspectJwtExpiry(cfg.accessToken);
      if (!jwtStatus.valid) {
        _state.dhanLiveActive = false;
        _state.dhanError = jwtStatus.reason;
        return { ok: false, reason: "TOKEN_EXPIRED", detail: jwtStatus.reason, expDate: jwtStatus.exp };
      }

      const idxCfg = OC_INDEX_CATALOG[sym] || OC_INDEX_CATALOG.NIFTY;
      const proxyBase = (cfg.proxyUrl || workerBase || "").trim().replace(/\/+$/, "");
      const targetUrl = proxyBase
        ? `${proxyBase}/v2/optionchain`
        : "https://api.dhan.co/v2/optionchain";

      try {
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "client-id": cfg.clientId.trim(),
            "access-token": cfg.accessToken.trim()
          },
          body: JSON.stringify({
            UnderlyingScrip: idxCfg.dhanId,
            UnderlyingSeg: idxCfg.dhanSeg,
            Expiry: exp
          })
        });

        const json = await res.json();
        if (res.ok && json && json.status === "success" && json.data) {
          ingestDhanResponse(sym, exp, json.data);
          _state.dhanLiveActive = true;
          _state.dhanLastSync = new Date();
          _state.dhanError = null;
          return { ok: true, data: json.data };
        }
        const msg = (json && json.data) ? JSON.stringify(json.data) : `HTTP ${res.status}`;
        _state.dhanLiveActive = false;
        _state.dhanError = msg;
        return { ok: false, reason: "API_ERROR", detail: msg };
      } catch (err) {
        _state.dhanLiveActive = false;
        _state.dhanError = proxyBase
          ? `Proxy unreachable (${err.message})`
          : "Browser CORS blocked direct api.dhan.co call (Configure Cloudflare Worker URL)";
        return { ok: false, reason: proxyBase ? "PROXY_ERROR" : "CORS_BLOCKED", detail: _state.dhanError };
      }
    } finally {
      _fetchInFlight = false;
    }
  }

  function ingestDhanResponse(symbol, expiryIso, dhanData) {
    const idxState = _state.indices[symbol];
    if (!idxState || !dhanData) return;

    if (typeof dhanData.last_price === "number" && dhanData.last_price > 0) {
      idxState.spot = +dhanData.last_price.toFixed(2);
    }

    if (dhanData.oc && typeof dhanData.oc === "object") {
      const chainKey = `${symbol}|${expiryIso}`;
      const existingRaw = _state.dhanRawChain[chainKey] || {};
      const parsedMap = {};

      Object.keys(dhanData.oc).forEach(k => {
        const strike = Math.round(parseFloat(k));
        const node = dhanData.oc[k];
        const ce = node.ce || {};
        const pe = node.pe || {};

        const prevLiveNode = existingRaw[strike];
        const prevBaseNode = idxState.strikes[strike] || {};
        const prevCeLtp = prevLiveNode ? prevLiveNode.ceBaseLtp : prevBaseNode.ceBaseLtp;
        const prevPeLtp = prevLiveNode ? prevLiveNode.peBaseLtp : prevBaseNode.peBaseLtp;

        const newCe = typeof ce.last_price === "number" ? +ce.last_price.toFixed(2) : (prevCeLtp || 0);
        const newPe = typeof pe.last_price === "number" ? +pe.last_price.toFixed(2) : (prevPeLtp || 0);

        const ceOiL = typeof ce.oi === "number" ? +(ce.oi / 100000).toFixed(2) : (prevBaseNode.ceOi || 0);
        const peOiL = typeof pe.oi === "number" ? +(pe.oi / 100000).toFixed(2) : (prevBaseNode.peOi || 0);

        // Compute real Chg% from previous_close_price returned by Dhan v2
        const ceChgPct = (typeof ce.previous_close_price === "number" && ce.previous_close_price > 0)
          ? +(((newCe - ce.previous_close_price) / ce.previous_close_price) * 100).toFixed(2)
          : (prevBaseNode.ceChgPct || 0);
        const peChgPct = (typeof pe.previous_close_price === "number" && pe.previous_close_price > 0)
          ? +(((newPe - pe.previous_close_price) / pe.previous_close_price) * 100).toFixed(2)
          : (prevBaseNode.peChgPct || 0);

        // Compute real OI Chg% from previous_oi returned by Dhan v2
        const cePrevOi = typeof ce.previous_oi === "number" && ce.previous_oi > 0 ? ce.previous_oi : 0;
        const pePrevOi = typeof pe.previous_oi === "number" && pe.previous_oi > 0 ? pe.previous_oi : 0;
        const ceOiChgPct = (cePrevOi > 0 && typeof ce.oi === "number")
          ? +(((ce.oi - cePrevOi) / cePrevOi) * 100).toFixed(2)
          : (prevBaseNode.ceOiChgPct || 0);
        const peOiChgPct = (pePrevOi > 0 && typeof pe.oi === "number")
          ? +(((pe.oi - pePrevOi) / pePrevOi) * 100).toFixed(2)
          : (prevBaseNode.peOiChgPct || 0);

        const ivVal = (typeof ce.implied_volatility === "number" && ce.implied_volatility > 0)
          ? +ce.implied_volatility.toFixed(2)
          : ((typeof pe.implied_volatility === "number" && pe.implied_volatility > 0)
            ? +pe.implied_volatility.toFixed(2)
            : (prevBaseNode.iv || idxState.cfg.baseIv));

        const moveCe = prevLiveNode ? +(newCe - prevLiveNode.ceBaseLtp).toFixed(2) : 0;
        const movePe = prevLiveNode ? +(newPe - prevLiveNode.peBaseLtp).toFixed(2) : 0;

        parsedMap[strike] = {
          strike,
          ceBaseLtp: newCe,
          ceChgPct,
          ceOi: ceOiL,
          ceOiChgPct,
          peBaseLtp: newPe,
          peChgPct,
          peOi: peOiL,
          peOiChgPct,
          iv: ivVal,
          dhanGreeksCe: ce.greeks || null,
          dhanGreeksPe: pe.greeks || null,
          lastCeMove: moveCe,
          lastPeMove: movePe
        };

        // Keep idxState.strikes synced too so legacy consumers & default lookups stay accurate
        if (expiryIso === idxState.selectedExpiry) {
          idxState.strikes[strike] = { ...parsedMap[strike] };
        }
      });
      _state.dhanRawChain[chainKey] = parsedMap;
    }
  }

  // ========================================================
  // 6. COMPUTE ACTIVE CHAIN ROWS & METRICS (MULTI-EXPIRY)
  // ========================================================
  function computeActiveOptionChain(symbol, overrideExpiryIso) {
    const sym = OC_INDEX_CATALOG[symbol] ? symbol : _state.activeSymbol;
    const idxState = _state.indices[sym];
    const cfg = idxState.cfg;
    const spot = idxState.spot;
    const step = cfg.step;
    const atm = Math.round(spot / step) * step;

    const expIso = overrideExpiryIso || idxState.selectedExpiry;
    const expObj = idxState.expiries.find(e => e.iso === expIso || e.key === expIso) || idxState.expiries[0];
    const dte = expObj ? expObj.daysLeft : 3;
    const tMult = Math.sqrt(Math.max(1, dte) / Math.max(1, idxState.baseDte));
    const oiMult = dte <= idxState.baseDte ? 1.0 : (dte <= 11 ? 0.45 : (dte <= 18 ? 0.30 : 0.72));

    const liveOverride = _state.dhanRawChain[`${sym}|${expObj ? expObj.iso : expIso}`];
    const isBaseExpiry = !liveOverride && (expObj && expObj.iso === idxState.expiries[0].iso);

    const rows = [];
    let maxCallOi = 1;
    let maxPutOi = 1;
    let totalCallOi = 0;
    let totalPutOi = 0;

    // Show ATM - 10 to ATM + 10 strikes (20 strikes matching Sensibull density)
    const minStrike = atm - (8 * step);
    const maxStrike = atm + (11 * step);

    for (let s = minStrike; s <= maxStrike; s += step) {
      const base = (liveOverride && liveOverride[s]) || idxState.strikes[s];
      const iv = base ? base.iv : cfg.baseIv;

      const bsCe = calcBlackScholes(spot, s, dte, iv, "CE");
      const bsPe = calcBlackScholes(spot, s, dte, iv, "PE");

      let callLtp, putLtp, ceOi, peOi, ceChgPct, peChgPct, ceOiChgPct, peOiChgPct;
      let ceGreeks = bsCe;
      let peGreeks = bsPe;

      if (liveOverride && liveOverride[s]) {
        const d = liveOverride[s];
        callLtp = d.ceBaseLtp;
        putLtp = d.peBaseLtp;
        ceOi = d.ceOi;
        peOi = d.peOi;
        ceChgPct = d.ceChgPct;
        peChgPct = d.peChgPct;
        ceOiChgPct = d.ceOiChgPct;
        peOiChgPct = d.peOiChgPct;
        if (d.dhanGreeksCe) ceGreeks = { delta: +d.dhanGreeksCe.delta.toFixed(2), gamma: +d.dhanGreeksCe.gamma.toFixed(4), theta: +d.dhanGreeksCe.theta.toFixed(2), vega: +d.dhanGreeksCe.vega.toFixed(2) };
        if (d.dhanGreeksPe) peGreeks = { delta: +d.dhanGreeksPe.delta.toFixed(2), gamma: +d.dhanGreeksPe.gamma.toFixed(4), theta: +d.dhanGreeksPe.theta.toFixed(2), vega: +d.dhanGreeksPe.vega.toFixed(2) };
      } else if (base) {
        if (isBaseExpiry) {
          callLtp = base.ceBaseLtp;
          putLtp = base.peBaseLtp;
        } else {
          const intCe = Math.max(0, spot - s);
          const intPe = Math.max(0, s - spot);
          const extCe = Math.max(1.5, base.ceBaseLtp - intCe);
          const extPe = Math.max(1.5, base.peBaseLtp - intPe);
          callLtp = +(intCe + extCe * tMult).toFixed(2);
          putLtp = +(intPe + extPe * tMult).toFixed(2);
        }
        ceOi = +(base.ceOi * oiMult).toFixed(2);
        peOi = +(base.peOi * oiMult).toFixed(2);
        ceChgPct = +(base.ceChgPct * (isBaseExpiry ? 1 : (1 / Math.sqrt(tMult)))).toFixed(2);
        peChgPct = +(base.peChgPct * (isBaseExpiry ? 1 : (1 / Math.sqrt(tMult)))).toFixed(2);
        ceOiChgPct = base.ceOiChgPct;
        peOiChgPct = base.peOiChgPct;
      } else {
        callLtp = bsCe.price;
        putLtp = bsPe.price;
        ceOi = +(12 * oiMult).toFixed(2);
        peOi = +(11 * oiMult).toFixed(2);
        ceChgPct = -45.0;
        peChgPct = 75.0;
        ceOiChgPct = 10.0;
        peOiChgPct = -5.0;
      }

      if (ceOi > maxCallOi) maxCallOi = ceOi;
      if (peOi > maxPutOi) maxPutOi = peOi;
      totalCallOi += ceOi;
      totalPutOi += peOi;

      rows.push({
        strike: s,
        isAtm: s === atm,
        isCallItm: s < spot,
        isPutItm: s > spot,
        iv,
        callLtp,
        ceChgPct,
        ceOi,
        ceOiChgPct,
        ceLastMove: base ? base.lastCeMove : 0,
        ceGreeks,
        putLtp,
        peChgPct,
        peOi,
        peOiChgPct,
        peLastMove: base ? base.lastPeMove : 0,
        peGreeks
      });
    }

    // Calculate Max Pain dynamically from OI distribution
    let maxPainStrike = atm;
    let minPayout = Infinity;
    rows.forEach(cand => {
      let totalPain = 0;
      rows.forEach(r => {
        if (cand.strike > r.strike) totalPain += (cand.strike - r.strike) * r.ceOi;
        if (cand.strike < r.strike) totalPain += (r.strike - cand.strike) * r.peOi;
      });
      if (totalPain < minPayout) {
        minPayout = totalPain;
        maxPainStrike = cand.strike;
      }
    });

    const pcr = +(totalPutOi / Math.max(0.1, totalCallOi)).toFixed(2);
    const atmRow = rows.find(r => r.isAtm) || rows[Math.floor(rows.length / 2)];
    const atmIv = atmRow ? atmRow.iv.toFixed(2) : cfg.baseIv.toFixed(2);

    const netChg = +(spot - idxState.prevClose).toFixed(2);
    const netPct = +((netChg / idxState.prevClose) * 100).toFixed(2);

    return {
      symbol: sym,
      cfg,
      spot,
      netChg,
      netPct,
      atm,
      expiry: expObj,
      maxCallOi,
      maxPutOi,
      pcr,
      maxPain: maxPainStrike,
      atmIv,
      ivPercentile: cfg.ivPercentile,
      rows
    };
  }

  // ========================================================
  // 7. MARKET TICK ENGINE (IST MARKET HOURS + LIVE PREVIEW)
  // ========================================================
  let _lastDhanPollMs = 0;

  function tickMarketLoop() {
    const istNow = getISTNow();
    const marketOpen = isIndianMarketOpen(istNow);
    const hasActiveDhan = _state.dhanLiveActive || (_state.workerOnline && _state.workerTokenValid);

    // 1. Poll real DhanHQ API every 3.2s during market hours (or preview)
    const nowMs = Date.now();
    if (hasActiveDhan && (marketOpen || _state.demoLivePreview) && (nowMs - _lastDhanPollMs >= 3200)) {
      _lastDhanPollMs = nowMs;
      const idxState = _state.indices[_state.activeSymbol];
      if (idxState) {
        fetchDhanOptionChainReadOnly(_state.activeSymbol, idxState.selectedExpiry);
      }
    }

    // 2. Delta-coherent simulated fluctuations ONLY when NO live Dhan feed is active
    //    (Never inject synthetic Math.random() noise over live Dhan prices!)
    const shouldSimulate = (marketOpen || _state.demoLivePreview) && !_state.dhanLiveActive;
    if (shouldSimulate) {
      Object.keys(_state.indices).forEach(sym => {
        const idxState = _state.indices[sym];
        const step = idxState.cfg.step;
        const scale = step / 50; // Larger indices move proportionately more points
        const spotDelta = +((Math.random() - 0.495) * 1.6 * scale).toFixed(2);
        idxState.spot = +(idxState.spot + spotDelta).toFixed(2);

        const dte = idxState.expiries[0] ? idxState.expiries[0].daysLeft : 3;
        Object.keys(idxState.strikes).forEach(k => {
          const s = idxState.strikes[k];
          const cG = calcBlackScholes(idxState.spot, s.strike, dte, s.iv, "CE");
          const pG = calcBlackScholes(idxState.spot, s.strike, dte, s.iv, "PE");
          const ceMove = +(spotDelta * cG.delta + (Math.random() - 0.5) * 0.14 * scale).toFixed(2);
          const peMove = +(spotDelta * pG.delta + (Math.random() - 0.5) * 0.14 * scale).toFixed(2);

          s.ceBaseLtp = Math.max(0.05, +(s.ceBaseLtp + ceMove).toFixed(2));
          s.peBaseLtp = Math.max(0.05, +(s.peBaseLtp + peMove).toFixed(2));
          s.lastCeMove = ceMove;
          s.lastPeMove = peMove;
        });
      });

      // Keep legacy global vars synced cleanly
      const activeIdx = _state.indices[_state.activeSymbol];
      if (activeIdx) {
        global._liveDhanSpot = activeIdx.spot;
        global._liveMarketState = {
          spot: activeIdx.spot,
          basePrevClose: activeIdx.prevClose,
          strikes: activeIdx.strikes
        };
      }
    }

    renderAllMountedOptionChains(istNow, marketOpen);
    syncTradeManagementTerminal();
  }

  function syncTradeManagementTerminal() {
    const nifty = _state.indices.NIFTY;
    const active = _state.indices[_state.activeSymbol] || nifty;
    const stratSpot = document.getElementById("adminStrategySpot");
    if (stratSpot && document.activeElement !== stratSpot) {
      stratSpot.value = active.spot.toFixed(2);
    }
  }

  // ========================================================
  // 8. PURE WHITE SENSIBULL UI HOST MOUNT & RENDERER
  // ========================================================
  function renderHostSkeleton(hostEl) {
    const hostId = hostEl.id;
    const allowTradeActions = hostEl.dataset.allowActions !== "false";
    const symbolOptionsHtml = Object.keys(OC_INDEX_CATALOG).map(sym => {
      const c = OC_INDEX_CATALOG[sym];
      return `<option value="${sym}" ${sym === _state.activeSymbol ? "selected" : ""}>${c.label} (${c.exchange})</option>`;
    }).join("");

    hostEl.innerHTML = `
      <div class="sensibull-pure-white-card" data-oc-card="${hostId}">
        <!-- ROW 1: Index Dropdown + Spot Price + Live Market Clock -->
        <div class="sensibull-header-bar" style="padding: 9px 14px; border-bottom: 1px solid #e2e8f0;">
          <div class="sensibull-spot-search" style="padding: 5px 10px; gap: 8px;">
            <span style="font-size: 14px;">🔍</span>
            <select id="${hostId}_indexSelect" class="oc-index-select" onchange="window.OCEngine.selectIndex(this.value)" title="Select Index">
              ${symbolOptionsHtml}
            </select>
            <span id="${hostId}_spotVal" style="font-weight: 600; font-size: 14.5px; color: #1e293b;">25,607.20</span>
            <span id="${hostId}_spotChg" class="sensibull-spot-red" style="font-size: 12.5px;">-277.30 (-1.07%)</span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span id="${hostId}_marketBadge" class="oc-market-badge closed">
              <span class="live-pulse-dot" id="${hostId}_pulseDot"></span>
              <span id="${hostId}_marketText">MARKET CLOSED</span>
              <span id="${hostId}_istClock" style="font-family: monospace; font-size: 11px; margin-left: 4px;"></span>
            </span>

            <button type="button" id="${hostId}_demoToggleBtn" class="oc-demo-toggle-btn" onclick="window.OCEngine.toggleDemoTicks()" title="Toggle 1-Second Live Fluctuation Preview when Market is Closed">
              ▶ Live Ticks: OFF
            </button>
          </div>
        </div>

        <!-- ROW 2: Expiry Pills + More Expiries Dropdown + OI/Greeks Segmented Control -->
        <div class="sensibull-header-bar" style="padding: 8px 14px; background: #fafbfc; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <div id="${hostId}_expiryPills" class="sensibull-expiry-pills"></div>
            <select id="${hostId}_expiryMore" class="sensibull-expiry-select" onchange="window.OCEngine.selectExpiry(this.value)" title="More Expiries"></select>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="sensibull-view-toggle">
              <button type="button" id="${hostId}_btnViewOI" class="sensibull-view-btn active" onclick="window.OCEngine.setViewMode('OI')">OI</button>
              <button type="button" id="${hostId}_btnViewGreeks" class="sensibull-view-btn" onclick="window.OCEngine.setViewMode('GREEKS')">Greeks</button>
            </div>
            <span id="${hostId}_dhanSourcePill" style="font-size: 11px; font-weight: 500; color: #475569; background: #f1f5f9; padding: 4px 9px; border-radius: 6px; border: 1px solid #cbd5e1;">
              Market Sync
            </span>
          </div>
        </div>

        <!-- OPTION CHAIN DATA TABLE -->
        <div class="sensibull-table-wrapper" style="max-height: 540px;">
          <table class="sensibull-pure-table sb-clone-table">
            <thead id="${hostId}_thead"></thead>
            <tbody id="${hostId}_tbody" data-allow-actions="${allowTradeActions}"></tbody>
          </table>
        </div>

        <!-- BOTTOM METRICS BAR (Matches Screenshot: PCR | Max Pain | ATM IV | IV Percentile) -->
        <div class="sensibull-footer-bar" style="justify-content: center; gap: 12px 26px; padding: 9px 16px; background: #ffffff; border-top: 1px solid #e2e8f0;">
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #64748b; font-weight: 500;">PCR</div>
            <div class="sensibull-metric-badge" id="${hostId}_pcr" style="font-size: 14px;">0.59</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #64748b; font-weight: 500;">Max Pain</div>
            <div class="sensibull-metric-badge" id="${hostId}_maxPain" style="font-size: 14px;">25700</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #64748b; font-weight: 500;">ATM IV</div>
            <div class="sensibull-metric-badge" id="${hostId}_atmIv" style="font-size: 14px;">14.20</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 11px; color: #64748b; font-weight: 500;">IV Percentile</div>
            <div class="sensibull-metric-badge" id="${hostId}_ivPct" style="font-size: 14px;">63.00 - High</div>
          </div>
          ${allowTradeActions ? `<div style="margin-left: auto; color: #059669; font-weight: 500; font-size: 12px;">✓ Click [S] or [B] on any strike to add to 3-Strike Basket</div>` : ""}
        </div>
      </div>
    `;
    hostEl.dataset.initialized = "true";
  }

  function renderHostContent(hostId, data, istNow, marketOpen) {
    const hostEl = document.getElementById(hostId);
    if (!hostEl) return;
    if (hostEl.dataset.initialized !== "true") {
      renderHostSkeleton(hostEl);
    }

    const allowActions = hostEl.dataset.allowActions !== "false";

    // Sync Index select
    const idxSel = document.getElementById(`${hostId}_indexSelect`);
    if (idxSel && idxSel.value !== data.symbol) idxSel.value = data.symbol;

    // Spot & change
    const spotValEl = document.getElementById(`${hostId}_spotVal`);
    const spotChgEl = document.getElementById(`${hostId}_spotChg`);
    if (spotValEl) spotValEl.textContent = data.spot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (spotChgEl) {
      const sign = data.netChg >= 0 ? "+" : "";
      spotChgEl.textContent = `${sign}${data.netChg.toFixed(2)} (${sign}${data.netPct.toFixed(2)}%)`;
      spotChgEl.className = data.netChg >= 0 ? "sensibull-spot-green" : "sensibull-spot-red";
    }

    // Market Status & IST Clock
    const clockStr = `${String(istNow.getHours()).padStart(2, "0")}:${String(istNow.getMinutes()).padStart(2, "0")}:${String(istNow.getSeconds()).padStart(2, "0")} IST`;
    const mktBadge = document.getElementById(`${hostId}_marketBadge`);
    const mktText = document.getElementById(`${hostId}_marketText`);
    const mktClock = document.getElementById(`${hostId}_istClock`);
    const pulseDot = document.getElementById(`${hostId}_pulseDot`);
    if (mktClock) mktClock.textContent = clockStr;
    if (mktBadge && mktText) {
      if (marketOpen) {
        mktBadge.className = "oc-market-badge live";
        mktText.textContent = "LIVE MARKET";
        if (pulseDot) pulseDot.style.background = "#10b981";
      } else if (_state.demoLivePreview) {
        mktBadge.className = "oc-market-badge preview";
        mktText.textContent = "LIVE PREVIEW (1s)";
        if (pulseDot) pulseDot.style.background = "#2563eb";
      } else {
        mktBadge.className = "oc-market-badge closed";
        mktText.textContent = "MARKET CLOSED (09:00–15:40)";
        if (pulseDot) pulseDot.style.background = "#94a3b8";
      }
    }

    const demoBtn = document.getElementById(`${hostId}_demoToggleBtn`);
    if (demoBtn) {
      demoBtn.textContent = _state.demoLivePreview ? "⏸ Live Ticks: ON" : "▶ Live Ticks: OFF";
      demoBtn.classList.toggle("active", _state.demoLivePreview);
      demoBtn.style.display = marketOpen ? "none" : "inline-flex";
    }

    // Dhan source pill
    const srcPill = document.getElementById(`${hostId}_dhanSourcePill`);
    if (srcPill) {
      if (_state.dhanLiveActive) {
        const syncTime = _state.dhanLastSync
          ? _state.dhanLastSync.toLocaleTimeString("en-IN", { hour12: false })
          : "";
        srcPill.textContent = marketOpen
          ? `🟢 DhanHQ Live (${syncTime})`
          : `🟢 DhanHQ Closing (${syncTime})`;
        srcPill.style.background = "#dcfce7";
        srcPill.style.color = "#166534";
        srcPill.style.borderColor = "#86efac";
      } else if (_state.workerOnline && !_state.workerTokenValid) {
        srcPill.textContent = "⚠️ Worker Token Expired";
        srcPill.style.background = "#fef3c7";
        srcPill.style.color = "#92400e";
        srcPill.style.borderColor = "#fcd34d";
      } else if (_state.workerOnline && _state.workerTokenValid) {
        srcPill.textContent = "🟡 Syncing Dhan Worker...";
        srcPill.style.background = "#eff6ff";
        srcPill.style.color = "#1d4ed8";
        srcPill.style.borderColor = "#93c5fd";
      } else {
        srcPill.textContent = "Closing / Market-Sync";
        srcPill.style.background = "#f1f5f9";
        srcPill.style.color = "#475569";
        srcPill.style.borderColor = "#cbd5e1";
      }
    }

    // Expiry pills (first 3) & More Expiries dropdown
    const idxState = _state.indices[data.symbol];
    const pillsWrap = document.getElementById(`${hostId}_expiryPills`);
    const moreSel = document.getElementById(`${hostId}_expiryMore`);
    const activeExpIso = data.expiry ? data.expiry.iso : "";

    if (pillsWrap && idxState) {
      const quickExps = idxState.expiries.slice(0, 3);
      pillsWrap.innerHTML = quickExps.map(e => {
        const active = e.iso === activeExpIso ? "active" : "";
        const wTag = e.isWeekly ? `<sup class="exp-w-badge">W</sup>` : "";
        return `<button type="button" class="sensibull-expiry-pill ${active}" onclick="window.OCEngine.selectExpiry('${e.iso}')">${e.label}${wTag}</button>`;
      }).join("");
    }
    if (moreSel && idxState) {
      const restExps = idxState.expiries.slice(3);
      const isRestActive = restExps.some(e => e.iso === activeExpIso);
      moreSel.classList.toggle("active", isRestActive);
      const listToShow = restExps.length > 0 ? restExps : idxState.expiries;
      moreSel.innerHTML = listToShow.map(e => {
        return `<option value="${e.iso}" ${e.iso === activeExpIso ? "selected" : ""}>${e.label}${e.isMonthly ? " • Monthly" : ""}</option>`;
      }).join("");
    }

    // Toggle OI / Greeks active state
    const btnOi = document.getElementById(`${hostId}_btnViewOI`);
    const btnGr = document.getElementById(`${hostId}_btnViewGreeks`);
    if (btnOi) btnOi.classList.toggle("active", _state.activeViewMode === "OI");
    if (btnGr) btnGr.classList.toggle("active", _state.activeViewMode === "GREEKS");

    // Table THEAD & TBODY
    const thead = document.getElementById(`${hostId}_thead`);
    const tbody = document.getElementById(`${hostId}_tbody`);
    if (!thead || !tbody) return;

    if (_state.activeViewMode === "OI") {
      thead.innerHTML = `
        <tr>
          <th style="text-align:right;">OI Chg%</th>
          <th style="text-align:right;">OI (in lakhs)</th>
          ${allowActions ? `<th style="width:68px;">Action</th>` : ""}
          <th style="text-align:right;">Chg%</th>
          <th style="text-align:right; padding-right:10px;">Call LTP</th>
          <th style="width:94px; background:#f1f5f9; color:#1e293b;">Strike</th>
          <th style="text-align:left; padding-left:10px;">Put LTP</th>
          <th style="text-align:left;">Chg%</th>
          ${allowActions ? `<th style="width:68px;">Action</th>` : ""}
          <th style="text-align:left;">OI (in lakhs)</th>
          <th style="text-align:left;">OI Chg%</th>
        </tr>
      `;

      tbody.innerHTML = data.rows.map(r => {
        const callBarPct = Math.min(220, Math.round((r.ceOi / data.maxCallOi) * 210));
        const putBarPct = Math.min(220, Math.round((r.peOi / data.maxPutOi) * 210));
        const ceMoveCls = r.ceLastMove > 0 ? "up" : (r.ceLastMove < 0 ? "down" : "");
        const peMoveCls = r.peLastMove > 0 ? "up" : (r.peLastMove < 0 ? "down" : "");

        const ceSelS = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "CE", "S") ? "selected" : "";
        const ceSelB = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "CE", "B") ? "selected" : "";
        const peSelB = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "PE", "B") ? "selected" : "";
        const peSelS = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "PE", "S") ? "selected" : "";

        return `
          <tr class="${r.isAtm ? "atm-row" : ""} ${r.isCallItm ? "itm-call" : ""} ${r.isPutItm ? "itm-put" : ""}">
            <td class="call-cell oc-pct ${r.ceOiChgPct >= 0 ? "pos" : "neg"}" style="text-align:right;">${r.ceOiChgPct.toFixed(2)}%</td>
            <td class="call-cell oc-oi-num" style="text-align:right; position:relative;">
              ${r.ceOi.toFixed(2)}
            </td>
            ${allowActions ? `
              <td class="call-cell" style="white-space:nowrap;">
                <button type="button" class="btn-oc-action-s ${ceSelS}" onclick="window.OCEngine.onLegAction(${r.strike}, 'CE', 'S', ${r.callLtp})">S</button>
                <button type="button" class="btn-oc-action-b ${ceSelB}" onclick="window.OCEngine.onLegAction(${r.strike}, 'CE', 'B', ${r.callLtp})">B</button>
              </td>
            ` : ""}
            <td class="call-cell oc-pct ${r.ceChgPct >= 0 ? "pos" : "neg"}" style="text-align:right;">${r.ceChgPct.toFixed(2)}%</td>
            <td class="call-cell sb-bar-host-left" style="text-align:right; padding-right:10px; position:relative;">
              <span class="price-tick-val ${ceMoveCls}">${r.callLtp.toFixed(2)}</span>
              <div class="sb-oi-bar sb-oi-bar-call" style="width:${callBarPct}%;"></div>
            </td>
            <td class="strike-cell">
              <span class="strike-pill-badge ${r.isAtm ? "atm" : ""}">${r.strike}</span>
            </td>
            <td class="put-cell sb-bar-host-right" style="text-align:left; padding-left:10px; position:relative;">
              <span class="price-tick-val ${peMoveCls}">${r.putLtp.toFixed(2)}</span>
              <div class="sb-oi-bar sb-oi-bar-put" style="width:${putBarPct}%;"></div>
            </td>
            <td class="put-cell oc-pct ${r.peChgPct >= 0 ? "pos" : "neg"}" style="text-align:left;">${r.peChgPct.toFixed(2)}%</td>
            ${allowActions ? `
              <td class="put-cell" style="white-space:nowrap;">
                <button type="button" class="btn-oc-action-b ${peSelB}" onclick="window.OCEngine.onLegAction(${r.strike}, 'PE', 'B', ${r.putLtp})">B</button>
                <button type="button" class="btn-oc-action-s ${peSelS}" onclick="window.OCEngine.onLegAction(${r.strike}, 'PE', 'S', ${r.putLtp})">S</button>
              </td>
            ` : ""}
            <td class="put-cell oc-oi-num" style="text-align:left;">${r.peOi.toFixed(2)}</td>
            <td class="put-cell oc-pct ${r.peOiChgPct >= 0 ? "pos" : "neg"}" style="text-align:left;">${r.peOiChgPct.toFixed(2)}%</td>
          </tr>
        `;
      }).join("");
    } else {
      // GREEKS VIEW
      thead.innerHTML = `
        <tr>
          <th>Theta</th>
          <th>Vega</th>
          <th>Gamma</th>
          <th>Delta</th>
          <th>Call LTP</th>
          ${allowActions ? `<th style="width:68px;">Action</th>` : ""}
          <th style="width:94px; background:#f1f5f9; color:#1e293b;">Strike</th>
          <th>IV</th>
          ${allowActions ? `<th style="width:68px;">Action</th>` : ""}
          <th>Put LTP</th>
          <th>Delta</th>
          <th>Gamma</th>
          <th>Vega</th>
          <th>Theta</th>
        </tr>
      `;

      tbody.innerHTML = data.rows.map(r => {
        const ceMoveCls = r.ceLastMove > 0 ? "up" : (r.ceLastMove < 0 ? "down" : "");
        const peMoveCls = r.peLastMove > 0 ? "up" : (r.peLastMove < 0 ? "down" : "");
        const ceSelS = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "CE", "S") ? "selected" : "";
        const ceSelB = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "CE", "B") ? "selected" : "";
        const peSelB = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "PE", "B") ? "selected" : "";
        const peSelS = typeof global.isLegSelected === "function" && global.isLegSelected(r.strike, "PE", "S") ? "selected" : "";
        return `
          <tr class="${r.isAtm ? "atm-row" : ""} ${r.isCallItm ? "itm-call" : ""} ${r.isPutItm ? "itm-put" : ""}">
            <td class="call-cell oc-greek">${r.ceGreeks.theta.toFixed(2)}</td>
            <td class="call-cell oc-greek">${r.ceGreeks.vega.toFixed(2)}</td>
            <td class="call-cell oc-greek">${r.ceGreeks.gamma.toFixed(4)}</td>
            <td class="call-cell oc-greek" style="font-weight:500;">${r.ceGreeks.delta.toFixed(2)}</td>
            <td class="call-cell"><span class="price-tick-val ${ceMoveCls}">${r.callLtp.toFixed(2)}</span></td>
            ${allowActions ? `
              <td class="call-cell" style="white-space:nowrap;">
                <button type="button" class="btn-oc-action-s ${ceSelS}" onclick="window.OCEngine.onLegAction(${r.strike}, 'CE', 'S', ${r.callLtp})">S</button>
                <button type="button" class="btn-oc-action-b ${ceSelB}" onclick="window.OCEngine.onLegAction(${r.strike}, 'CE', 'B', ${r.callLtp})">B</button>
              </td>
            ` : ""}
            <td class="strike-cell">
              <span class="strike-pill-badge ${r.isAtm ? "atm" : ""}">${r.strike}</span>
            </td>
            <td class="oc-greek" style="font-weight:500;">${r.iv.toFixed(2)}</td>
            ${allowActions ? `
              <td class="put-cell" style="white-space:nowrap;">
                <button type="button" class="btn-oc-action-b ${peSelB}" onclick="window.OCEngine.onLegAction(${r.strike}, 'PE', 'B', ${r.putLtp})">B</button>
                <button type="button" class="btn-oc-action-s ${peSelS}" onclick="window.OCEngine.onLegAction(${r.strike}, 'PE', 'S', ${r.putLtp})">S</button>
              </td>
            ` : ""}
            <td class="put-cell"><span class="price-tick-val ${peMoveCls}">${r.putLtp.toFixed(2)}</span></td>
            <td class="put-cell oc-greek" style="font-weight:500;">${r.peGreeks.delta.toFixed(2)}</td>
            <td class="put-cell oc-greek">${r.peGreeks.gamma.toFixed(4)}</td>
            <td class="put-cell oc-greek">${r.peGreeks.vega.toFixed(2)}</td>
            <td class="put-cell oc-greek">${r.peGreeks.theta.toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }

    // Bottom Metrics
    const pcrEl = document.getElementById(`${hostId}_pcr`);
    const maxPainEl = document.getElementById(`${hostId}_maxPain`);
    const atmIvEl = document.getElementById(`${hostId}_atmIv`);
    const ivPctEl = document.getElementById(`${hostId}_ivPct`);
    if (pcrEl) pcrEl.textContent = data.pcr.toFixed(2);
    if (maxPainEl) maxPainEl.textContent = data.maxPain;
    if (atmIvEl) atmIvEl.textContent = data.atmIv;
    if (ivPctEl) ivPctEl.textContent = data.ivPercentile;
  }

  function renderAllMountedOptionChains(istDate, marketOpenFlag) {
    const istNow = istDate || getISTNow();
    const marketOpen = typeof marketOpenFlag === "boolean" ? marketOpenFlag : isIndianMarketOpen(istNow);
    const data = computeActiveOptionChain(_state.activeSymbol);
    _hosts.forEach(hostId => {
      renderHostContent(hostId, data, istNow, marketOpen);
    });
  }

  // ========================================================
  // 9. PUBLIC API (window.OCEngine & Backward Compatibility)
  // ========================================================
  const OCEngine = {
    catalog: OC_INDEX_CATALOG,
    mount(hostId) {
      const el = document.getElementById(hostId);
      if (!el) return;
      _hosts.add(hostId);
      renderAllMountedOptionChains();
    },
    selectIndex(symbol) {
      const sym = normalizeSymbolKey(symbol);
      if (!OC_INDEX_CATALOG[sym]) return;
      _state.activeSymbol = sym;
      const basketIdx = document.getElementById("basketIndex");
      if (basketIdx) basketIdx.value = sym;
      if (_state.dhanLiveActive || (_state.workerOnline && _state.workerTokenValid)) {
        const idxState = _state.indices[sym];
        fetchDhanOptionChainReadOnly(sym, idxState.selectedExpiry);
      }
      renderAllMountedOptionChains();
    },
    selectExpiry(expIsoOrKey) {
      const idxState = _state.indices[_state.activeSymbol];
      if (!idxState) return;
      const match = idxState.expiries.find(e => e.iso === expIsoOrKey || e.key === expIsoOrKey);
      if (match) {
        idxState.selectedExpiry = match.iso;
        const basketExp = document.getElementById("basketExpiry");
        if (basketExp) basketExp.value = match.key;
        if (_state.dhanLiveActive || (_state.workerOnline && _state.workerTokenValid)) {
          fetchDhanOptionChainReadOnly(_state.activeSymbol, match.iso);
        }
        renderAllMountedOptionChains();
      }
    },
    setViewMode(mode) {
      _state.activeViewMode = mode === "GREEKS" ? "GREEKS" : "OI";
      renderAllMountedOptionChains();
    },
    toggleDemoTicks() {
      _state.demoLivePreview = !_state.demoLivePreview;
      if (_state.demoLivePreview && _state.workerOnline && _state.workerTokenValid) {
        const idxState = _state.indices[_state.activeSymbol];
        if (idxState) fetchDhanOptionChainReadOnly(_state.activeSymbol, idxState.selectedExpiry);
      }
      renderAllMountedOptionChains();
    },
    setWorkerUrl(url) {
      const clean = String(url || "").trim().replace(/\/+$/, "");
      _state.workerUrl = clean;
      _state.officialExpiriesLoaded = {};
      try {
        if (clean) localStorage.setItem("liveipo_worker_url", clean);
        else localStorage.removeItem("liveipo_worker_url");
      } catch (e) {}
    },
    getWorkerUrl() {
      return _state.workerUrl || getStoredWorkerUrl();
    },
    calcLegPnl(symbol, entry, ltp, lots, action) {
      const sym = normalizeSymbolKey(symbol);
      const lotSize = (OC_INDEX_CATALOG[sym] && OC_INDEX_CATALOG[sym].lotSize) || 65;
      const e = parseFloat(entry) || 0;
      const l = parseFloat(ltp) || 0;
      const q = parseFloat(lots) || 1;
      const act = String(action || "S").toUpperCase();
      const diff = (act === "S" || act === "SELL") ? (e - l) : (l - e);
      return Math.round(diff * q * lotSize);
    },
    getLotSize(symbol) {
      const sym = normalizeSymbolKey(symbol);
      return (OC_INDEX_CATALOG[sym] && OC_INDEX_CATALOG[sym].lotSize) || 65;
    },
    onLegAction(strike, type, action, ltp) {
      const basketIdx = document.getElementById("basketIndex");
      const basketExp = document.getElementById("basketExpiry");
      const idxState = _state.indices[_state.activeSymbol];
      if (basketIdx) basketIdx.value = _state.activeSymbol;
      if (basketExp && idxState) {
        const exp = idxState.expiries.find(e => e.iso === idxState.selectedExpiry) || idxState.expiries[0];
        if (exp) basketExp.value = exp.key;
      }
      if (typeof global.selectSensibullStrike === "function") {
        global.selectSensibullStrike(strike, type, action, ltp);
      }
    },
    getLiveLtp(symbol, expiry, strike, type) {
      const sym = normalizeSymbolKey(symbol || _state.activeSymbol);
      const data = computeActiveOptionChain(sym, expiry);
      const numStrike = parseFloat(strike);
      const found = data.rows.find(r => r.strike === numStrike);
      if (found) return type === "CE" ? found.callLtp : found.putLtp;
      const idxState = _state.indices[sym];
      const baseStrike = idxState && idxState.strikes && idxState.strikes[numStrike];
      if (baseStrike) return type === "CE" ? baseStrike.ceBaseLtp : baseStrike.peBaseLtp;
      const bs = calcBlackScholes(data.spot, numStrike || data.atm, data.expiry ? data.expiry.daysLeft : 3, data.cfg.baseIv, type);
      return bs.price;
    },
    getSpot(symbol) {
      const sym = normalizeSymbolKey(symbol || _state.activeSymbol);
      return _state.indices[sym] ? _state.indices[sym].spot : 25607.20;
    },
    getActiveSymbol() {
      return _state.activeSymbol;
    },
    getActiveExpiry() {
      const idxState = _state.indices[_state.activeSymbol];
      return idxState ? idxState.selectedExpiry : "2026-12-01";
    },
    inspectJwtExpiry,
    checkWorkerStatus,
    fetchDhanOptionChainReadOnly,
    renderAll: () => renderAllMountedOptionChains(),
    isMarketOpen: () => isIndianMarketOpen(),
    isDhanLiveActive: () => _state.dhanLiveActive,
    isLiveActive: () => isIndianMarketOpen() || _state.demoLivePreview
  };

  global.OCEngine = OCEngine;

  // Auto-mount hosts, check Cloudflare Worker on startup, & start IST tick loop
  async function autoSyncWorkerOnLoad() {
    const wUrl = getStoredWorkerUrl();
    if (!wUrl) return;
    const status = await checkWorkerStatus(wUrl);
    if (status && status.ok && status.tokenValid) {
      await fetchWorkerExpiries(_state.activeSymbol);
      const idxState = _state.indices[_state.activeSymbol];
      await fetchDhanOptionChainReadOnly(_state.activeSymbol, idxState ? idxState.selectedExpiry : "");
      renderAllMountedOptionChains();
    } else {
      renderAllMountedOptionChains();
    }
  }

  function autoMount() {
    ["ocHost-adminPage", "ocHost-modal", "ocHost-frontPage"].forEach(id => {
      if (document.getElementById(id)) {
        OCEngine.mount(id);
      }
    });
    if (global._ocMasterTimer) clearInterval(global._ocMasterTimer);
    global._ocMasterTimer = setInterval(tickMarketLoop, 1000);
    tickMarketLoop();
    autoSyncWorkerOnLoad();
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoMount);
    } else {
      autoMount();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
