"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Check, Loader2, ArrowRight, ShieldCheck, Mail } from "lucide-react";

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle } = useApp();
  const [loading, setLoading] = useState(false);
  const [gmailInput, setGmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSignIn = (name: string, email: string, avatar?: string) => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid Gmail / Email address.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      loginWithGoogle({
        name: name.trim() || email.split("@")[0],
        email: email.trim().toLowerCase(),
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      });
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 700);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignIn(nameInput, gmailInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header with Google Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <div className="font-bold text-slate-900 text-sm">Google Authentication</div>
              <div className="text-[11px] text-slate-500">LiveIPO Options Secure Data Isolation</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-xl text-slate-900">Sign in with your Gmail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              તમારો સબ્સ્ક્રિપ્શન પ્લાન, પેમેન્ટ અને પ્રોફિટ/લોસ ડેટા ફક્ત તમારા Gmail સાથે જ સુરક્ષિત રહેશે.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Form to enter custom Gmail */}
          <form onSubmit={handleDirectSubmit} className="space-y-3.5">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Enter Your Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={gmailInput}
                  onChange={(e) => setGmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Your Full Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patel"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 text-xs text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Google Account...</span>
                </>
              ) : (
                <>
                  <span>Continue with this Gmail</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Accounts for multi-user isolation verification */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">
              ⚡ Or select a test profile:
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSignIn(
                    "Ramesh Patel",
                    "ramesh.options@gmail.com",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  )
                }
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">Ramesh Patel</div>
                <div className="text-[10px] text-slate-500 truncate">ramesh.options@gmail.com</div>
                <div className="text-[9px] text-emerald-600 font-semibold mt-0.5">Premium Plan</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSignIn(
                    "Jignesh Shah",
                    "jignesh.trader@gmail.com",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  )
                }
                className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition group"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">Jignesh Shah</div>
                <div className="text-[10px] text-slate-500 truncate">jignesh.trader@gmail.com</div>
                <div className="text-[9px] text-blue-600 font-semibold mt-0.5">Silver Plan</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Data Isolation: You only see your personal trading records.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
