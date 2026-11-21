"use client";

import React, { useState } from "react";
import { Bell, Send, Smartphone, Mail, MessageSquare, CheckCircle2 } from "lucide-react";

export default function AdminNotificationsPage() {
  const [channel, setChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp");
  const [target, setTarget] = useState<"all" | "active" | "expiring_soon">("all");
  const [message, setMessage] = useState(
    "LiveIPO Alert: Bank Nifty weekly expiry 51500 CE & 50500 PE short strangle has decayed 65%. Trailing stop loss updated to cost."
  );
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Broadcast Alerts (WhatsApp, SMS, Email)</h1>
        <p className="text-xs text-slate-400 mt-1">
          Send live options trade adjustment alerts and subscription expiry reminders directly to subscribers.
        </p>
      </div>

      {sent && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Broadcast dispatched successfully via {channel.toUpperCase()}!
        </div>
      )}

      <form onSubmit={handleSend} className="p-6 rounded-2xl glass-card border border-slate-800 space-y-5 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 uppercase">Select Delivery Channel:</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setChannel("whatsapp")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                channel === "whatsapp"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp Business API
            </button>
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                channel === "email"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Mail className="w-4 h-4 text-blue-400" />
              Email Newsletter
            </button>
            <button
              type="button"
              onClick={() => setChannel("sms")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                channel === "sms"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              Direct SMS Gateway
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 uppercase">Recipient Audience:</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Registered Users</option>
            <option value="active">Active Plan Subscribers Only</option>
            <option value="expiring_soon">Users Expiring within 7 Days (Renewal Reminder)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-300 uppercase">Message Content:</label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Instant Broadcast
        </button>
      </form>
    </div>
  );
}
