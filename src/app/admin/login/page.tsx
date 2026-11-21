"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "../../../context/AppContext";
import { Shield, KeyRound, User, ArrowRight, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useApp();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = adminLogin(username, password);
      setLoading(false);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.message || "Invalid Admin User ID or Password.");
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl glass-card border border-purple-500/30 space-y-6 shadow-2xl shadow-purple-950/40 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-purple-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">LiveIPO Admin Portal</h1>
          <p className="text-xs text-purple-300/80">
            Authorized Personnel & Administrator Access Only
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider">
              Admin User ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or email"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider">
              Admin Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Quick Preset Help info for Developer / Owner */}
          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1 text-[11px] text-purple-300">
            <div className="font-bold flex items-center gap-1 text-purple-200">
              <Lock className="w-3 h-3" /> Default Administrator Credentials:
            </div>
            <div>User ID: <code className="text-white bg-purple-950/60 px-1 py-0.5 rounded">admin</code></div>
            <div>Password: <code className="text-white bg-purple-950/60 px-1 py-0.5 rounded">Admin@123</code></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-purple-600/30 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? "Verifying Credentials..." : "Access Admin Control Suite"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
