"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import { Trade } from "../../../lib/types";
import {
  TrendingUp,
  Download,
  Printer,
  Filter,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function TradeHistoryPage() {
  const { trades, currentUser } = useApp();

  // Filters state
  const [selectedSymbol, setSelectedSymbol] = useState<string>("ALL");
  const [selectedStrategy, setSelectedStrategy] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [pnlFilter, setPnlFilter] = useState<string>("ALL"); // ALL, PROFIT, LOSS
  const [searchDate, setSearchDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Filter logic
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (selectedSymbol !== "ALL" && t.symbol !== selectedSymbol) return false;
      if (selectedStrategy !== "ALL" && t.strategy !== selectedStrategy) return false;
      if (selectedStatus !== "ALL" && t.status !== selectedStatus) return false;
      if (pnlFilter === "PROFIT" && t.pnl <= 0) return false;
      if (pnlFilter === "LOSS" && t.pnl >= 0) return false;
      if (searchDate && !t.date.includes(searchDate)) return false;
      return true;
    });
  }, [trades, selectedSymbol, selectedStrategy, selectedStatus, pnlFilter, searchDate]);

  // Summary Metrics
  const totalFilteredPnL = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = filteredTrades.filter((t) => t.pnl > 0).length;
  const winPercentage = filteredTrades.length ? Math.round((winCount / filteredTrades.length) * 100) : 0;

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = [
      "Trade ID",
      "Date",
      "Symbol",
      "Strategy",
      "Entry Time",
      "Exit Time",
      "Entry Premium",
      "Exit Premium",
      "Quantity",
      "P&L (INR)",
      "Status",
      "Notes",
    ];

    const rows = filteredTrades.map((t) => [
      t.id,
      t.date,
      t.symbol,
      `"${t.strategy}"`,
      t.entryTime,
      t.exitTime,
      t.entryPremium,
      t.exitPremium,
      t.quantity,
      t.pnl,
      t.status,
      `"${t.notes || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LiveIPO_Trade_History_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Verified Options Selling Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trade History & Performance Log
          </h1>
          <p className="text-xs text-slate-400">
            Transparent index trades with entry/exit times, premiums, and delta-neutral notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-300 rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Download Excel / CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Advanced Filters</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-lg ${
                viewMode === "cards" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"
              }`}
            >
              Card View (Prompt Style)
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg ${
                viewMode === "table" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Symbol Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Symbol Wise</label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Symbols (NIFTY, BANKNIFTY...)</option>
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="SENSEX">SENSEX</option>
            </select>
          </div>

          {/* Strategy Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Strategy Wise</label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Strategies</option>
              <option value="Iron Condor">Iron Condor</option>
              <option value="Short Strangle">Short Strangle</option>
              <option value="Short Straddle">Short Straddle</option>
              <option value="Bull Put Spread">Bull Put Spread</option>
              <option value="Bear Call Spread">Bear Call Spread</option>
              <option value="Iron Fly">Iron Fly</option>
            </select>
          </div>

          {/* Profit / Loss Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Profit / Loss Wise</label>
            <select
              value={pnlFilter}
              onChange={(e) => setPnlFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All P&L Trades</option>
              <option value="PROFIT">Profitable Trades Only (+)</option>
              <option value="LOSS">Loss Trades Only (-)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Trade Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All (Open & Closed)</option>
              <option value="CLOSED">Closed Trades</option>
              <option value="OPEN">Open (Live Running)</option>
            </select>
          </div>

          {/* Date Search */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Search by Date</label>
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary Metrics */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{filteredTrades.length}</strong> of {trades.length} trades
          </div>
          <div className="flex gap-4">
            <span>Win Rate: <strong className="text-emerald-400">{winPercentage}%</strong></span>
            <span>Filtered Net P&L: <strong className={totalFilteredPnL >= 0 ? "text-emerald-400" : "text-red-400"}>
              {totalFilteredPnL >= 0 ? "+" : ""}₹{totalFilteredPnL.toLocaleString("en-IN")}
            </strong></span>
          </div>
        </div>
      </div>

      {/* SAMPLE CARD DESIGN (Exactly Matching Prompt Section 4) */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrades.map((trade) => (
            <div
              key={trade.id}
              className="p-6 rounded-3xl glass-card border border-slate-800 hover:border-slate-700 transition space-y-4"
            >
              {/* Header: Date & Status */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">Date: {trade.date}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    trade.status === "CLOSED"
                      ? "bg-slate-800 text-slate-300 border border-slate-700"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse"
                  }`}
                >
                  {trade.status}
                </span>
              </div>

              {/* Trade Details Grid - Exactly as requested in prompt */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Symbol</span>
                  <span className="font-bold text-white">{trade.symbol}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Strategy</span>
                  <span className="font-semibold text-emerald-300">{trade.strategy}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Entry Time</span>
                  <span className="text-slate-200">{trade.entryTime}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Exit Time</span>
                  <span className="text-slate-200">{trade.exitTime}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Entry Premium</span>
                  <span className="text-slate-200">₹{trade.entryPremium}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Exit Premium</span>
                  <span className="text-slate-200">₹{trade.exitPremium}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Quantity</span>
                  <span className="font-mono text-slate-200">{trade.quantity}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Gross P&L</span>
                  <span className={`font-bold ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Net Trade P&L Highlight Box */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Net Trade P&L</div>
                  <div className="text-[10px] text-slate-500">Est. after brokerage & charges</div>
                </div>
                <div className={`text-xl font-extrabold ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl.toLocaleString("en-IN")}
                </div>
              </div>

              {trade.notes && (
                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-300">Adjustment Note:</strong> {trade.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Compact Table View */
        <div className="p-6 rounded-2xl glass-card border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Symbol</th>
                <th className="py-3 px-3">Strategy</th>
                <th className="py-3 px-3">Entry Time</th>
                <th className="py-3 px-3">Exit Time</th>
                <th className="py-3 px-3">Entry Prem.</th>
                <th className="py-3 px-3">Exit Prem.</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3 text-right">Net P&L</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTrades.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono text-slate-400">{t.date}</td>
                  <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                  <td className="py-3 px-3 text-emerald-300">{t.strategy}</td>
                  <td className="py-3 px-3 text-slate-400">{t.entryTime}</td>
                  <td className="py-3 px-3 text-slate-400">{t.exitTime}</td>
                  <td className="py-3 px-3">₹{t.entryPremium}</td>
                  <td className="py-3 px-3">₹{t.exitPremium}</td>
                  <td className="py-3 px-3 font-mono">{t.quantity}</td>
                  <td className={`py-3 px-3 text-right font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}₹{t.pnl.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Compliance Box for Trade Records */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>About Model P&L Calculation:</span>
        </div>
        <p>
          ઉદાહરણ તરીકેનો ટ્રેડ રેકોર્ડ. વાસ્તવિક P&L બ્રોકરેજ, એક્સચેન્જ ટ્રાન્ઝેક્શન ચાર્જિસ, GST, STT અને સ્લિપેજ પ્રમાણે અલગ અલગ ટ્રેડર્સ માટે થોડો બદલાઈ શકે છે.
        </p>
      </div>
    </div>
  );
}
