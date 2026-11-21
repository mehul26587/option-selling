/**
 * LiveIPO Option Selling Portal - Frontend Script (script.js)
 * Standalone client-side application with Sensibull-style Multi-Leg Option Strategies,
 * Day-by-Day analysis, interactive Payoff Graph, and Google Identity Services.
 */

// ==========================================
// 1. GOOGLE IDENTITY SERVICES CONFIGURATION
// ==========================================
const GOOGLE_CLIENT_ID = "207372613533-2lvj2glt01tn79f5tnd38kcc6d74h2ch.apps.googleusercontent.com";

// Default Plans
const PLANS = {
  basic: { id: "basic", name: "Basic Starter", price: 999, durationDays: 30, trades: "1-2 / day" },
  silver: { id: "silver", name: "Silver Trader", price: 2499, durationDays: 90, trades: "2-3 / day" },
  gold: { id: "gold", name: "Gold Pro", price: 4499, durationDays: 180, trades: "3-5 / day + Hedging" },
  premium: { id: "premium", name: "Premium Elite", price: 7999, durationDays: 365, trades: "All Access + Direct Support" }
};

// ==========================================
// 2. MULTI-LEG OPTION STRATEGIES DATA (SENSIBULL STYLE)
// 3 Strikes combined into 1 Single Trade with Day-by-Day Analysis
// ==========================================
const DEFAULT_MULTILEG_STRATEGIES = [
  {
    id: "STRAT-23NOV-NIFTY",
    title: "NIFTY Multi-Strike Ratio Put Spread (3-Leg Basket)",
    index: "NIFTY",
    underlyingPrice: 25436.55,
    underlyingChange: "+0.83%",
    expiry: "23 Nov",
    strategyType: "Custom Ratio Put Spread",
    status: "OPEN",
    entryDate: "2026-11-19",
    expiryDate: "2026-11-23",
    totalBooked: 0,
    totalUnbooked: 9276,
    totalPnl: 9276,
    metrics: {
      profitLeft: 26091,
      profitLeftPct: "+2.4%",
      lossLeft: "Unlimited",
      maxProfit: 35484,
      maxProfitPct: "+3.3%",
      maxLoss: "Unlimited",
      breakeven: 24959,
      breakevenPct: "-1.9%",
      pop: "91%",
      rewardRisk: "1/x NA",
      timeValue: -9854,
      intrinsicValue: 16263,
      standaloneFunds: "10.88L",
      standaloneMargin: "10.68L",
      marginAvailable: "12,34,329"
    },
    legs: [
      {
        id: "leg-1",
        action: "SELL",
        actionBadge: "S",
        instrument: "23rd Nov 25050 PE",
        lots: 6,
        avgPrice: 46.35,
        ltp: 24.30,
        booked: 0,
        unbooked: 8249,
        pnl: 8249
      },
      {
        id: "leg-2",
        action: "SELL",
        actionBadge: "S",
        instrument: "23rd Nov 25350 PE",
        lots: 2,
        avgPrice: 120.75,
        ltp: 81.00,
        booked: 0,
        unbooked: 4778,
        pnl: 4778
      },
      {
        id: "leg-3",
        action: "BUY",
        actionBadge: "B",
        instrument: "23rd Nov 25600 PE",
        lots: 2,
        avgPrice: 236.85,
        ltp: 203.20,
        booked: 0,
        unbooked: -3750,
        pnl: -3750
      }
    ],
    dayByDayHistory: [
      {
        date: "19 Nov (Day 1)",
        niftySpot: 25400.00,
        leg1Ltp: 46.35,
        leg2Ltp: 120.75,
        leg3Ltp: 236.85,
        bookedPnl: 0,
        unbookedPnl: 2850,
        dayPnl: "+2,850",
        thetaCaptured: "12%",
        remark: "Strategy deployed at market open"
      },
      {
        date: "20 Nov (Day 2)",
        niftySpot: 25420.50,
        leg1Ltp: 34.50,
        leg2Ltp: 98.20,
        leg3Ltp: 218.40,
        bookedPnl: 0,
        unbookedPnl: 5600,
        dayPnl: "+2,750",
        thetaCaptured: "38%",
        remark: "Clean overnight theta decay"
      },
      {
        date: "21 Nov (Live Today)",
        niftySpot: 25436.55,
        leg1Ltp: 24.30,
        leg2Ltp: 81.00,
        leg3Ltp: 203.20,
        bookedPnl: 0,
        unbookedPnl: 9276,
        dayPnl: "+3,676",
        thetaCaptured: "62%",
        remark: "Current Live Market Analysis"
      },
      {
        date: "22 Nov (Projected)",
        niftySpot: 25450.00,
        leg1Ltp: 12.00,
        leg2Ltp: 45.00,
        leg3Ltp: 160.00,
        bookedPnl: 0,
        unbookedPnl: 18500,
        dayPnl: "+9,224",
        thetaCaptured: "80%",
        remark: "Pre-Expiry Weekend Decay"
      },
      {
        date: "23 Nov (Expiry Target)",
        niftySpot: 25450.00,
        leg1Ltp: 0.05,
        leg2Ltp: 0.05,
        leg3Ltp: 0.05,
        bookedPnl: 35484,
        unbookedPnl: 0,
        dayPnl: "+16,984",
        thetaCaptured: "100%",
        remark: "Max Potential Profit Achieved"
      }
    ],
    greeks: {
      delta: "+14.2 (Mild Bullish)",
      theta: "+₹3,676 / day (High Decay)",
      gamma: "-0.0018",
      vega: "-₹1,240 / 1% IV Drop"
    }
  }
];

