"use client";

import React, { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Plan } from "../../../lib/types";
import { Layers, Plus, Edit3, CheckCircle2, X } from "lucide-react";

export default function AdminPlansPage() {
  const { plans, addPlan, updatePlan } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(999);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setValidityDays(plan.validityDays);
    setDescription(plan.description);
    setFeaturesText(plan.features.join("\n"));
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPlan) {
      updatePlan({
        ...editingPlan,
        name,
        price,
        validityDays,
        description,
        features: featuresList,
      });
      setEditingPlan(null);
    } else {
      addPlan({
        name,
        price,
        validityDays,
        description,
        features: featuresList,
        status: "active",
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Plan & Pricing Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure subscription tiers, validity days, and feature access.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlan(null);
            setName("");
            setPrice(999);
            setValidityDays(30);
            setDescription("");
            setFeaturesText("");
            setShowModal(true);
          }}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <button
                  onClick={() => handleEditClick(plan)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Edit Plan"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-slate-400 min-h-[36px]">{plan.description}</div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-2xl font-black text-emerald-400">₹{plan.price.toLocaleString("en-IN")}</div>
                <div className="text-xs text-slate-400">Validity: {plan.validityDays} Days</div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Features:</span>
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleEditClick(plan)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Modify Plan Details
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingPlan ? "Edit Subscription Plan" : "Create New Subscription Plan"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Plan Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Platinum VIP"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Validity (Days)</label>
                  <input
                    type="number"
                    required
                    value={validityDays}
                    onChange={(e) => setValidityDays(parseInt(e.target.value, 10) || 30)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of audience"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Features (1 per line)</label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Daily NIFTY Setups&#10;Full Historical Downloads&#10;WhatsApp Alerts"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
