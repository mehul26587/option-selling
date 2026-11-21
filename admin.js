/**
 * LiveIPO Option Selling Admin Panel Script (admin.js)
 * Standalone client-side admin controller with persistent localStorage backing.
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
    if (raw) return JSON.parse(raw);
  } catch (e) {}
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
  if (!tbody) return;

  const now = new Date();

  tbody.innerHTML = users.map(u => {
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
  if (overlay) overlay.classList.add("active");
}

function closeExtendModal() {
  const overlay = document.getElementById("extendExpiryModalOverlay");
  if (overlay) overlay.classList.remove("active");
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
  if (!tbody) return;

  tbody.innerHTML = trades.map(t => {
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
        <td style="font-weight: 700; color: ${isProfit ? '#10b981' : '#ef4444'}">
          ${isProfit ? '+' : ''}₹${(t.pnl || 0).toLocaleString("en-IN")}
        </td>
        <td><span style="font-weight: 700; font-size: 11.5px;">${t.status}</span></td>
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

// Switch Admin Section
function switchAdminTab(tabKey) {
  currentAdminTab = tabKey;
  document.querySelectorAll(".admin-nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("data-tab") === tabKey);
  });

  document.querySelectorAll(".admin-tab-section").forEach(sec => {
    sec.style.display = sec.id === `adminTab-${tabKey}` ? "block" : "none";
  });
}

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  refreshAdminDashboard();
});
