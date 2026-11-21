/**
 * LiveIPO Option Selling Portal - Frontend Script (script.js)
 * Fully standalone, zero backend dependency, works on GitHub Pages.
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

// Initial Seed Trades if none exists
const SEED_TRADES = [
  {
    id: "TRD-101",
    index: "NIFTY",
    strategy: "Iron Condor",
    strike: "24400 PE / 24800 CE",
    action: "SELL",
    entryPrice: 84.50,
    currentPrice: 22.00,
    targetPrice: 10.00,
    stopLoss: 120.00,
    lots: 4,
    pnl: 18750,
    status: "OPEN",
    date: "2026-11-20"
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
    date: "2026-11-21"
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

// ==========================================
// 2. USER AUTHENTICATION & DATA ISOLATION
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
    } catch (e) {
      // fallback
    }
  }
  // Default structure for newly registered user
  const initial = {
    email: email,
    plan: "Free Trial",
    planId: "free",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], // 7 Days Free Trial
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
    
    // Initialize or load isolated user data
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
// 3. TRADES & DASHBOARD DATA MANAGEMENT
// ==========================================
function getAllTrades() {
  const stored = localStorage.getItem("liveipo_shared_trades");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  // Initialize seed trades
  localStorage.setItem("liveipo_shared_trades", JSON.stringify(SEED_TRADES));
  return SEED_TRADES;
}

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
  let totalProfit = 0;
  let winCount = 0;
  let openTradesCount = 0;

  trades.forEach(t => {
    totalProfit += (t.pnl || 0);
    if ((t.pnl || 0) > 0) winCount++;
    if (t.status === "OPEN") openTradesCount++;
  });

  const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;

  // Render Metric Cards
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

  // Render Signal Cards
  renderSignalCards(trades);

  // Render Table
  renderTradeTable(trades);

  // Render My Subscription Tab
  renderSubscriptionTab(userData);

  // Render Payments Tab
  renderPaymentsTab(userData);
}

function renderSignalCards(trades) {
  const container = document.getElementById("signalsContainer");
  if (!container) return;

  const openTrades = trades.filter(t => t.status === "OPEN" || t.status === "TARGET HIT").slice(0, 6);
  if (openTrades.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px;">No open option signals currently. Check back during market hours!</p>`;
    return;
  }

  container.innerHTML = openTrades.map(trade => {
    const isProfit = (trade.pnl || 0) >= 0;
    const isTargetHit = trade.status === "TARGET HIT";
    return `
      <div class="signal-card ${trade.status === 'OPEN' ? 'active-signal' : ''}">
        <div class="signal-header">
          <div>
            <span class="signal-index">${trade.index}</span>
            <span class="signal-strategy">${trade.strategy}</span>
          </div>
          <span class="badge-${trade.action.toLowerCase()}">${trade.action}</span>
        </div>
        <div class="signal-strikes">
          <div class="strike-row">
            <span>Strikes:</span>
            <span>${trade.strike}</span>
          </div>
          <div class="strike-row">
            <span>Quantity:</span>
            <span>${trade.lots} Lots</span>
          </div>
        </div>
        <div class="signal-levels">
          <div class="level-box">
            <div class="level-label">Entry Avg</div>
            <div class="level-val">₹${trade.entryPrice}</div>
          </div>
          <div class="level-box">
            <div class="level-label">Target</div>
            <div class="level-val" style="color: #10b981;">₹${trade.targetPrice}</div>
          </div>
          <div class="level-box">
            <div class="level-label">StopLoss</div>
            <div class="level-val" style="color: #ef4444;">₹${trade.stopLoss}</div>
          </div>
        </div>
        <div class="signal-footer">
          <span style="font-weight: 600; color: ${isTargetHit ? '#10b981' : '#2563eb'}">
            ${isTargetHit ? '🎯 Target Achieved' : '● Live In Market'}
          </span>
          <span class="pnl-badge" style="color: ${isProfit ? '#10b981' : '#ef4444'}">
            ${isProfit ? '+' : ''}₹${(trade.pnl || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function renderTradeTable(trades) {
  const tbody = document.getElementById("tradeTableBody");
  if (!tbody) return;

  tbody.innerHTML = trades.map(t => {
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
// 4. RAZORPAY PAYMENT SIMULATION FLOW
// ==========================================
function startPlanSubscription(planKey) {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  const plan = PLANS[planKey];
  if (!plan) return;

  selectedPlanForPayment = plan;

  // Open Checkout Modal
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
  
  // Calculate expiry
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

  // Save isolated and sync to global admin DB
  saveUserIsolatedData(currentUser.email, userData);

  // Also record in global transactions
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
// 5. NAVIGATION & MODALS
// ==========================================
function switchTab(tabId) {
  currentTab = tabId;

  // Update menu active
  document.querySelectorAll(".sidebar-menu li").forEach(li => {
    li.classList.toggle("active", li.getAttribute("data-tab") === tabId);
  });

  // Update Tab Content
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `tab-${tabId}`);
  });

  // Update Page Title
  const titles = {
    dashboard: { title: "Dashboard & Live Signals", sub: "Live options selling positions, hedging & intraday spreads" },
    analytics: { title: "P&L Analytics", sub: "Historical performance, win-rate breakdown & monthly stats" },
    trades: { title: "Trade History", sub: "Verified track record of past option selling calls" },
    subscription: { title: "My Subscription", sub: "Manage active membership, expiry date & invoices" },
    pricing: { title: "Plans & Pricing", sub: "Choose your professional option selling membership" },
    support: { title: "Help & Support", sub: "Direct support desk for options strategy queries" }
  };

  const info = titles[tabId] || titles.dashboard;
  document.getElementById("mainPageTitle").textContent = info.title;
  document.getElementById("mainPageSubtitle").textContent = info.sub;

  // Close mobile sidebar if open
  document.getElementById("mainSidebar").classList.remove("open");
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

// Export Trades CSV
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
// 6. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderAuthUI();
  loadDashboardData();

  // Initialize GSI if available
  if (window.google && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: window.handleGoogleSignIn,
        auto_select: false
      });

      // Render buttons in containers
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
