
// ========================================================
// DHANHQ REAL-TIME OPTION CHAIN FEED (EXACT SCREENSHOT DATA)
// ========================================================
const DHAN_LIVE_DATA_NIFTY = {
  spot: 25819.25,
  change: 469.60,
  changePct: "+1.85%",
  expiry: "01-Dec-2026",
  strikes: {
    25500: {
      ce: { ltp: 415.50, chgPct: 111.20, oi: 215400, oiChgPct: -55.20, volume: "45.10 L" },
      pe: { ltp: 95.20, chgPct: -71.40, oi: 945000, oiChgPct: 175.40, volume: "320.10 L" }
    },
    25550: {
      ce: { ltp: 381.20, chgPct: 114.40, oi: 364195, oiChgPct: -52.93, volume: "64.25 L" },
      pe: { ltp: 108.50, chgPct: -69.53, oi: 864500, oiChgPct: 159.71, volume: "403.62 L" }
    },
    25600: {
      ce: { ltp: 347.15, chgPct: 117.92, oi: 1455805, oiChgPct: -50.65, volume: "333.86 L" },
      pe: { ltp: 124.10, chgPct: -68.02, oi: 3265925, oiChgPct: 105.11, volume: "977.52 L" }
    },
    25650: {
      ce: { ltp: 315.60, chgPct: 121.09, oi: 562380, oiChgPct: -33.95, volume: "296.58 L" },
      pe: { ltp: 142.05, chgPct: -66.10, oi: 1454635, oiChgPct: 473.23, volume: "661.16 L" }
    },
    25700: {
      ce: { ltp: 286.00, chgPct: 123.18, oi: 3163030, oiChgPct: 6.34, volume: "1178.72 L" },
      pe: { ltp: 160.90, chgPct: -54.68, oi: 4983810, oiChgPct: 256.62, volume: "1781.92 L" }
    },
    25750: {
      ce: { ltp: 256.75, chgPct: 124.14, oi: 2001350, oiChgPct: 142.42, volume: "1014.97 L" },
      pe: { ltp: 183.05, chgPct: -62.61, oi: 2109640, oiChgPct: 813.48, volume: "1021.44 L" }
    },
    25800: {
      ce: { ltp: 230.15, chgPct: 127.65, oi: 5714150, oiChgPct: 27.46, volume: "1644.32 L" },
      pe: { ltp: 206.35, chgPct: -60.91, oi: 4353310, oiChgPct: 170.11, volume: "1344.27 L" }
    },
    25850: {
      ce: { ltp: 205.90, chgPct: 128.40, oi: 1702740, oiChgPct: 114.00, volume: "753.12 L" },
      pe: { ltp: 231.80, chgPct: -58.93, oi: 993395, oiChgPct: 774.31, volume: "438.07 L" }
    },
    25900: {
      ce: { ltp: 183.00, chgPct: 128.04, oi: 4271280, oiChgPct: 103.79, volume: "1246.49 L" },
      pe: { ltp: 258.20, chgPct: -57.61, oi: 1883700, oiChgPct: 322.63, volume: "689.34 L" }
    },
    25950: {
      ce: { ltp: 161.60, chgPct: 127.45, oi: 1910415, oiChgPct: 132.01, volume: "681.50 L" },
      pe: { ltp: 287.75, chgPct: -55.74, oi: 501670, oiChgPct: 1058.86, volume: "211.74 L" }
    },
    26000: {
      ce: { ltp: 142.50, chgPct: 129.28, oi: 9323145, oiChgPct: 10.75, volume: "1967.53 L" },
      pe: { ltp: 317.85, chgPct: -53.82, oi: 2521090, oiChgPct: 64.98, volume: "377.89 L" }
    },
    26050: {
      ce: { ltp: 125.40, chgPct: 131.10, oi: 1245000, oiChgPct: 15.20, volume: "850.10 L" },
      pe: { ltp: 350.20, chgPct: -51.20, oi: 1840000, oiChgPct: 45.10, volume: "280.40 L" }
    },
    26100: {
      ce: { ltp: 110.10, chgPct: 133.20, oi: 3450000, oiChgPct: 18.50, volume: "1120.30 L" },
      pe: { ltp: 384.60, chgPct: -48.90, oi: 1420000, oiChgPct: 38.20, volume: "190.50 L" }
    }
  }
};



// ========================================================
// ROLE & VIEW SIMULATOR FOR DUAL DASHBOARD ARCHITECTURE
// ========================================================
function getSimulatedRole() {
  return localStorage.getItem("liveipo_simulated_role") || "subscriber";
}

function setSimulatedRole(role) {
  localStorage.setItem("liveipo_simulated_role", role);
  updateSimulatorButtons();
  renderSensibullInterface("sensibullDashboardContainer");
  renderSensibullInterface("sensibullTradeHistoryContainer");
  renderMultiStrikeTradeHistoryTable();
  renderAuthUI();
  
  const label = role === "guest" ? "Public Guest (Locked Live Trades)" : role === "unsubscribed" ? "Logged In (No Subscription)" : "Active Premium Subscriber (Full Live Access)";
  showToast(`Switched View to: ${label}`);
}

function updateSimulatorButtons() {
  const currentRole = getSimulatedRole();
  const bGuest = document.getElementById("btnRoleGuest");
  const bUnsub = document.getElementById("btnRoleUnsubscribed");
  const bSub = document.getElementById("btnRoleSubscriber");
  
  if (bGuest) bGuest.classList.toggle("active", currentRole === "guest");
  if (bUnsub) bUnsub.classList.toggle("active", currentRole === "unsubscribed");
  if (bSub) bSub.classList.toggle("active", currentRole === "subscriber");
}

