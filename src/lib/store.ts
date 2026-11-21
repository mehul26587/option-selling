"use client";

import { User, Plan, Subscription, Trade, PaymentRecord, SupportTicket, NotificationItem } from "./types";

// Initial Demo Plans (Exactly matching user prompt)
export const initialPlans: Plan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    price: 999,
    validityDays: 30,
    description: "Ideal for beginners starting with options selling strategies.",
    features: [
      "Access to Daily NIFTY Trades",
      "End-of-day Trade Log & P&L",
      "Standard Telegram / WhatsApp Alerts",
      "Email & Ticket Support",
      "30 Days Full Access",
    ],
    isPopular: false,
    status: "active",
  },
  {
    id: "plan-silver",
    name: "Silver",
    price: 2499,
    validityDays: 90,
    description: "Quarterly package with multi-index trades and strategy breakdown.",
    features: [
      "NIFTY & BANKNIFTY Trades",
      "Iron Condor & Strangle Setups",
      "Live Adjustment Guidelines",
      "Quarterly Performance Report",
      "Priority WhatsApp Support",
      "90 Days Validity (Save ₹500)",
    ],
    isPopular: false,
    status: "active",
  },
  {
    id: "plan-gold",
    name: "Gold",
    price: 4499,
    validityDays: 180,
    description: "Half-yearly pro package for consistent delta & theta sellers.",
    features: [
      "All Indices (NIFTY, BANKNIFTY, FINNIFTY)",
      "Weekly & Monthly Iron Fly Setups",
      "CSV & Excel Historical Trade Downloads",
      "Hedging & Risk Management Guidelines",
      "1-on-1 Portfolio Sizing Guidance",
      "180 Days Validity (Save ₹1,500)",
    ],
    isPopular: false,
    status: "active",
  },
  {
    id: "plan-premium",
    name: "Premium",
    price: 7999,
    validityDays: 365,
    description: "The complete institutional options selling management suite for 1 year.",
    features: [
      "All Trades Across All Expiries (Unlimited)",
      "Full Historical Trade Database (PDF/Excel)",
      "Real-time Entry, Exit & Adjustment Alerts",
      "Direct Admin Desk Access",
      "Brokerage & Tax Optimization Calculator",
      "Custom Strategy Request Consultations",
      "365 Days Validity (Best Value)",
    ],
    isPopular: true,
    status: "active",
  },
];

// Initial Demo Trades (including sample trade from prompt: 18 Nov 2026, NIFTY Iron Condor, +4125)
export const initialTrades: Trade[] = [
  {
    id: "TRD-1001",
    date: "2026-11-18",
    symbol: "NIFTY",
    strategy: "Iron Condor",
    entryTime: "09:30 AM",
    exitTime: "02:45 PM",
    entryPremium: 150,
    exitPremium: 95,
    quantity: 75,
    pnl: 4125,
    status: "CLOSED",
    notes: "Perfect range-bound expiry. Decay captured nicely across 24400-24800.",
    charges: 180,
  },
  {
    id: "TRD-1002",
    date: "2026-11-17",
    symbol: "BANKNIFTY",
    strategy: "Short Strangle",
    entryTime: "09:20 AM",
    exitTime: "03:15 PM",
    entryPremium: 320,
    exitPremium: 210,
    quantity: 60,
    pnl: 6600,
    status: "CLOSED",
    notes: "51500 CE & 50500 PE. Volatility crush post RBI commentary.",
    charges: 240,
  },
  {
    id: "TRD-1003",
    date: "2026-11-14",
    symbol: "FINNIFTY",
    strategy: "Bull Put Spread",
    entryTime: "09:45 AM",
    exitTime: "01:30 PM",
    entryPremium: 85,
    exitPremium: 30,
    quantity: 100,
    pnl: 5500,
    status: "CLOSED",
    notes: "Financial index showed strong baseline support at 23800.",
    charges: 150,
  },
  {
    id: "TRD-1004",
    date: "2026-11-12",
    symbol: "NIFTY",
    strategy: "Bear Call Spread",
    entryTime: "10:15 AM",
    exitTime: "02:20 PM",
    entryPremium: 72,
    exitPremium: 98,
    quantity: 75,
    pnl: -1950,
    status: "CLOSED",
    notes: "Gap up momentum tested call side; disciplined SL triggered as per risk rule.",
    charges: 160,
  },
  {
    id: "TRD-1005",
    date: "2026-11-10",
    symbol: "BANKNIFTY",
    strategy: "Iron Fly",
    entryTime: "09:25 AM",
    exitTime: "03:00 PM",
    entryPremium: 480,
    exitPremium: 340,
    quantity: 45,
    pnl: 6300,
    status: "CLOSED",
    notes: "Weekly expiry straddle sold with OTM wings. Theta melted smoothly.",
    charges: 210,
  },
  {
    id: "TRD-1006",
    date: "2026-11-06",
    symbol: "NIFTY",
    strategy: "Short Straddle",
    entryTime: "09:30 AM",
    exitTime: "02:50 PM",
    entryPremium: 210,
    exitPremium: 135,
    quantity: 75,
    pnl: 5625,
    status: "CLOSED",
    notes: "Delta neutral adjustment done at 12:15 PM.",
    charges: 190,
  },
  {
    id: "TRD-1007",
    date: "2026-11-03",
    symbol: "SENSEX",
    strategy: "Iron Condor",
    entryTime: "09:35 AM",
    exitTime: "02:40 PM",
    entryPremium: 240,
    exitPremium: 150,
    quantity: 40,
    pnl: 3600,
    status: "CLOSED",
    notes: "SENSEX Friday expiry play.",
    charges: 175,
  },
  {
    id: "TRD-1008",
    date: "2026-11-18",
    symbol: "BANKNIFTY",
    strategy: "Short Strangle",
    entryTime: "09:30 AM",
    exitTime: "OPEN",
    entryPremium: 280,
    exitPremium: 220,
    quantity: 60,
    pnl: 3600,
    status: "OPEN",
    notes: "Live intraday running trade. Target 50% decay.",
    charges: 120,
  },
];

