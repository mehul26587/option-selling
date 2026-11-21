# Software Requirement Specification (SRS)
## LiveIPO - Options Selling Management Portal & Subscription System

**Document Version:** 1.0  
**Target Platform:** Web (Desktop & Mobile Responsive)  
**Location:** `D:\LiveIPO Option Selling Payment`

---

## ૧. પ્રોજેક્ટ પરિચય (Executive Summary)
આ પ્લેટફોર્મ એક સુરક્ષિત, ઓટોમેટેડ અને સ્કેલેબલ **Options Selling Management & Subscription SaaS Portal** છે. તે એડમિનને પોતાના ઇન્ડેક્સ ઓપ્શન્સ (NIFTY, BANKNIFTY, FINNIFTY, SENSEX) ટ્રેડ રેકોર્ડ્સ શેર કરવાની, સબ્સ્ક્રિપ્શન પ્લાન વેચવાની અને યુઝર્સને વેરિફાઇડ ટ્રેડ હિસ્ટ્રી પૂરી પાડવાની સુવિધા આપે છે.

---

## ૨. સિસ્ટમ આર્કિટેક્ચર અને મોડ્યુલ્સ (Modules Breakdown)

### મોડ્યુલ ૧: Client / User Portal (ગ્રાહક માટે)
1. **Home Page (`/`)**:
   - પ્લેટફોર્મ પરિચય, મુખ્ય વિશેષતાઓ, ડેલ્ટા ન્યુટ્રલ પર્ફોર્મન્સ મેટ્રિક્સ (84%+ વિન રેટ).
   - ફીચર્ડ ટ્રેડ સ્પોટલાઇટ (NIFTY Iron Condor, +₹4,125 Net P&L).
   - પ્રાઇસિંગ પ્લાન્સ અને ડાયરેક્ટ ચેકઆઉટ.
2. **About Us (`/about`)**:
   - ઓપ્શન્સ સેલિંગ ફિલોસોફી, રિસ્ક મેનેજમેન્ટ પોલિસી અને SEBI ગાઇડલાઇન્સ.
3. **Plans & Pricing (`/plans`)**:
   - 4 સ્તરના પ્લાન્સ: Basic (₹999 / 30d), Silver (₹2,499 / 90d), Gold (₹4,499 / 180d), Premium (₹7,999 / 365d).
   - Razorpay ઇન્સ્ટન્ટ પેમેન્ટ ચેકઆઉટ.
4. **User Dashboard (`/dashboard`)**:
   - Active Plan: Current Plan (Premium), Expiry Date (30 Dec 2026).
   - Total Trades: 45 Trades, Trade Status.
   - Subscription Validity: 42 Days Remaining.
   - One-Click Renew Subscription.
5. **Trade History (`/dashboard/trades`)**:
   - વિગતવાર ટ્રેડ રેકોર્ડ્સ: Date, Symbol, Strategy, Entry/Exit Times, Premiums, Quantity, Gross & Net P&L.
   - ૫ પ્રકારના ફિલ્ટર્સ: Symbol, Strategy, Profit/Loss, Trade Status, Date search.
   - **Download Excel / CSV** અને **Print / PDF export**.
6. **Payment History (`/dashboard/payments`)**:
   - Razorpay Transaction IDs, ઇન્વોઇસ રસીદ ડાઉનલોડ.
7. **Support Desk (`/dashboard/support`)**:
   - ફરિયાદો અને મદદ માટે ટિકિટ સિસ્ટમ.

---

### મોડ્યુલ ૨: Admin Control Panel (એડમિન માટે)
1. **Overview Dashboard (`/admin`)**:
   - ટોટલ રેવન્યુ, એક્ટિવ સબ્સ્ક્રિપ્શન્સ, કુલ યુઝર્સ, ઓવરઓલ સ્ટ્રેટેજી P&L.
2. **User Management (`/admin/users`)**:
   - યુઝર Add, Edit, Block / Unblock.
   - **ખાસ ફીચર:** **Manual Expiry Date Extension** (+7, +15, +30 દિવસ અથવા કસ્ટમ કેલેન્ડર તારીખ પસંદ કરીને એક્સપાયરી લંબાવવી).
3. **Trade Management (`/admin/trades`)**:
   - નવો ટ્રેડ મેન્યુઅલી એડ કરવો (ઓટો P&L ગણતરી સાથે).
   - ટ્રેડ એડિટ અને ડિલીટ કરવો.
   - **Bulk CSV / Excel Import**: એક સાથે સેંકડો ટ્રેડ CSV પેસ્ટ કરીને અપલોડ કરવા.
4. **Subscription & Renewals (`/admin/subscriptions`)**:
   - એક્ટિવ, એક્સપાયરિંગ અને એક્સપાયર થયેલા યુઝર્સનું ટ્રેકિંગ અને એક-ક્લિક રિન્યુઅલ.
5. **Plan Management (`/admin/plans`)**:
   - નવા પ્લાન બનાવવા, જૂના પ્લાનની કિંમત અને વેલિડિટી બદલવી.
6. **Payment Records (`/admin/payments`)**:
   - તમામ Razorpay પેમેન્ટ ટ્રાન્ઝેક્શન હિસ્ટ્રી.
7. **Reports & Analytics (`/admin/reports`)**:
   - સ્ટ્રેટેજી વાઇઝ વિન રેશિયો અને પ્રોફિટ રિપોર્ટ્સ.
8. **Notification Broadcast (`/admin/notifications`)**:
   - WhatsApp, SMS અને Email દ્વારા લાઈવ ટ્રેડ એડજસ્ટમેન્ટ એલર્ટ્સ મોકલવા.
9. **Support Desk (`/admin/support`)**:
   - યુઝર ટિકિટ્સના જવાબો આપવા અને રિઝોલ્વ કરવી.
10. **Portal Settings (`/admin/settings`)**:
    - Razorpay API Keys અને SEBI લીગલ ડિસ્ક્લેમર સેટિંગ્સ.

---

## ૩. ડેટાબેઝ સ્કીમા સ્ટ્રક્ચર (Database Schema)
1. `users` (id, name, email, phone, role, status, createdAt)
2. `plans` (id, name, price, validityDays, description, features, status)
3. `subscriptions` (id, userId, planId, planName, startDate, expiryDate, daysRemaining, status, amountPaid, paymentId)
4. `trades` (id, date, symbol, strategy, entryTime, exitTime, entryPremium, exitPremium, quantity, pnl, status, notes)
5. `payments` (id, userId, planId, amount, paymentMethod, razorpayPaymentId, status, date)
6. `support_tickets` (id, userId, subject, message, category, status, adminReply, createdAt)
7. `notifications` (id, channel, target, message, date)

---

## ૪. ટેકનોલોજી સ્ટેક
- **Frontend & Admin UI:** Next.js 14, React 18, Tailwind CSS, Lucide Icons.
- **Backend:** Next.js Server Components & Route Handlers.
- **State & Local Persistence:** Reactive AppContext with Storage Sync.
- **Payment Gateway:** Razorpay Standard Checkout & Webhooks.
