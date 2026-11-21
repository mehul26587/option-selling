"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { User, Mail, Phone, Lock, Save, ShieldCheck } from "lucide-react";

export default function UserProfilePage() {
  const { currentUser } = useApp();
  const [name, setName] = useState(currentUser?.name || "Ramesh Patel");
  const [phone, setPhone] = useState(currentUser?.phone || "+91 98250 11223");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Profile & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal details and WhatsApp alert preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Profile details saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email Address (Read-only)</label>
          <input
            type="email"
            disabled
            value={currentUser?.email || "user@liveipo.com"}
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-400 cursor-not-allowed"
          />
          <div className="text-[11px] text-slate-500">Contact admin to update registered email address.</div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">WhatsApp Notification Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <div className="text-[11px] text-slate-500">Live adjustment alerts and expiry reminders will be sent to this number.</div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
