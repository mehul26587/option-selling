"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { GoogleSignInButton } from "../../components/GoogleSignInButton";
import { Lock, Mail, ArrowRight, KeyRound, CheckCircle, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const success = login(email, "user");
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md py-16">
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 shadow-2xl text-center">
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-emerald-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Subscriber Sign In</h1>
          <p className="text-xs text-slate-400">
            Sign in with Google to view your personal trading dashboard, subscription, and P&L
          </p>
        </div>

        {/* NATIVE GOOGLE IDENTITY SERVICES BUTTON (ONE CLICK) */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-white">
            1-Click Direct Google Authentication
          </div>
          <p className="text-[11px] text-slate-400">
            No password required. Google will securely authenticate your Gmail account.
          </p>

          <div className="flex justify-center pt-1">
            <GoogleSignInButton
              size="large"
              shape="pill"
              text="continue_with"
              onSuccess={() => router.push("/dashboard")}
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 pt-2 border-t border-slate-900">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strict Data Isolation: Only your Gmail data will be visible.</span>
          </div>
        </div>

        {/* Alternative Email Form */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Or sign in with email
            </span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Password</label>
                <span className="text-emerald-400 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-xs uppercase tracking-wider"
            >
              Sign In with Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
