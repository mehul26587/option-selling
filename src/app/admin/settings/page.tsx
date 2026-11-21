"use client";

import React, { useState } from "react";
import { Settings, Save, ShieldCheck, Key, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("LiveIPO Options Selling Portal");
  const [razorpayKeyId, setRazorpayKeyId] = useState("rzp_live_xxxxxxxxxxxxxx");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••••••");
  const [sebiDisclaimer, setSebiDisclaimer] = useState(
    "All trade logs, strategies, and options signals are strictly for educational and analytical purposes. Past performance does not guarantee future results. Derivative trading carries substantial financial risk."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Portal & Gateway Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Razorpay merchant keys, SEBI disclaimer compliance, and platform parameters.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Portal configuration updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Key className="w-4 h-4 text-purple-400" />
            Razorpay Payment Gateway Configuration
          </h3>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Razorpay Key ID</label>
            <input
              type="text"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Razorpay Key Secret</label>
            <input
              type="password"
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Regulatory & SEBI Compliance Banner
          </h3>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Mandatory Public Disclaimer Notice</label>
            <textarea
              rows={4}
              value={sebiDisclaimer}
              onChange={(e) => setSebiDisclaimer(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save System Settings
        </button>
      </form>
    </div>
  );
}
