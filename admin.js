
/**
 * LiveIPO Option Selling Admin Panel Script (admin.js)
 * Standalone client-side admin controller with persistent localStorage backing.
 * DhanHQ credentials are stored ONLY in Cloudflare Worker KV/Secrets or local Admin browser storage.
 */

// ==========================================
// 1. SECURITY & AUTH CHECK
// ==========================================
if (localStorage.getItem("live_ipo_admin_logged") !== "true") {
  window.location.href = "login.html";
}

function handleAdminLogout() {
  localStorage.removeItem("live_ipo_admin_logged");
  localStorage.removeItem("live_ipo_admin_user");
  window.location.href = "login.html";
}

// Global Admin State
let selectedUserForExpiry = null;
let currentAdminTab = "overview";

// ==========================================
// 2. DATA LOADERS & METRICS
// ==========================================
function getAdminUsers() {
  try {
    const raw = localStorage.getItem("liveipo_users_db");
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  // Default seed users if none exist
  const seedUsers = [
    {
      email: "trader.rahul@gmail.com",
      name: "Rahul Sharma",
      plan: "Gold Pro",
      expiryDate: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
      status: "ACTIVE",
      lastActive: new Date().toISOString()
    },
    {
      email: "mehul.investor@gmail.com",
      name: "Mehul Patel",
      plan: "Premium Elite",
      expiryDate: new Date(Date.now() + 180 * 86400000).toISOString().split("T")[0],
      status: "ACTIVE",
      lastActive: new Date().toISOString()
    },
    {
      email: "sanjay.options@yahoo.com",
      name: "Sanjay Dave",
      plan: "Basic Starter",
      expiryDate: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
      status: "EXPIRED",
      lastActive: new Date().toISOString()
    }
  ];
  localStorage.setItem("liveipo_users_db", JSON.stringify(seedUsers));
  return seedUsers;
}

function getAdminTrades() {
  try {
    const raw = localStorage.getItem("liveipo_shared_trades");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  if (typeof SEED_TRADES !== "undefined" && Array.isArray(SEED_TRADES) && SEED_TRADES.length > 0) {
    return SEED_TRADES;
  }
  return [];
}

function getAdminPayments() {
  try {
    const raw = localStorage.getItem("liveipo_payments_db");
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const seedPayments = [
    {
      invoiceId: "INV-928104",
      userEmail: "mehul.investor@gmail.com",
      userName: "Mehul Patel",
      planName: "Premium Elite",
      amount: 7999,
      date: "2026-11-15",
      method: "Razorpay UPI",
      status: "PAID"
    },
    {
      invoiceId: "INV-817263",
      userEmail: "trader.rahul@gmail.com",
      userName: "Rahul Sharma",
      planName: "Gold Pro",
      amount: 4499,
      date: "2026-11-10",
      method: "Razorpay NetBanking",
      status: "PAID"
    }
  ];
  localStorage.setItem("liveipo_payments_db", JSON.stringify(seedPayments));
  return seedPayments;
}

function refreshAdminDashboard() {
  const users = getAdminUsers();
  const trades = getAdminTrades();
  const payments = getAdminPayments();

  // Metrics
  const activeSubs = users.filter(u => {
    const diff = Math.ceil((new Date(u.expiryDate) - new Date()) / 86400000);
    return diff > 0;
  }).length;

  let totalRev = 0;
  payments.forEach(p => totalRev += (p.amount || 0));

  const totalUsersEl = document.getElementById("adminStatUsers");
  const activeSubsEl = document.getElementById("adminStatActiveSubs");
  const totalRevEl = document.getElementById("adminStatRevenue");
  const totalTradesEl = document.getElementById("adminStatTrades");

  if (totalUsersEl) totalUsersEl.textContent = users.length;
  if (activeSubsEl) activeSubsEl.textContent = activeSubs;
  if (totalRevEl) totalRevEl.textContent = `₹${totalRev.toLocaleString("en-IN")}`;
  if (totalTradesEl) totalTradesEl.textContent = trades.length;

  // Render Sub-Views
  renderUsersTable(users);
  renderTradesTable(trades);
  renderPaymentsTable(payments);
}

// ==========================================
// 3. USER MANAGEMENT & EXPIRY EXTENSION
// ==========================================
function renderUsersTable(users) {
  const tbody = document.getElementById("adminUsersTableBody");
  const detailedTbody = document.getElementById("adminUsersDetailedTableBody");
  if (!tbody && !detailedTbody) return;

  const now = new Date();

  const usersHtml = users.map(u => {
    const expDate = new Date(u.expiryDate);
    const diffDays = Math.ceil((expDate - now) / 86400000);
    const isExpired = diffDays <= 0;

    return `
      <tr>
        <td><strong>${u.name || 'User'}</strong></td>
        <td>${u.email}</td>
        <td><span style="font-weight: 600; color: #2563eb;">${u.plan || 'Free Trial'}</span></td>
        <td>${u.expiryDate}</td>
        <td>
          <span class="${isExpired ? 'badge-expired' : 'badge-active'}">
            ${isExpired ? `Expired (${Math.abs(diffDays)}d ago)` : `${diffDays} Days Left`}
          </span>
        </td>
        <td>
          <button class="admin-btn-primary" style="padding: 5px 10px; font-size: 11.5px;" onclick="openExtendModal('${u.email}')">
            ⏳ Extend Expiry
          </button>
        </td>
      </tr>
    `;
  }).join("");

  if (tbody) tbody.innerHTML = usersHtml;
  if (detailedTbody) detailedTbody.innerHTML = usersHtml;
}

function openExtendModal(email) {
  const users = getAdminUsers();
  const user = users.find(u => u.email === email);
  if (!user) return;

  selectedUserForExpiry = user;
  document.getElementById("modalExtendUserEmail").textContent = user.email;
  document.getElementById("modalExtendCurrentExpiry").textContent = user.expiryDate;
  document.getElementById("customExpiryInput").value = user.expiryDate;

  const overlay = document.getElementById("extendExpiryModalOverlay");
  if (overlay) overlay.classList.add("active"); overlay.style.display = "flex";
}

function closeExtendModal() {
  const overlay = document.getElementById("extendExpiryModalOverlay");
  if (overlay) overlay.classList.remove("active"); overlay.style.display = "none";
  selectedUserForExpiry = null;
}

function applyDaysExtension(days) {
  if (!selectedUserForExpiry) return;

  let baseDate = new Date(selectedUserForExpiry.expiryDate);
  const now = new Date();
  if (isNaN(baseDate) || baseDate < now) {
    baseDate = now;
  }

  baseDate.setDate(baseDate.getDate() + days);
  const newDateStr = baseDate.toISOString().split("T")[0];
  saveNewUserExpiry(selectedUserForExpiry.email, newDateStr);
}

function applyCustomDateExtension() {
  if (!selectedUserForExpiry) return;
  const customDate = document.getElementById("customExpiryInput").value;
  if (!customDate) {
    alert("Please select a valid expiry date!");
    return;
  }
  saveNewUserExpiry(selectedUserForExpiry.email, customDate);
}

function saveNewUserExpiry(email, newExpiryDate) {
  const users = getAdminUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx >= 0) {
    users[idx].expiryDate = newExpiryDate;
    users[idx].status = "ACTIVE";
    localStorage.setItem("liveipo_users_db", JSON.stringify(users));
  }

  // Also update isolated user storage so user immediately sees it when they log in!
  const userIsoKey = `liveipo_user_${email}`;
  const isoRaw = localStorage.getItem(userIsoKey);
  if (isoRaw) {
    try {
      const isoData = JSON.parse(isoRaw);
      isoData.expiryDate = newExpiryDate;
      isoData.status = "ACTIVE";
      localStorage.setItem(userIsoKey, JSON.stringify(isoData));
    } catch (e) {}
  }

  closeExtendModal();
  refreshAdminDashboard();
  alert(`✓ Expiry successfully extended to ${newExpiryDate} for ${email}`);
}

// ==========================================
// 4. TRADE MANAGEMENT (ADD / CLOSE / DELETE)
// ==========================================
function renderTradesTable(trades) {
  const tbody = document.getElementById("adminTradesTableBody");
  const fullTbody = document.getElementById("adminTradesFullTableBody");
  if (!tbody && !fullTbody) return;

  const tradesHtml = trades.map(t => {
    const isProfit = (t.pnl || 0) >= 0;
    return `
      <tr>
        <td><strong>${t.id}</strong></td>
        <td>${t.date}</td>
        <td><strong>${t.index}</strong></td>
        <td>${t.strategy}</td>
        <td>${t.strike}</td>
        <td>${t.action}</td>
        <td>₹${t.entryPrice}</td>
        <td>₹${t.currentPrice || t.targetPrice}</td>
        <td style="font-weight: 600; color: ${isProfit ? '#10b981' : '#ef4444'}">
          ${isProfit ? '+' : ''}₹${(t.pnl || 0).toLocaleString("en-IN")}
        </td>
        <td><span style="font-weight: 600; font-size: 11.5px;">${t.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${t.status === 'OPEN' ? `
              <button class="admin-btn-success" onclick="openCloseTradeModal('${t.id}')">Close</button>
            ` : ''}
            <button class="admin-btn-danger" onclick="deleteTrade('${t.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  if (tbody) tbody.innerHTML = tradesHtml;
  if (fullTbody) fullTbody.innerHTML = tradesHtml;
}

function openAddTradeModal() {
  document.getElementById("addTradeForm").reset();
  const overlay = document.getElementById("addTradeModalOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeAddTradeModal() {
  const overlay = document.getElementById("addTradeModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

function handleAddTradeSubmit(e) {
  e.preventDefault();
  const trades = getAdminTrades();

  const index = document.getElementById("tradeIndex").value;
  const strategy = document.getElementById("tradeStrategy").value;
  const strike = document.getElementById("tradeStrike").value;
  const action = document.getElementById("tradeAction").value;
  const entryPrice = parseFloat(document.getElementById("tradeEntry").value);
  const targetPrice = parseFloat(document.getElementById("tradeTarget").value);
  const stopLoss = parseFloat(document.getElementById("tradeSL").value);
  const lots = parseInt(document.getElementById("tradeLots").value);

  const newTrade = {
    id: `TRD-${Math.floor(100 + Math.random() * 900)}`,
    index,
    strategy,
    strike,
    action,
    entryPrice,
    currentPrice: entryPrice,
    targetPrice,
    stopLoss,
    lots,
    pnl: 0,
    status: "OPEN",
    date: new Date().toISOString().split("T")[0]
  };

  trades.unshift(newTrade);
  localStorage.setItem("liveipo_shared_trades", JSON.stringify(trades));

  closeAddTradeModal();
  refreshAdminDashboard();
  alert(`✓ New Option Trade ${newTrade.id} successfully published to user terminals!`);
}

let tradeToClose = null;
function openCloseTradeModal(tradeId) {
  const trades = getAdminTrades();
  tradeToClose = trades.find(t => t.id === tradeId);
  if (!tradeToClose) return;

  document.getElementById("closeTradeId").textContent = tradeToClose.id;
  document.getElementById("closeTradeStrikes").textContent = `${tradeToClose.index} ${tradeToClose.strike}`;
  document.getElementById("closeTradeEntry").textContent = `₹${tradeToClose.entryPrice}`;
  document.getElementById("closeExitPrice").value = tradeToClose.targetPrice;

  const overlay = document.getElementById("closeTradeModalOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeCloseTradeModal() {
  const overlay = document.getElementById("closeTradeModalOverlay");
  if (overlay) overlay.classList.remove("active");
  tradeToClose = null;
}

function submitCloseTrade() {
  if (!tradeToClose) return;
  const exitPrice = parseFloat(document.getElementById("closeExitPrice").value);
  if (isNaN(exitPrice)) {
    alert("Please enter a valid exit price!");
    return;
  }

  const trades = getAdminTrades();
  const idx = trades.findIndex(t => t.id === tradeToClose.id);
  if (idx >= 0) {
    // For selling: profit = (entry - exit) * multiplier * lots
    const lotSize = tradeToClose.index === "NIFTY" ? 25 : (tradeToClose.index === "BANKNIFTY" ? 15 : 40);
    const diff = tradeToClose.action === "SELL" ? (tradeToClose.entryPrice - exitPrice) : (exitPrice - tradeToClose.entryPrice);
    const calculatedPnl = Math.round(diff * lotSize * tradeToClose.lots);

    trades[idx].currentPrice = exitPrice;
    trades[idx].pnl = calculatedPnl;
    trades[idx].status = exitPrice <= tradeToClose.targetPrice ? "TARGET HIT" : (exitPrice >= tradeToClose.stopLoss ? "SL HIT" : "CLOSED");

    localStorage.setItem("liveipo_shared_trades", JSON.stringify(trades));
  }

  closeCloseTradeModal();
  refreshAdminDashboard();
  alert(`✓ Trade closed with P&L: ₹${trades[idx].pnl}`);
}

function deleteTrade(tradeId) {
  if (!confirm(`Are you sure you want to delete trade ${tradeId}?`)) return;
  let trades = getAdminTrades();
  trades = trades.filter(t => t.id !== tradeId);
  localStorage.setItem("liveipo_shared_trades", JSON.stringify(trades));
  refreshAdminDashboard();
}

// ==========================================
// 5. BULK CSV IMPORT
// ==========================================
function openBulkCsvModal() {
  const overlay = document.getElementById("bulkCsvModalOverlay");
  if (overlay) overlay.classList.add("active");
}

function closeBulkCsvModal() {
  const overlay = document.getElementById("bulkCsvModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

function handleCsvFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const text = event.target.result;
    parseAndImportCSV(text);
  };
  reader.readAsText(file);
}

function parseAndImportCSV(csvText) {
  const lines = csvText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length <= 1) {
    alert("CSV file seems empty or invalid.");
    return;
  }

  const trades = getAdminTrades();
  let importedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map(p => p.replace(/"/g, "").trim());
    if (parts.length >= 6) {
      const newTrade = {
        id: parts[0] || `TRD-${Math.floor(100 + Math.random() * 900)}`,
        date: parts[1] || new Date().toISOString().split("T")[0],
        index: parts[2] || "NIFTY",
        strategy: parts[3] || "Option Spread",
        strike: parts[4] || "24500 CE",
        action: parts[5] || "SELL",
        entryPrice: parseFloat(parts[6]) || 100,
        currentPrice: parseFloat(parts[7]) || 20,
        targetPrice: parseFloat(parts[7]) || 10,
        stopLoss: parseFloat(parts[6]) * 1.5 || 150,
        lots: 3,
        pnl: parseFloat(parts[8]) || 5000,
        status: parts[9] || "CLOSED"
      };
      trades.unshift(newTrade);
      importedCount++;
    }
  }

  localStorage.setItem("liveipo_shared_trades", JSON.stringify(trades));
  closeBulkCsvModal();
  refreshAdminDashboard();
  alert(`✓ Successfully imported ${importedCount} trades from CSV!`);
}

// ==========================================
// 6. PAYMENTS & TRANSACTIONS
// ==========================================
function renderPaymentsTable(payments) {
  const tbody = document.getElementById("adminPaymentsTableBody");
  if (!tbody) return;

  tbody.innerHTML = payments.map(p => `
    <tr>
      <td><strong>${p.invoiceId}</strong></td>
      <td>${p.date}</td>
      <td>${p.userName || 'Member'} (${p.userEmail})</td>
      <td><strong>${p.planName}</strong></td>
      <td><strong>₹${(p.amount || 0).toLocaleString("en-IN")}</strong></td>
      <td>${p.method || 'Razorpay UPI'}</td>
      <td><span class="badge-active">PAID</span></td>
    </tr>
  `).join("");
}

// ==========================================
// 7. MULTI-LEG STRATEGY (3-STRIKE BASKET) DESK
// ==========================================
function loadMultiLegStrategyAdmin() {
  let strategies = [];
  try {
    const raw = localStorage.getItem("liveipo_multileg_strategies");
    if (raw) strategies = JSON.parse(raw);
  } catch (e) {}

  if (!strategies || strategies.length === 0) {
    strategies = [
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
          { id: "leg-1", action: "SELL", actionBadge: "S", instrument: "23rd Nov 25050 PE", lots: 6, avgPrice: 46.35, ltp: 24.30, booked: 0, unbooked: 8249, pnl: 8249 },
          { id: "leg-2", action: "SELL", actionBadge: "S", instrument: "23rd Nov 25350 PE", lots: 2, avgPrice: 120.75, ltp: 81.00, booked: 0, unbooked: 4778, pnl: 4778 },
          { id: "leg-3", action: "BUY", actionBadge: "B", instrument: "23rd Nov 25600 PE", lots: 2, avgPrice: 236.85, ltp: 203.20, booked: 0, unbooked: -3750, pnl: -3750 }
        ],
        dayByDayHistory: [
          { date: "19 Nov (Day 1)", niftySpot: 25400.00, leg1Ltp: 46.35, leg2Ltp: 120.75, leg3Ltp: 236.85, bookedPnl: 0, unbookedPnl: 2850, dayPnl: "+2,850", remark: "Entry Day" },
          { date: "20 Nov (Day 2)", niftySpot: 25420.50, leg1Ltp: 34.50, leg2Ltp: 98.20, leg3Ltp: 218.40, bookedPnl: 0, unbookedPnl: 5600, dayPnl: "+2,750", remark: "Holding Day" },
          { date: "21 Nov (Live Today)", niftySpot: 25436.55, leg1Ltp: 24.30, leg2Ltp: 81.00, leg3Ltp: 203.20, bookedPnl: 0, unbookedPnl: 9276, dayPnl: "+3,676", remark: "Live Market" },
          { date: "22 Nov (Projected)", niftySpot: 25450.00, leg1Ltp: 12.00, leg2Ltp: 45.00, leg3Ltp: 160.00, bookedPnl: 0, unbookedPnl: 18500, dayPnl: "+9,224", remark: "Projected Weekend" },
          { date: "23 Nov (Expiry Target)", niftySpot: 25450.00, leg1Ltp: 0.05, leg2Ltp: 0.05, leg3Ltp: 0.05, bookedPnl: 35484, unbookedPnl: 0, dayPnl: "+16,984", remark: "Full Target" }
        ],
        greeks: { delta: "+14.2", theta: "+₹3,676 / day", gamma: "-0.0018", vega: "-₹1,240" }
      }
    ];
    localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));
  }

  const strat = strategies[0];
  const spotEl = document.getElementById("adminStrategySpot");
  const leg1El = document.getElementById("adminLeg1Ltp");
  const leg2El = document.getElementById("adminLeg2Ltp");
  const leg3El = document.getElementById("adminLeg3Ltp");

  if (spotEl) spotEl.value = strat.underlyingPrice;
  if (leg1El && strat.legs[0]) leg1El.value = strat.legs[0].ltp;
  if (leg2El && strat.legs[1]) leg2El.value = strat.legs[1].ltp;
  if (leg3El && strat.legs[2]) leg3El.value = strat.legs[2].ltp;

  renderAdminDayByDayTable(strat.dayByDayHistory);
}

function saveMultiLegStrategyLive() {
  const spotVal = parseFloat(document.getElementById("adminStrategySpot").value) || 25436.55;
  const leg1Val = parseFloat(document.getElementById("adminLeg1Ltp").value) || 24.30;
  const leg2Val = parseFloat(document.getElementById("adminLeg2Ltp").value) || 81.00;
  const leg3Val = parseFloat(document.getElementById("adminLeg3Ltp").value) || 203.20;

  let strategies = [];
  try {
    const raw = localStorage.getItem("liveipo_multileg_strategies");
    if (raw) strategies = JSON.parse(raw);
  } catch (e) {}

  if (strategies.length > 0) {
    const strat = strategies[0];
    strat.underlyingPrice = spotVal;

    const leg1Pnl = Math.round((46.35 - leg1Val) * 25 * 6 * 2.5);
    strat.legs[0].ltp = leg1Val;
    strat.legs[0].unbooked = leg1Pnl;
    strat.legs[0].pnl = leg1Pnl;

    const leg2Pnl = Math.round((120.75 - leg2Val) * 25 * 2 * 2.4);
    strat.legs[1].ltp = leg2Val;
    strat.legs[1].unbooked = leg2Pnl;
    strat.legs[1].pnl = leg2Pnl;

    const leg3Pnl = Math.round((leg3Val - 236.85) * 25 * 2 * 2.23);
    strat.legs[2].ltp = leg3Val;
    strat.legs[2].unbooked = leg3Pnl;
    strat.legs[2].pnl = leg3Pnl;

    strat.totalUnbooked = leg1Pnl + leg2Pnl + leg3Pnl;
    strat.totalPnl = strat.totalBooked + strat.totalUnbooked;

    localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));

    // Also sync to liveipo_multistrike_trades for Trade History table
    try {
      const rawTrades = localStorage.getItem("liveipo_multistrike_trades");
      if (rawTrades) {
        const trades = JSON.parse(rawTrades);
        const activeTrade = trades.find(t => t.tradeNo === 1);
        if (activeTrade && activeTrade.status === "LIVE") {
          activeTrade.totalProfit = strat.totalPnl;
          activeTrade.legs[0].ltp = leg1Val;
          activeTrade.legs[0].netPnl = leg1Pnl;
          activeTrade.legs[1].ltp = leg2Val;
          activeTrade.legs[1].netPnl = leg2Pnl;
          activeTrade.legs[2].ltp = leg3Val;
          activeTrade.legs[2].netPnl = leg3Pnl;
          localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(trades));
        }
      }
    } catch (err) {}

    alert(`✓ Multi-Leg Strategy Live Prices updated!\nTotal Combined P&L: ₹${strat.totalPnl.toLocaleString("en-IN")}`);
    refreshAdminDashboard();
  }
}

function renderAdminDayByDayTable(history) {
  const tbody = document.getElementById("adminDayByDayTableBody");
  if (!tbody || !history) return;

  tbody.innerHTML = history.map(row => `
    <tr>
      <td><strong>${row.date}</strong></td>
      <td>₹${row.niftySpot.toFixed(2)}</td>
      <td>₹${row.leg1Ltp.toFixed(2)}</td>
      <td>₹${row.leg2Ltp.toFixed(2)}</td>
      <td>₹${row.leg3Ltp.toFixed(2)}</td>
      <td style="color: #10b981; font-weight: 500;">${row.dayPnl}</td>
      <td style="color: #10b981; font-weight: 600;">+₹${row.unbookedPnl.toLocaleString("en-IN")}</td>
      <td><span style="font-size: 11.5px; color: #64748b;">${row.remark}</span></td>
    </tr>
  `).join("");
}

function handleAddDayRecordSubmit(e) {
  e.preventDefault();
  const dateStage = document.getElementById("newDayDate").value;
  const spot = parseFloat(document.getElementById("newDaySpot").value);
  const leg1 = parseFloat(document.getElementById("newDayLeg1").value);
  const leg2 = parseFloat(document.getElementById("newDayLeg2").value);
  const leg3 = parseFloat(document.getElementById("newDayLeg3").value);
  const thetaGain = document.getElementById("newDayTheta").value;
  const totalPnl = parseFloat(document.getElementById("newDayPnl").value);
  const remark = document.getElementById("newDayRemark").value;

  let strategies = [];
  try {
    const raw = localStorage.getItem("liveipo_multileg_strategies");
    if (raw) strategies = JSON.parse(raw);
  } catch (e) {}

  if (strategies.length > 0) {
    strategies[0].dayByDayHistory.push({
      date: dateStage,
      niftySpot: spot,
      leg1Ltp: leg1,
      leg2Ltp: leg2,
      leg3Ltp: leg3,
      bookedPnl: 0,
      unbookedPnl: totalPnl,
      dayPnl: thetaGain,
      remark: remark
    });
    localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));
    alert("✓ New Day-by-Day analysis record added!");
    document.getElementById("addDayRecordForm").reset();
    refreshAdminDashboard();
  }
}

// Switch Admin Section

// Explicit Window Global Bindings for Sidebar Navigation & Modals
if (typeof window !== "undefined") {
  window.switchAdminTab = switchAdminTab;
  window.openPublishBasketTradeModal = openPublishBasketTradeModal;
  if (typeof closePublishBasketTradeModal === "function") window.closePublishBasketTradeModal = closePublishBasketTradeModal;
  if (typeof selectSensibullStrike === "function") window.selectSensibullStrike = selectSensibullStrike;
  if (typeof switchPureSensibullExpiry === "function") window.switchPureSensibullExpiry = switchPureSensibullExpiry;
  if (typeof renderAllSensibullChains === "function") window.renderAllSensibullChains = renderAllSensibullChains;
  if (typeof renderSensibullOptionChainTable === "function") window.renderSensibullOptionChainTable = renderSensibullOptionChainTable;
  if (typeof refreshAdminDashboard === "function") window.refreshAdminDashboard = refreshAdminDashboard;
}

function switchAdminTab(tabKey) {
  currentAdminTab = tabKey;
  document.querySelectorAll(".admin-nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-tab") === tabKey);
  });

  document.querySelectorAll(".admin-tab-section").forEach(sec => {
    sec.style.display = sec.id === `adminTab-${tabKey}` ? "block" : "none";
  });

  if (tabKey === "users") {
    renderUsersTable(getAdminUsers());
  } else if (tabKey === "trades") {
    renderTradesTable(getAdminTrades());
  } else if (tabKey === "overview") {
    refreshAdminDashboard();
  } else if (tabKey === "strategy") {
    loadMultiLegStrategyAdmin();
    if (window.OCEngine) window.OCEngine.renderAll();
  } else if (tabKey === "optionchain") {
    if (window.OCEngine) window.OCEngine.renderAll();
  }
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  refreshAdminDashboard();
  loadMultiLegStrategyAdmin();
  if (typeof populateExpiryDropdown === "function") {
    populateExpiryDropdown(currentOcSymbol);
    fetchNSEOptionChain();
    startRealtimeOptionChainTicks();
  }
  if (typeof renderMultiStrikeTradeHistoryTable === "function") {
    renderMultiStrikeTradeHistoryTable();
  }
});



// ========================================================
// 3-STRIKE BASKET TRADE PUBLISHING MODAL HANDLERS
// ========================================================
function openPublishBasketTradeModal() {
  const overlay = document.getElementById("publishBasketTradeModalOverlay");
  if (overlay) {
    overlay.classList.add("active");
    // Pre-populate trade date with today's date formatted DD-MM-YYYY
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;
    
    const dateInput = document.getElementById("basketTradeDate");
    if (dateInput) dateInput.value = formattedDate;
  }
}

function closePublishBasketTradeModal() {
  const overlay = document.getElementById("publishBasketTradeModalOverlay");
  if (overlay) overlay.classList.remove("active");
}

function handlePublishBasketTradeSubmit(e) {
  e.preventDefault();

  const strategyName = document.getElementById("basketStrategyName").value || "LiveIPO Pro";
  const tradeName = document.getElementById("basketTradeName") ? (document.getElementById("basketTradeName").value || "NIFTY Weekly Ratio Put Spread") : "LiveIPO 3-Strike Basket";
  const index = document.getElementById("basketIndex").value || "NIFTY";
  const expiry = document.getElementById("basketExpiry").value || "23-Nov-2026";
  const tradeDate = document.getElementById("basketTradeDate").value || new Date().toISOString().split("T")[0];

  // Leg 1
  const leg1 = {
    strike: document.getElementById("leg1Strike").value,
    type: document.getElementById("leg1Type").value,
    action: document.getElementById("leg1Action").value,
    lots: parseInt(document.getElementById("leg1Lots").value) || 6,
    entry: parseFloat(document.getElementById("leg1Entry").value) || 0,
    ltp: parseFloat(document.getElementById("leg1LtpVal").value) || 0
  };

  // Leg 2
  const leg2 = {
    strike: document.getElementById("leg2Strike").value,
    type: document.getElementById("leg2Type").value,
    action: document.getElementById("leg2Action").value,
    lots: parseInt(document.getElementById("leg2Lots").value) || 2,
    entry: parseFloat(document.getElementById("leg2Entry").value) || 0,
    ltp: parseFloat(document.getElementById("leg2LtpVal").value) || 0
  };

  // Leg 3
  const leg3 = {
    strike: document.getElementById("leg3Strike").value,
    type: document.getElementById("leg3Type").value,
    action: document.getElementById("leg3Action").value,
    lots: parseInt(document.getElementById("leg3Lots").value) || 2,
    entry: parseFloat(document.getElementById("leg3Entry").value) || 0,
    ltp: parseFloat(document.getElementById("leg3LtpVal").value) || 0
  };

  // Load existing multi-strike trades
  let trades = [];
  try {
    const raw = localStorage.getItem("liveipo_multistrike_trades");
    if (raw) trades = JSON.parse(raw);
  } catch (err) {}

  // Find next Trade No
  let maxTradeNo = 0;
  let maxSrNo = 0;
  trades.forEach(t => {
    if (t.tradeNo > maxTradeNo) maxTradeNo = t.tradeNo;
    if (t.legs) {
      t.legs.forEach(l => {
        if (l.srNo > maxSrNo) maxSrNo = l.srNo;
      });
    }
  });

  const nextTradeNo = maxTradeNo + 1;
  const sr1 = maxSrNo + 1;
  const sr2 = maxSrNo + 2;
  const sr3 = maxSrNo + 3;

  // Calculate initial net P&Ls using exact exchange lot sizes from OCEngine
  const calcPnl = (sym, leg) => {
    if (window.OCEngine && typeof window.OCEngine.calcLegPnl === "function") {
      return window.OCEngine.calcLegPnl(sym, leg.entry, leg.ltp, leg.lots, leg.action);
    }
    const diff = leg.action === "S" ? (leg.entry - leg.ltp) : (leg.ltp - leg.entry);
    return Math.round(diff * (leg.lots || 1) * 65);
  };
  const pnl1 = calcPnl(index, leg1);
  const pnl2 = calcPnl(index, leg2);
  const pnl3 = calcPnl(index, leg3);
  const totalPnl = pnl1 + pnl2 + pnl3;

  const newTrade = {
    tradeNo: nextTradeNo,
    date: tradeDate,
    index: index,
    expiry: expiry,
    strategy: strategyName,
    tradeName: tradeName,
    status: "LIVE",
    totalProfit: totalPnl,
    legs: [
      {
        srNo: sr1,
        tradeId: `TRD-${100 + sr1}`,
        strike: leg1.strike,
        type: leg1.type,
        action: leg1.action,
        entry: leg1.entry,
        ltp: leg1.ltp,
        lots: leg1.lots,
        netPnl: pnl1,
        status: "LIVE"
      },
      {
        srNo: sr2,
        tradeId: `TRD-${100 + sr2}`,
        strike: leg2.strike,
        type: leg2.type,
        action: leg2.action,
        entry: leg2.entry,
        ltp: leg2.ltp,
        lots: leg2.lots,
        netPnl: pnl2,
        status: "LIVE"
      },
      {
        srNo: sr3,
        tradeId: `TRD-${100 + sr3}`,
        strike: leg3.strike,
        type: leg3.type,
        action: leg3.action,
        entry: leg3.entry,
        ltp: leg3.ltp,
        lots: leg3.lots,
        netPnl: pnl3,
        status: "LIVE"
      }
    ]
  };

  // Prepend as top active trade
  trades.unshift(newTrade);
  localStorage.setItem("liveipo_multistrike_trades", JSON.stringify(trades));

  // Also update live multi-leg strategy (Sensibull) so frontend matches
  try {
    let strategies = [];
    const rawStrat = localStorage.getItem("liveipo_multileg_strategies");
    if (rawStrat) strategies = JSON.parse(rawStrat);
    if (strategies.length > 0) {
      strategies[0].expiry = expiry;
      strategies[0].index = index;
      strategies[0].legs[0].instrument = `${expiry} ${leg1.strike} ${leg1.type}`;
      strategies[0].legs[0].lots = leg1.lots;
      strategies[0].legs[0].avgPrice = leg1.entry;
      strategies[0].legs[0].ltp = leg1.ltp;
      strategies[0].legs[0].unbooked = pnl1;
      strategies[0].legs[0].pnl = pnl1;

      strategies[0].legs[1].instrument = `${expiry} ${leg2.strike} ${leg2.type}`;
      strategies[0].legs[1].lots = leg2.lots;
      strategies[0].legs[1].avgPrice = leg2.entry;
      strategies[0].legs[1].ltp = leg2.ltp;
      strategies[0].legs[1].unbooked = pnl2;
      strategies[0].legs[1].pnl = pnl2;

      strategies[0].legs[2].instrument = `${expiry} ${leg3.strike} ${leg3.type}`;
      strategies[0].legs[2].lots = leg3.lots;
      strategies[0].legs[2].avgPrice = leg3.entry;
      strategies[0].legs[2].ltp = leg3.ltp;
      strategies[0].legs[2].unbooked = pnl3;
      strategies[0].legs[2].pnl = pnl3;

      strategies[0].totalUnbooked = totalPnl;
      strategies[0].totalPnl = totalPnl;
      localStorage.setItem("liveipo_multileg_strategies", JSON.stringify(strategies));
    }
  } catch (err) {}

  closePublishBasketTradeModal();
  renderMultiStrikeTradeHistoryTable();
  alert(`✓ Trade #${nextTradeNo} (${strategyName} - 3 Strikes) Published LIVE successfully!\nTotal Basket P&L: ₹${totalPnl.toLocaleString("en-IN")}`);
}


// ========================================================
// LIVE OPTION CHAIN AUTO-STRIKE PICKER & REAL-TIME TICKS
// ========================================================

function getLiveOptionLtp(symbol, expiry, strike, type) {
  if (window.OCEngine && typeof window.OCEngine.getLiveLtp === "function") {
    return window.OCEngine.getLiveLtp(symbol, expiry, strike, type);
  }
  return 140.00;
}

function getStrikeRangeForIndex(symbol) {
  const sym = symbol || (window.OCEngine ? window.OCEngine.getActiveSymbol() : "NIFTY");
  const cfg = (window.OCEngine && window.OCEngine.catalog[sym]) ? window.OCEngine.catalog[sym] : { baseSpot: 25607.20, step: 50 };
  const spot = window.OCEngine ? window.OCEngine.getSpot(sym) : cfg.baseSpot;
  const step = cfg.step;
  const atm = Math.round(spot / step) * step;
  const strikes = [];
  for (let s = atm - (step * 10); s <= atm + (step * 10); s += step) {
    strikes.push(s);
  }
  return { spot, step, atm, strikes };
}

function populateStrikeDropdowns() {
  const symbol = window.OCEngine ? window.OCEngine.getActiveSymbol() : "NIFTY";
  const { spot } = getStrikeRangeForIndex(symbol);
  const spotDisp = document.getElementById("modalSpotDisplay");
  if (spotDisp) spotDisp.textContent = spot.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

function quickSelectStrikeIntoFirstAvailableLeg(strike) {
  // Cycle or pick Leg 1 by default, or the focused one
  const leg1Sel = document.getElementById("leg1Strike");
  if (leg1Sel) {
    leg1Sel.value = strike;
    updateLegAutoPrice(1);
    alert(`✓ Strike ${strike} applied to Leg 1 with Live Market LTP auto-filled!`);
  }
}

function onLegStrikeOrTypeChange(legNum) {
  updateLegAutoPrice(legNum);
}

function updateLegAutoPrice(legNum) {
  const symbol = document.getElementById("basketIndex") ? document.getElementById("basketIndex").value : "NIFTY";
  const expiry = document.getElementById("basketExpiry") ? document.getElementById("basketExpiry").value : "23-Nov-2026";
  const strikeEl = document.getElementById(`leg${legNum}Strike`);
  const typeEl = document.getElementById(`leg${legNum}Type`);
  const entryEl = document.getElementById(`leg${legNum}Entry`);
  const ltpEl = document.getElementById(`leg${legNum}LtpVal`);
  const badgeEl = document.getElementById(`leg${legNum}LiveBadge`);

  if (!strikeEl || !typeEl || !entryEl || !ltpEl) return;

  const strike = strikeEl.value;
  const type = typeEl.value;
  const liveLtp = getLiveOptionLtp(symbol, expiry, strike, type);

  // Auto-fill both Entry and Current LTP with the EXACT same live market price!
  entryEl.value = liveLtp.toFixed(2);
  ltpEl.value = liveLtp.toFixed(2);

  if (badgeEl) {
    badgeEl.textContent = `⚡ Live LTP Fetched: ₹${liveLtp.toFixed(2)} (Auto-filled)`;
    badgeEl.style.color = "#059669";
  }

  // Soft visual highlight
  entryEl.style.transition = "background-color 0.4s ease";
  entryEl.style.backgroundColor = "#dcfce7";
  setTimeout(() => {
    entryEl.style.backgroundColor = "#f0fdf4";
  }, 600);
}

function onBasketIndexOrExpiryChange() {
  populateStrikeDropdowns();
}

// ========================================================
// LIVE TICK ENGINE: FIXED ENTRY + LIVE UPDATING LTP & P&L
// ========================================================
function startLiveTradeTickEngine() {
  if (window._liveTradeTickTimer) return;
  window._liveTradeTickTimer = setInterval(() => {
    if (window.OCEngine && !window.OCEngine.isLiveActive()) return;
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
        const sym = trade.index || "NIFTY";
        trade.legs.forEach(leg => {
          // ENTRY PRICE IS NEVER CHANGED! IT STAYS 100% FIXED!
          if (window.OCEngine) {
            leg.ltp = window.OCEngine.getLiveLtp(sym, null, leg.strike, leg.type);
          }
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
  }, 1500);
}

// Start ticker on load
if (typeof window !== "undefined") {
  startLiveTradeTickEngine();
}


// ========================================================
// SENSIBULL OPTION CHAIN INTERACTIVE STRIKE PICKER
// ========================================================
let currentSensibullViewMode = "LTP"; // LTP, OI, GREEKS

function setSensibullViewMode(mode) {
  currentSensibullViewMode = mode;
  const bLtp = document.getElementById("btnToggleLtp");
  const bOi = document.getElementById("btnToggleOi");
  const bGrk = document.getElementById("btnToggleGreeks");

  if (bLtp) {
    bLtp.style.background = mode === "LTP" ? "#2563eb" : "#ffffff";
    bLtp.style.color = mode === "LTP" ? "#ffffff" : "#475569";
  }
  if (bOi) {
    bOi.style.background = mode === "OI" ? "#2563eb" : "#ffffff";
    bOi.style.color = mode === "OI" ? "#ffffff" : "#475569";
  }
  if (bGrk) {
    bGrk.style.background = mode === "GREEKS" ? "#2563eb" : "#ffffff";
    bGrk.style.color = mode === "GREEKS" ? "#ffffff" : "#475569";
  }

  renderSensibullOptionChainTable();
}

function onSensibullExpiryChange() {
  const expSel = document.getElementById("sensibullExpirySelect");
  const basketExp = document.getElementById("basketExpiry");
  if (expSel && basketExp) {
    basketExp.value = expSel.value;
  }
  renderSensibullOptionChainTable();
}

function renderSensibullOptionChainTable() {
  renderSensibullTableById("sensibullChainTableBody");
}

function isLegSelected(strike, type, action) {
  for (let i = 1; i <= 3; i++) {
    const sEl = document.getElementById(`leg${i}Strike`);
    const tEl = document.getElementById(`leg${i}Type`);
    const aEl = document.getElementById(`leg${i}Action`);
    if (sEl && tEl && aEl) {
      if (parseInt(sEl.value) === strike && tEl.value === type && aEl.value === action) {
        return true;
      }
    }
  }
  return false;
}

function isStrikeSelectedInLeg(legNum, strike) {
  const sEl = document.getElementById(`leg${legNum}Strike`);
  return sEl && parseInt(sEl.value) === strike;
}

// WHEN USER CLICKS [B] OR [S] ON ANY STRIKE:
function selectSensibullStrike(strike, type, action, ltp) {
  // Find which leg to fill:
  // First check if already selected in a leg, if so replace that leg
  let targetLeg = 0;
  for (let i = 1; i <= 3; i++) {
    const sEl = document.getElementById(`leg${i}Strike`);
    const tEl = document.getElementById(`leg${i}Type`);
    if (sEl && parseInt(sEl.value) === strike && tEl && tEl.value === type) {
      targetLeg = i;
      break;
    }
  }

  // If not already selected, find the first empty or default slot
  if (targetLeg === 0) {
    if (!document.getElementById("leg1Strike").dataset.userModified) {
      targetLeg = 1;
    } else if (!document.getElementById("leg2Strike").dataset.userModified) {
      targetLeg = 2;
    } else if (!document.getElementById("leg3Strike").dataset.userModified) {
      targetLeg = 3;
    } else {
      // If all 3 were chosen, cycle through 1 -> 2 -> 3
      window._lastTargetLeg = ((window._lastTargetLeg || 0) % 3) + 1;
      targetLeg = window._lastTargetLeg;
    }
  }

  // Auto-open modal if closed
  const modal = document.getElementById("publishBasketTradeModalOverlay");
  if (modal && !modal.classList.contains("active")) {
    if (typeof window.openPublishBasketTradeModal === "function") {
      window.openPublishBasketTradeModal();
    } else {
      modal.classList.add("active");
    }
  }

  // Populate Leg
  const sEl = document.getElementById(`leg${targetLeg}Strike`);
  const tEl = document.getElementById(`leg${targetLeg}Type`);
  const aEl = document.getElementById(`leg${targetLeg}Action`);
  const eEl = document.getElementById(`leg${targetLeg}Entry`);
  const lEl = document.getElementById(`leg${targetLeg}LtpVal`);
  const lotsEl = document.getElementById(`leg${targetLeg}Lots`);

  if (sEl) {
    sEl.value = strike;
    sEl.dataset.userModified = "true";
  }
  if (tEl) tEl.value = type;
  if (aEl) aEl.value = action;
  if (eEl) eEl.value = ltp.toFixed(2);
  if (lEl) lEl.value = ltp.toFixed(2);
  if (lotsEl && (!lotsEl.value || lotsEl.value == 0)) {
    lotsEl.value = targetLeg === 1 ? 6 : 2;
  }

  // Re-render table to show active button highlights
  renderSensibullOptionChainTable();

  // Highlight the selected leg card smoothly
  const card = document.getElementById(`legCard${targetLeg}`);
  if (card) {
    card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    card.style.transform = "scale(1.01)";
    card.style.boxShadow = "0 0 15px rgba(37,99,235,0.3)";
    setTimeout(() => {
      card.style.transform = "none";
      card.style.boxShadow = "none";
    }, 400);
  }
}

function clearLeg(legNum) {
  const sEl = document.getElementById(`leg${legNum}Strike`);
  const eEl = document.getElementById(`leg${legNum}Entry`);
  const lEl = document.getElementById(`leg${legNum}LtpVal`);
  if (sEl) {
    sEl.value = "";
    delete sEl.dataset.userModified;
  }
  if (eEl) eEl.value = "";
  if (lEl) lEl.value = "";
  renderSensibullOptionChainTable();
}

function clearSelectedBasketLegs() {
  clearLeg(1);
  clearLeg(2);
  clearLeg(3);
}

function onManualLegChange(legNum) {
  const sEl = document.getElementById(`leg${legNum}Strike`);
  const tEl = document.getElementById(`leg${legNum}Type`);
  const eEl = document.getElementById(`leg${legNum}Entry`);
  const lEl = document.getElementById(`leg${legNum}LtpVal`);
  const sym = (document.getElementById("basketIndex") && document.getElementById("basketIndex").value) || (window.OCEngine ? window.OCEngine.getActiveSymbol() : "NIFTY");
  const exp = (document.getElementById("basketExpiry") && document.getElementById("basketExpiry").value) || (window.OCEngine ? window.OCEngine.getActiveExpiry() : "2026-12-01");
  if (sEl && tEl && eEl && lEl && sEl.value) {
    const ltp = getLiveOptionLtp(sym, exp, parseFloat(sEl.value), tEl.value);
    eEl.value = ltp.toFixed(2);
    lEl.value = ltp.toFixed(2);
  }
  renderSensibullOptionChainTable();
}

// Hook into openPublishBasketTradeModal
window.openPublishBasketTradeModal = function() {
  const overlay = document.getElementById("publishBasketTradeModalOverlay");
  if (overlay) {
    overlay.classList.add("active");
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateInput = document.getElementById("basketTradeDate");
    if (dateInput) dateInput.value = `${dd}-${mm}-${yyyy}`;
    if (window.OCEngine) {
      const idxInput = document.getElementById("basketIndex");
      const expInput = document.getElementById("basketExpiry");
      if (idxInput) idxInput.value = window.OCEngine.getActiveSymbol();
      if (expInput) expInput.value = window.OCEngine.getActiveExpiry();
      window.OCEngine.renderAll();
    }
  }
};


// ========================================================
// DHANHQ REAL-TIME OPTION CHAIN & WORKER INTEGRATION (STRICTLY READ-ONLY)
// ========================================================
async function loadDhanConfig() {
  let cfg = {};
  try {
    const raw = localStorage.getItem("liveipo_dhan_config");
    if (raw) cfg = JSON.parse(raw) || {};
  } catch (e) {}

  const engineWorkerUrl = (window.OCEngine && typeof window.OCEngine.getWorkerUrl === "function")
    ? window.OCEngine.getWorkerUrl()
    : "";
  const effectiveUrl = (cfg.proxyUrl || engineWorkerUrl || "").trim();

  if (document.getElementById("dhanProxyUrlInput")) {
    document.getElementById("dhanProxyUrlInput").value = effectiveUrl;
  }
  if (document.getElementById("dhanWorkerAdminKeyInput")) {
    document.getElementById("dhanWorkerAdminKeyInput").value = cfg.workerAdminKey || "";
  }
  if (document.getElementById("dhanClientIdInput")) {
    document.getElementById("dhanClientIdInput").value = cfg.clientId || "";
  }
  if (document.getElementById("dhanAccessTokenInput")) {
    document.getElementById("dhanAccessTokenInput").value = cfg.accessToken || "";
  }

  if (effectiveUrl && window.OCEngine && typeof window.OCEngine.checkWorkerStatus === "function") {
    const status = await window.OCEngine.checkWorkerStatus(effectiveUrl);
    if (status && status.ok) {
      if (status.tokenValid) {
        updateDhanBadge(true, `🟢 Worker Ready (${status.storage.toUpperCase()}) • Token Active`);
      } else if (status.hasCredentials) {
        updateDhanBadge(false, "⚠️ Worker Token Expired • Paste New Token");
      } else {
        updateDhanBadge(false, "⚠️ Worker Online • Add Dhan Credentials");
      }
      return;
    }
  }

  if (cfg.clientId && cfg.accessToken) {
    const jwtCheck = (window.OCEngine && typeof window.OCEngine.inspectJwtExpiry === "function")
      ? window.OCEngine.inspectJwtExpiry(cfg.accessToken)
      : { valid: false, reason: "Unable to verify token" };
    if (!jwtCheck.valid) {
      updateDhanBadge(false, `⚠️ ${jwtCheck.reason}`);
    } else if (effectiveUrl) {
      updateDhanBadge(false, "Local Token Valid • Click Save & Connect");
    } else {
      updateDhanBadge(false, "Configure Cloudflare Worker URL");
    }
  } else {
    updateDhanBadge(false, "Configure Cloudflare Worker URL");
  }
}

function updateDhanBadge(isConnected, text) {
  const badge = document.getElementById("dhanConnectionBadge");
  const txt = document.getElementById("dhanStatusText");
  if (badge && txt) {
    txt.textContent = text;
    if (isConnected) {
      badge.style.background = "#dcfce7";
      badge.style.color = "#166534";
      badge.style.borderColor = "#86efac";
    } else {
      badge.style.background = "#fef3c7";
      badge.style.color = "#92400e";
      badge.style.borderColor = "#fcd34d";
    }
  }
}

async function saveAndTestDhanConnection() {
  const workerUrlEl = document.getElementById("dhanProxyUrlInput");
  const adminKeyEl = document.getElementById("dhanWorkerAdminKeyInput");
  const clientIdEl = document.getElementById("dhanClientIdInput");
  const accessTokenEl = document.getElementById("dhanAccessTokenInput");

  const workerUrl = workerUrlEl ? workerUrlEl.value.trim().replace(/\/+$/, "") : "";
  const workerAdminKey = adminKeyEl ? adminKeyEl.value.trim() : "";
  const clientId = clientIdEl ? clientIdEl.value.trim() : "";
  const accessToken = accessTokenEl ? accessTokenEl.value.trim() : "";

  if (!workerUrl) {
    alert("⚠️ કૃપા કરીને પહેલા તમારો Cloudflare Worker URL દાખલ કરો (ઉદા. https://liveipo-oc.yourname.workers.dev).");
    return;
  }

  const config = {
    clientId,
    accessToken,
    proxyUrl: workerUrl,
    workerAdminKey,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem("liveipo_dhan_config", JSON.stringify(config));
  if (window.OCEngine && typeof window.OCEngine.setWorkerUrl === "function") {
    window.OCEngine.setWorkerUrl(workerUrl);
  }

  updateDhanBadge(false, "Connecting Cloudflare Worker...");

  // Check if target is our upgraded Cloudflare Worker (/live/status)
  const workerStatus = (window.OCEngine && typeof window.OCEngine.checkWorkerStatus === "function")
    ? await window.OCEngine.checkWorkerStatus(workerUrl)
    : { ok: false };

  // If Admin entered fresh credentials + Admin Key, securely push them into Cloudflare Worker KV
  if (workerStatus.ok && workerAdminKey && clientId && accessToken) {
    try {
      const saveRes = await fetch(`${workerUrl}/live/admin-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": workerAdminKey
        },
        body: JSON.stringify({ clientId, accessToken })
      });
      const saveJson = await saveRes.json();
      if (!saveRes.ok) {
        updateDhanBadge(false, `⚠️ Worker Auth/KV: ${saveJson.reason || saveRes.status}`);
        alert(`⚠️ Cloudflare Worker માં ટોકન સેવ ન થયો:\n\n${saveJson.error || JSON.stringify(saveJson)}`);
        return;
      }
    } catch (err) {
      updateDhanBadge(false, "⚠️ Worker Save Failed");
      alert(`⚠️ Worker કનેક્શન એરર: ${err.message}`);
      return;
    }
  } else if (workerStatus.ok && !workerStatus.tokenValid && (!clientId || !accessToken || !workerAdminKey)) {
    updateDhanBadge(false, "⚠️ Worker Token Expired / Missing");
    alert("⚠️ Worker માં Dhan ટોકન સેટ નથી અથવા એક્સપાયર થઈ ગયો છે.\n\nકૃપા કરીને Dhan Client ID, આજનો 24h Access Token અને Worker Admin Key નાખીને ફરી ક્લિક કરો (અથવા Cloudflare Dashboard -> Variables માં અપડેટ કરો).");
    return;
  }

  updateDhanBadge(false, "Testing Live Dhan Option Chain Feed...");
  const activeSym = window.OCEngine ? window.OCEngine.getActiveSymbol() : "NIFTY";
  const activeExp = window.OCEngine ? window.OCEngine.getActiveExpiry() : "";
  const result = window.OCEngine
    ? await window.OCEngine.fetchDhanOptionChainReadOnly(activeSym, activeExp)
    : { ok: false, reason: "ENGINE_MISSING" };

  if (result.ok) {
    updateDhanBadge(true, "🟢 DhanHQ Worker Live (Read-Only)");
    window.OCEngine.renderAll();
    alert("✓ Cloudflare Worker + DhanHQ Live Option Chain Connected (Read-Only)!\n\nહવે Admin અને Frontend બંને પર અસલ લાઈવ માર્કેટ ડેટા ચાલશે.");
  } else if (result.reason === "RATE_LIMIT_COOLDOWN") {
    updateDhanBadge(true, "🟡 Worker Saved • Cooldown (15s)");
    alert("✓ તમારો Token Cloudflare Worker માં સુરક્ષિત રીતે સેવ થઈ ગયો છે!\n\nDhan સર્વર પર 3-સેકન્ડની રેટ-લિમિટ (805 Cooldown) ને કારણે 15 સેકન્ડ પછી આપોઆપ લાઈવ ડેટા અપડેટ થઈ જશે. ફરીથી તરત બટન દબાવવાની જરૂર નથી.");
  } else if (result.reason === "TOKEN_EXPIRED") {
    updateDhanBadge(false, "⚠️ Dhan Token Expired (24h)");
    const expStr = result.expDate ? result.expDate.toLocaleString("en-IN") : "24h limit";
    alert(`⚠️ તમારો Dhan Access Token એક્સપાયર થઈ ગયો છે (${expStr}).\n\nધન પોર્ટલમાંથી આજનો નવો Access Token કોપી કરીને અહીં પેસ્ટ કરો.`);
  } else if (result.reason === "CORS_BLOCKED") {
    updateDhanBadge(false, "📡 CORS Proxy Required");
    alert("⚠️ બ્રાઉઝર CORS બ્લોક થયું છે. કૃપા કરીને માન્ય Cloudflare Worker URL ચકાસો.");
  } else {
    updateDhanBadge(false, `⚠️ Dhan Error: ${result.reason}`);
    alert(`⚠️ Dhan API Error: ${result.detail || result.reason}`);
  }
}

async function renewDhanTokenViaWorker() {
  const workerUrlEl = document.getElementById("dhanProxyUrlInput");
  const adminKeyEl = document.getElementById("dhanWorkerAdminKeyInput");
  const workerUrl = (workerUrlEl ? workerUrlEl.value.trim() : "").replace(/\/+$/, "")
    || (window.OCEngine && window.OCEngine.getWorkerUrl ? window.OCEngine.getWorkerUrl() : "");
  const workerAdminKey = adminKeyEl ? adminKeyEl.value.trim() : "";

  if (!workerUrl || !workerAdminKey) {
    alert("⚠️ Auto-Renew માટે Cloudflare Worker URL અને Worker Admin Key બંને જરૂરી છે.");
    return;
  }

  try {
    updateDhanBadge(false, "Renewing Dhan Token (+24h)...");
    const res = await fetch(`${workerUrl}/live/renew-now`, {
      method: "POST",
      headers: { "x-admin-key": workerAdminKey }
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      updateDhanBadge(true, "🟢 Token Renewed (+24h)");
      alert(`✓ Dhan Access Token સફળતાપૂર્વક 24 કલાક માટે રિન્યુ થઈ ગયો!\nExpiry: ${json.expiryTime || "Extended +24h"}`);
    } else {
      updateDhanBadge(false, `⚠️ Renew Failed: ${json.reason || res.status}`);
      alert(`⚠️ ટોકન રિન્યુ ન થઈ શક્યો:\n${json.message || JSON.stringify(json)}\n\n(નોંધ: જો જૂનો ટોકન પહેલેથી જ એક્સપાયર થઈ ગયો હોય, તો Dhan પોર્ટલમાંથી એકવાર નવો ટોકન કોપી કરીને સેવ કરવો પડે છે).`);
    }
  } catch (err) {
    updateDhanBadge(false, "⚠️ Worker Unreachable");
    alert(`⚠️ Worker કનેક્શન એરર: ${err.message}`);
  }
}

// Call on admin load
if (typeof window !== "undefined") {
  setTimeout(loadDhanConfig, 300);
}

// ========================================================
// UNIFIED OPTION CHAIN DELEGATES (POWERED BY option-chain-engine.js)
// ========================================================
function switchPureSensibullExpiry(exp) {
  if (window.OCEngine) window.OCEngine.selectExpiry(exp);
}

function renderAllSensibullChains() {
  if (window.OCEngine) window.OCEngine.renderAll();
}

function renderSensibullTableById() {
  if (window.OCEngine) window.OCEngine.renderAll();
}
