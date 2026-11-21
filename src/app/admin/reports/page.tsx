"use client";

import React from "react";
import { useApp } from "../../../context/AppContext";
import { BarChart2, TrendingUp, ArrowUpRight, DollarSign, Award, Download } from "lucide-react";

export default function AdminReportsPage() {
  const { trades, payments, subscriptions } = useApp();

  const totalTrades = trades.length;
  const profitableTrades = trades.filter((t) => t.pnl > 0);
  const winRate = totalTrades ? Math.round((profitableTrades.length / totalTrades) * 100) : 0;
  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);

  // Strategy breakdown
  const strategies = ["Iron Condor", "Short Strangle", "Short Straddle", "Bull Put Spread", "Iron Fly"];
  const strategyStats = strategies.map((s) => {
    const matched = trades.filter((t) => t.strategy === s);
    const pnlSum = matched.reduce((acc, t) => acc + t.pnl, 0);
    const wins = matched.filter((t) => t.pnl > 0).length;
    return {
      strategy: s,
      count: matched.length,
      pnl: pnlSum,
      winRate: matched.length ? Math.round((wins / matched.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Financial & Trading Reports</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed performance breakdown across index options strategies and subscription revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Overall Strategy Win Ratio</div>
          <div className="text-3xl font-extrabold text-white">{winRate}%</div>
          <div className="text-xs text-emerald-400">{profitableTrades.length} of {totalTrades} executions in profit</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Gross Cumulative Return</div>
          <div className="text-3xl font-extrabold text-emerald-400">
            +{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(totalPnL)}
          </div>
          <div className="text-xs text-slate-400">Model calculations across indices</div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-purple-500/30 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase">Monthly Run-rate Revenue</div>
          <div className="text-3xl font-extrabold text-purple-300">
            ₹{payments.reduce((a, b) => a + b.amount, 0).toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-purple-400">{subscriptions.length} registered lifecycle accounts</div>
        </div>
      </div>

      {/* Strategy Performance Table */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Strategy-Wise Performance Analysis</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Option Strategy</th>
                <th className="py-3 px-3">Total Trades</th>
                <th className="py-3 px-3">Win Ratio</th>
                <th className="py-3 px-3 text-right">Net Profit / Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {strategyStats.map((st) => (
                <tr key={st.strategy} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3 font-bold text-white">{st.strategy}</td>
                  <td className="py-3.5 px-3 font-mono">{st.count} Trades</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${st.winRate}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-emerald-400">{st.winRate}%</span>
                    </div>
                  </td>
                  <td className={`py-3.5 px-3 text-right font-bold ${st.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {st.pnl >= 0 ? "+" : ""}₹{st.pnl.toLocaleString("en-IN")}
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
