"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, TrendingUp, Target, Award, ArrowRight, BookOpen, AlertTriangle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 space-y-14">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">About LiveIPO Options</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Data-Driven Discipline in Options Selling
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
          We believe consistency in financial markets does not come from guessing direction, but from managing probability, mathematics, and strict position sizing.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Systematic Probability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            By selling options with high statistical probability of expiring worthless (Delta 10 to 20), theta decay works in our favor every single trading second.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Non-Negotiable Risk Limits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every trade is capped with a predefined maximum stop-loss and hedge wings to prevent black swan drawdowns. Capital safety is our priority #1.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Transparent Journal</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We record winning trades, losing trades, adjustments, brokerage estimates, and time-stamped execution. Nothing is concealed or exaggerated.
          </p>
        </div>
      </div>

      {/* Detailed Philosophy */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          Why Index Options Selling (NIFTY & BANKNIFTY)?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <p>
            The Indian derivatives market (NSE) offers the highest index liquidity in the world. As options sellers, we take advantage of the structural tendency of implied volatility (IV) to trade at a premium over actual realized volatility.
          </p>
          <p>
            Whether markets go up, stay flat, or make mild moves, our delta-neutral strategies (like Iron Condors, Strangle adjustments, and Iron Flies) are constructed to capture decay while hedging tail risk.
          </p>
        </div>
      </div>

      {/* Important Regulatory Compliance Notice */}
      <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3 text-xs text-amber-200">
        <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          SEBI Investor Disclosure & Warning
        </div>
        <p className="leading-relaxed">
          According to SEBI study, 9 out of 10 individual traders in equity Futures and Options Segment incurred net losses. Derivative trading requires financial literacy, risk management, and adequate capitalization. This portal is maintained as an educational journal and technology platform for analytical subscribers.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          href="/plans"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
        >
          Explore Subscription Plans
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
