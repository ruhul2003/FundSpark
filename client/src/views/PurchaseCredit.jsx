'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Coins, Check, CreditCard } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const packages = [
  { credits: 100, price: 10, title: '100 Credits', badge: 'Starter', isPopular: false },
  { credits: 300, price: 25, title: '300 Credits', badge: 'Most Popular', isPopular: true },
  { credits: 800, price: 60, title: '800 Credits', badge: 'Pro Backer', isPopular: false },
  { credits: 1500, price: 110, title: '1500 Credits', badge: 'Ultimate Visionary', isPopular: false }
];

export default function PurchaseCreditView() {
  const { user, refreshUserData } = useAuth();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePurchase = async (pkg) => {
    setSelectedPkg(pkg);
    setPurchasing(true);
    setSuccessMsg('');

    try {
      const intentRes = await axios.post(`${API_URL}/payments/create-intent`, {
        credits: pkg.credits
      });

      const confirmRes = await axios.post(`${API_URL}/payments/confirm`, {
        creditsPurchased: pkg.credits,
        amountPaid: pkg.price,
        packageName: pkg.title,
        paymentIntentId: intentRes.data.clientSecret
      });

      setSuccessMsg(`Successfully added ${pkg.credits} credits to your account!`);
      await refreshUserData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Purchase Platform Credits</h1>
        <p className="text-xs text-slate-400 mt-2">
          Choose a credit package to empower your favorite campaigns. Secured by Stripe Gateway.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold animate-in fade-in">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.credits}
            className={`glass-card p-6 rounded-3xl relative flex flex-col justify-between transition-all ${
              pkg.isPopular ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : 'border-slate-800'
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-md">
                {pkg.badge}
              </span>
            )}

            <div className="space-y-4">
              <div className="text-center pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{pkg.title}</span>
                <div className="mt-3 flex items-baseline justify-center text-white">
                  <span className="text-4xl font-extrabold tracking-tight">${pkg.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/ USD</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-center space-y-1">
                <span className="text-xl font-bold text-amber-400 flex items-center justify-center space-x-1">
                  <Coins className="w-5 h-5" />
                  <span>{pkg.credits} Credits</span>
                </span>
                <p className="text-[10px] text-slate-400">Pledge to any campaign</p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Instant Account Credit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Verified Stripe Checkout</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Protected Escrow Guarantee</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePurchase(pkg)}
              disabled={purchasing && selectedPkg?.credits === pkg.credits}
              className={`w-full mt-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                pkg.isPopular
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>{purchasing && selectedPkg?.credits === pkg.credits ? 'Processing...' : `Pay $${pkg.price}`}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
