"use client";

import React, { useState } from "react";
import { Plan } from "../lib/types";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Smartphone,
  Building,
  Loader2,
  Sparkles,
  ArrowRight,
  Receipt,
} from "lucide-react";

interface RazorpayModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { subscribeToPlan, currentUser } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<
    "Razorpay (UPI)" | "Razorpay (Card)" | "Razorpay (NetBanking)"
  >("Razorpay (UPI)");
  const [upiId, setUpiId] = useState("user@okaxis");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate Razorpay Gateway handshake & processing delay
    setTimeout(async () => {
      const generatedPayId = `pay_Rzp${Math.floor(100000000 + Math.random() * 900000000)}`;
      setPaymentId(generatedPayId);
      await subscribeToPlan(plan.id, selectedMethod);
      setIsProcessing(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 1800);
  };

  const calculatedExpiry = new Date();
  calculatedExpiry.setDate(calculatedExpiry.getDate() + plan.validityDays);
  const expiryFormatted = calculatedExpiry.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0c2340] px-6 py-4 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              R
            </div>
            <div>
              <div className="text-white font-bold text-base flex items-center gap-2">
                Razorpay <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded uppercase font-semibold">Live Checkout</span>
              </div>
              <div className="text-xs text-blue-200/70">Merchant: LiveIPO Options Portal</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
            <p className="text-sm text-slate-300">
              Congratulations! Your <strong className="text-emerald-400">{plan.name} Plan</strong> has been activated instantly.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Payment Reference:</span>
                <span className="font-mono text-emerald-300">{paymentId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount Paid:</span>
                <span className="font-bold text-white">₹{plan.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Plan Validity:</span>
                <span className="text-white">{plan.validityDays} Days</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Calculated Expiry Date:</span>
                <span className="font-semibold text-amber-400">{expiryFormatted}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onClose();
                  window.location.href = "/dashboard";
                }}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Go to My Trading Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Plan Info Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">Selected Plan</span>
                <div className="text-lg font-bold text-white">{plan.name} Package</div>
                <div className="text-xs text-slate-400">{plan.validityDays} Days Unrestricted Trade History Access</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-white">₹{plan.price.toLocaleString("en-IN")}</div>
                <div className="text-[11px] text-slate-400">Inclusive of all taxes</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Select Payment Mode
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("Razorpay (UPI)")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-medium ${
                    selectedMethod === "Razorpay (UPI)"
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("Razorpay (Card)")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-medium ${
                    selectedMethod === "Razorpay (Card)"
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("Razorpay (NetBanking)")}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition text-xs font-medium ${
                    selectedMethod === "Razorpay (NetBanking)"
                      ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <Building className="w-5 h-5 text-amber-400" />
                  <span>NetBanking</span>
                </button>
              </div>

              {selectedMethod === "Razorpay (UPI)" && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs text-slate-300 font-medium">Virtual Payment Address (VPA / UPI ID):</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@okaxis"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">GPay</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">PhonePe</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Paytm</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">BHIM</span>
                  </div>
                </div>
              )}
            </div>

            {/* Subscriber Confirmation info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Subscribing as: <strong className="text-white">{currentUser?.name || "Guest Trader"}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Secure
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Bank Handshake...
                </>
              ) : (
                <>
                  Pay ₹{plan.price.toLocaleString("en-IN")} via Razorpay
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
