"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { User, Subscription } from "../../../lib/types";
import {
  Users,
  Calendar,
  Clock,
  Shield,
  UserPlus,
  Ban,
  CheckCircle,
  Plus,
  X,
  Search,
  Sparkles,
  Save,
} from "lucide-react";

export default function AdminUsersPage() {
  const {
    users,
    subscriptions,
    extendSubscription,
    toggleUserStatus,
    register,
  } = useApp();

  const [search, setSearch] = useState("");
  const [selectedUserForExtension, setSelectedUserForExtension] = useState<User | null>(null);
  const [extraDays, setExtraDays] = useState<number>(15);
  const [customExpiryDate, setCustomExpiryDate] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New User form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  const handleExtendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForExtension) return;

    if (customExpiryDate) {
      extendSubscription(selectedUserForExtension.id, undefined, customExpiryDate);
    } else {
      extendSubscription(selectedUserForExtension.id, extraDays);
    }

    setSelectedUserForExtension(null);
    setCustomExpiryDate("");
    alert(`Subscription extended successfully for ${selectedUserForExtension.name}!`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) return;

    register(newName, newEmail, newPhone);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30 mb-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Special Feature: Manual Expiry Date Extension
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User & Subscription Management
          </h1>
          <p className="text-xs text-slate-400">
            Control registered subscribers, grant extra trial days, or suspend accounts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-purple-600/20 flex items-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Search and Table Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email, or phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Total Registered: <strong className="text-white">{users.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">User Details</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Subscribed Plan</th>
                <th className="py-3 px-3">Current Expiry</th>
                <th className="py-3 px-3">Days Remaining</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((u) => {
                const sub = subscriptions.find((s) => s.userId === u.id);
                return (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email} • {u.phone}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "admin"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-emerald-400">
                      {sub?.planName || "No Plan"}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {sub?.expiryDate || "—"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-amber-400">
                      {sub ? `${sub.daysRemaining} Days` : "—"}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Extend Expiry Button */}
                        <button
                          onClick={() => setSelectedUserForExtension(u)}
                          className="px-2.5 py-1.5 bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 border border-purple-500/40 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                          title="Extend validity or set custom expiry date"
                        >
                          <Calendar className="w-3.5 h-3.5 text-purple-300" />
                          <span>+ Extend Expiry</span>
                        </button>

                        {/* Toggle Block / Unblock */}
                        {u.role !== "admin" && (
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`p-1.5 rounded-lg border text-[11px] transition ${
                              u.status === "active"
                                ? "bg-red-950/30 border-red-500/30 text-red-400 hover:bg-red-900/40"
                                : "bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40"
                            }`}
                            title={u.status === "active" ? "Block User" : "Activate User"}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTEND EXPIRY MODAL (KEY FEATURE) */}
      {selectedUserForExtension && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">Extend Subscription Expiry</h3>
              </div>
              <button
                onClick={() => setSelectedUserForExtension(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>Subscriber: <strong className="text-white">{selectedUserForExtension.name}</strong></div>
              <div className="text-slate-400">Email: {selectedUserForExtension.email}</div>
              <div className="text-purple-300">
                Current Expiry:{" "}
                <strong>
                  {subscriptions.find((s) => s.userId === selectedUserForExtension.id)?.expiryDate || "Not subscribed yet"}
                </strong>
              </div>
            </div>

            <form onSubmit={handleExtendSubmit} className="space-y-4 text-xs">
              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 uppercase">Select Quick Extension:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExtraDays(7);
                      setCustomExpiryDate("");
                    }}
                    className={`py-2 rounded-lg border font-bold transition ${
                      extraDays === 7 && !customExpiryDate
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    + 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExtraDays(15);
                      setCustomExpiryDate("");
                    }}
                    className={`py-2 rounded-lg border font-bold transition ${
                      extraDays === 15 && !customExpiryDate
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    + 15 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExtraDays(30);
                      setCustomExpiryDate("");
                    }}
                    className={`py-2 rounded-lg border font-bold transition ${
                      extraDays === 30 && !customExpiryDate
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    + 30 Days
                  </button>
                </div>
              </div>

              {/* Or Custom Expiry Date Input */}
              <div className="space-y-1 pt-1">
                <label className="font-semibold text-slate-300 uppercase">Or Choose Exact Expiry Date:</label>
                <input
                  type="date"
                  value={customExpiryDate}
                  onChange={(e) => setCustomExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-500">Leaving date blank will add the selected extra days above.</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForExtension(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Expiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add New Subscriber Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Subscriber Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="anand@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Phone (WhatsApp Alerts)</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98980 12345"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
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
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
