"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Plan,
  Subscription,
  Trade,
  PaymentRecord,
  SupportTicket,
  NotificationItem,
} from "../lib/types";
import {
  initialUsers,
  initialPlans,
  initialSubscriptions,
  initialTrades,
  initialPayments,
  initialTickets,
  getStoredData,
  setStoredData,
} from "../lib/store";

interface AppContextType {
  currentUser: User | null;
  currentAdmin: User | null;
  users: User[];
  plans: Plan[];
  subscriptions: Subscription[];
  trades: Trade[];
  payments: PaymentRecord[];
  tickets: SupportTicket[];
  loginWithGoogle: (profile: { name: string; email: string; avatar?: string }) => boolean;
  adminLogin: (usernameOrEmail: string, password: string) => { success: boolean; message?: string };
  adminLogout: () => void;
  login: (email: string, role?: "user" | "admin") => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string) => boolean;
  subscribeToPlan: (planId: string, paymentMethod: string) => Promise<boolean>;
  activateTestSubscription: (planId?: string) => void;
  extendSubscription: (userId: string, extraDays?: number, customExpiry?: string) => void;
  addTrade: (trade: Omit<Trade, "id">) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (id: string) => void;
  importTrades: (newTrades: Omit<Trade, "id">[]) => void;
  addPlan: (plan: Omit<Plan, "id">) => void;
  updatePlan: (plan: Plan) => void;
  createTicket: (subject: string, category: SupportTicket["category"], message: string) => void;
  resolveTicket: (id: string, reply: string) => void;
  toggleUserStatus: (userId: string) => void;
  getUserSubscription: (userId?: string) => Subscription | undefined;
  getUserPayments: () => PaymentRecord[];
  getUserTickets: () => SupportTicket[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  useEffect(() => {
    setIsClient(true);
    // User session
    const savedUser = getStoredData<User | null>("current_user", null);
    const savedAdmin = getStoredData<User | null>("current_admin", null);

    const savedUsers = getStoredData<User[]>("users", initialUsers);
    const savedPlans = getStoredData<Plan[]>("plans", initialPlans);
    const savedSubs = getStoredData<Subscription[]>("subs", initialSubscriptions);
    const savedTrades = getStoredData<Trade[]>("trades", initialTrades);
    const savedPayments = getStoredData<PaymentRecord[]>("payments", initialPayments);
    const savedTickets = getStoredData<SupportTicket[]>("tickets", initialTickets);

    if (savedUser) {
      setCurrentUser(savedUser);
    }
    if (savedAdmin) {
      setCurrentAdmin(savedAdmin);
    }

    setUsers(savedUsers);
    setPlans(savedPlans);
    setSubscriptions(savedSubs);
    setTrades(savedTrades);
    setPayments(savedPayments);
    setTickets(savedTickets);
  }, []);

  const saveState = <T,>(key: string, data: T, setter: React.Dispatch<React.SetStateAction<T>>) => {
    setter(data);
    setStoredData(key, data);
  };

  // Google Login Handler - Strictly binds to the user's Gmail ID
  const loginWithGoogle = (profile: { name: string; email: string; avatar?: string }): boolean => {
    const cleanEmail = profile.email.trim().toLowerCase();
    let existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      const newUser: User = {
        id: `usr-g-${Date.now()}`,
        name: profile.name || cleanEmail.split("@")[0],
        email: cleanEmail,
        phone: "+91 98000 00000",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        avatar: profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name || cleanEmail)}`,
        provider: "google",
      };

      const updatedUsers = [newUser, ...users];
      saveState("users", updatedUsers, setUsers);
      existingUser = newUser;
    } else {
      existingUser = {
        ...existingUser,
        name: profile.name || existingUser.name,
        avatar: profile.avatar || existingUser.avatar,
        provider: "google",
      };
    }

    if (existingUser.status === "blocked") {
      alert("This account is currently blocked by administration. Please contact support.");
      return false;
    }

    setCurrentUser(existingUser);
    setStoredData("current_user", existingUser);
    return true;
  };

  // Dedicated Admin Login with User ID & Password
  const adminLogin = (usernameOrEmail: string, password: string): { success: boolean; message?: string } => {
    const cleanId = usernameOrEmail.trim().toLowerCase();

    const isValidAdminId =
      cleanId === "admin" ||
      cleanId === "admin@liveipo.com" ||
      cleanId === "mehul" ||
      cleanId === "liveipo_admin";

    const isValidPassword =
      password === "Admin@123" ||
      password === "admin123" ||
      password === "admin";

    if (isValidAdminId && isValidPassword) {
      const adminObj: User = {
        id: "usr-admin",
        name: "Mehul (Admin)",
        email: "admin@liveipo.com",
        phone: "+91 98765 43210",
        role: "admin",
        status: "active",
        createdAt: "2026-01-01",
      };

      setCurrentAdmin(adminObj);
      setStoredData("current_admin", adminObj);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid Admin User ID or Password. Please try again.",
    };
  };

  const adminLogout = () => {
    setCurrentAdmin(null);
    setStoredData("current_admin", null);
  };

  const login = (email: string, role?: "user" | "admin"): boolean => {
    const targetRole = role || "user";
    const cleanEmail = email.trim().toLowerCase();
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      found = {
        id: `usr-${Date.now()}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        phone: "+91 98000 00000",
        role: targetRole,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        provider: "credentials",
      };
      saveState("users", [found, ...users], setUsers);
    }

    if (found.status === "blocked") {
      alert("Account deactivated by administrator.");
      return false;
    }

    const activeUser = { ...found, role: targetRole };
    setCurrentUser(activeUser);
    setStoredData("current_user", activeUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setStoredData("current_user", null);
  };

  const register = (name: string, email: string, phone: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      phone,
      role: "user",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      provider: "credentials",
    };
    const updatedUsers = [...users, newUser];
    saveState("users", updatedUsers, setUsers);
    setCurrentUser(newUser);
    setStoredData("current_user", newUser);
    return true;
  };

  // Subscribe to Plan (Strictly tied to currentUser)
  const subscribeToPlan = async (planId: string, paymentMethod: string): Promise<boolean> => {
    if (!currentUser) return false;

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return false;

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + plan.validityDays);

    const paymentId = `pay_Rzp${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planId: plan.id,
      planName: `${plan.name} Plan (${plan.validityDays} Days)`,
      amount: plan.price,
      paymentMethod: paymentMethod as any,
      razorpayPaymentId: paymentId,
      status: "SUCCESS",
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    const newSub: Subscription = {
      id: `SUB-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planId: plan.id,
      planName: plan.name,
      startDate: now.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      daysRemaining: plan.validityDays,
      status: "active",
      amountPaid: plan.price,
      paymentId: paymentId,
      autoRenew: true,
    };

    const updatedSubs = [newSub, ...subscriptions.filter((s) => s.userEmail.toLowerCase() !== currentUser.email.toLowerCase())];
    const updatedPayments = [newPayment, ...payments];

    saveState("subs", updatedSubs, setSubscriptions);
    saveState("payments", updatedPayments, setPayments);

    return true;
  };

  // Quick test activation for the logged-in Gmail user
  const activateTestSubscription = (planId = "plan-premium") => {
    if (!currentUser) return;
    const plan = plans.find((p) => p.id === planId) || plans[3];

    const now = new Date();
    const expiry = new Date();
    expiry.setDate(now.getDate() + 42); // 42 days remaining like prompt

    const paymentId = `pay_Rzp${Math.floor(100000000 + Math.random() * 900000000)}`;

    const testPayment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planId: plan.id,
      planName: `${plan.name} Package (${plan.validityDays} Days)`,
      amount: plan.price,
      paymentMethod: "Razorpay (UPI)",
      razorpayPaymentId: paymentId,
      status: "SUCCESS",
      date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };

    const testSub: Subscription = {
      id: `SUB-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planId: plan.id,
      planName: plan.name,
      startDate: now.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      daysRemaining: 42,
      status: "active",
      amountPaid: plan.price,
      paymentId: paymentId,
      autoRenew: true,
    };

    const updatedSubs = [testSub, ...subscriptions.filter((s) => s.userEmail.toLowerCase() !== currentUser.email.toLowerCase())];
    const updatedPayments = [testPayment, ...payments];

    saveState("subs", updatedSubs, setSubscriptions);
    saveState("payments", updatedPayments, setPayments);
  };

  const extendSubscription = (userId: string, extraDays = 15, customExpiry?: string) => {
    const updated = subscriptions.map((sub) => {
      if (sub.userId === userId) {
        let newExpiryStr = "";
        let newDays = sub.daysRemaining;

        if (customExpiry) {
          newExpiryStr = customExpiry;
          const diffMs = new Date(customExpiry).getTime() - new Date().getTime();
          newDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        } else {
          const baseDate = new Date(sub.expiryDate);
          baseDate.setDate(baseDate.getDate() + extraDays);
          newExpiryStr = baseDate.toISOString().split("T")[0];
          newDays = sub.daysRemaining + extraDays;
        }

        return {
          ...sub,
          expiryDate: newExpiryStr,
          daysRemaining: newDays,
          status: newDays > 0 ? ("active" as const) : ("expired" as const),
        };
      }
      return sub;
    });

    saveState("subs", updated, setSubscriptions);
  };

  const addTrade = (tradeData: Omit<Trade, "id">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: `TRD-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    saveState("trades", [newTrade, ...trades], setTrades);
  };

  const updateTrade = (trade: Trade) => {
    const updated = trades.map((t) => (t.id === trade.id ? trade : t));
    saveState("trades", updated, setTrades);
  };

  const deleteTrade = (id: string) => {
    const updated = trades.filter((t) => t.id !== id);
    saveState("trades", updated, setTrades);
  };

  const importTrades = (newTrades: Omit<Trade, "id">[]) => {
    const formatted = newTrades.map((t, idx) => ({
      ...t,
      id: `TRD-${Date.now()}-${idx}`,
    }));
    saveState("trades", [...formatted, ...trades], setTrades);
  };

  const addPlan = (planData: Omit<Plan, "id">) => {
    const newPlan: Plan = {
      ...planData,
      id: `plan-${Date.now()}`,
    };
    saveState("plans", [...plans, newPlan], setPlans);
  };

  const updatePlan = (plan: Plan) => {
    const updated = plans.map((p) => (p.id === plan.id ? plan : p));
    saveState("plans", updated, setPlans);
  };

  const createTicket = (subject: string, category: SupportTicket["category"], message: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `TCK-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      subject,
      category,
      message,
      status: "OPEN",
      priority: "MEDIUM",
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    saveState("tickets", [newTicket, ...tickets], setTickets);
  };

  const resolveTicket = (id: string, reply: string) => {
    const updated = tickets.map((t) =>
      t.id === id ? { ...t, status: "RESOLVED" as const, adminReply: reply } : t
    );
    saveState("tickets", updated, setTickets);
  };

  const toggleUserStatus = (userId: string) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, status: u.status === "active" ? ("blocked" as const) : ("active" as const) } : u
    );
    saveState("users", updated, setUsers);
  };

  // STRICT DATA ISOLATION HELPERS:
  // 1. Get ONLY the current user's subscription
  const getUserSubscription = (userId?: string) => {
    const targetEmail = currentUser?.email?.toLowerCase();
    const targetId = userId || currentUser?.id;
    if (!targetId && !targetEmail) return undefined;

    return subscriptions.find(
      (s) =>
        (targetId && s.userId === targetId) ||
        (targetEmail && s.userEmail.toLowerCase() === targetEmail)
    );
  };

  // 2. Get ONLY the current user's payments (NO leakage of other users' data)
  const getUserPayments = (): PaymentRecord[] => {
    if (!currentUser) return [];
    const myEmail = currentUser.email.toLowerCase();
    return payments.filter(
      (p) => p.userId === currentUser.id || p.userEmail.toLowerCase() === myEmail
    );
  };

  // 3. Get ONLY the current user's support tickets
  const getUserTickets = (): SupportTicket[] => {
    if (!currentUser) return [];
    const myEmail = currentUser.email.toLowerCase();
    return tickets.filter(
      (t) => t.userId === currentUser.id || t.userEmail.toLowerCase() === myEmail
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentAdmin,
        users,
        plans,
        subscriptions,
        trades,
        payments,
        tickets,
        loginWithGoogle,
        adminLogin,
        adminLogout,
        login,
        logout,
        register,
        subscribeToPlan,
        activateTestSubscription,
        extendSubscription,
        addTrade,
        updateTrade,
        deleteTrade,
        importTrades,
        addPlan,
        updatePlan,
        createTicket,
        resolveTicket,
        toggleUserStatus,
        getUserSubscription,
        getUserPayments,
        getUserTickets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