// Initial Demo Users
export const initialUsers: User[] = [
  {
    id: "usr-admin",
    name: "Mehul (Admin)",
    email: "admin@liveipo.com",
    phone: "+91 98765 43210",
    role: "admin",
    status: "active",
    createdAt: "2026-01-01",
  },
  {
    id: "usr-user1",
    name: "Ramesh Patel",
    email: "user@liveipo.com",
    phone: "+91 98250 11223",
    role: "user",
    status: "active",
    createdAt: "2026-06-15",
  },
  {
    id: "usr-user2",
    name: "Jignesh Shah",
    email: "jignesh@gmail.com",
    phone: "+91 94260 55443",
    role: "user",
    status: "active",
    createdAt: "2026-08-10",
  },
  {
    id: "usr-user3",
    name: "Pooja Mehta",
    email: "pooja@outlook.com",
    phone: "+91 99090 77889",
    role: "user",
    status: "active",
    createdAt: "2026-09-01",
  },
];

// Initial Demo Subscriptions (User Ramesh Patel has Premium Plan expiring 30 Dec 2026, 42 days remaining)
export const initialSubscriptions: Subscription[] = [
  {
    id: "SUB-801",
    userId: "usr-user1",
    userName: "Ramesh Patel",
    userEmail: "user@liveipo.com",
    planId: "plan-premium",
    planName: "Premium",
    startDate: "2026-01-01",
    expiryDate: "2026-12-30",
    daysRemaining: 42,
    status: "active",
    amountPaid: 7999,
    paymentId: "pay_Rzp1098471928",
    autoRenew: true,
  },
  {
    id: "SUB-802",
    userId: "usr-user2",
    userName: "Jignesh Shah",
    userEmail: "jignesh@gmail.com",
    planId: "plan-silver",
    planName: "Silver",
    startDate: "2026-09-01",
    expiryDate: "2026-11-30",
    daysRemaining: 12,
    status: "expiring_soon",
    amountPaid: 2499,
    paymentId: "pay_Rzp9928172635",
    autoRenew: false,
  },
  {
    id: "SUB-803",
    userId: "usr-user3",
    userName: "Pooja Mehta",
    userEmail: "pooja@outlook.com",
    planId: "plan-basic",
    planName: "Basic",
    startDate: "2026-10-01",
    expiryDate: "2026-10-31",
    daysRemaining: 0,
    status: "expired",
    amountPaid: 999,
    paymentId: "pay_Rzp8837192019",
    autoRenew: false,
  },
];

// Initial Payments
export const initialPayments: PaymentRecord[] = [
  {
    id: "PAY-501",
    userId: "usr-user1",
    userName: "Ramesh Patel",
    userEmail: "user@liveipo.com",
    planId: "plan-premium",
    planName: "Premium Plan (365 Days)",
    amount: 7999,
    paymentMethod: "Razorpay (UPI)",
    razorpayPaymentId: "pay_Rzp1098471928",
    status: "SUCCESS",
    date: "2026-01-01 10:15 AM",
  },
  {
    id: "PAY-502",
    userId: "usr-user2",
    userName: "Jignesh Shah",
    userEmail: "jignesh@gmail.com",
    planId: "plan-silver",
    planName: "Silver Plan (90 Days)",
    amount: 2499,
    paymentMethod: "Razorpay (Card)",
    razorpayPaymentId: "pay_Rzp9928172635",
    status: "SUCCESS",
    date: "2026-09-01 02:40 PM",
  },
  {
    id: "PAY-503",
    userId: "usr-user3",
    userName: "Pooja Mehta",
    userEmail: "pooja@outlook.com",
    planId: "plan-basic",
    planName: "Basic Plan (30 Days)",
    amount: 999,
    paymentMethod: "Razorpay (NetBanking)",
    razorpayPaymentId: "pay_Rzp8837192019",
    status: "SUCCESS",
    date: "2026-10-01 11:05 AM",
  },
];

// Initial Support Tickets
export const initialTickets: SupportTicket[] = [
  {
    id: "TCK-101",
    userId: "usr-user1",
    userName: "Ramesh Patel",
    userEmail: "user@liveipo.com",
    subject: "Trade report download in PDF query",
    message: "Hi, I wanted to confirm if the trade records include gross P&L or net of brokerage?",
    category: "Trade History",
    status: "RESOLVED",
    priority: "MEDIUM",
    createdAt: "2026-11-15 11:30 AM",
    adminReply: "Hello Ramesh, both Gross P&L and Estimated Net P&L after statutory charges are available in your Excel/PDF export.",
  },
  {
    id: "TCK-102",
    userId: "usr-user2",
    userName: "Jignesh Shah",
    userEmail: "jignesh@gmail.com",
    subject: "Need renewal invoice for GST credit",
    message: "Can you provide the GST tax invoice for my upcoming Silver plan renewal?",
    category: "Billing",
    status: "OPEN",
    priority: "HIGH",
    createdAt: "2026-11-17 04:15 PM",
  },
];

// Helper to get or set local storage in browser
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`liveipo_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Storage error:", e);
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`liveipo_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}
