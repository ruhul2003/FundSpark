'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Coins,
  Check,
  CreditCard,
  ShieldCheck,
  Zap,
  Sparkles,
  X,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const packages = [
  {
    credits: 100,
    price: 10,
    title: '100 Credits',
    badge: 'Starter',
    description: 'Perfect for first-time supporters wanting to back small ideas.',
    isPopular: false
  },
  {
    credits: 300,
    price: 25,
    title: '300 Credits',
    badge: 'Most Popular',
    description: 'Ideal balance for supporting multiple innovative campaigns.',
    isPopular: true
  },
  {
    credits: 800,
    price: 60,
    title: '800 Credits',
    badge: 'Pro Backer',
    description: 'Generous package for active community champions.',
    isPopular: false
  },
  {
    credits: 1500,
    price: 110,
    title: '1500 Credits',
    badge: 'Ultimate Visionary',
    description: 'Maximum impact package with bonus credit savings.',
    isPopular: false
  }
];

export default function PurchaseCreditView() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [selectedPkg, setSelectedPkg] = useState(null);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Stripe Modal form states
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expDate, setExpDate] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  const openCheckout = (pkg) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedPkg(pkg);
    setCardHolder(user.name || '');
    setErrorMsg('');
    setShowStripeModal(true);
  };

  const handleStripePay = async (e) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setPurchasing(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Step 1: Create Stripe Payment Intent
      const intentRes = await axios.post(`${API_URL}/payments/create-intent`, {
        credits: selectedPkg.credits
      });

      // Step 2: Confirm Payment & Update User Credits
      await axios.post(`${API_URL}/payments/confirm`, {
        creditsPurchased: selectedPkg.credits,
        amountPaid: selectedPkg.price,
        packageName: selectedPkg.title,
        paymentIntentId: intentRes.data.clientSecret
      });

      setSuccessMsg(`Successfully added ${selectedPkg.credits} credits to your account balance!`);
      await refreshUserData();
      setShowStripeModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stripe Payment Gateway Integrated</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Purchase <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 dark:from-indigo-300 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">Platform Credits</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
          Choose a credit package to empower your favorite crowdfunding projects. 1 Credit = $0.10 value. Secured with 256-bit Stripe encryption.
        </p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Credit Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.credits}
            className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
              pkg.isPopular
                ? 'bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 shadow-xl shadow-indigo-600/10 scale-105 z-10'
                : 'bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-md">
                {pkg.badge}
              </span>
            )}

            <div className="space-y-5">
              <div className="text-center pt-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{pkg.badge}</span>
                <div className="mt-2 flex items-baseline justify-center text-slate-900 dark:text-white">
                  <span className="text-4xl font-black tracking-tight">${pkg.price}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-medium">/ USD</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-0.5">
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-300 flex items-center justify-center gap-1.5">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>{pkg.credits} Credits</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">100% usable for pledges</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                {pkg.description}
              </p>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Instant Credit Balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Stripe 256-bit Encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Protected Escrow Guarantee</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => openCheckout(pkg)}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                pkg.isPopular
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-800 dark:border-slate-700'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Purchase ${pkg.price}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Security Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stripe Escrow</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Credits remain protected until approved by project creators.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
            <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Instant Allocation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Credits are instantly credited to your wallet balance upon confirmation.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 shrink-0">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">SSL Security</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              End-to-end encrypted Stripe Checkout protects financial credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Stripe Payment Gateway</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Checkout for {selectedPkg.title}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStripeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPkg.title} (+{selectedPkg.credits} Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Amount</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">${selectedPkg.price}.00 USD</span>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleStripePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Card Number (Stripe Test Card: 4242 4242 4242 4242)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay $${selectedPkg.price}.00 & Add ${selectedPkg.credits} Credits`}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Simulated with official Stripe API Gateway integration</span>
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
