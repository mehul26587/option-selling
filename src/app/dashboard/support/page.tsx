"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { HelpCircle, Send, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function UserSupportPage() {
  const { getUserTickets, createTicket, currentUser } = useApp();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<any>("General");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const userTickets = getUserTickets();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    createTicket(subject, category, message);
    setSubject("");
    setMessage("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Helpdesk & Support Tickets</h1>
        <p className="text-xs text-slate-400 mt-1">
          Raise queries, billing issues, or feedback directly with our desk for{" "}
          <strong className="text-white">{currentUser?.email}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Raise Ticket Form */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Raise a New Support Ticket
          </h3>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-semibold">
              Ticket submitted successfully! Our support desk will reply shortly.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="General">General Inquiries</option>
                <option value="Billing">Billing & Razorpay Payments</option>
                <option value="Trade History">Trade History & Calculations</option>
                <option value="Subscription">Subscription Expiry & Renewal</option>
                <option value="Technical">Technical Portal Issue</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your query"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Detailed Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Ticket
            </button>
          </form>
        </div>

        {/* Existing Tickets List */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white">Your Previous Tickets</h3>

          {userTickets.length > 0 ? (
            <div className="space-y-3">
              {userTickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{t.subject}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="text-slate-300">{t.message}</p>
                  <div className="text-[10px] text-slate-500">Raised: {t.createdAt} • Category: {t.category}</div>

                  {t.adminReply && (
                    <div className="mt-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-emerald-200">
                      <strong className="text-emerald-400 block mb-0.5">Admin Response:</strong>
                      {t.adminReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No tickets submitted yet by {currentUser?.email}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
