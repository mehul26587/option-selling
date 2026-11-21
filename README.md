# LiveIPO - Options Selling Management & Subscription Portal

A full-fledged, institutional-grade Options Selling Management Portal built with **Next.js (React 18)**, **Tailwind CSS**, and **TypeScript**. Designed for systematic index options sellers (NIFTY, BANKNIFTY, FINNIFTY, SENSEX) and their paying subscribers.

---

## 🌟 Two Separate & Distinct Portals

### 1. User / Client Frontend Portal (With Google Sign-In)
- **Google Authentication ("Sign in with Google")**: 
  - One-click Google Login popup selector with official Google Identity styling.
  - Automatically activates and links the user's trading profile.
- **Personal Trading Dashboard & P&L Analysis (`/dashboard`)**:
  - **Profit & Loss Analytics**: Real-time breakdown of Net Realized P&L, Winning Trades (Profits), Controlled Stop-Losses (Losses), and Visual Win-Ratio Bar.
  - **Active Plan**: Displays Current Plan (`Premium`), Expiry Date (`30 Dec 2026`), Total Trades (`45`), and Subscription Validity (`42 Days Remaining`).
  - **One-Click Renewal**: Instant extension via Razorpay modal.
- **My Subscription (`/dashboard/subscription`)**: Complete validity breakdown and plan privileges.
- **Trade History Module (`/dashboard/trades`)**:
  - Sample trade records (e.g., `18 Nov 2026 | NIFTY Iron Condor | +₹4,125 net P&L`).
  - Advanced filters: Date Wise, Symbol Wise, Strategy Wise, Profit/Loss Wise, Open/Closed Trades.
  - **Download Excel / CSV** button.
  - **Print / PDF export** option.
- **Payment Details & Invoices (`/dashboard/payments`)**: Razorpay payment reference IDs and downloadable receipts.
- **Support Tickets (`/dashboard/support`)**: Helpdesk to raise tickets and view admin replies.

---

### 2. Dedicated Admin Control Suite (With User ID & Password)
- **Secure Admin Login Gateway (`/admin/login`)**:
  - Completely separate from the subscriber login.
  - Protected with Admin User ID & Password.
  - Any unauthorized access to `/admin` is locked behind the Admin Security Gate.
  - **Default Administrator Credentials**:
    - **User ID:** `admin` (or `admin@liveipo.com`)
    - **Password:** `Admin@123`
- **Admin Dashboard (`/admin`)**: Total revenue collected, active subscriber count, cumulative model P&L, open tickets.
- **User Management (`/admin/users`)**: 
  - List registered users.
  - Block / Unblock accounts.
  - **Special Feature: Manual Expiry Date Extension** (+7, +15, +30 days, or custom calendar date picker).
- **Trade Management (`/admin/trades`)**:
  - Manual trade entry with auto P&L calculation.
  - Edit & delete existing trades.
  - **Bulk CSV / Excel Trade Upload** (paste CSV data with instant parsing).
- **Plan Management (`/admin/plans`)**: Create, edit, and toggle subscription pricing.
- **Subscription Tracker (`/admin/subscriptions`)**: Track active, expiring, and expired accounts with one-click +30 days renewal.
- **Payment Records (`/admin/payments`)**: Complete payment ledger with Razorpay transaction IDs.
- **Reports (`/admin/reports`)**: Strategy-wise win-rate and net profit analysis.
- **Broadcast Notifications (`/admin/notifications`)**: Trigger WhatsApp, SMS, or Email alerts.
- **Support Desk (`/admin/support`)**: Reply to subscriber queries.
- **Portal Settings (`/admin/settings`)**: Configure Razorpay keys and legal SEBI disclaimer text.

---

## 🚀 How to Run the Project Locally

```bash
cd "D:\LiveIPO Option Selling Payment"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Access Details
- **User Frontend & Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Click "Sign in with Google")
- **Admin Security Portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - User ID: `admin`
  - Password: `Admin@123`