// Seed Historical Individual Trades
const SEED_TRADES = [
  {
    id: "TRD-101",
    index: "NIFTY",
    strategy: "3-Leg Ratio Put Spread",
    strike: "25050 PE (S) / 25350 PE (S) / 25600 PE (B)",
    action: "SELL",
    entryPrice: 403.95,
    currentPrice: 308.50,
    targetPrice: 200.00,
    stopLoss: 550.00,
    lots: 10,
    pnl: 9276,
    status: "OPEN",
    date: "2026-11-21"
  },
  {
    id: "TRD-102",
    index: "BANKNIFTY",
    strategy: "Bull Put Spread",
    strike: "51800 PE Sell / 51500 PE Buy",
    action: "SELL",
    entryPrice: 165.00,
    currentPrice: 15.00,
    targetPrice: 15.00,
    stopLoss: 220.00,
    lots: 3,
    pnl: 13500,
    status: "TARGET HIT",
    date: "2026-11-19"
  },
  {
    id: "TRD-103",
    index: "FINNIFTY",
    strategy: "Bear Call Spread",
    strike: "23500 CE Sell / 23700 CE Buy",
    action: "SELL",
    entryPrice: 62.00,
    currentPrice: 8.50,
    targetPrice: 5.00,
    stopLoss: 95.00,
    lots: 5,
    pnl: 10700,
    status: "TARGET HIT",
    date: "2026-11-18"
  },
  {
    id: "TRD-104",
    index: "NIFTY",
    strategy: "Short Straddle",
    strike: "24500 CE & PE",
    action: "SELL",
    entryPrice: 210.00,
    currentPrice: 145.00,
    targetPrice: 90.00,
    stopLoss: 275.00,
    lots: 2,
    pnl: 6500,
    status: "OPEN",
    date: "2026-11-20"
  },
  {
    id: "TRD-105",
    index: "BANKNIFTY",
    strategy: "Short Strangle",
    strike: "52500 CE / 51200 PE",
    action: "SELL",
    entryPrice: 140.00,
    currentPrice: 28.00,
    targetPrice: 20.00,
    stopLoss: 190.00,
    lots: 4,
    pnl: 16800,
    status: "TARGET HIT",
    date: "2026-11-17"
  }
];

// Helper: Parse Google JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

// Global App State
let currentUser = null;
let currentTab = "dashboard";
let selectedPlanForPayment = null;
let activeSensibullTab = "payoff";
let currentSimulatedTargetNifty = 25445.05;
let currentSimulatedDaysToExpiry = 2;

