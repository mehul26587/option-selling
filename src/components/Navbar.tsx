"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import { GoogleSignInButton } from "./GoogleSignInButton";
import {
  TrendingUp,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Crown,
  Menu,
  X,
  ChevronDown,
  Receipt,
  PieChart,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Regulatory Compliance Banner */}
      <div className="bg-emerald-950/60 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-emerald-300/90 flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <strong>SEBI Compliance:</strong> Options and futures trading involves financial risk. Performance records shown are for educational analysis.
          </span>
          <div className="hidden sm:flex items-center gap-3 text-emerald-400/90 text-[11px]">
            <span>Market Status: <strong className="text-emerald-300">Live Theta Sync</strong></span>
            <span>•</span>
            <span>Automated Subscription Tracking</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              LiveIPO <span className="text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">OPTIONS</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Selling Portal</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/" ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/about" ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/plans"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/plans" ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            Plans & Pricing
          </Link>
          <Link
            href="/dashboard/trades"
            className={`transition-colors hover:text-emerald-400 ${
              pathname.includes("/trades") ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            Trade History & P&L
          </Link>
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-emerald-400 ${
              pathname === "/dashboard" ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            My Dashboard
          </Link>
          <Link
            href="/dashboard/support"
            className={`transition-colors hover:text-emerald-400 ${
              pathname.includes("/support") ? "text-emerald-400 font-semibold" : "text-slate-300"
            }`}
          >
            Support
          </Link>
        </nav>

        {/* Right User Authentication Section (Native Google Sign-In) */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 transition-all shadow-md"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                )}

                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-200 flex items-center gap-1">
                    {currentUser.name}
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 py-0.2 rounded font-medium">
                      Google
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 truncate max-w-[130px]">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-sm animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-800 text-xs">
                    <div className="text-slate-400">Signed in as:</div>
                    <div className="font-semibold text-white truncate">{currentUser.email}</div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-slate-800 text-xs font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    My Trading Dashboard & P&L
                  </Link>

                  <Link
                    href="/dashboard/subscription"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-slate-800 text-xs font-medium"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    My Subscription & Validity
                  </Link>

                  <Link
                    href="/dashboard/trades"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-slate-800 text-xs font-medium"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Trade History & Filters
                  </Link>

                  <Link
                    href="/dashboard/payments"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:bg-slate-800 text-xs font-medium"
                  >
                    <Receipt className="w-4 h-4 text-blue-400" />
                    Payment History & Receipts
                  </Link>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-red-400 hover:bg-red-950/30 text-xs text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Native Google Identity Services Button */}
              <GoogleSignInButton text="continue_with" shape="pill" />
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-emerald-400 py-1"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-emerald-400 py-1"
          >
            About Us
          </Link>
          <Link
            href="/plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-emerald-400 py-1"
          >
            Plans & Pricing
          </Link>
          <Link
            href="/dashboard/trades"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-emerald-400 py-1"
          >
            Trade History & P&L
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-emerald-400 py-1"
          >
            My Dashboard
          </Link>

          {!currentUser && (
            <div className="pt-2 border-t border-slate-800">
              <GoogleSignInButton text="continue_with" shape="pill" />
            </div>
          )}
        </div>
      )}
    </header>
  );
};
