"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { RazorpayModal } from "../components/RazorpayModal";
import { Plan } from "../lib/types";
import {
  TrendingUp,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Lock,
  Layers,
  Clock,
  Sparkles,
  ChevronRight,
  Crown,
  FileSpreadsheet,
} from "lucide-react";

export default function HomePage() {
  const { plans, trades, currentUser } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Latest trade for spotlight
  const latestTrade = trades[0];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Systematic Options Selling Management Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Master the Edge of <br className="hidden sm:inline" />
            <span className="gradient-text">Theta Decay & Delta Neutrality</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Institutional-grade Options Selling management. Transparent, verified trade journals across NIFTY & BANKNIFTY with automated subscription tracking and real-time P&L analytics.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/plans"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition shadow-xl shadow-emerald-500/25 flex items-center gap-2 text-sm"
            >
              Get Started with Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/trades"
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              View Verified Trades
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-xs text-slate-400 font-medium">Historical Win Rate</div>
              <div className="text-2xl font-bold text-emerald-400">84.2%</div>
              <div className="text-[11px] text-slate-500">Across 120+ Expiries</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-xs text-slate-400 font-medium">Avg Monthly Theta Gain</div>
              <div className="text-2xl font-bold text-white">+4.8%</div>
              <div className="text-[11px] text-slate-500">Capital Protection First</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-xs text-slate-400 font-medium">Total Verified Trades</div>
              <div className="text-2xl font-bold text-white">45+ Active</div>
              <div className="text-[11px] text-slate-500">Live Tracked Journal</div>
            </div>
            <div className="p-4 rounded-2xl glass-card">
              <div className="text-xs text-slate-400 font-medium">Subscriber Retention</div>
              <div className="text-2xl font-bold text-teal-400">92%</div>
              <div className="text-[11px] text-slate-500">Auto Expiry Renewal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live Trade Spotlight (Sample from prompt) */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="p-6 md:p-8 rounded-3xl glass-card border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-500/10 border-b border-l border-emerald-500/20 text-emerald-300 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
            Verified Trade Showcase
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-white">
                  {latestTrade.symbol}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {latestTrade.strategy}
                </span>
                <span className="text-xs text-slate-400">Date: {latestTrade.date}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {latestTrade.symbol} Range-Bound Expiry Strategy
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {latestTrade.notes || "Systematic execution with pre-defined stop loss and delta neutral rebalancing."}
              </p>
            </div>

            <div className="flex items-center gap-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Net Trade P&L</div>
                <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
                  +{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(latestTrade.pnl)}
                </div>
                <div className="text-[10px] text-slate-500">Qty: {latestTrade.quantity} • Exited @ 02:45 PM</div>
              </div>

              <Link
                href="/dashboard/trades"
                className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition shadow-lg font-bold"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Plans Section (Basic, Silver, Gold, Premium matching prompt) */}
      <section className="container mx-auto px-4 max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Transparent Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose Your Trading Strategy Plan
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Get instant access to verified trades, daily adjustments, and institutional options data. Automatic Razorpay payment with real-time activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? "glass-card border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10 scale-105"
                  : "glass-card border border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Crown className="w-3.5 h-3.5" /> Best Institutional Value
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="text-xs text-slate-400 mt-1">{plan.description}</div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400">/ {plan.validityDays} Days</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-1">
                    ~₹{Math.round(plan.price / plan.validityDays)} per day
                  </div>
                </div>

                <div className="space-y-2.5 pt-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Features Included:</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg ${
                    plan.isPopular
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                >
                  Subscribe via Razorpay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategies Supported Showcase */}
      <section className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Options Selling Strategies Deployed</h2>
          <p className="text-xs text-slate-400">Tested and optimized for Indian Index Expiries (NIFTY, BANKNIFTY, SENSEX)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              IC
            </div>
            <h4 className="text-lg font-bold text-white">Iron Condor (Delta-Neutral)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Defined risk strategy selling OTM Call and Put while buying further OTM wings. Captures theta decay when market trades in defined bandwidths.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold">
              SS
            </div>
            <h4 className="text-lg font-bold text-white">Short Strangle & Adjustments</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Selling out-of-the-money Call & Put options during high IV percentiles with dynamic rolling rules to neutralize one-sided trending shocks.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
              IF
            </div>
            <h4 className="text-lg font-bold text-white">Iron Fly (ATM Straddle + Wings)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maximum theta acceleration on expiry days with hedge protection. High reward-to-risk ratio on range consolidation days.
            </p>
          </div>
        </div>
      </section>

      {/* Razorpay Modal Trigger */}
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
