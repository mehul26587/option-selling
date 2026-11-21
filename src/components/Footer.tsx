"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldAlert, Mail, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      {/* SEBI Compliance Notice Box */}
      <div className="bg-amber-950/20 border-b border-amber-500/20 py-6 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center gap-4 text-xs text-amber-200/80">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-amber-300 uppercase tracking-wide">
              Mandatory Legal & SEBI Regulatory Compliance Disclaimer
            </h4>
            <p className="leading-relaxed">
              LiveIPO Option Selling Portal is strictly an educational analysis and performance tracking tool for index options strategies. We do not provide guaranteed returns, investment advisory, portfolio management services, or execute trades on behalf of clients. Derivative trading (Options & Futures) involves substantial risk of capital loss as per SEBI regulations. Trade records displayed represent historical execution models and are subject to brokerage, slippage, and statutory taxes.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">LiveIPO Options</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Comprehensive options selling management, verified trade journals, delta-neutral analytics, and automated subscription renewal platform.
          </p>
          <div className="text-xs text-emerald-400/90 font-medium">
            Designed for Systematic Options Traders & Subscribers.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-emerald-400 transition">Home Page</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition">About Our Methodology</Link></li>
            <li><Link href="/plans" className="hover:text-emerald-400 transition">Subscription Plans</Link></li>
            <li><Link href="/dashboard/trades" className="hover:text-emerald-400 transition">Trade History & P&L</Link></li>
            <li><Link href="/login" className="hover:text-emerald-400 transition">Subscriber Login</Link></li>
          </ul>
        </div>

        {/* Subscriber Portal */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Subscriber Portal</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition">My Trading Dashboard & P&L</Link></li>
            <li><Link href="/dashboard/subscription" className="hover:text-emerald-400 transition">My Subscription & Validity</Link></li>
            <li><Link href="/dashboard/payments" className="hover:text-emerald-400 transition">Payment History & Invoices</Link></li>
            <li><Link href="/dashboard/support" className="hover:text-emerald-400 transition">Support & Complaints</Link></li>
            <li><Link href="/dashboard/profile" className="hover:text-emerald-400 transition">Profile & Notifications</Link></li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Support & Helpdesk</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>support@liveipo.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
              <span className="text-emerald-400 font-semibold">Payment Gateway:</span> Razorpay 100% Encrypted & Secure Checkout with instant invoice.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 LiveIPO Options Management Portal. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Refund & Cancellation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
