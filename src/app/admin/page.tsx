"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import {
  Users,
  Crown,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { users, subscriptions, payments, trades, tickets } = useApp();

  const totalUsers = users.length;
  const activeSubs = subscriptions.filter((s) => s.status === "active").length;
  const totalRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((acc, p) => acc + p.amount, 0);
  const totalTrades = trades.length;
  const totalTradePnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const openTicketsCount = tickets.filter((t) => t.status === "OPEN").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Management Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete operational metrics, user subscriptions, and trade journal status.
        </p>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/trades"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add / Import Trades
        </Link>
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Extend User Expiry Date
        </Link>
        <Link
          href="/admin/plans"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition"
        >
          Manage Plans
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Razorpay Revenue</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400">From {payments.length} verified transactions</div>
        </div>

        {/* Active Subscriptions */}
        <div className="p-5 rounded-2xl glass-card border border-purple-500/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Subscriptions</span>
            <Crown className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {activeSubs} / {subscriptions.length}
          </div>
          <div className="text-[11px] text-purple-300">Live active access granted</div>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalUsers}</div>
          <div className="text-[11px] text-slate-400">Includes active & demo accounts</div>
        </div>

        {/* Total Trades Tracked */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Model Trades</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalTrades}</div>
          <div className="text-[11px] text-slate-400">Iron Condor, Strangles & Flies</div>
        </div>

        {/* Cumulative Trade Model P&L */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cumulative Strategy P&L</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-3xl font-extrabold ${totalTradePnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalTradePnL >= 0 ? "+" : ""}₹{totalTradePnL.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400">Gross model results</div>
        </div>

        {/* Pending Tickets */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Support Tickets Open</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{openTicketsCount}</div>
          <div className="text-[11px] text-slate-400">Requires desk resolution</div>
        </div>
      </div>

      {/* Active Subscriptions Summary Table */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Active Subscriber Overview</h3>
            <p className="text-xs text-slate-400">Current validity and expiration tracker</p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>Manage All Users & Expiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Subscriber</th>
                <th className="py-3 px-3">Plan</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Days Left</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-semibold text-white">
                    {sub.userName}
                    <div className="text-[11px] text-slate-400 font-normal">{sub.userEmail}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{sub.planName}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">{sub.startDate}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-white">{sub.expiryDate}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{sub.daysRemaining} Days</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sub.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : sub.status === "expiring_soon"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {sub.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/users"
                      className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-semibold"
                    >
                      Extend Days
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
