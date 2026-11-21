"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Receipt, CheckCircle, Search, Download } from "lucide-react";

export default function AdminPaymentsPage() {
  const { payments } = useApp();
  const [search, setSearch] = useState("");

  const filtered = payments.filter(
    (p) =>
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.razorpayPaymentId.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Payment & Transaction Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete gateway records verified through Razorpay Webhook.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Revenue Collected</div>
          <div className="text-2xl font-black text-emerald-400">₹{totalCollected.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Razorpay ID, Subscriber, or Email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Subscriber</th>
                <th className="py-3 px-3">Plan Subscribed</th>
                <th className="py-3 px-3">Razorpay ID</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3 text-slate-400 font-mono">{p.date}</td>
                  <td className="py-3.5 px-3 font-semibold text-white">
                    {p.userName}
                    <div className="text-[11px] text-slate-400 font-normal">{p.userEmail}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 font-medium">{p.planName}</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold">{p.razorpayPaymentId}</td>
                  <td className="py-3.5 px-3 text-slate-300">{p.paymentMethod}</td>
                  <td className="py-3.5 px-3 font-bold text-white">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      <CheckCircle className="w-3 h-3" />
                      {p.status}
                    </span>
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
