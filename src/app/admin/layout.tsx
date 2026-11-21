"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../../context/AppContext";
import {
  Shield,
  LayoutDashboard,
  Users,
  Layers,
  Crown,
  Receipt,
  TrendingUp,
  FileSpreadsheet,
  Bell,
  BarChart2,
  HelpCircle,
  Settings,
  ChevronRight,
  ExternalLink,
  LogOut,
  Lock,
  KeyRound,
  User as UserIcon,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentAdmin, adminLogin, adminLogout } = useApp();

  // Local login state for gate if not authenticated
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already on /admin/login page, render children directly
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated as Admin, show the secure Admin Login Gate
  if (!currentAdmin) {
    const handleGateLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      setTimeout(() => {
        const res = adminLogin(username, password);
        setLoading(false);
        if (!res.success) {
          setError(res.message || "Invalid Admin User ID or Password.");
        }
      }, 500);
    };

    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="p-8 rounded-3xl glass-card border border-purple-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-purple-600/30">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Security Gate</h1>
            <p className="text-xs text-purple-300/80">
              Please enter your Admin User ID and Password to manage the portal
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGateLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">
                Admin User ID
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
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
                Admin Password
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

            <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1 text-[11px] text-purple-300">
              <div className="font-bold flex items-center gap-1 text-purple-200">
                <Lock className="w-3 h-3" /> Admin Credentials:
              </div>
              <div>User ID: <code className="text-white bg-purple-950/60 px-1 py-0.5 rounded">admin</code></div>
              <div>Password: <code className="text-white bg-purple-950/60 px-1 py-0.5 rounded">Admin@123</code></div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-purple-600/30 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Unlock Admin Control Suite"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users, badge: "Expiry Extension" },
    { name: "Trade Management", href: "/admin/trades", icon: TrendingUp, badge: "CSV Import" },
    { name: "Subscription & Renewals", href: "/admin/subscriptions", icon: Crown },
    { name: "Plan Management", href: "/admin/plans", icon: Layers },
    { name: "Payment Records", href: "/admin/payments", icon: Receipt },
    { name: "Revenue & Trade Reports", href: "/admin/reports", icon: BarChart2 },
    { name: "Notifications (SMS/WA)", href: "/admin/notifications", icon: Bell },
    { name: "Support Tickets", href: "/admin/support", icon: HelpCircle },
    { name: "Portal Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Admin Top Header Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              LiveIPO Admin Control Suite
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">
                Logged in as {currentAdmin.name}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Manage all portal operations, user validity extensions, and trade journals
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 rounded-xl transition flex items-center gap-1.5"
          >
            <span>Subscriber View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={adminLogout}
            className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-xs font-semibold text-red-300 rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <nav className="p-3 rounded-2xl glass-card border border-slate-800 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Admin Content Area */}
        <section className="lg:col-span-4">{children}</section>
      </div>
    </div>
  );
}
