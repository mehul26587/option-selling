"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { HelpCircle, CheckCircle, MessageSquare, Send, X } from "lucide-react";

export default function AdminSupportPage() {
  const { tickets, resolveTicket } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyText) return;

    resolveTicket(selectedTicketId, replyText);
    setSelectedTicketId(null);
    setReplyText("");
    alert("Reply sent and ticket marked as RESOLVED!");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscriber Support Desk</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review subscriber complaints, trade log queries, and billing requests.
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{t.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300">
                    {t.category}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                    t.status === "RESOLVED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{t.message}</p>

              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 pt-1 border-t border-slate-900">
                <span>By: <strong className="text-white">{t.userName}</strong> ({t.userEmail})</span>
                <span>•</span>
                <span>Raised: {t.createdAt}</span>
              </div>

              {t.adminReply ? (
                <div className="mt-2 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200">
                  <strong className="text-purple-400 block mb-0.5">Admin Desk Reply:</strong>
                  {t.adminReply}
                </div>
              ) : (
                <div className="pt-2">
                  {selectedTicketId === t.id ? (
                    <form onSubmit={handleReplySubmit} className="space-y-2 mt-2">
                      <textarea
                        required
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type official response to subscriber..."
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTicketId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                        >
                          Send & Resolve
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setSelectedTicketId(t.id)}
                      className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 rounded-lg font-semibold inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply to Subscriber
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
