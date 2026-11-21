"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RazorpayModal } from "../../components/RazorpayModal";
import { Plan } from "../../lib/types";
import { CheckCircle2, Crown, Sparkles, ShieldCheck, Zap, HelpCircle, ArrowRight } from "lucide-react";

export default function PlansPage() {
  const { plans, currentUser, getUserSubscription } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const currentSub = getUserSubscription();

  return (
    <div className="container mx-auto px-4 max-w-6xl py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Subscription & Access</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Flexible Plans for Every Systematic Trader
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-300">
          Subscribe securely with Razorpay. Instant activation, real-time expiry date generation, and automated renewal reminders.
        </p>

        {currentSub && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
            <span className="text-slate-400">Current Plan:</span>
            <span className="font-bold text-emerald-400">{currentSub.planName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-medium">{currentSub.daysRemaining} Days Left (Expires {currentSub.expiryDate})</span>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrentActive = currentSub?.planId === plan.id && currentSub.status === "active";
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl flex flex-col justify-between relative transition-all duration-300 ${
                plan.isPopular
                  ? "glass-card border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105"
                  : "glass-card border border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-[11px] rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Crown className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400">/ {plan.validityDays} Days</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-1">
                    ₹{Math.round(plan.price / plan.validityDays)} / day
                  </div>
                </div>

                <div className="space-y-2.5 pt-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Plan Highlights:</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                  >
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                      plan.isPopular
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    Subscribe with Razorpay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Flow - Exactly as described in prompt */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">How the Automated Subscription Works</h2>
          <p className="text-xs text-slate-400">A seamless, fully automated 7-step process from checkout to access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">1</div>
            <div className="font-bold text-white text-sm">Select Your Plan</div>
            <p className="text-slate-400">Pick the duration that fits your options trading cycle (30, 90, 180, 365 Days).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">2</div>
            <div className="font-bold text-white text-sm">Razorpay Checkout</div>
            <p className="text-slate-400">Pay safely using UPI, QR, Credit/Debit cards, or NetBanking.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">3</div>
            <div className="font-bold text-white text-sm">Instant Activation</div>
            <p className="text-slate-400">System sets Expiry Date automatically and unlocks all trade journals immediately.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">4</div>
            <div className="font-bold text-white text-sm">Renewal Reminders</div>
            <p className="text-slate-400">Timely reminder notifications before expiry so you never miss strategy updates.</p>
          </div>
        </div>
      </div>

      {/* Razorpay Modal */}
      {selectedPlan && (
        <RazorpayModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
