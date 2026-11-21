"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Crown, Calendar, CheckCircle2, AlertTriangle, Clock, RefreshCw, Search } from "lucide-react";

export default function AdminSubscriptionsPage() {
  const { subscriptions, extendSubscription } = useApp();
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  const [search, setSearch] = useState("");

  const filtered = subscriptions.filter((sub) => {
    if (filter === "ACTIVE" && sub.status !== "active") return false;
    if (filter === "EXPIRED" && sub.status === "active") return false;
    if (search && !sub.userName.toLowerCase().includes(search.toLowerCase()) && !sub.userEmail.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscription & Renewal Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor active, expiring, and lapsed subscriber accounts with instant renewal controls.
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "ALL" ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-400"
              }`}
            >
              All Subscriptions ({subscriptions.length})
            </button>
            <button
              onClick={() => setFilter("ACTIVE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "ACTIVE" ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400"
              }`}
            >
              Active ({subscriptions.filter((s) => s.status === "active").length})
            </button>
            <button
              onClick={() => setFilter("EXPIRED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                filter === "EXPIRED" ? "bg-red-600 text-white" : "bg-slate-900 text-slate-400"
              }`}
            >
              Expired / Due ({subscriptions.filter((s) => s.status !== "active").length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscriber name or email..."
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Subscriber</th>
                <th className="py-3 px-3">Subscribed Plan</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Days Remaining</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Quick Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white text-sm">{s.userName}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{s.userEmail}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-400">{s.planName}</td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono">{s.startDate}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-white">{s.expiryDate}</td>
                  <td className="py-3.5 px-3 font-bold text-amber-400">{s.daysRemaining} Days</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => {
                        extendSubscription(s.userId, 30);
                        alert(`Renewed +30 days for ${s.userName}!`);
                      }}
                      className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> +30 Days Renewal
                    </button>
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