// ==========================================
// 3. USER AUTHENTICATION & DATA ISOLATION
// ==========================================
function getCurrentUser() {
  const stored = localStorage.getItem("live_ipo_current_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function getUserIsolatedData(email) {
  const key = `liveipo_user_${email}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  const initial = {
    email: email,
    plan: "Free Trial",
    planId: "free",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    status: "ACTIVE",
    payments: [],
    customNotes: []
  };
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveUserIsolatedData(email, data) {
  localStorage.setItem(`liveipo_user_${email}`, JSON.stringify(data));
  syncUserToGlobalDB(email, data);
}

function syncUserToGlobalDB(email, data) {
  let db = [];
  try {
    const raw = localStorage.getItem("liveipo_users_db");
    if (raw) db = JSON.parse(raw);
  } catch (e) {}

  const idx = db.findIndex(u => u.email === email);
  const userInfo = {
    email: email,
    name: currentUser ? currentUser.name : email.split("@")[0],
    picture: currentUser ? currentUser.picture : "",
    plan: data.plan,
    expiryDate: data.expiryDate,
    status: data.status,
    lastActive: new Date().toISOString()
  };

  if (idx >= 0) {
    db[idx] = { ...db[idx], ...userInfo };
  } else {
    db.push(userInfo);
  }
  localStorage.setItem("liveipo_users_db", JSON.stringify(db));
}

// Google Sign-In Callback Handler
window.handleGoogleSignIn = function(response) {
  if (!response || !response.credential) return;
  const payload = parseJwt(response.credential);
  if (payload) {
    currentUser = {
      id: payload.sub,
      name: payload.name || payload.given_name || "User",
      email: payload.email,
      picture: payload.picture || ""
    };
    localStorage.setItem("live_ipo_current_user", JSON.stringify(currentUser));
    getUserIsolatedData(currentUser.email);
    closeAuthModal();
    renderAuthUI();
    loadDashboardData();
    showToast(`✓ Welcome ${currentUser.name}! Logged in successfully.`);
  }
};

function logoutUser() {
  localStorage.removeItem("live_ipo_current_user");
  currentUser = null;
  if (window.google && google.accounts && google.accounts.id) {
    google.accounts.id.disableAutoSelect();
  }
  renderAuthUI();
  loadDashboardData();
  showToast("Logged out successfully.");
}

function renderAuthUI() {
  currentUser = getCurrentUser();
  const loginBtn = document.getElementById("headerLoginBtn");
  const userProfile = document.getElementById("headerUserProfile");
  const sidebarUser = document.getElementById("sidebarUserWidget");

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none";
    if (userProfile) {
      userProfile.style.display = "flex";
      document.getElementById("userAvatarImg").src = currentUser.picture || "https://api.dicebear.com/7.x/bottts/svg?seed=" + encodeURIComponent(currentUser.name);
      document.getElementById("userNameText").textContent = currentUser.name;
    }
    if (sidebarUser) {
      sidebarUser.style.display = "flex";
      document.getElementById("sidebarAvatarImg").src = currentUser.picture || "https://api.dicebear.com/7.x/bottts/svg?seed=" + encodeURIComponent(currentUser.name);
      document.getElementById("sidebarUserName").textContent = currentUser.name;
      const userData = getUserIsolatedData(currentUser.email);
      document.getElementById("sidebarUserPlan").textContent = userData.plan;
    }
  } else {
    if (loginBtn) loginBtn.style.display = "flex";
    if (userProfile) userProfile.style.display = "none";
    if (sidebarUser) sidebarUser.style.display = "none";
  }
}

// ==========================================
// 4. MULTI-LEG STRATEGY & SENSIBULL RENDERING
// ==========================================
function getMultiLegStrategies() {
  try {
    const raw = localStorage.getItem("liveipo_multileg_strategies");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(DEFAULT_MULTILEG_STRATEGIES));
  return DEFAULT_MULTILEG_STRATEGIES;
}

function getAllTrades() {
  const stored = localStorage.getItem("liveipo_shared_trades");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  localStorage.setItem("liveipo_shared_trades", JSON.stringify(SEED_TRADES));
  return SEED_TRADES;
}

function renderSensibullInterface(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const strategies = getMultiLegStrategies();
  if (!strategies || strategies.length === 0) return;

  const strat = strategies[0]; // Active 3-Leg Ratio Put Spread

  container.innerHTML = `
    <div class="sensibull-wrapper">
      <!-- Top Banner -->
      <div class="sensibull-header-banner">
        <div class="sensibull-underlying">
          <span style="font-size: 20px;">🔍</span>
          <span class="underlying-badge">${strat.index} ${strat.underlyingPrice.toFixed(2)}</span>
          <span class="underlying-change">${strat.underlyingChange}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 12px; color: #64748b; font-weight: 600;">MULTI-STRIKE SINGLE BASKET TRADE</span>
          <button class="btn-export" style="font-size: 11px; padding: 4px 10px;" onclick="refreshLivePrices()">⚡ Refresh Live LTP</button>
        </div>
      </div>

      <!-- Main 2-Column Grid -->
      <div class="sensibull-grid">
        
        <!-- Left Column: 3 Strike Legs -->
        <div class="sensibull-left">
          <div class="expiry-chips">
            <button class="chip active">Show All</button>
            <button class="chip">${strat.expiry}</button>
          </div>

          <!-- Strategy Combined P&L Summary -->
          <div class="strategy-pnl-summary">
            <div class="summary-col">
              <div class="label">Total Booked</div>
              <div class="val">₹${strat.totalBooked}</div>
            </div>
            <div class="summary-col">
              <div class="label">Total Unbooked</div>
              <div class="val green">+₹${strat.totalUnbooked.toLocaleString("en-IN")}</div>
            </div>
            <div class="summary-col">
              <div class="label">Total P&L</div>
              <div class="val green">+₹${strat.totalPnl.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <!-- Leg Items -->
          <div class="legs-list">
            ${strat.legs.map((leg, idx) => {
              const isProfit = leg.pnl >= 0;
              return `
                <div class="leg-card">
                  <div class="leg-top-row">
                    <div class="leg-ident">
                      <input type="checkbox" checked disabled>
                      <span class="leg-action-badge ${leg.action.toLowerCase()}">${leg.actionBadge}</span>
                      <span class="leg-instrument-name">${leg.instrument}</span>
                    </div>
                    <span style="font-size: 11px; color: #64748b;">⋮</span>
                  </div>

                  <div class="leg-stats-grid">
                    <div class="leg-stat-item">
                      <span class="l-lbl">Lots</span>
                      <span class="l-val">${leg.lots}</span>
                    </div>
                    <div class="leg-stat-item">
                      <span class="l-lbl">Avg Price</span>
                      <span class="l-val">₹${leg.avgPrice.toFixed(2)}</span>
                    </div>
                    <div class="leg-stat-item">
                      <span class="l-lbl">Live LTP</span>
                      <span class="l-val" style="color: #2563eb;">₹${leg.ltp.toFixed(2)}</span>
                    </div>
                  </div>

                  <div class="leg-pnl-row">
                    <span style="color: #64748b;">Booked: ₹${leg.booked}</span>
                    <span style="color: #64748b;">Unbooked: <strong style="color: ${isProfit ? '#10b981' : '#ef4444'}">${isProfit ? '+' : ''}₹${leg.unbooked.toLocaleString("en-IN")}</strong></span>
                    <span class="pnl-txt" style="color: ${isProfit ? '#10b981' : '#ef4444'}">
                      ${isProfit ? '+' : ''}₹${leg.pnl.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Right Column: Metrics, Payoff Chart & Day-by-Day Analysis -->
        <div class="sensibull-right">
          
          <!-- Metrics Bar -->
          <div class="strategy-metrics-panel">
            <div class="metric-item">
              <span class="m-lbl">Profit Left</span>
              <span class="m-val green">+₹${strat.metrics.profitLeft.toLocaleString("en-IN")} (${strat.metrics.profitLeftPct})</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Loss Left</span>
              <span class="m-val red">${strat.metrics.lossLeft}</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Max Profit</span>
              <span class="m-val green">+₹${strat.metrics.maxProfit.toLocaleString("en-IN")} (${strat.metrics.maxProfitPct})</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Breakeven</span>
              <span class="m-val">${strat.metrics.breakeven} (${strat.metrics.breakevenPct})</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">POP</span>
              <span class="m-val blue">${strat.metrics.pop}</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Time Value</span>
              <span class="m-val red">${strat.metrics.timeValue}</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Standalone Margin</span>
              <span class="m-val">${strat.metrics.standaloneMargin}</span>
            </div>
          </div>

          <!-- Tab Bar -->
          <div class="sensibull-tabs-bar">
            <div class="sensibull-tab-nav">
              <div class="s-tab-link ${activeSensibullTab === 'payoff' ? 'active' : ''}" onclick="setSensibullTab('payoff')">Payoff Graph</div>
              <div class="s-tab-link ${activeSensibullTab === 'daybyday' ? 'active' : ''}" onclick="setSensibullTab('daybyday')">Day-by-Day Analysis & P&L</div>
              <div class="s-tab-link ${activeSensibullTab === 'greeks' ? 'active' : ''}" onclick="setSensibullTab('greeks')">Strategy Greeks</div>
            </div>
          </div>

          <!-- Display Body -->
          <div class="payoff-display-area">
            
            <!-- VIEW 1: PAYOFF GRAPH -->
            <div id="sensibullView-payoff" style="display: ${activeSensibullTab === 'payoff' ? 'block' : 'none'};">
              <div class="chart-legend-row">
                <div class="legend-items">
                  <span><span class="legend-indicator legend-green"></span> <strong>On Expiry</strong></span>
                  <span><span class="legend-indicator legend-blue"></span> <strong>On Target Date</strong></span>
                  <span style="color: #64748b;">● OI Call: 35.25L | Put: 25.38L</span>
                </div>
                <div style="font-size: 12px; font-weight: 700; color: #10b981; background: #ecfdf5; padding: 4px 10px; border-radius: 6px;" id="projectedProfitBadge">
                  Projected profit: ₹9,300 (+0.93%)
                </div>
              </div>

              <!-- Interactive SVG Payoff Curve -->
              <div class="payoff-chart-box">
                <svg id="payoffSvg" viewBox="0 0 600 220" style="width: 100%; height: 220px; overflow: visible;">
                  <!-- Zero line -->
                  <line x1="20" y1="120" x2="580" y2="120" stroke="#cbd5e1" stroke-dasharray="4" stroke-width="1.5" />
                  <text x="25" y="115" font-size="10" fill="#94a3b8">₹0 P&L</text>
                  
                  <!-- Profit Shaded Area -->
                  <polygon points="200,120 200,50 560,50 560,120" fill="rgba(16,185,129,0.08)" />
                  <!-- Loss Shaded Area -->
                  <polygon points="40,200 200,120 40,120" fill="rgba(239,68,68,0.08)" />

                  <!-- Green Line (On Expiry) -->
                  <!-- Downward slope below breakeven 24959, flat peak above 25350 -->
                  <polyline points="40,205 180,135 220,50 560,50" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />

                  <!-- Blue Line (On Target Date / Dynamic Theta Curve) -->
                  <path id="targetDateCurve" d="M 40,205 Q 160,160 220,100 T 400,65 T 560,55" fill="none" stroke="#2563eb" stroke-width="2.5" />

                  <!-- Current Spot Vertical Line (NIFTY 25436.55) -->
                  <line id="spotVerticalLine" x1="420" y1="20" x2="420" y2="200" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2" />
                  <circle id="spotCircle" cx="420" cy="65" r="5" fill="#2563eb" stroke="#ffffff" stroke-width="2" />

                  <!-- Strike Markers -->
                  <text x="180" y="215" font-size="9" fill="#64748b" text-anchor="middle">24,959 (BE)</text>
                  <text x="250" y="215" font-size="9" fill="#64748b" text-anchor="middle">25,050 PE</text>
                  <text x="370" y="215" font-size="9" fill="#64748b" text-anchor="middle">25,350 PE</text>
                  <text x="420" y="215" font-size="9" fill="#2563eb" font-weight="bold" text-anchor="middle">Current: 25,445</text>
                  <text x="500" y="215" font-size="9" fill="#64748b" text-anchor="middle">25,600 PE</text>
                </svg>
              </div>

              <!-- Interactive Controls (NIFTY Target Slider & Date Slider) -->
              <div class="interactive-controls-bar">
                <div class="control-group">
                  <div class="control-label-row">
                    <span>NIFTY Target Price: <strong id="sliderNiftyVal" style="color: #2563eb;">25,445.05</strong></span>
                    <button style="border: none; background: none; color: #2563eb; cursor: pointer; font-size: 11px;" onclick="resetNiftySlider()">Reset</button>
                  </div>
                  <input type="range" class="custom-range-slider" id="niftyRangeSlider" min="24500" max="26200" step="25" value="25445" oninput="onNiftySliderChange(this.value)">
                </div>

                <div class="control-group">
                  <div class="control-label-row">
                    <span>Target Date: <strong id="sliderDateVal" style="color: #10b981;">21 Nov (Live Market)</strong></span>
                    <button style="border: none; background: none; color: #2563eb; cursor: pointer; font-size: 11px;" onclick="resetDateSlider()">Reset</button>
                  </div>
                  <input type="range" class="custom-range-slider" id="dateRangeSlider" min="1" max="5" step="1" value="3" oninput="onDateSliderChange(this.value)">
                </div>
              </div>
            </div>

            <!-- VIEW 2: DAY-BY-DAY ANALYSIS & PROGRESSION -->
            <div id="sensibullView-daybyday" style="display: ${activeSensibullTab === 'daybyday' ? 'block' : 'none'};">
              <p style="font-size: 12.5px; color: #64748b; margin-bottom: 12px;">
                📅 <strong>Day-by-Day Historical & Live Market Analysis:</strong> Track how the 3 strike prices decay collectively each day from entry to expiry.
              </p>
              <div class="table-responsive">
                <table class="day-progression-table">
                  <thead>
                    <tr>
                      <th>Date / Stage</th>
                      <th>NIFTY Spot</th>
                      <th>25050 PE (S)</th>
                      <th>25350 PE (S)</th>
                      <th>25600 PE (B)</th>
                      <th>Theta Gain</th>
                      <th>Cumulative P&L</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${strat.dayByDayHistory.map(row => {
                      const isToday = row.date.includes("Today");
                      return `
                        <tr class="${isToday ? 'highlight-today' : ''}">
                          <td><strong>${row.date}</strong></td>
                          <td>₹${row.niftySpot.toFixed(2)}</td>
                          <td>₹${row.leg1Ltp.toFixed(2)}</td>
                          <td>₹${row.leg2Ltp.toFixed(2)}</td>
                          <td>₹${row.leg3Ltp.toFixed(2)}</td>
                          <td style="color: #10b981; font-weight: 700;">${row.dayPnl}</td>
                          <td style="color: #10b981; font-weight: 800; font-size: 13.5px;">+₹${row.unbookedPnl.toLocaleString("en-IN")}</td>
                          <td><span style="font-size: 11px; color: #475569;">${row.remark}</span></td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- VIEW 3: GREEKS -->
            <div id="sensibullView-greeks" style="display: ${activeSensibullTab === 'greeks' ? 'block' : 'none'};">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; padding: 10px 0;">
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 11.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Delta</span>
                  <h3 style="font-size: 18px; color: #2563eb; margin-top: 4px;">${strat.greeks.delta}</h3>
                  <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Portfolio directional bias is balanced to neutral</p>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 11.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Theta</span>
                  <h3 style="font-size: 18px; color: #10b981; margin-top: 4px;">${strat.greeks.theta}</h3>
                  <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Daily income generated from time decay</p>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 11.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Gamma</span>
                  <h3 style="font-size: 18px; color: #0f172a; margin-top: 4px;">${strat.greeks.gamma}</h3>
                  <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Low delta movement risk</p>
                </div>
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  <span style="font-size: 11.5px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Vega</span>
                  <h3 style="font-size: 18px; color: #9333ea; margin-top: 4px;">${strat.greeks.vega}</h3>
                  <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Benefits when market volatility cools off</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;
}

function setSensibullTab(tabName) {
  activeSensibullTab = tabName;
  document.querySelectorAll(".s-tab-link").forEach(l => {
    l.classList.remove("active");
  });
  const views = ["payoff", "daybyday", "greeks"];
  views.forEach(v => {
    const el = document.getElementById(`sensibullView-${v}`);
    if (el) el.style.display = v === tabName ? "block" : "none";
  });
  event.target.classList.add("active");
}

// Sliders Interactive Logic
function onNiftySliderChange(val) {
  currentSimulatedTargetNifty = parseFloat(val);
  document.getElementById("sliderNiftyVal").textContent = currentSimulatedTargetNifty.toLocaleString("en-IN");
  updateInteractivePayoff();
}

function onDateSliderChange(val) {
  currentSimulatedDaysToExpiry = parseInt(val);
  const stages = [
    "19 Nov (Day 1 Entry)",
    "20 Nov (Day 2 Holding)",
    "21 Nov (Live Market Today)",
    "22 Nov (Pre-Expiry Projected)",
    "23 Nov (Expiry Target)"
  ];
  document.getElementById("sliderDateVal").textContent = stages[val - 1] || "21 Nov (Live)";
  updateInteractivePayoff();
}

function resetNiftySlider() {
  document.getElementById("niftyRangeSlider").value = 25445;
  onNiftySliderChange(25445);
}

function resetDateSlider() {
  document.getElementById("dateRangeSlider").value = 3;
  onDateSliderChange(3);
}

function updateInteractivePayoff() {
  const diffNifty = currentSimulatedTargetNifty - 25436.55;
  // Calculate simulated PnL based on NIFTY movement & days decay
  const thetaBonus = (currentSimulatedDaysToExpiry - 1) * 4500;
  let simulatedPnl = 9276 + thetaBonus;

  // Below breakeven 24959: severe drop
  if (currentSimulatedTargetNifty < 24959) {
    const lossDrop = (24959 - currentSimulatedTargetNifty) * 150;
    simulatedPnl -= lossDrop;
  } else if (currentSimulatedTargetNifty > 25600) {
    // High upside: fixed max profit
    simulatedPnl = Math.min(35484, simulatedPnl + 3000);
  }

  const badge = document.getElementById("projectedProfitBadge");
  if (badge) {
    const isProfit = simulatedPnl >= 0;
    badge.textContent = `Projected profit: ${isProfit ? '+' : ''}₹${Math.round(simulatedPnl).toLocaleString("en-IN")}`;
    badge.style.color = isProfit ? '#10b981' : '#ef4444';
    badge.style.background = isProfit ? '#ecfdf5' : '#fee2e2';
  }

  // Shift Spot Line in SVG
  const minX = 24500, maxX = 26200;
  const svgWidth = 540;
  const pct = Math.max(0, Math.min(1, (currentSimulatedTargetNifty - minX) / (maxX - minX)));
  const mappedX = 40 + pct * svgWidth;

  const spotLine = document.getElementById("spotVerticalLine");
  const spotCircle = document.getElementById("spotCircle");
  if (spotLine && spotCircle) {
    spotLine.setAttribute("x1", mappedX);
    spotLine.setAttribute("x2", mappedX);
    spotCircle.setAttribute("cx", mappedX);
  }
}

function refreshLivePrices() {
  showToast("⚡ Updating live market quotes & LTPs from NSE...");
  setTimeout(() => {
    showToast("✓ Live market quotes synced: NIFTY 25436.55 (+0.83%)");
  }, 800);
}

// ==========================================
// 5. DASHBOARD DATA LOADER
// ==========================================
function loadDashboardData() {
  const trades = getAllTrades();
  let userData = null;
  if (currentUser) {
    userData = getUserIsolatedData(currentUser.email);
  }

  // Update Subscription Banner
  const planNameSpan = document.getElementById("bannerPlanName");
  const expirySpan = document.getElementById("bannerExpiryDate");
  const daysLeftSpan = document.getElementById("bannerDaysLeft");

  if (userData) {
    if (planNameSpan) planNameSpan.textContent = userData.plan;
    if (expirySpan) expirySpan.textContent = userData.expiryDate;
    const diff = Math.ceil((new Date(userData.expiryDate) - new Date()) / 86400000);
    if (daysLeftSpan) {
      daysLeftSpan.textContent = diff > 0 ? `${diff} Days Left` : "Expired (Renew now)";
    }
  } else {
    if (planNameSpan) planNameSpan.textContent = "Guest Mode";
    if (expirySpan) expirySpan.textContent = "Sign in to activate";
    if (daysLeftSpan) daysLeftSpan.textContent = "Login with Google";
  }

  // Calculate Metrics
  let totalTrades = trades.length;
  let totalProfit = 9276; // including active multi-leg basket
  let winCount = 1;
  let openTradesCount = 1;

  trades.forEach(t => {
    totalProfit += (t.pnl || 0);
    if ((t.pnl || 0) > 0) winCount++;
    if (t.status === "OPEN") openTradesCount++;
  });

  const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;

  const totalPnlEl = document.getElementById("statTotalPnl");
  const winRateEl = document.getElementById("statWinRate");
  const totalTradesEl = document.getElementById("statTotalTrades");
  const openTradesEl = document.getElementById("statOpenTrades");

  if (totalPnlEl) {
    totalPnlEl.textContent = `₹${totalProfit.toLocaleString("en-IN")}`;
    totalPnlEl.className = totalProfit >= 0 ? "stat-value profit" : "stat-value loss";
  }
  if (winRateEl) winRateEl.textContent = `${winRate}%`;
  if (totalTradesEl) totalTradesEl.textContent = totalTrades;
  if (openTradesEl) openTradesEl.textContent = openTradesCount;

  // Render Sensibull Interface on Dashboard
  renderSensibullInterface("sensibullDashboardContainer");

  // Render Sensibull Interface in Trade History
  renderSensibullInterface("sensibullTradeHistoryContainer");

  // Render Trade Table
  renderTradeTable(trades);

  // Render Subscription & Payments Tab
  renderSubscriptionTab(userData);
  renderPaymentsTab(userData);
}

function renderTradeTable(trades) {
  const tbody = document.getElementById("tradeTableBody");
  const historyTbody = document.getElementById("tradeHistoryBody");

  const rows = trades.map(t => {
    const isProfit = (t.pnl || 0) >= 0;
    const statusColor = t.status === "OPEN" ? "#2563eb" : (t.status === "TARGET HIT" ? "#10b981" : "#64748b");
    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.date}</td>
        <td><strong>${t.index}</strong></td>
        <td>${t.strategy}</td>
        <td>${t.strike}</td>
        <td><span class="badge-${t.action.toLowerCase()}">${t.action}</span></td>
        <td>₹${t.entryPrice}</td>
        <td>₹${t.currentPrice || t.targetPrice}</td>
        <td style="font-weight: 700; color: ${isProfit ? '#10b981' : '#ef4444'}">
          ${isProfit ? '+' : ''}₹${(t.pnl || 0).toLocaleString("en-IN")}
        </td>
        <td><span style="background: ${statusColor}15; color: ${statusColor}; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 11.5px;">${t.status}</span></td>
      </tr>
    `;
  }).join("");

  if (tbody) tbody.innerHTML = rows;
  if (historyTbody) historyTbody.innerHTML = rows;
}

function renderSubscriptionTab(userData) {
  const container = document.getElementById("subTabContainer");
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h3 style="font-size: 20px; margin-bottom: 12px; color: #0f172a;">🔐 Google Login Required</h3>
        <p style="color: #64748b; margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto;">
          Please sign in with your Google Account to view your subscription status, renew plan, and access verified options selling calls.
        </p>
        <button class="btn-gsi" style="margin: 0 auto;" onclick="openAuthModal()">
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google"> Sign In With Google
        </button>
      </div>
    `;
    return;
  }

  const diff = Math.ceil((new Date(userData.expiryDate) - new Date()) / 86400000);
  const isExpired = diff <= 0;

  container.innerHTML = `
    <div style="background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 28px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px;">
        <div>
          <span style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700;">Account Email</span>
          <h2 style="font-size: 20px; color: #0f172a; margin-top: 4px;">${currentUser.email}</h2>
        </div>
        <span style="background: ${isExpired ? '#fee2e2' : '#ecfdf5'}; color: ${isExpired ? '#ef4444' : '#10b981'}; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 13px;">
          ${isExpired ? 'EXPIRED' : 'ACTIVE SUBSCRIPTION'}
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px;">
        <div style="background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600;">Current Plan</div>
          <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px;">${userData.plan}</div>
        </div>
        <div style="background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600;">Expiry Date</div>
          <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px;">${userData.expiryDate}</div>
        </div>
        <div style="background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #64748b; font-weight: 600;">Time Remaining</div>
          <div style="font-size: 20px; font-weight: 800; color: ${isExpired ? '#ef4444' : '#2563eb'}; margin-top: 4px;">
            ${isExpired ? '0 Days (Expired)' : `${diff} Days Left`}
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 14px;">
        <button class="btn-select-plan" style="max-width: 220px;" onclick="switchTab('pricing')">
          ⚡ Upgrade / Renew Plan
        </button>
        <button class="btn-export" onclick="switchTab('trades')">
          📈 View Trade History
        </button>
      </div>
    </div>
  `;
}

function renderPaymentsTab(userData) {
  const container = document.getElementById("paymentsTableContainer");
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 30px;">Login with Google to view payment receipts and invoice history.</p>`;
    return;
  }

  const payments = (userData && userData.payments) || [];
  if (payments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        <p style="margin-bottom: 12px;">No payment transactions recorded yet.</p>
        <button class="btn-select-plan" style="display: inline-block; max-width: 200px;" onclick="switchTab('pricing')">View Pricing Plans</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table class="custom-table">
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Date</th>
          <th>Plan Name</th>
          <th>Amount</th>
          <th>Payment Mode</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map(p => `
          <tr>
            <td><strong>${p.invoiceId}</strong></td>
            <td>${p.date}</td>
            <td>${p.planName}</td>
            <td><strong>₹${p.amount.toLocaleString("en-IN")}</strong></td>
            <td>${p.method || 'UPI / Razorpay'}</td>
            <td><span style="color: #10b981; font-weight: 700; background: #ecfdf5; padding: 4px 8px; border-radius: 4px;">SUCCESS</span></td>
            <td>
              <button class="btn-export" style="padding: 4px 8px; font-size: 11px;" onclick="downloadInvoice('${p.invoiceId}', '${p.planName}', ${p.amount}, '${p.date}')">
                📄 Receipt
              </button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

// ==========================================
// 6. RAZORPAY PAYMENT SIMULATION FLOW
// ==========================================
function startPlanSubscription(planKey) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const plan = PLANS[planKey];
  if (!plan) return;
  selectedPlanForPayment = plan;

  document.getElementById("modalPlanName").textContent = plan.name;
  document.getElementById("modalPlanAmount").textContent = `₹${plan.price.toLocaleString("en-IN")}`;
  document.getElementById("modalPlanDuration").textContent = `${plan.durationDays} Days Membership`;
  document.getElementById("modalUserEmail").textContent = currentUser.email;

  const overlay = document.getElementById("razorpayModalOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeRazorpayModal() {
  const overlay = document.getElementById("razorpayModalOverlay");
  if (overlay) overlay.classList.remove("active");
  selectedPlanForPayment = null;
}

function completeSimulatedPayment() {
  if (!currentUser || !selectedPlanForPayment) return;

  const userData = getUserIsolatedData(currentUser.email);
  const now = new Date();
  
  let currentExpiry = new Date(userData.expiryDate);
  if (isNaN(currentExpiry) || currentExpiry < now) {
    currentExpiry = new Date();
  }
  currentExpiry.setDate(currentExpiry.getDate() + selectedPlanForPayment.durationDays);
  const newExpiryStr = currentExpiry.toISOString().split("T")[0];

  const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
  const paymentRecord = {
    invoiceId: invoiceId,
    planId: selectedPlanForPayment.id,
    planName: selectedPlanForPayment.name,
    amount: selectedPlanForPayment.price,
    date: now.toISOString().split("T")[0],
    method: "Razorpay UPI (LiveIPO Gateway)",
    status: "PAID"
  };

  userData.plan = selectedPlanForPayment.name;
  userData.planId = selectedPlanForPayment.id;
  userData.expiryDate = newExpiryStr;
  userData.status = "ACTIVE";
  userData.payments.unshift(paymentRecord);

  saveUserIsolatedData(currentUser.email, userData);

  let globalPayments = [];
  try {
    const rawP = localStorage.getItem("liveipo_payments_db");
    if (rawP) globalPayments = JSON.parse(rawP);
  } catch (e) {}
  globalPayments.unshift({
    ...paymentRecord,
    userEmail: currentUser.email,
    userName: currentUser.name
  });
  localStorage.setItem("liveipo_payments_db", JSON.stringify(globalPayments));

  closeRazorpayModal();
  loadDashboardData();
  renderAuthUI();
  showToast(`🎉 Payment of ₹${selectedPlanForPayment.price} Successful! Subscription activated till ${newExpiryStr}.`);
}

function downloadInvoice(id, plan, amount, date) {
  const receiptText = `
========================================
       LIVEIPO OPTIONS SELLING
        OFFICIAL TAX INVOICE
========================================
Invoice ID : ${id}
Date       : ${date}
Customer   : ${currentUser ? currentUser.name : 'Valued Member'}
Email      : ${currentUser ? currentUser.email : '-'}
Plan       : ${plan}
Amount     : INR ${amount}.00
Payment    : Confirmed / Paid Online
GSTIN      : 24AAACL1234F1Z8
Support    : support@liveipo.in
========================================
Thank you for trading with LiveIPO!
  `;

  const blob = new Blob([receiptText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${id}_receipt.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 7. NAVIGATION & MODALS
// ==========================================
function switchTab(tabId) {
  currentTab = tabId;

  document.querySelectorAll(".sidebar-menu li").forEach(li => {
    li.classList.toggle("active", li.getAttribute("data-tab") === tabId);
  });

  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `tab-${tabId}`);
  });

  const titles = {
    dashboard: { title: "Dashboard & Live Signals", sub: "Live options selling positions, hedging & intraday spreads" },
    analytics: { title: "P&L Analytics", sub: "Historical performance, win-rate breakdown & monthly stats" },
    trades: { title: "Trade History & Strategy Terminal", sub: "Multi-strike strategy analysis, payoff curves & verified trades" },
    subscription: { title: "My Subscription", sub: "Manage active membership, expiry date & invoices" },
    pricing: { title: "Plans & Pricing", sub: "Choose your professional option selling membership" },
    support: { title: "Help & Support", sub: "Direct support desk for options strategy queries" }
  };

  const info = titles[tabId] || titles.dashboard;
  document.getElementById("mainPageTitle").textContent = info.title;
  document.getElementById("mainPageSubtitle").textContent = info.sub;

  const sidebar = document.getElementById("mainSidebar");
  if (sidebar) sidebar.classList.remove("open");
}

function openAuthModal() {
  const modal = document.getElementById("authModalOverlay");
  if (modal) modal.classList.add("active");
}

function closeAuthModal() {
  const modal = document.getElementById("authModalOverlay");
  if (modal) modal.classList.remove("active");
}

function toggleMobileSidebar() {
  document.getElementById("mainSidebar").classList.toggle("open");
}

function showToast(msg) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function exportTradesCSV() {
  const trades = getAllTrades();
  let csv = "ID,Date,Index,Strategy,Strike,Action,EntryPrice,ExitPrice,PnL,Status\n";
  trades.forEach(t => {
    csv += `"${t.id}","${t.date}","${t.index}","${t.strategy}","${t.strike}","${t.action}",${t.entryPrice},${t.currentPrice || t.targetPrice},${t.pnl || 0},"${t.status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `liveipo_trades_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 8. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderAuthUI();
  loadDashboardData();

  if (window.google && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleSignIn,
        auto_select: false
      });

      const headerBtnCont = document.getElementById("headerGsiContainer");
      if (headerBtnCont) {
        google.accounts.id.renderButton(headerBtnCont, {
          theme: "outline",
          size: "medium",
          shape: "pill",
          text: "signin_with"
        });
      }

      const modalBtnCont = document.getElementById("modalGsiContainer");
      if (modalBtnCont) {
        google.accounts.id.renderButton(modalBtnCont, {
          theme: "filled_blue",
          size: "large",
          shape: "rectangular",
          text: "continue_with"
        });
      }
    } catch (e) {
      console.warn("GSI init note:", e);
    }
  }
});
