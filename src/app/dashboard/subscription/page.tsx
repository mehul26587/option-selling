"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../../../context/AppContext";
import { RazorpayModal } from "../../../components/RazorpayModal";
import {
  Crown,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MySubscriptionPage() {
  const { getUserSubscription, currentUser, plans, activateTestSubscription } = useApp();
  const subscription = getUserSubscription();
  const [showRenewModal, setShowRenewModal] = useState(false);

  const hasSub = subscription && subscription.status === "active";
  const activePlan = plans.find((p) => p.id === subscription?.planId) || plans[3];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Active Subscription</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your current plan benefits, validity status, and renewal settings linked to{" "}
          <strong className="text-white">{currentUser?.email}</strong>.
        </p>
      </div>

      {hasSub ? (
        /* Status Card when User HAS an Active Plan */
        <div className="p-8 rounded-3xl glass-card border border-emerald-500/30 relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-emerald-500/20">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Subscription
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  {subscription.planName} Package
                </h2>
                <div className="text-xs text-slate-400">
                  Institutional Delta-Neutral Option Selling Access
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRenewModal(true)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Plan via Razorpay
            </button>
          </div>

          {/* Validity Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Subscription Start Date</div>
              <div className="text-lg font-bold text-white mt-1">{subscription.startDate}</div>
              <div className="text-[10px] text-emerald-400">Payment ID: {subscription.paymentId}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Expiry Date</div>
              <div className="text-lg font-bold text-white mt-1">{subscription.expiryDate}</div>
              <div className="text-[10px] text-slate-400">Auto grace period enabled</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Days Remaining</div>
              <div className="text-lg font-bold text-amber-400 mt-1">
                {subscription.daysRemaining} Days Remaining
              </div>
              <div className="text-[10px] text-slate-400">Valid until 11:59 PM IST</div>
            </div>
          </div>
        </div>
      ) : (
        /* Status Card when User HAS NO Active Plan */
        <div className="p-8 rounded-3xl glass-card border border-slate-800 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Crown className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">No Active Subscription Found</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              There is currently no paid subscription plan linked to <strong className="text-white">{currentUser?.email}</strong>. Choose one of our 4 options selling packages to start tracking real-time trade signals.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/plans"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              Browse Plans & Pricing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => activateTestSubscription("plan-premium")}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Activate Instant Trial for this Account
            </button>
          </div>
        </div>
      )}

      {/* Plan Features Checklist */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Options Selling Strategy Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activePlan.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {showRenewModal && (
        <RazorpayModal
          plan={activePlan}
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
        />
      )}
    </div>
  );
}