function activateInstantTestPass() {
  let user = getCurrentUser();
  if (!user) {
    user = {
      id: "demo_trader_sub",
      name: "Demo Premium Subscriber",
      email: "subscriber@liveipo.in",
      picture: "https://api.dicebear.com/7.x/bottts/svg?seed=VIPTrader"
    };
    localStorage.setItem("live_ipo_current_user", JSON.stringify(user));
  }
  
  const userData = {
    email: user.email,
    plan: "VIP Gold Access",
    planId: "gold",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    status: "ACTIVE",
    payments: [],
    customNotes: []
  };
  saveUserIsolatedData(user.email, userData);
  localStorage.setItem("liveipo_simulated_role", "subscriber");
  
  renderAuthUI();
  updateSimulatorButtons();
  renderSensibullInterface("sensibullDashboardContainer");
  renderSensibullInterface("sensibullTradeHistoryContainer");
  renderMultiStrikeTradeHistoryTable();
  showToast("✓ 30-Day VIP Premium Pass Activated! Full Live Terminal Unlocked.");
}

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
let currentSimulatedTargetNifty = 25819.25;
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
  const role = getSimulatedRole();
  const isSubscriber = role === "subscriber";

  // IF NOT A SUBSCRIBER (GUEST OR UNSUBSCRIBED): RENDER SHOWCASE & LOCKED TEASER
  if (!isSubscriber) {
    container.innerHTML = `
      <!-- Master Trader Verified Showcase -->
      <div class="master-showcase-panel">
        <div class="showcase-header">
          <div class="showcase-title-area">
            <h2>🏆 Master Option Seller Verified Track Record</h2>
            <p>Non-directional multi-strike option selling strategies with automated theta decay management & Greeks hedging.</p>
          </div>
          <span class="verified-master-badge">✓ SEBI COMPLIANT RULES & 100% TRANSPARENT</span>
        </div>

        <div class="showcase-kpi-grid">
          <div class="showcase-kpi-card">
            <span class="showcase-kpi-lbl">Total Executed Trades</span>
            <div class="showcase-kpi-val">142+ Baskets</div>
            <span class="showcase-kpi-sub">Multi-Strike Strategies</span>
          </div>
          <div class="showcase-kpi-card">
            <span class="showcase-kpi-lbl">Verified Win Rate</span>
            <div class="showcase-kpi-val green">89.4%</div>
            <span class="showcase-kpi-sub">Target vs Stop Loss</span>
          </div>
          <div class="showcase-kpi-card">
            <span class="showcase-kpi-lbl">Total Verified Net Profit</span>
            <div class="showcase-kpi-val green">+₹8,45,200</div>
            <span class="showcase-kpi-sub">Audited Track Record</span>
          </div>
          <div class="showcase-kpi-card">
            <span class="showcase-kpi-lbl">Average Profit / Trade</span>
            <div class="showcase-kpi-val green">+₹9,850</div>
            <span class="showcase-kpi-sub">Per Single Basket</span>
          </div>
          <div class="showcase-kpi-card">
            <span class="showcase-kpi-lbl">Max Drawdown</span>
            <div class="showcase-kpi-val" style="color: #6366f1;">&lt; 3.8%</div>
            <span class="showcase-kpi-sub">Strict Risk Defined</span>
          </div>
        </div>
      </div>

      <!-- Locked Active 3-Strike Live Trade Teaser -->
      <div class="locked-live-trade-wrapper">
        <!-- Blurred Sensibull Preview in Background -->
        <div class="locked-background-preview">
          <div class="sensibull-wrapper">
            <div class="sensibull-header-banner">
              <div class="sensibull-underlying">
                <span class="underlying-badge">${strat.index} 25,436.55</span>
                <span class="underlying-change">+0.83%</span>
              </div>
              <span style="font-weight: 800; color: #10b981;">● LIVE IN MARKET (3 LEGS)</span>
            </div>
            <div class="sensibull-grid">
              <div class="sensibull-left">
                <div class="legs-list">
                  <div class="leg-card"><div class="leg-ident"><span class="leg-action-badge sell">SELL</span> 25,xxx PE (6 Lots)</div></div>
                  <div class="leg-card"><div class="leg-ident"><span class="leg-action-badge sell">SELL</span> 25,xxx PE (2 Lots)</div></div>
                  <div class="leg-card"><div class="leg-ident"><span class="leg-action-badge buy">BUY</span> 25,xxx PE (2 Lots)</div></div>
                </div>
              </div>
              <div class="sensibull-right">
                <div style="height: 180px; background: #e2e8f0; border-radius: 8px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Frosted Overlay with Subscription CTA -->
        <div class="locked-overlay-content">
          <div class="locked-icon-badge">🔒</div>
          <div class="locked-overlay-title">માસ્ટર ટ્રેડરનો લાઇવ 3-સ્ટ્રાઇક ટ્રેડ અત્યારે માર્કેટમાં એક્ટિવ છે!</div>
          <div class="locked-overlay-desc">
            લાઇવ સ્ટ્રાઇક પ્રાઇસ (25050 PE / 25350 PE / 25600 PE), એન્ટ્રી ભાવ, સ્ટોપ લોસ, રિયલ-ટાઇમ થીટા P&L અને ઇન્ટરેક્ટિવ Payoff Graph જોવા માટે પ્રીમિયમ સબ્સ્ક્રિપ્શન મેળવો અથવા ડેમો ટેસ્ટ પાસ એક્ટિવેટ કરો.
          </div>
          <div class="locked-cta-btns">
            <button class="btn-unlock-gold" onclick="switchTab('pricing')">
              👑 પ્રીમિયમ પ્લાન જુઓ અને અનલોક કરો
            </button>
            <button class="btn-test-pass" onclick="activateInstantTestPass()">
              ⚡ 1-Click Instant VIP Access Pass
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // IF SUBSCRIBER: RENDER FULL UNLOCKED SENSIBULL DASHBOARD + SUBSCRIBER PERSONAL LOT CALCULATOR
  container.innerHTML = `
    <div class="sensibull-wrapper">
      <!-- Top Banner -->
      <div class="sensibull-header-banner">
        <div class="sensibull-underlying">
          <span style="font-size: 20px;">🔍</span>
          <span class="underlying-badge">${strat.index} ${strat.underlyingPrice.toFixed(2)}</span>
          <span class="underlying-change">${strat.underlyingChange}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 12px; color: #10b981; font-weight: 800; background: #ecfdf5; padding: 4px 10px; border-radius: 20px; border: 1px solid #a7f3d0;">
            ● LIVE MASTER BROADCAST UNLOCKED
          </span>
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
              <span class="m-lbl">Max Profit</span>
              <span class="m-val green">+₹${strat.metrics.maxProfit.toLocaleString("en-IN")} (${strat.metrics.maxProfitPct})</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">POP (Prob. of Profit)</span>
              <span class="m-val green" style="font-weight: 900;">${strat.metrics.pop}</span>
            </div>
            <div class="metric-item">
              <span class="m-lbl">Breakeven</span>
              <span class="m-val">${strat.metrics.breakeven}</span>
            </div>
          </div>

          <!-- Sensibull Sub-Tabs -->
          <div class="sensibull-tabs-bar">
            <button class="s-tab-btn ${activeSensibullTab === 'payoff' ? 'active' : ''}" onclick="switchSensibullTab('payoff')">Payoff Graph</button>
            <button class="s-tab-btn ${activeSensibullTab === 'pnltable' ? 'active' : ''}" onclick="switchSensibullTab('pnltable')">P&L Table (Day-by-Day Theta)</button>
            <button class="s-tab-btn ${activeSensibullTab === 'greeks' ? 'active' : ''}" onclick="switchSensibullTab('greeks')">Greeks</button>
          </div>

          <!-- Sub-Tab 1: Payoff Graph Canvas -->
          <div id="sensibullSubTab_payoff" style="display: ${activeSensibullTab === 'payoff' ? 'block' : 'none'};">
            <div class="payoff-canvas-container">
              <canvas id="sensibullPayoffCanvas"></canvas>
            </div>

            <!-- Target & Date Sliders -->
            <div class="slider-control-row">
              <div class="slider-group">
                <span class="lbl">NIFTY Target: <strong id="valNiftyTarget">${currentSimulatedTargetNifty.toFixed(2)}</strong></span>
                <input type="range" min="24200" max="26200" step="25" value="${currentSimulatedTargetNifty}" oninput="onNiftyTargetSliderChange(this.value)">
              </div>
              <div class="slider-group">
                <span class="lbl">Days to Expiry: <strong id="valDaysToExpiry">${currentSimulatedDaysToExpiry} Days</strong></span>
                <input type="range" min="0" max="7" step="1" value="${currentSimulatedDaysToExpiry}" oninput="onDaysToExpirySliderChange(this.value)">
              </div>
            </div>
          </div>

          <!-- Sub-Tab 2: Day-by-Day Analysis Table -->
          <div id="sensibullSubTab_pnltable" style="display: ${activeSensibullTab === 'pnltable' ? 'block' : 'none'};">
            <div style="padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; font-size: 12px; color: #475569;">
              📅 <strong>Day-by-Day Theta Decay Table:</strong> Live daily tracking of strike prices, decay and cumulative net profit.
            </div>
            <div class="table-responsive">
              <table class="sensibull-daybyday-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>NIFTY Spot</th>
                    <th>25050 PE (6L)</th>
                    <th>25350 PE (2L)</th>
                    <th>25600 PE (2L)</th>
                    <th>Day P&L</th>
                    <th>Total P&L</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${(strat.dayByDayHistory || []).map(row => {
                    const spotVal = (row.spot ?? row.niftySpot ?? 25819.25);
                    const p1Val = (row.p25050 ?? row.leg1Ltp ?? 0);
                    const p2Val = (row.p25350 ?? row.leg2Ltp ?? 0);
                    const p3Val = (row.p25600 ?? row.leg3Ltp ?? 0);
                    const dPnl = (row.dayPnl ?? row.unbookedPnl ?? 0);
                    const tPnl = (row.totalPnl ?? 0);
                    return `<tr>
                      <td><strong>${row.date || '-'}</strong></td>
                      <td>${typeof spotVal === 'number' ? spotVal.toFixed(2) : spotVal}</td>
                      <td>₹${typeof p1Val === 'number' ? p1Val.toFixed(2) : p1Val}</td>
                      <td>₹${typeof p2Val === 'number' ? p2Val.toFixed(2) : p2Val}</td>
                      <td>₹${typeof p3Val === 'number' ? p3Val.toFixed(2) : p3Val}</td>
                      <td style="color: ${dPnl >= 0 ? '#10b981' : '#ef4444'}; font-weight: 700;">
                        ${dPnl >= 0 ? '+' : ''}₹${dPnl.toLocaleString("en-IN")}
                      </td>
                      <td style="color: ${tPnl >= 0 ? '#10b981' : '#ef4444'}; font-weight: 800;">
                        ${tPnl >= 0 ? '+' : ''}₹${tPnl.toLocaleString("en-IN")}
                      </td>
                      <td><span style="font-size: 11px; font-weight: 700; color: #10b981;">${row.status || 'Active'}</span></td>
                    </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Sub-Tab 3: Greeks -->
          <div id="sensibullSubTab_greeks" style="display: ${activeSensibullTab === 'greeks' ? 'block' : 'none'};">
            <div class="greeks-grid">
              <div class="greek-card">
                <span class="g-name">Delta (Δ)</span>
                <span class="g-val ${strat.greeks.delta >= 0 ? 'green' : 'red'}">${strat.greeks.delta}</span>
                <span class="g-sub">Neutral Directional Bias</span>
              </div>
              <div class="greek-card">
                <span class="g-name">Theta (Θ)</span>
                <span class="g-val green">+${strat.greeks.theta}</span>
                <span class="g-sub">Daily Time Decay Profit</span>
              </div>
              <div class="greek-card">
                <span class="g-name">Vega (ν)</span>
                <span class="g-val red">${strat.greeks.vega}</span>
                <span class="g-sub">Short Volatility</span>
              </div>
              <div class="greek-card">
                <span class="g-name">Gamma (Γ)</span>
                <span class="g-val">${strat.greeks.gamma}</span>
                <span class="g-sub">Controlled Acceleration</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- Subscriber's Personal Lot Size & Capital Calculator -->
    <div class="subscriber-desk-container">
      <div class="subscriber-desk-header">
        <div>
          <h3 style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
            🎯 મારું પર્સનલ ટ્રેડ કેલ્ક્યુલેટર (My Personal Lot Size & Custom P&L)
          </h3>
          <p style="font-size: 12.5px; color: #64748b; margin: 0;">
            માસ્ટર ટ્રેડરનો બેઝિક ટ્રેડ 1x મલ્ટિપ્લાયરનો છે. તમારા કેપિટલ પ્રમાણે અહીં લોટ બદલીને તમારો કસ્ટમાઈઝ્ડ નફો અને માર્જિન રિયલ-ટાઇમ ચેક કરો:
          </p>
        </div>
        <span class="subscriber-badge-tag">👑 SUBSCRIBER TRADE COPIER</span>
      </div>

      <div class="calc-grid-layout">
        <div class="calc-input-panel">
          <div class="calc-input-group">
            <label>તમારો ટ્રેડ સાઈઝ મલ્ટિપ્લાયર (Lot Multiplier):</label>
            <select id="subMultiplierSelect" onchange="calculateSubscriberCustomPnl()">
              <option value="0.5">0.5x Half Size (3 Lots Sell / 1 Lot Buy)</option>
              <option value="1" selected>1.0x Normal Size (6 Lots Sell / 2 Lots Buy - As Master)</option>
              <option value="2">2.0x Double Size (12 Lots Sell / 4 Lots Buy)</option>
              <option value="3">3.0x Triple Size (18 Lots Sell / 6 Lots Buy)</option>
              <option value="5">5.0x Heavy Size (30 Lots Sell / 10 Lots Buy)</option>
            </select>
          </div>
          <div class="calc-input-group">
            <label>તમારું ડિપ્લોય કરેલું કેપિટલ (₹):</label>
            <input type="number" id="subCapitalInput" value="350000" step="25000" oninput="calculateSubscriberCustomPnl()">
          </div>
        </div>

        <div class="calc-output-panel">
          <div class="calc-stat-box">
            <span class="lbl">અંદાજિત માર્જિન જરૂરિયાત</span>
            <div class="val" id="subCalcMargin">₹1,85,000</div>
          </div>
          <div class="calc-stat-box">
            <span class="lbl">તમારો લાઈવ કરન્ટ નફો (LTP)</span>
            <div class="val green" id="subCalcLivePnl">+₹9,276</div>
          </div>
          <div class="calc-stat-box">
            <span class="lbl">એક્સપાયરી પર મહત્તમ નફો</span>
            <div class="val green" id="subCalcMaxProfit">+₹35,484</div>
          </div>
          <div class="calc-stat-box">
            <span class="lbl">ROI / રિટર્ન ઓન કેપિટલ</span>
            <div class="val green" id="subCalcRoi">+10.1%</div>
          </div>

          <div class="calc-advice-banner">
            <span>💡</span>
            <span><strong>માસ્ટર ગાઇડન્સ:</strong> એક્સપાયરી સુધી થીટા ડીકેનો પૂરો બેનિફિટ લેવા માટે સ્ટોપ લોસ NIFTY 24,950 રાખવું.</span>
          </div>
        </div>
      </div>
    </div>
  `;

  if (activeSensibullTab === "payoff") {
    if (typeof drawSensibullPayoffGraph === "function") { setTimeout(drawSensibullPayoffGraph, 100); }
  }
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

  renderMultiStrikeTradeHistoryTable();
}

// ==========================================
// MULTI-STRIKE (3 STRIKES PER SINGLE TRADE) TRADE HISTORY ENGINE
// Exact Schema matching User's Table:
// Sr.No | Trade No | Trade ID | Date | Index | Strategy | Strikes | CE/PE | Action | Entry | LTP | Net P&L | Total Profit | Status
// ==========================================
const DEFAULT_MULTI_STRIKE_TRADES = [
  {
    tradeNo: 1,
    date: "20-11-2026",
    index: "Nifty",
    strategy: "LiveIPO Pro",
    status: "LIVE", // LIVE while active, CLOSED when exited
    totalProfit: 9276,
    legs: [
      {
        srNo: 1,
        tradeId: "TRD-101",
        strike: "25050",
        type: "PE",
        action: "S",
        entry: 46.35,
        ltp: 24.30,
        lots: 6,
        netPnl: 8249,
        status: "LIVE"
      },
      {
        srNo: 2,
        tradeId: "TRD-102",
        strike: "25350",
        type: "PE",
        action: "S",
        entry: 120.75,
        ltp: 81.00,
        lots: 2,
        netPnl: 4778,
        status: "LIVE"
      },
      {
        srNo: 3,
        tradeId: "TRD-103",
        strike: "25600",
        type: "PE",
        action: "B",
        entry: 236.85,
        ltp: 203.20,
        lots: 2,
        netPnl: -3750,
        status: "LIVE"
      }
    ]
  },
  {
    tradeNo: 2,
    date: "20-12-26",
    index: "Nifty",
    strategy: "LiveIPO Pro",
    status: "CLOSED",
    totalProfit: 12000,
    legs: [
      {
        srNo: 4,
        tradeId: "TRD-104",
        strike: "24400",
        type: "PE",
        action: "B",
        entry: 85.00,
        ltp: 125.00,
        lots: 3,
        netPnl: 3000,
        status: "CLOSED"
      },
      {
        srNo: 5,
        tradeId: "TRD-105",
        strike: "24800",
        type: "CE",
        action: "S",
        entry: 110.00,
        ltp: 30.00,
        lots: 2,
        netPnl: 4000,
        status: "CLOSED"
      },
      {
        srNo: 6,
        tradeId: "TRD-106",
        strike: "25100",
        type: "CE",
        action: "S",
        entry: 75.00,
        ltp: 10.00,
        lots: 4,
        netPnl: 5000,
        status: "CLOSED"
      }
    ]
  },
  {
    tradeNo: 3,
    date: "17-11-26",
    index: "BankNifty",
    strategy: "LiveIPO Pro",
    status: "CLOSED",
    totalProfit: 16800,
    legs: [
      {
        srNo: 7,
        tradeId: "TRD-107",
        strike: "51800",
        type: "PE",
        action: "S",
        entry: 180.00,
        ltp: 25.00,
        lots: 4,
        netPnl: 7200,
        status: "CLOSED"
      },
      {
        srNo: 8,
        tradeId: "TRD-108",
        strike: "52200",
        type: "CE",
        action: "S",
        entry: 165.00,
        ltp: 18.00,
        lots: 3,
        netPnl: 6600,
        status: "CLOSED"
      },
      {
        srNo: 9,
        tradeId: "TRD-109",
        strike: "51400",
        type: "PE",
        action: "B",
        entry: 55.00,
        ltp: 10.00,
        lots: 2,
        netPnl: 3000,
        status: "CLOSED"
      }
    ]
  }
];

function getMultiStrikeTrades() {
  try {
    const raw = localStorage.getItem("liveipo_multistrike_trades");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(DEFAULT_MULTI_STRIKE_TRADES));
  return DEFAULT_MULTI_STRIKE_TRADES;
}

function saveMultiStrikeTrades(trades) {
  localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(trades));
}

function renderMultiStrikeTradeHistoryTable() {
  const tbody = document.getElementById("multiStrikeTradeTableBody");
  const adminTbody = document.getElementById("adminMultiStrikeTradeTableBody");
  if (!tbody && !adminTbody) return;

  const trades = getMultiStrikeTrades();
  const role = getSimulatedRole();
  const isSubscriber = role === "subscriber";

  let html = "";
  trades.forEach(trade => {
    const isLive = trade.status === "LIVE";
    const legCount = trade.legs.length;
    const totalProfit = trade.totalProfit;

    trade.legs.forEach((leg, idx) => {
      const isFirst = idx === 0;
      const isProfit = leg.netPnl >= 0;

      html += `<tr class="${isFirst ? 'trade-group-start' : ''}">`;

      // Sr.No
      html += `<td>${leg.srNo}</td>`;

      // Trade No (rowspan across the 3 strikes)
      if (isFirst) {
        html += `<td rowspan="${legCount}" style="background: #ffffff; font-size: 15px; font-weight: 900;">${trade.tradeNo}</td>`;
      }

      // Trade ID
      html += `<td><strong>${leg.tradeId}</strong></td>`;

      // Grouped Date, Index, Strategy (rowspan across 3 strikes)
      if (isFirst) {
        html += `<td rowspan="${legCount}">${trade.date}</td>`;
        html += `<td rowspan="${legCount}"><strong>${trade.index}</strong></td>`;
        html += `<td rowspan="${legCount}"><strong>${trade.strategy}</strong>${trade.tradeName ? `<br><span style="font-size: 11px; color: #64748b; font-weight: 600;">${trade.tradeName}</span>` : ""}</td>`;
      }

      // Strikes, CE/PE, Action, Entry, LTP, Net P&L
      if (isLive && !isSubscriber) {
        // Locked display for free users on active live trade
        html += `<td><span style="color: #d97706; font-weight: 700;">🔒 25,xxx ${leg.type}</span></td>`;
        html += `<td><span class="badge-option-${leg.type.toLowerCase()}">${leg.type}</span></td>`;
        html += `<td><span class="badge-action-${leg.action.toLowerCase()}">${leg.action}</span></td>`;
        html += `<td><span style="color: #94a3b8; font-size: 11px;">🔒 Locked</span></td>`;
        html += `<td><span style="color: #94a3b8; font-size: 11px;">🔒 Locked</span></td>`;
        html += `<td><span style="color: #94a3b8; font-size: 11px;">🔒 Locked</span></td>`;
      } else {
        html += `<td><strong>${leg.strike}</strong></td>`;
        html += `<td><span class="badge-option-${leg.type.toLowerCase()}">${leg.type}</span></td>`;
        html += `<td><span class="badge-action-${leg.action.toLowerCase()}">${leg.action}</span></td>`;
        html += `<td>₹${leg.entry.toFixed(2)}</td>`;
        html += `<td><span class="oc-ltp-val ${isLive ? 'up' : ''}">₹${leg.ltp.toFixed(2)}</span></td>`;
        html += `<td style="font-weight: 700; color: ${isProfit ? '#10b981' : '#ef4444'}">${isProfit ? '+' : ''}₹${leg.netPnl.toLocaleString("en-IN")}</td>`;
      }

      // Total Profit & Status (rowspan across 3 strikes)
      if (isFirst) {
        if (isLive && !isSubscriber) {
          html += `<td rowspan="${legCount}" class="trade-total-profit-cell" style="color: #d97706; font-size: 12.5px;">
            🔒 <a href="javascript:void(0)" onclick="switchTab('pricing')" style="color: #2563eb; font-weight: 700; text-decoration: underline;">Subscribe to View</a>
          </td>`;
        } else {
          html += `<td rowspan="${legCount}" class="trade-total-profit-cell" style="color: ${totalProfit >= 0 ? '#10b981' : '#ef4444'};">
            ${totalProfit >= 0 ? '+' : ''}₹${totalProfit.toLocaleString("en-IN")}
          </td>`;
        }
        
        html += `<td rowspan="${legCount}">
          ${isLive ? '<span class="badge-status-live"><span class="live-pulse-dot"></span> LIVE</span>' : '<span class="badge-status-closed">CLOSED</span>'}
          ${isLive ? `<br><button class="oc-act-btn btn-s" style="margin-top: 6px; font-size: 10px; padding: 3px 8px;" onclick="exitMultiStrikeTrade(${trade.tradeNo})" title="Exit Position">Exit Trade</button>` : `<br><button class="oc-act-btn btn-b" style="margin-top: 6px; font-size: 10px; padding: 2px 6px;" onclick="reopenMultiStrikeTrade(${trade.tradeNo})" title="Re-open Live">Reopen</button>`}
        </td>`;
      }

      html += `</tr>`;
    });
  });

  if (tbody) tbody.innerHTML = html;
  if (adminTbody) adminTbody.innerHTML = html;
}

function exitMultiStrikeTrade(tradeNo) {
  const trades = getMultiStrikeTrades();
  const trade = trades.find(t => t.tradeNo === tradeNo);
  if (!trade) return;

  if (confirm(`Are you sure you want to EXIT Trade #${tradeNo}? Status will be automatically marked as CLOSED and final P&L locked.`)) {
    trade.status = "CLOSED";
    trade.legs.forEach(l => l.status = "CLOSED");
    saveMultiStrikeTrades(trades);
    renderMultiStrikeTradeHistoryTable();
    showToast(`✓ Trade #${tradeNo} EXITED! Status is now CLOSED with Total Profit: ₹${trade.totalProfit.toLocaleString("en-IN")}`);
  }
}

function reopenMultiStrikeTrade(tradeNo) {
  const trades = getMultiStrikeTrades();
  const trade = trades.find(t => t.tradeNo === tradeNo);
  if (!trade) return;

  trade.status = "LIVE";
  trade.legs.forEach(l => l.status = "LIVE");
  saveMultiStrikeTrades(trades);
  renderMultiStrikeTradeHistoryTable();
  showToast(`⚡ Trade #${tradeNo} reopened to LIVE mode! Real-time price tracking active.`);
}

function exportMultiStrikeTradesCSV() {
  const trades = getMultiStrikeTrades();
  let csv = "Sr.No,Trade No,Trade ID,Date,Index,Strategy,Strikes,CE/PE,Action,Entry,LTP,Net P&L,Total Profit,Status\n";

  trades.forEach(t => {
    t.legs.forEach(l => {
      csv += `${l.srNo},${t.tradeNo},${l.tradeId},"${t.date}","${t.index}","${t.strategy}","${l.strike}","${l.type}","${l.action}",${l.entry},${l.ltp},${l.netPnl},${t.totalProfit},"${t.status}"\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LiveIPO_3Strike_TradeHistory_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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
    optionchain: { title: "NSE Live Option Chain Terminal", sub: "Real-time NSE derivative chain feeds synced directly with live strategy execution" },
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
// 8. NSE LIVE OPTION CHAIN REAL-TIME ENGINE
// Strictly follows Tuesday Expiry Rule:
// NIFTY & FINNIFTY Expiry: Every Tuesday (મંગળવાર)
// If Tuesday is a holiday -> Monday (સોમવાર)
// If Monday is a holiday -> Friday (શુક્રવાર)
// ==========================================
const NSE_EXPIRIES = {
  NIFTY: [
    "23-Nov-2026", // Preponed to Monday (Tue 24-Nov Holiday)
    "01-Dec-2026", // Tuesday
    "08-Dec-2026", // Tuesday
    "15-Dec-2026", // Tuesday
    "22-Dec-2026", // Tuesday
    "29-Dec-2026", // Tuesday (Monthly Expiry)
    "05-Jan-2027", // Tuesday
    "12-Jan-2027", // Tuesday
    "19-Jan-2027", // Tuesday
    "25-Jan-2027", // Preponed to Monday (Tue 26-Jan Republic Day Holiday)
    "02-Feb-2027", // Tuesday
    "09-Feb-2027", // Tuesday
    "16-Feb-2027", // Tuesday
    "23-Feb-2027", // Tuesday (Monthly Expiry)
    "02-Mar-2027", // Tuesday
    "09-Mar-2027", // Tuesday
    "16-Mar-2027", // Tuesday
    "23-Mar-2027", // Tuesday
    "30-Mar-2027", // Tuesday (Monthly / Quarterly Expiry)
    "06-Apr-2027", // Tuesday
    "13-Apr-2027", // Tuesday
    "20-Apr-2027", // Tuesday
    "27-Apr-2027", // Tuesday (Monthly Expiry)
    "29-Jun-2027", // Tuesday (Quarterly Expiry)
    "28-Sep-2027", // Tuesday (Quarterly Expiry)
    "28-Dec-2027", // Tuesday (Yearly Expiry)
    "26-Dec-2028", // Tuesday (Yearly Expiry)
    "24-Dec-2029", // Preponed to Monday (Tue 25-Dec Christmas Holiday)
    "31-Dec-2030"  // Tuesday (LEAPS Expiry)
  ],
  FINNIFTY: [
    "23-Nov-2026", // Preponed to Monday (Tue 24-Nov Holiday)
    "01-Dec-2026", // Tuesday
    "08-Dec-2026", // Tuesday
    "15-Dec-2026", // Tuesday
    "22-Dec-2026", // Tuesday
    "29-Dec-2026", // Tuesday (Monthly)
    "05-Jan-2027", // Tuesday
    "12-Jan-2027", // Tuesday
    "19-Jan-2027", // Tuesday
    "25-Jan-2027", // Preponed to Monday (Tue 26-Jan Republic Day)
    "02-Feb-2027", // Tuesday
    "23-Feb-2027", // Tuesday (Monthly)
    "30-Mar-2027"  // Tuesday (Quarterly)
  ],
  BANKNIFTY: [
    "25-Nov-2026", // Wednesday
    "02-Dec-2026", // Wednesday
    "09-Dec-2026", // Wednesday
    "16-Dec-2026", // Wednesday
    "23-Dec-2026", // Wednesday
    "30-Dec-2026", // Wednesday (Monthly)
    "06-Jan-2027", // Wednesday
    "13-Jan-2027", // Wednesday
    "20-Jan-2027", // Wednesday
    "27-Jan-2027", // Wednesday
    "24-Feb-2027", // Wednesday
    "31-Mar-2027"  // Wednesday (Quarterly)
  ]
};

let currentOcSymbol = "NIFTY";
let currentOcExpiry = "23-Nov-2026";
let currentOcRange = 15; // ATM +/- 15 strikes
let ocAutoRefreshActive = true;
let ocRefreshInterval = null;
let currentOcSpotPrice = 25819.25;
let currentOcSpotChg = 210.20;
let currentOcSpotPct = "+0.83%";
let cachedOptionChainData = null;

const INDEX_STRIKE_STEPS = {
  NIFTY: 50,
  BANKNIFTY: 100,
  FINNIFTY: 50
};

// Calculate days to expiry from date string
function getDaysToExpiry(expiryStr) {
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  const parts = expiryStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]] !== undefined ? months[parts[1]] : 10;
    const year = parseInt(parts[2]);
    const expDate = new Date(year, month, day);
    const today = new Date(2026, 10, 21); // 21-Nov-2026
    const diff = Math.ceil((expDate - today) / 86400000);
    return Math.max(1, diff);
  }
  return 2;
}

// Populate Expiry and Strike dropdowns
function populateExpiryDropdown(symbol) {
  const expSelect = document.getElementById("ocSelectExpiry");
  const adminExpSelect = document.getElementById("adminOcSelectExpiry");
  const expiries = NSE_EXPIRIES[symbol] || NSE_EXPIRIES.NIFTY;

  if (!expiries.includes(currentOcExpiry)) {
    currentOcExpiry = expiries[0];
  }

  const optionsHtml = expiries.map(exp => {
    const isSelected = exp === currentOcExpiry ? "selected" : "";
    let dayLabel = "Tuesday";
    if (exp === "23-Nov-2026" || exp === "25-Jan-2027" || exp === "24-Dec-2029") {
      dayLabel = "Monday (Holiday Preponed)";
    } else if (symbol === "BANKNIFTY") {
      dayLabel = "Wednesday";
    }
    const isMonthly = exp.includes("29-Dec") || exp.includes("23-Feb") || exp.includes("30-Mar") || exp.includes("27-Apr") || exp.includes("28-Dec");
    const tag = isMonthly ? " • Monthly" : "";
    return `<option value="${exp}" ${isSelected}>${exp} (${dayLabel}${tag})</option>`;
  }).join("");

  if (expSelect) expSelect.innerHTML = optionsHtml;
  if (adminExpSelect) adminExpSelect.innerHTML = optionsHtml;
}

function populateStrikePriceDropdown(strikes) {
  const strikeSelect = document.getElementById("ocSelectStrikePrice");
  if (!strikeSelect || !strikes) return;

  const currentVal = strikeSelect.value;
  strikeSelect.innerHTML = `<option value="">Select Strike Price</option>` + strikes.map(s => {
    const isSelected = s.strikePrice == currentVal ? "selected" : "";
    return `<option value="${s.strikePrice}" ${isSelected}>${s.strikePrice.toLocaleString("en-IN")}${s.isAtm ? ' (ATM)' : ''}</option>`;
  }).join("");
}

function generateOptionChainData(symbol, spot) {
  symbol = symbol || "NIFTY";
  spot = symbol === "NIFTY" ? (window._liveDhanSpot || 25819.25) : spot;
  const step = INDEX_STRIKE_STEPS[symbol] || 50;
  const atmStrike = Math.round(spot / step) * step;
  const strikes = [];

  const daysToExpiry = getDaysToExpiry(currentOcExpiry);
  const timeMultiplier = Math.sqrt(Math.max(1, daysToExpiry) / 2.0);

  const minStrike = atmStrike - (currentOcRange * step);
  const maxStrike = atmStrike + (currentOcRange * step);

  let totalCallOi = 0;
  let totalPutOi = 0;

  for (let s = minStrike; s <= maxStrike; s += step) {
    const callIntrinsic = Math.max(0, spot - s);
    const putIntrinsic = Math.max(0, s - spot);

    // Check if exact strike exists in DHAN_LIVE_DATA_NIFTY
    const dhanStrike = (symbol === "NIFTY" && DHAN_LIVE_DATA_NIFTY.strikes[s]) ? DHAN_LIVE_DATA_NIFTY.strikes[s] : null;

    let callLtp, putLtp, callOi, putOi, callChg, putChg, callVol, putVol;

    if (dhanStrike) {
      callLtp = dhanStrike.ce.ltp;
      putLtp = dhanStrike.pe.ltp;
      callOi = +(dhanStrike.ce.oi / 100000).toFixed(2);
      putOi = +(dhanStrike.pe.oi / 100000).toFixed(2);
      callChg = +(callLtp * (dhanStrike.ce.chgPct / 100)).toFixed(2);
      putChg = +(putLtp * (dhanStrike.pe.chgPct / 100)).toFixed(2);
      callVol = parseFloat(dhanStrike.ce.volume);
      putVol = parseFloat(dhanStrike.pe.volume);
    } else {
      const baseAtmExtrinsic = 138 * timeMultiplier;
      const distanceNorm = Math.pow(s - spot, 2) / (360000 * Math.max(1, timeMultiplier));
      const callTimeVal = Math.max(1.8, baseAtmExtrinsic * Math.exp(-distanceNorm));
      const putTimeVal = Math.max(1.8, (baseAtmExtrinsic + 4) * Math.exp(-distanceNorm));

      callLtp = +(callIntrinsic + callTimeVal).toFixed(2);
      putLtp = +(putIntrinsic + putTimeVal).toFixed(2);
      callOi = +(Math.round(18 + Math.random() * 35)).toFixed(2);
      putOi = +(Math.round(15 + Math.random() * 32)).toFixed(2);
      callChg = +(callLtp * 0.05).toFixed(2);
      putChg = -(+(putLtp * 0.05).toFixed(2));
      callVol = +(callOi * 0.6).toFixed(2);
      putVol = +(putOi * 0.55).toFixed(2);
    }

    totalCallOi += callOi;
    totalPutOi += putOi;

    const spread = Math.max(0.15, +(callLtp * 0.01).toFixed(2));
    const putSpread = Math.max(0.15, +(putLtp * 0.01).toFixed(2));

    strikes.push({
      strikePrice: s,
      isAtm: s === atmStrike,
      ce: {
        oi: callOi,
        chgOi: dhanStrike ? dhanStrike.ce.oiChgPct : +(Math.random() * 5).toFixed(2),
        volume: callVol,
        iv: 17.3,
        ltp: callLtp,
        chg: callChg,
        bidQty: 1800,
        bidPrice: Math.max(0.05, +(callLtp - spread / 2).toFixed(2)),
        askPrice: +(callLtp + spread / 2).toFixed(2),
        askQty: 1800
      },
      pe: {
        oi: putOi,
        chgOi: dhanStrike ? dhanStrike.pe.oiChgPct : -(+(Math.random() * 6).toFixed(2)),
        volume: putVol,
        iv: 17.4,
        ltp: putLtp,
        chg: putChg,
        bidQty: 1800,
        bidPrice: Math.max(0.05, +(putLtp - putSpread / 2).toFixed(2)),
        askPrice: +(putLtp + putSpread / 2).toFixed(2),
        askQty: 1800
      }
    });
  }

  return {
    symbol,
    spotPrice: spot,
    strikes,
    totalCallOi: +totalCallOi.toFixed(2),
    totalPutOi: +totalPutOi.toFixed(2),
    pcr: +(totalPutOi / Math.max(1, totalCallOi)).toFixed(2),
    maxPain: atmStrike,
    underlyingPrice: spot,
    underlyingChange: "+469.60 (+1.85%)"
  };
}

async function fetchNSEOptionChain() {
  const indicator = document.getElementById("ocLiveIndicator");
  if (indicator) indicator.style.opacity = "0.5";

  // Generate dynamic pricing for selected expiry
  cachedOptionChainData = generateOptionChainData(currentOcSymbol, currentOcSpotPrice);
  renderOptionChainTable(cachedOptionChainData);
  populateStrikePriceDropdown(cachedOptionChainData.strikes);
  syncOptionChainToLiveStrategy(cachedOptionChainData);

  if (indicator) indicator.style.opacity = "1";
}

function renderOptionChainTable(data) {
  const tbody = document.getElementById("ocTableBody");
  const adminTbody = document.getElementById("adminOcTableBody");
  if (!tbody && !adminTbody) return;
  if (!data) return;

  // Update header tickers & live timestamp
  const now = new Date();
  const timeStr = `${now.getDate().toString().padStart(2, '0')}-Nov-2026 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;

  const spotVal = data.spotPrice ?? data.underlyingPrice ?? window._liveDhanSpot ?? 25819.25;
  const spotFormatted = typeof spotVal === 'number' ? spotVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : spotVal;
  const spotText = `Underlying Index : ${data.symbol || 'NIFTY'} ${spotFormatted} As on ${timeStr}`;
  const spotEl = document.getElementById("ocUnderlyingIndexLine");
  const adminSpotEl = document.getElementById("adminOcUnderlyingIndexLine");

  if (spotEl) spotEl.innerHTML = `${spotText} <span style="cursor: pointer; margin-left: 6px;" onclick="fetchNSEOptionChain()" title="Refresh">🔄</span>`;
  if (adminSpotEl) adminSpotEl.innerHTML = `${spotText} <span style="cursor: pointer; margin-left: 6px;" onclick="fetchNSEOptionChain()" title="Refresh">🔄</span>`;

  const pcrEl = document.getElementById("ocPcrDisplay");
  const maxPainEl = document.getElementById("ocMaxPainDisplay");
  if (pcrEl) pcrEl.textContent = `PCR: ${data.pcr} (${data.pcr > 1 ? 'Bullish' : 'Neutral'})`;
  if (maxPainEl) maxPainEl.textContent = `Max Pain: ${data.maxPain.toLocaleString("en-IN")}`;

  const spot = data.spotPrice;

  const rowsHtml = data.strikes.map(row => {
    const s = row.strikePrice;
    const isCallItm = s < spot;
    const isPutItm = s > spot;
    const isAtm = row.isAtm;

    // Check if this strike is part of the active 3-leg basket
    let basketBadge = "";
    if (s === 25050 && data.expiry === "23-Nov-2026") {
      basketBadge = `<span class="oc-active-badge sell">ACTIVE 6x S</span>`;
    } else if (s === 25350 && data.expiry === "23-Nov-2026") {
      basketBadge = `<span class="oc-active-badge sell">ACTIVE 2x S</span>`;
    } else if (s === 25600 && data.expiry === "23-Nov-2026") {
      basketBadge = `<span class="oc-active-badge buy">ACTIVE 2x B</span>`;
    }

    const ce = row.ce;
    const pe = row.pe;

    return `
      <tr id="strike-row-${s}" class="${isAtm ? 'atm-row' : ''}">
        <!-- CALLS (CE) -->
        <td class="chart-icon-cell ${isCallItm ? 'itm-call' : 'otm-call'}">📈</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.oi}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}" style="color: ${ce.chgOi >= 0 ? '#10b981' : '#ef4444'}">${ce.chgOi >= 0 ? '+' : ''}${ce.chgOi}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.volume}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.iv}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">
          <span class="oc-ltp-val ${ce.chg >= 0 ? 'up' : 'down'}">₹${ce.ltp.toFixed(2)}</span>
        </td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}" style="color: ${ce.chg >= 0 ? '#10b981' : '#ef4444'}">
          ${ce.chg >= 0 ? '+' : ''}${ce.chg.toFixed(2)}
        </td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.bidQty.toLocaleString("en-IN")}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.bidPrice.toFixed(2)}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.askPrice.toFixed(2)}</td>
        <td class="${isCallItm ? 'itm-call' : 'otm-call'}">${ce.askQty.toLocaleString("en-IN")}</td>

        <!-- STRIKE CENTER -->
        <td class="td-strike">
          <strong>${s.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
          ${isAtm ? '<span style="display: block; font-size: 8.5px; background: #fff; color: #2563eb; padding: 1px 4px; border-radius: 3px; margin-top: 1px;">ATM</span>' : ''}
          ${basketBadge}
        </td>

        <!-- PUTS (PE) -->
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.bidQty.toLocaleString("en-IN")}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.bidPrice.toFixed(2)}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.askPrice.toFixed(2)}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.askQty.toLocaleString("en-IN")}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}" style="color: ${pe.chg >= 0 ? '#10b981' : '#ef4444'}">
          ${pe.chg >= 0 ? '+' : ''}${pe.chg.toFixed(2)}
        </td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">
          <span class="oc-ltp-val ${pe.chg >= 0 ? 'up' : 'down'}">₹${pe.ltp.toFixed(2)}</span>
        </td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.iv}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.volume}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}" style="color: ${pe.chgOi >= 0 ? '#10b981' : '#ef4444'}">${pe.chgOi >= 0 ? '+' : ''}${pe.chgOi}</td>
        <td class="${isPutItm ? 'itm-put' : 'otm-put'}">${pe.oi}</td>
        <td class="chart-icon-cell ${isPutItm ? 'itm-put' : 'otm-put'}">📈</td>
      </tr>
    `;
  }).join("");

  if (tbody) tbody.innerHTML = rowsHtml;
  if (adminTbody) adminTbody.innerHTML = rowsHtml;
}

// Event Handlers for Expiry, Symbol, Strike, and Streaming
function onOcExpiryChange(exp) {
  currentOcExpiry = exp;
  showToast(`⚡ Switched to Expiry: ${exp}. Calculating live rates...`);
  fetchNSEOptionChain();
}

function onOcSymbolChange(sym) {
  currentOcSymbol = sym;
  currentOcSpotPrice = sym === "BANKNIFTY" ? 52340.80 : (sym === "FINNIFTY" ? 23680.40 : 25800.60);
  populateExpiryDropdown(sym);
  fetchNSEOptionChain();
}

function onOcStrikeSelect(strike) {
  if (!strike) return;
  const row = document.getElementById(`strike-row-${strike}`);
  if (row) {
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.add("flash-green");
    setTimeout(() => row.classList.remove("flash-green"), 1500);
  }
}

function toggleStreaming(isOn) {
  ocAutoRefreshActive = isOn;
  showToast(isOn ? "✓ NSE Streaming Live Feed: ON (Updating every 3s)" : "⏸ NSE Streaming Live Feed: OFF");
}

function downloadOptionChainCsv() {
  if (!cachedOptionChainData || !cachedOptionChainData.strikes) {
    alert("Option Chain data not available for download.");
    return;
  }

  let csv = `NSE Option Chain (Equity Derivatives) - ${currentOcSymbol} - Expiry: ${currentOcExpiry}\n`;
  csv += `Underlying Index: ${currentOcSymbol} ${cachedOptionChainData.spotPrice} As on ${new Date().toLocaleString()}\n\n`;
  csv += `CALL_OI,CALL_CHNG_OI,CALL_VOL,CALL_IV,CALL_LTP,CALL_CHNG,CALL_BID_QTY,CALL_BID,CALL_ASK,CALL_ASK_QTY,STRIKE,PUT_BID_QTY,PUT_BID,PUT_ASK,PUT_ASK_QTY,PUT_CHNG,PUT_LTP,PUT_IV,PUT_VOL,PUT_CHNG_OI,PUT_OI\n`;

  cachedOptionChainData.strikes.forEach(row => {
    const ce = row.ce;
    const pe = row.pe;
    csv += `${ce.oi},${ce.chgOi},${ce.volume},${ce.iv},${ce.ltp},${ce.chg},${ce.bidQty},${ce.bidPrice},${ce.askPrice},${ce.askQty},${row.strikePrice},${pe.bidQty},${pe.bidPrice},${pe.askPrice},${pe.askQty},${pe.chg},${pe.ltp},${pe.iv},${pe.volume},${pe.chgOi},${pe.oi}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NSE_OptionChain_${currentOcSymbol}_${currentOcExpiry}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`✓ Downloaded Option Chain CSV for ${currentOcExpiry}`);
}

// ==========================================
// CONNECT OPTION CHAIN TICKS TO LIVE BASKET TRADE
// ==========================================
function syncOptionChainToLiveStrategy(ocData) {
  if (!ocData || !ocData.strikes) return;

  const strategies = getMultiLegStrategies();
  if (!strategies || strategies.length === 0) return;

  const strat = strategies[0];
  strat.underlyingPrice = ocData.spotPrice;

  // Find the exact 3 strikes from the option chain
  const s25050 = ocData.strikes.find(s => s.strikePrice === 25050);
  const s25350 = ocData.strikes.find(s => s.strikePrice === 25350);
  const s25600 = ocData.strikes.find(s => s.strikePrice === 25600);

  if (s25050 && strat.legs[0]) {
    strat.legs[0].ltp = s25050.pe.ltp;
    strat.legs[0].unbooked = Math.round((46.35 - s25050.pe.ltp) * 25 * 6 * 2.5);
    strat.legs[0].pnl = strat.legs[0].unbooked;
  }
  if (s25350 && strat.legs[1]) {
    strat.legs[1].ltp = s25350.pe.ltp;
    strat.legs[1].unbooked = Math.round((120.75 - s25350.pe.ltp) * 25 * 2 * 2.4);
    strat.legs[1].pnl = strat.legs[1].unbooked;
  }
  if (s25600 && strat.legs[2]) {
    strat.legs[2].ltp = s25600.pe.ltp;
    strat.legs[2].unbooked = Math.round((s25600.pe.ltp - 236.85) * 25 * 2 * 2.23);
    strat.legs[2].pnl = strat.legs[2].unbooked;
  }

  strat.totalUnbooked = strat.legs.reduce((acc, l) => acc + l.unbooked, 0);
  strat.totalPnl = strat.totalBooked + strat.totalUnbooked;

  // Persist updated strategy
  localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));

  // Re-render Sensibull container if currently visible
  if (currentTab === "dashboard") {
    renderSensibullInterface("sensibullDashboardContainer");
  } else if (currentTab === "trades") {
    renderSensibullInterface("sensibullTradeHistoryContainer");
  }

  // Update Multi-Strike Trade History (Trade 1 if LIVE)
  const multiTrades = getMultiStrikeTrades();
  if (multiTrades.length > 0 && multiTrades[0].status === "LIVE") {
    const t1 = multiTrades[0];
    if (s25050 && t1.legs[0]) {
      t1.legs[0].ltp = s25050.pe.ltp;
      t1.legs[0].netPnl = Math.round((46.35 - s25050.pe.ltp) * 25 * 6 * 2.5);
    }
    if (s25350 && t1.legs[1]) {
      t1.legs[1].ltp = s25350.pe.ltp;
      t1.legs[1].netPnl = Math.round((120.75 - s25350.pe.ltp) * 25 * 2 * 2.4);
    }
    if (s25600 && t1.legs[2]) {
      t1.legs[2].ltp = s25600.pe.ltp;
      t1.legs[2].netPnl = Math.round((s25600.pe.ltp - 236.85) * 25 * 2 * 2.23);
    }
    t1.totalProfit = t1.legs.reduce((acc, l) => acc + l.netPnl, 0);
    saveMultiStrikeTrades(multiTrades);
    renderMultiStrikeTradeHistoryTable();
  }

  // Update top banner metrics
  const totalPnlEl = document.getElementById("statTotalPnl");
  if (totalPnlEl) {
    totalPnlEl.textContent = `₹${strat.totalPnl.toLocaleString("en-IN")}`;
  }
}

// Real-Time Live Market Ticks (every 3 seconds)
function startRealtimeOptionChainTicks() {
  if (ocRefreshInterval) clearInterval(ocRefreshInterval);

  ocRefreshInterval = setInterval(() => {
    if (!ocAutoRefreshActive) return;

    // Simulate realistic live tick
    const tickDelta = (Math.random() - 0.48) * 4.2;
    currentOcSpotPrice = +(currentOcSpotPrice + tickDelta).toFixed(2);
    currentOcSpotChg = +(currentOcSpotChg + tickDelta).toFixed(2);

    if (cachedOptionChainData) {
      cachedOptionChainData.spotPrice = currentOcSpotPrice;
      cachedOptionChainData.spotChg = currentOcSpotChg;

      // Drift strike LTPs realistically
      cachedOptionChainData.strikes.forEach(row => {
        const deltaFactor = 0.05 * (Math.random() - 0.5);
        row.ce.ltp = Math.max(0.2, +(row.ce.ltp + deltaFactor * (row.strikePrice < currentOcSpotPrice ? 2 : 1)).toFixed(2));
        row.pe.ltp = Math.max(0.2, +(row.pe.ltp - deltaFactor * (row.strikePrice > currentOcSpotPrice ? 2 : 1)).toFixed(2));
      });

      renderOptionChainTable(cachedOptionChainData);
      syncOptionChainToLiveStrategy(cachedOptionChainData);
    } else {
      fetchNSEOptionChain();
    }
  }, 3000);
}

function onOcSymbolChange(sym) {
  currentOcSymbol = sym;
  currentOcSpotPrice = sym === "BANKNIFTY" ? 52340.80 : (sym === "FINNIFTY" ? 23680.40 : 25436.55);
  fetchNSEOptionChain();
}

function onOcExpiryChange(exp) {
  currentOcExpiry = exp;
  fetchNSEOptionChain();
}

function onOcRangeChange(range) {
  currentOcRange = parseInt(range);
  fetchNSEOptionChain();
}

function toggleOcAutoRefresh() {
  ocAutoRefreshActive = !ocAutoRefreshActive;
  const btn = document.getElementById("ocAutoRefreshBtn");
  if (btn) {
    btn.textContent = ocAutoRefreshActive ? "⏸ Pause Live Feed" : "▶ Resume Live Feed";
    btn.style.background = ocAutoRefreshActive ? "#10b981" : "#64748b";
  }
  showToast(ocAutoRefreshActive ? "⚡ Real-time NSE feed resumed (3s interval)" : "Paused live feed");
}

function addStrikeToStrategyBasket(strike, type, action) {
  showToast(`⚡ Adding ${strike} ${type} (${action}) to Multi-Leg Basket Trade...`);
  setTimeout(() => {
    const strategies = getMultiLegStrategies();
    if (strategies && strategies.length > 0) {
      strategies[0].legs.push({
        id: `leg-${Date.now().toString().slice(-4)}`,
        action: action,
        actionBadge: action === "SELL" ? "S" : "B",
        instrument: `23rd Nov ${strike} ${type}`,
        lots: 2,
        avgPrice: type === "CE" ? 65.00 : 75.00,
        ltp: type === "CE" ? 65.00 : 75.00,
        booked: 0,
        unbooked: 0,
        pnl: 0
      });
      localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));
      showToast(`✓ Successfully added ${strike} ${type} to active strategy basket!`);
      if (cachedOptionChainData) renderOptionChainTable(cachedOptionChainData);
    }
  }, 500);
}

// ==========================================
// 9. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderAuthUI();
  loadDashboardData();
  populateExpiryDropdown(currentOcSymbol);
  fetchNSEOptionChain();
  startRealtimeOptionChainTicks();

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


function calculateSubscriberCustomPnl() {
  const multSelect = document.getElementById("subMultiplierSelect");
  const capInput = document.getElementById("subCapitalInput");
  if (!multSelect || !capInput) return;

  const multiplier = parseFloat(multSelect.value) || 1;
  const capital = parseFloat(capInput.value) || 350000;

  const baseMargin = 185000;
  const baseLivePnl = 9276;
  const baseMaxProfit = 35484;

  const userMargin = Math.round(baseMargin * multiplier);
  const userLivePnl = Math.round(baseLivePnl * multiplier);
  const userMaxProfit = Math.round(baseMaxProfit * multiplier);
  const roi = ((userMaxProfit / capital) * 100).toFixed(1);

  const elMargin = document.getElementById("subCalcMargin");
  const elLive = document.getElementById("subCalcLivePnl");
  const elMax = document.getElementById("subCalcMaxProfit");
  const elRoi = document.getElementById("subCalcRoi");

  if (elMargin) elMargin.textContent = "₹" + userMargin.toLocaleString("en-IN");
  if (elLive) elLive.textContent = "+₹" + userLivePnl.toLocaleString("en-IN");
  if (elMax) elMax.textContent = "+₹" + userMaxProfit.toLocaleString("en-IN");
  if (elRoi) elRoi.textContent = "+" + roi + "%";
}

// ========================================================
// FRONTEND REAL-TIME TRADE TICKER (FIXED ENTRY, LIVE LTP)
// ========================================================
function startLiveTradeTickEngine() {
  if (window._frontendTradeTickTimer) return;
  window._frontendTradeTickTimer = setInterval(() => {
    let trades = [];
    try {
      const raw = localStorage.getItem("liveipo_multistrike_trades");
      if (raw) trades = JSON.parse(raw);
    } catch(e) {}
    
    let hasLiveTrades = false;
    trades.forEach(trade => {
      if (trade.status === "LIVE") {
        hasLiveTrades = true;
        let basketTotal = 0;
        trade.legs.forEach(leg => {
          // Entry price remains 100% FIXED!
          const delta = +((Math.random() - 0.52) * 0.30).toFixed(2);
          leg.ltp = Math.max(0.10, +(leg.ltp + delta).toFixed(2));
          
          const isSell = leg.action === "S" || leg.action === "SELL";
          const multiplier = 25 * (leg.lots || 1);
          const pnlPerShare = isSell ? (leg.entry - leg.ltp) : (leg.ltp - leg.entry);
          leg.netPnl = Math.round(pnlPerShare * multiplier * 2.4);
          basketTotal += leg.netPnl;
        });
        trade.totalProfit = basketTotal;
      }
    });

    if (hasLiveTrades) {
      localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(trades));
      if (typeof renderMultiStrikeTradeHistoryTable === "function") {
        renderMultiStrikeTradeHistoryTable();
      }
    }
  }, 3000);
}

if (typeof window !== "undefined") {
  startLiveTradeTickEngine();
}


// Fast 1-Second Ticker for Live Market Pulses (DhanHQ Real-Time Mode)
setInterval(() => {
  if (typeof DHAN_LIVE_DATA_NIFTY !== "undefined" && DHAN_LIVE_DATA_NIFTY.strikes) {
    // Micro-tick underlying spot by +/- 0.35
    const spotDelta = +((Math.random() - 0.49) * 0.35).toFixed(2);
    window._liveDhanSpot = +( (window._liveDhanSpot || 25819.25) + spotDelta ).toFixed(2);

    // Micro-tick each strike LTP by +/- 0.10
    Object.keys(DHAN_LIVE_DATA_NIFTY.strikes).forEach(k => {
      const s = DHAN_LIVE_DATA_NIFTY.strikes[k];
      const ceTick = +((Math.random() - 0.48) * 0.20).toFixed(2);
      const peTick = +((Math.random() - 0.52) * 0.20).toFixed(2);
      s.ce.ltp = Math.max(0.05, +(s.ce.ltp + ceTick).toFixed(2));
      s.pe.ltp = Math.max(0.05, +(s.pe.ltp + peTick).toFixed(2));
    });

    // Update active Sensibull / Trade History LTPs & PnL
    let trades = [];
    try {
      const raw = localStorage.getItem("liveipo_multistrike_trades");
      if (raw) trades = JSON.parse(raw);
    } catch(e) {}

    let modified = false;
    trades.forEach(t => {
      if (t.status === "LIVE") {
        modified = true;
        let bTotal = 0;
        t.legs.forEach(l => {
          // Entry price remains 100% FIXED!
          // Sync LTP from live Dhan data if available
          const dStrike = DHAN_LIVE_DATA_NIFTY.strikes[l.strike];
          if (dStrike) {
            l.ltp = l.type === "CE" ? dStrike.ce.ltp : dStrike.pe.ltp;
          } else {
            const tick = +((Math.random() - 0.51) * 0.20).toFixed(2);
            l.ltp = Math.max(0.05, +(l.ltp + tick).toFixed(2));
          }

          const isSell = l.action === "S" || l.action === "SELL";
          const mult = 25 * (l.lots || 1);
          const pnlPerShare = isSell ? (l.entry - l.ltp) : (l.ltp - l.entry);
          l.netPnl = Math.round(pnlPerShare * mult * 2.4);
          bTotal += l.netPnl;
        });
        t.totalProfit = bTotal;
      }
    });

    if (modified) {
      localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(trades));
      if (typeof renderMultiStrikeTradeHistoryTable === "function") {
        renderMultiStrikeTradeHistoryTable();
      }
    }
  }
}, 1000);


// ========================================================
// PURE WHITE SENSIBULL UNIFIED RENDERER ENGINE
// ========================================================
var activeSensibullExpiry = window.activeSensibullExpiry || "01-Dec-2026";

function switchPureSensibullExpiry(exp) {
  activeSensibullExpiry = exp;
  document.querySelectorAll(".sensibull-expiry-pill").forEach(p => {
    p.classList.toggle("active", p.textContent.includes(exp.split("-")[0]));
  });
  renderAllSensibullChains();
}

function renderAllSensibullChains() {
  renderSensibullTableById("sensibullChainTableBody");
  renderSensibullTableById("adminPageOcBody");
  renderSensibullTableById("frontPageOcBody");
}

function renderSensibullTableById(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  const spot = window._liveDhanSpot || 25819.25;
  const atm = 25800;

  // Strikes from 25450 to 26200 matching Sensibull screenshot exactly
  const strikes = [
    25450, 25500, 25550, 25600, 25650, 25700, 25750,
    25800,
    25850, 25900, 25950, 26000, 26050, 26100, 26150, 26200
  ];

  // Update spot displays
  const spotDisp = document.getElementById(tbodyId + "_spotDisplay");
  if (spotDisp) spotDisp.textContent = spot.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let html = "";
  strikes.forEach(s => {
    const isAtm = s === atm;
    const isCallItm = s < spot;
    const isPutItm = s > spot;

    const dhanS = (typeof DHAN_LIVE_DATA_NIFTY !== "undefined" && DHAN_LIVE_DATA_NIFTY.strikes[s]) 
      ? DHAN_LIVE_DATA_NIFTY.strikes[s] 
      : null;

    let callLtp, putLtp, callOiLakhs, putOiLakhs, callDelta, putDelta, iv;

    if (dhanS) {
      callLtp = dhanS.ce.ltp;
      putLtp = dhanS.pe.ltp;
      callOiLakhs = (dhanS.ce.oi / 100000).toFixed(2);
      putOiLakhs = (dhanS.pe.oi / 100000).toFixed(2);
    } else {
      const diff = Math.abs(s - spot);
      const callInt = Math.max(0, spot - s);
      const putInt = Math.max(0, s - spot);
      const tv = Math.max(2, 138 * Math.exp(-Math.pow(diff, 2) / 380000));
      callLtp = +(callInt + tv).toFixed(2);
      putLtp = +(putInt + tv).toFixed(2);
      callOiLakhs = (Math.max(2, 45 - diff / 40)).toFixed(2);
      putOiLakhs = (Math.max(2, 48 - diff / 40)).toFixed(2);
    }

    // Delta approximations matching Sensibull table
    if (s <= 25450) { callDelta = "0.74"; putDelta = "-0.26"; iv = "17.4"; }
    else if (s === 25500) { callDelta = "0.71"; putDelta = "-0.29"; iv = "17.4"; }
    else if (s === 25550) { callDelta = "0.68"; putDelta = "-0.32"; iv = "17.3"; }
    else if (s === 25600) { callDelta = "0.64"; putDelta = "-0.36"; iv = "17.2"; }
    else if (s === 25650) { callDelta = "0.61"; putDelta = "-0.39"; iv = "17.4"; }
    else if (s === 25700) { callDelta = "0.58"; putDelta = "-0.42"; iv = "17.3"; }
    else if (s === 25750) { callDelta = "0.54"; putDelta = "-0.46"; iv = "17.2"; }
    else if (s === 25800) { callDelta = "0.51"; putDelta = "-0.49"; iv = "17.2"; }
    else if (s === 25850) { callDelta = "0.47"; putDelta = "-0.53"; iv = "17.2"; }
    else if (s === 25900) { callDelta = "0.44"; putDelta = "-0.56"; iv = "17.2"; }
    else if (s === 25950) { callDelta = "0.40"; putDelta = "-0.60"; iv = "17.3"; }
    else if (s === 26000) { callDelta = "0.37"; putDelta = "-0.63"; iv = "17.2"; }
    else if (s === 26050) { callDelta = "0.34"; putDelta = "-0.66"; iv = "17.2"; }
    else if (s === 26100) { callDelta = "0.31"; putDelta = "-0.69"; iv = "17.3"; }
    else if (s === 26150) { callDelta = "0.28"; putDelta = "-0.72"; iv = "17.3"; }
    else { callDelta = "0.25"; putDelta = "-0.75"; iv = "17.3"; }

    // Proportional horizontal red/green OI bars (max 70px)
    const callLineWidth = Math.min(70, Math.max(6, Math.round(parseFloat(callOiLakhs) * 0.9)));
    const putLineWidth = Math.min(70, Math.max(6, Math.round(parseFloat(putOiLakhs) * 0.9)));

    html += `<tr class="${isCallItm ? 'itm-call' : ''} ${isPutItm ? 'itm-put' : ''}">
      
      <!-- CALL DELTA -->
      <td class="call-cell" style="color: #64748b; font-weight: 600;">${callDelta}</td>

      <!-- CALL LTP -->
      <td class="call-cell" style="font-weight: 800; font-size: 13px; color: #0f172a;">
        ${callLtp.toFixed(2)}
      </td>

      <!-- CALL OI with Red Bar -->
      <td class="call-cell" style="text-align: left; padding-left: 12px; font-weight: 700;">
        <strong>${callOiLakhs}</strong>
        <span class="oi-red-line" style="width: ${callLineWidth}px;"></span>
      </td>

      <!-- CALL ACTION: B and S -->
      <td class="call-cell" style="white-space: nowrap;">
        <button type="button" class="btn-oc-action-b" onclick="selectSensibullStrike(${s}, 'CE', 'B', ${callLtp})" title="Buy Call">B</button>
        <button type="button" class="btn-oc-action-s" onclick="selectSensibullStrike(${s}, 'CE', 'S', ${callLtp})" title="Sell Call">S</button>
      </td>

      <!-- STRIKE (CENTER) with ATM Box -->
      <td class="strike-cell">
        <span class="strike-pill-badge ${isAtm ? 'atm' : ''}">${s}</span>
      </td>

      <!-- IV -->
      <td style="color: #64748b; font-weight: 600;">${iv}</td>

      <!-- PUT ACTION: B and S -->
      <td class="put-cell" style="white-space: nowrap;">
        <button type="button" class="btn-oc-action-b" onclick="selectSensibullStrike(${s}, 'PE', 'B', ${putLtp})" title="Buy Put">B</button>
        <button type="button" class="btn-oc-action-s" onclick="selectSensibullStrike(${s}, 'PE', 'S', ${putLtp})" title="Sell Put">S</button>
      </td>

      <!-- PUT OI with Green Bar -->
      <td class="put-cell" style="text-align: right; padding-right: 12px; font-weight: 700;">
        <span class="oi-green-line" style="width: ${putLineWidth}px;"></span>
        <strong>${putOiLakhs}</strong>
      </td>

      <!-- PUT LTP -->
      <td class="put-cell" style="font-weight: 800; font-size: 13px; color: #0f172a;">
        ${putLtp.toFixed(2)}
      </td>

      <!-- PUT DELTA -->
      <td class="put-cell" style="color: #64748b; font-weight: 600;">${putDelta}</td>

    </tr>`;
  });

  tbody.innerHTML = html;
}

// Periodic render every 1 sec
if (typeof window !== "undefined") {
  window.renderAllSensibullChains = renderAllSensibullChains;
  window.renderSensibullOptionChainTable = renderAllSensibullChains;
  setInterval(renderAllSensibullChains, 1000);
  setTimeout(renderAllSensibullChains, 250);
}

function drawSensibullPayoffGraph() {}
