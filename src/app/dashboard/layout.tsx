"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { GoogleSignInButton } from "../../components/GoogleSignInButton";
import {
  LayoutDashboard,
  Crown,
  TrendingUp,
  Receipt,
  User as UserIcon,
  HelpCircle,
  ChevronRight,
  LogOut,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, getUserSubscription, logout } = useApp();
  const subscription = getUserSubscription();

  // If user is not logged in, show the Google Sign-in Protection Gate
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <div className="p-8 rounded-3xl glass-card border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">Subscriber Login Required</h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              તમારું વ્યક્તિગત ટ્રેડિંગ ડેશબોર્ડ, સબ્સ્ક્રિપ્શન પ્લાન, પેમેન્ટ વિગતો અને પ્રોફિટ/લોસ એનાલિસિસ જોવા માટે કૃપા કરીને તમારા ગૂગલ એકાઉન્ટથી સાઇન ઇન કરો.
            </p>
          </div>

          {/* Native 1-Click Google Sign-In Button */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-2">
            <GoogleSignInButton size="large" shape="pill" text="continue_with" />
            <div className="text-[11px] text-slate-400">
              No password needed • Authenticates directly via your Google Account
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Strict Privacy: You only see your own subscription & payment records.</span>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Or browse publicly:{" "}
            <Link href="/plans" className="text-emerald-400 font-semibold hover:underline">
              Explore Subscription Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview & P&L Analysis", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Subscription", href: "/dashboard/subscription", icon: Crown },
    { name: "Trade History & Performance", href: "/dashboard/trades", icon: TrendingUp },
    { name: "Payment Details & Invoices", href: "/dashboard/payments", icon: Receipt },
    { name: "Profile & Preferences", href: "/dashboard/profile", icon: UserIcon },
    { name: "Support & Helpdesk", href: "/dashboard/support", icon: HelpCircle },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* User Mini Profile Card */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-emerald-500/40"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-base">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              <div className="overflow-hidden">
                <div className="font-bold text-white text-sm truncate flex items-center gap-1">
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                <span className="inline-block text-[9px] text-blue-400 bg-blue-500/10 px-1.5 rounded mt-0.5 font-medium border border-blue-500/20">
                  Google Account
                </span>
              </div>
            </div>

            {/* Subscription Mini Badge */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Current Plan:</span>
                <span className="font-bold text-emerald-400">{subscription?.planName || "No Plan"}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Validity:</span>
                <span className="text-amber-400 font-semibold">
                  {subscription?.daysRemaining ?? 0} Days Remaining
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 rounded-2xl glass-card border border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:bg-red-950/30 transition text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-4">{children}</section>
      </div>
    </div>
  );
}
