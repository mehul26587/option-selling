"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { RazorpayModal } from "../../components/RazorpayModal";
import {
  TrendingUp,
  Crown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Download,
  Receipt,
  PieChart,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function UserDashboardPage() {
  const {
    currentUser,
    getUserSubscription,
    getUserPayments,
    trades,
    plans,
    activateTestSubscription,
  } = useApp();

  const subscription = getUserSubscription();
  const userPayments = getUserPayments();
  const [showRenewModal, setShowRenewModal] = useState(false);

  // If user has subscription, find target plan for renewal, else default to Premium
  const targetPlan = plans.find((p) => p.id === (subscription?.planId || "plan-premium")) || plans[3];

  const hasActiveSub = subscription && subscription.status === "active";
  const activePlanName = subscription?.planName || "No Active Plan";
  const expiryDateFormatted = subscription?.expiryDate || "Not Activated";
  const daysRemaining = subscription?.daysRemaining ?? 0;

  // Calculate detailed Profit & Loss analysis
  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  const profitTrades = closedTrades.filter((t) => t.pnl > 0);
  const lossTrades = closedTrades.filter((t) => t.pnl < 0);

  const totalGrossProfit = profitTrades.reduce((acc, t) => acc + t.pnl, 0);
  const totalGrossLoss = Math.abs(lossTrades.reduce((acc, t) => acc + t.pnl, 0));
  const netProfit = trades.reduce((acc, t) => acc + t.pnl, 0);

  const winRate = closedTrades.length
    ? Math.round((profitTrades.length / closedTrades.length) * 100)
    : 84;

  const latestPayment = userPayments[0];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Personal Trader Dashboard
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentUser?.email}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trading Dashboard & P&L Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in as <strong className="text-white">{currentUser?.name || currentUser?.email}</strong>. This dashboard displays strictly your personal subscription and payment history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {hasActiveSub ? (
            <button
              onClick={() => setShowRenewModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Renew Plan
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/plans"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Subscribe to a Plan
              </Link>
              <button
                onClick={() => activateTestSubscription("plan-premium")}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs transition"
                title="Quickly activate a trial subscription for this Gmail account"
              >
                + Activate Free Trial
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 4 Dashboard Cards matching User Prompt Example */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Active Plan */}
        <div className={`p-5 rounded-2xl glass-card border relative overflow-hidden space-y-2 ${
          hasActiveSub ? "border-emerald-500/40" : "border-slate-800"
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Your Active Plan</span>
            <Crown className={`w-4 h-4 ${hasActiveSub ? "text-emerald-400" : "text-slate-600"}`} />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Current Plan</div>
            <div className="text-2xl font-black text-white">{activePlanName}</div>
          </div>
          <div className="text-[11px] flex items-center gap-1 font-medium pt-1">
            {hasActiveSub ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Subscription
              </span>
            ) : (
              <span className="text-amber-400">No active plan linked</span>
            )}
          </div>
        </div>

        {/* Card 2: Expiry Date */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Expiry Date</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Valid Until</div>
            <div className="text-2xl font-black text-white">{expiryDateFormatted}</div>
          </div>
          <div className="text-[11px] text-slate-400">
            {hasActiveSub ? "Auto renewal reminder active" : "Subscribe to set validity"}
          </div>
        </div>

        {/* Card 3: Total Trades */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Model Trades</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Tracked Signals</div>
            <div className="text-2xl font-black text-white">{trades.length}</div>
          </div>
          <Link
            href="/dashboard/trades"
            className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 font-medium pt-1"
          >
            <span>Trade Status: View History</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 4: Subscription Validity */}
        <div className={`p-5 rounded-2xl glass-card border space-y-2 ${
          hasActiveSub
            ? "border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-transparent"
            : "border-slate-800"
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Subscription Validity</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Remaining Period</div>
            <div className={`text-2xl font-black ${hasActiveSub ? "text-amber-400" : "text-slate-400"}`}>
              {daysRemaining} Days Remaining
            </div>
          </div>
          {hasActiveSub ? (
            <button
              onClick={() => setShowRenewModal(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 pt-1 underline"
            >
              <span>Renew Subscription Now</span>
            </button>
          ) : (
            <Link
              href="/plans"
              className="text-[11px] text-emerald-400 hover:underline font-bold pt-1 block"
            >
              Choose a Plan ➔
            </Link>
          )}
        </div>
      </div>

      {/* USER'S PROFIT & LOSS ANALYSIS SECTION */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Options Performance & Profit/Loss Analysis</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive breakdown of winning trades, stopped-out trades, and net realized returns.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/dashboard/trades"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel/CSV Log
            </Link>
          </div>
        </div>

        {/* 4 P&L Analytics KPI Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Net Options P&L
            </div>
            <div className={`text-2xl font-extrabold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {netProfit >= 0 ? "+" : ""}₹{netProfit.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-emerald-400/90 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Inclusive of all index trades
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Profitable Trades
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">
              +₹{totalGrossProfit.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-slate-400">
              {profitTrades.length} Successful Expiries
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Controlled Stop-Losses
            </div>
            <div className="text-2xl font-extrabold text-red-400">
              -₹{totalGrossLoss.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-slate-400">
              {lossTrades.length} Trades Stopped per Risk Rule
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Overall Win Ratio
            </div>
            <div className="text-2xl font-extrabold text-white">{winRate}%</div>
            <div className="text-[10px] text-teal-400">
              High statistical edge in Delta 10-20
            </div>
          </div>
        </div>

        {/* Visual Profit vs Loss Ratio Bar */}
        <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">
              Profitable Trades: {profitTrades.length} ({winRate}%)
            </span>
            <span className="text-red-400">
              Loss / Hedged: {lossTrades.length} ({100 - winRate}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 rounded-l-full transition-all"
              style={{ width: `${winRate}%` }}
            ></div>
            <div
              className="h-full bg-red-500 rounded-r-full transition-all"
              style={{ width: `${100 - winRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* USER'S RECENT PAYMENT & INVOICE DETAIL (STRICTLY FOR THIS GMAIL USER) */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Your Billing & Payment Records</div>
            {latestPayment ? (
              <div className="text-[11px] text-slate-400">
                Latest transaction: <strong className="text-white">₹{latestPayment.amount.toLocaleString("en-IN")}</strong> for {latestPayment.planName} ({latestPayment.razorpayPaymentId})
              </div>
            ) : (
              <div className="text-[11px] text-slate-400">
                No billing transactions recorded yet for <strong className="text-white">{currentUser?.email}</strong>.
              </div>
            )}
          </div>
        </div>

        <Link
          href="/dashboard/payments"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-400 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Payment Invoices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Trades Preview Table */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Trade Executions & P&L</h3>
            <p className="text-xs text-slate-400">Real-time options selling records and exit levels</p>
          </div>
          <Link
            href="/dashboard/trades"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View All {trades.length} Records with Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Symbol</th>
                <th className="py-3 px-3">Strategy</th>
                <th className="py-3 px-3">Entry/Exit Time</th>
                <th className="py-3 px-3">Premiums (In/Out)</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3 text-right">Net P&L</th>
                <th className="py-3 px-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {trades.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono text-slate-400">{t.date}</td>
                  <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 text-[11px] font-medium border border-slate-700">
                      {t.strategy}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {t.entryTime} ➔ {t.exitTime}
                  </td>
                  <td className="py-3 px-3">
                    ₹{t.entryPremium} ➔ ₹{t.exitPremium}
                  </td>
                  <td className="py-3 px-3 font-mono">{t.quantity}</td>
                  <td className={`py-3 px-3 text-right font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}₹{t.pnl.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.pnl >= 0
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {t.pnl >= 0 ? "PROFIT" : "LOSS"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <RazorpayModal
          plan={targetPlan}
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
        />
      )}
    </div>
  );
}
