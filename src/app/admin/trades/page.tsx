"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Trade } from "../../../lib/types";
import {
  TrendingUp,
  PlusCircle,
  FileSpreadsheet,
  Upload,
  Trash2,
  Edit3,
  X,
  CheckCircle,
  Sparkles,
  Download,
  Search,
} from "lucide-react";

export default function AdminTradesPage() {
  const { trades, addTrade, updateTrade, deleteTrade, importTrades } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [search, setSearch] = useState("");

  // New trade form state
  const [date, setDate] = useState("2026-11-18");
  const [symbol, setSymbol] = useState("NIFTY");
  const [strategy, setStrategy] = useState("Iron Condor");
  const [entryTime, setEntryTime] = useState("09:30 AM");
  const [exitTime, setExitTime] = useState("02:45 PM");
  const [entryPremium, setEntryPremium] = useState<number>(150);
  const [exitPremium, setExitPremium] = useState<number>(95);
  const [quantity, setQuantity] = useState<number>(75);
  const [status, setStatus] = useState<"OPEN" | "CLOSED">("CLOSED");
  const [notes, setNotes] = useState("Decay captured nicely in defined range.");

  // Bulk CSV state
  const [csvText, setCsvText] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate P&L: (entryPremium - exitPremium) * quantity
    const calculatedPnl = Math.round((entryPremium - exitPremium) * quantity);

    if (editingTrade) {
      updateTrade({
        ...editingTrade,
        date,
        symbol,
        strategy,
        entryTime,
        exitTime,
        entryPremium,
        exitPremium,
        quantity,
        pnl: calculatedPnl,
        status,
        notes,
      });
      setEditingTrade(null);
    } else {
      addTrade({
        date,
        symbol,
        strategy,
        entryTime,
        exitTime,
        entryPremium,
        exitPremium,
        quantity,
        pnl: calculatedPnl,
        status,
        notes,
      });
    }

    setShowAddModal(false);
  };

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade);
    setDate(trade.date);
    setSymbol(trade.symbol);
    setStrategy(trade.strategy);
    setEntryTime(trade.entryTime);
    setExitTime(trade.exitTime);
    setEntryPremium(trade.entryPremium);
    setExitPremium(trade.exitPremium);
    setQuantity(trade.quantity);
    setStatus(trade.status);
    setNotes(trade.notes || "");
    setShowAddModal(true);
  };

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    try {
      const lines = csvText.trim().split("\n");
      const parsedTrades: Omit<Trade, "id">[] = [];

      // Skip header if line 0 contains letters
      const startIndex = lines[0].toLowerCase().includes("date") ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 8) {
          const tDate = parts[0];
          const tSymbol = parts[1];
          const tStrategy = parts[2];
          const tEntryTime = parts[3];
          const tExitTime = parts[4];
          const tEntryPrem = parseFloat(parts[5]) || 0;
          const tExitPrem = parseFloat(parts[6]) || 0;
          const tQty = parseInt(parts[7], 10) || 75;
          const tPnl = Math.round((tEntryPrem - tExitPrem) * tQty);
          const tStatus = (parts[8]?.toUpperCase() === "OPEN" ? "OPEN" : "CLOSED") as "OPEN" | "CLOSED";
          const tNotes = parts[9] || "CSV imported trade";

          parsedTrades.push({
            date: tDate,
            symbol: tSymbol,
            strategy: tStrategy,
            entryTime: tEntryTime,
            exitTime: tExitTime,
            entryPremium: tEntryPrem,
            exitPremium: tExitPrem,
            quantity: tQty,
            pnl: tPnl,
            status: tStatus,
            notes: tNotes,
          });
        }
      }

      if (parsedTrades.length > 0) {
        importTrades(parsedTrades);
        alert(`Successfully imported ${parsedTrades.length} trades!`);
        setCsvText("");
        setShowImportModal(false);
      } else {
        alert("No valid trade records found. Please check CSV format.");
      }
    } catch (err) {
      alert("Error parsing CSV. Please verify column formatting.");
    }
  };

  const loadSampleCsvTemplate = () => {
    const sample = `Date,Symbol,Strategy,Entry Time,Exit Time,Entry Premium,Exit Premium,Quantity,Status,Notes
2026-11-20,NIFTY,Iron Condor,09:30 AM,02:45 PM,160,85,75,CLOSED,High decay day
2026-11-19,BANKNIFTY,Short Strangle,09:20 AM,03:15 PM,310,180,60,CLOSED,Post RBI speech crush
2026-11-21,FINNIFTY,Iron Fly,09:35 AM,03:00 PM,450,290,65,CLOSED,Weekly expiry straddle`;
    setCsvText(sample);
  };

  const filtered = trades.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.strategy.toLowerCase().includes(search.toLowerCase()) ||
      t.date.includes(search)
  );

  return (
    <div className="space-y-8">
      {/* Header with Add & Import CSV buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Live Strategy & Trade Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trade Journal Management
          </h1>
          <p className="text-xs text-slate-400">
            Post new index trades, edit exits, or batch upload via CSV/Excel spreadsheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setEditingTrade(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            + New Trade
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Import CSV / Excel
          </button>
        </div>
      </div>

      {/* Trades List Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Symbol, Strategy, or Date..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Total Trades: <strong className="text-white">{trades.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Symbol</th>
                <th className="py-3 px-3">Strategy</th>
                <th className="py-3 px-3">Times (In / Out)</th>
                <th className="py-3 px-3">Premiums (Entry / Exit)</th>
                <th className="py-3 px-3">Qty</th>
                <th className="py-3 px-3 text-right">Calculated P&L</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-mono text-slate-400">{t.date}</td>
                  <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                  <td className="py-3 px-3 text-emerald-300 font-semibold">{t.strategy}</td>
                  <td className="py-3 px-3 text-slate-400">{t.entryTime} ➔ {t.exitTime}</td>
                  <td className="py-3 px-3">₹{t.entryPremium} ➔ ₹{t.exitPremium}</td>
                  <td className="py-3 px-3 font-mono">{t.quantity}</td>
                  <td className={`py-3 px-3 text-right font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}₹{t.pnl.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Trade"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete trade ${t.symbol} (${t.date})?`)) deleteTrade(t.id);
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                        title="Delete Trade"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT TRADE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingTrade ? "Edit Options Trade Record" : "Add New Index Trade Record"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Execution Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Symbol</label>
                  <select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NIFTY">NIFTY</option>
                    <option value="BANKNIFTY">BANKNIFTY</option>
                    <option value="FINNIFTY">FINNIFTY</option>
                    <option value="SENSEX">SENSEX</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Strategy Name</label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Iron Condor">Iron Condor</option>
                  <option value="Short Strangle">Short Strangle</option>
                  <option value="Short Straddle">Short Straddle</option>
                  <option value="Bull Put Spread">Bull Put Spread</option>
                  <option value="Bear Call Spread">Bear Call Spread</option>
                  <option value="Iron Fly">Iron Fly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Entry Time</label>
                  <input
                    type="text"
                    required
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    placeholder="09:30 AM"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Exit Time</label>
                  <input
                    type="text"
                    required
                    value={exitTime}
                    onChange={(e) => setExitTime(e.target.value)}
                    placeholder="02:45 PM"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Entry Premium (₹)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={entryPremium}
                    onChange={(e) => setEntryPremium(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Exit Premium (₹)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={exitPremium}
                    onChange={(e) => setExitPremium(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Total Quantity</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 75)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live Preview of Calculated PnL */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Calculated Net P&L:</span>
                <span className={`font-bold text-sm ${
                  (entryPremium - exitPremium) * quantity >= 0 ? "text-emerald-400" : "text-red-400"
                }`}>
                  {(entryPremium - exitPremium) * quantity >= 0 ? "+" : ""}
                  ₹{Math.round((entryPremium - exitPremium) * quantity).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Trade Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="CLOSED">CLOSED (Completed Trade)</option>
                  <option value="OPEN">OPEN (Active Running Position)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Adjustment Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on delta adjustment, volatility, or exit reasoning..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {editingTrade ? "Update Trade" : "Save Trade to Journal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Bulk CSV / Excel Trade Upload</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Paste CSV Content Below:</label>
                <button
                  type="button"
                  onClick={loadSampleCsvTemplate}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Load Sample Template
                </button>
              </div>

              <textarea
                required
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Date,Symbol,Strategy,Entry Time,Exit Time,Entry Premium,Exit Premium,Quantity,Status,Notes..."
                className="w-full p-3 font-mono bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Required CSV Columns:</span>
                <code>Date, Symbol, Strategy, Entry Time, Exit Time, Entry Premium, Exit Premium, Quantity, Status, Notes</code>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Parse & Import Trades
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
