export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "active" | "blocked";
  createdAt: string;
  avatar?: string;
  provider?: "google" | "credentials";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  status: "active" | "inactive";
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: "active" | "expired" | "expiring_soon";
  amountPaid: number;
  paymentId: string;
  autoRenew: boolean;
}

export interface Trade {
  id: string;
  date: string;
  symbol: "NIFTY" | "BANKNIFTY" | "FINNIFTY" | "SENSEX" | string;
  strategy: "Iron Condor" | "Short Strangle" | "Short Straddle" | "Bull Put Spread" | "Bear Call Spread" | "Iron Fly" | string;
  entryTime: string;
  exitTime: string;
  entryPremium: number;
  exitPremium: number;
  quantity: number;
  pnl: number;
  status: "OPEN" | "CLOSED";
  notes?: string;
  charges?: number;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: "Razorpay (UPI)" | "Razorpay (Card)" | "Razorpay (NetBanking)";
  razorpayPaymentId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  date: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  category: "Billing" | "Trade History" | "Subscription" | "Technical" | "General";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
  adminReply?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  date: string;
  target: "all" | "active_subscribers" | "expired_subscribers";
}
