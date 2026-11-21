"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../../../context/AppContext";
import { Receipt, CheckCircle, Download, CreditCard, ShieldCheck, ArrowRight } from "lucide-react";

export default function UserPaymentsPage() {
  const { getUserPayments, currentUser } = useApp();
  const userPayments = getUserPayments();

  const downloadReceipt = (payment: any) => {
    alert(
      `Downloading Tax Invoice for Payment: ${payment.razorpayPaymentId}\nPlan: ${payment.planName}\nSubscriber: ${currentUser?.email}\nAmount: ₹${payment.amount}`
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Payment & Billing History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review all transactions and invoices linked to your account (<strong className="text-white">{currentUser?.email}</strong>).
        </p>
      </div>

      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        {userPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Plan Subscribed</th>
                  <th className="py-3 px-3">Razorpay Payment ID</th>
                  <th className="py-3 px-3">Payment Mode</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {userPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-3 text-slate-400 font-mono">{p.date}</td>
                    <td className="py-3.5 px-3 font-bold text-white">{p.planName}</td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400">{p.razorpayPaymentId}</td>
                    <td className="py-3.5 px-3 text-slate-300">{p.paymentMethod}</td>
                    <td className="py-3.5 px-3 font-bold text-white">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => downloadReceipt(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3 text-emerald-400" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty state when this Gmail user has no payments */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="text-white font-bold text-base">No Payment Transactions Recorded</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no billing records yet for <strong>{currentUser?.email}</strong>. When you subscribe to a plan, your Razorpay invoices will appear here.
            </p>
            <div className="pt-2">
              <Link
                href="/plans"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                <span>View Plans & Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
