'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Coins,
  Check,
  CreditCard,
  User,
  Star,
  Sparkles,
  Crown,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const supporterPackages = [
  {
    id: 'starter',
    credits: 100,
    price: 10,
    title: 'Starter',
    icon: User,
    description: 'Essential features for getting started and organizing your campaign backing.',
    isPopular: false,
    btnText: 'Get Starter Pack',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
    features: [
      '100 Platform Credits',
      'Instant credit wallet allocation',
      'Use on any active campaign',
      'Protected Stripe escrow guarantee'
    ]
  },
  {
    id: 'pro',
    credits: 300,
    price: 25,
    title: 'Pro Backer',
    icon: Star,
    description: 'Our most popular option for serious active candidates looking to rapidly back projects.',
    isPopular: true,
    badgeText: 'MOST POPULAR',
    btnText: 'Upgrade to Pro',
    btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    features: [
      '300 Platform Credits',
      'Instant credit wallet allocation',
      'Save 16% per platform credit',
      'Priority backing status',
      'Protected Stripe escrow guarantee'
    ]
  },
  {
    id: 'premium',
    credits: 800,
    price: 60,
    title: 'Premium',
    icon: Sparkles,
    description: 'Uncapped potential and priority tools tailored for high-impact community champions.',
    isPopular: false,
    btnText: 'Go Premium',
    btnClass: 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700',
    features: [
      '800 Platform Credits',
      'Instant credit wallet allocation',
      'Save 25% per platform credit',
      '24/7 Priority support queue',
      'Protected Stripe escrow guarantee'
    ]
  },
  {
    id: 'ultimate',
    credits: 1500,
    price: 110,
    title: 'Ultimate',
    icon: Crown,
    description: 'Maximum impact package with bonus credit savings for top visionary backers.',
    isPopular: false,
    btnText: 'Get Ultimate Pack',
    btnClass: 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700',
    features: [
      '1500 Platform Credits',
      'Instant credit wallet allocation',
      'Save 27% per platform credit',
      'VIP badge & priority processing',
      'Protected Stripe escrow guarantee'
    ]
  }
];

const creatorPackages = [
  {
    id: 'creator_basic',
    credits: 200,
    price: 20,
    title: 'Creator Launch',
    icon: User,
    description: 'Bonus credits for new project creators to launch and promote their campaign.',
    isPopular: false,
    btnText: 'Get Creator Launch',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
    features: [
      '200 Creator Credits',
      'Campaign highlight tools',
      'Instant wallet allocation',
      'Verified creator badge'
    ]
  },
  {
    id: 'creator_pro',
    credits: 600,
    price: 50,
    title: 'Creator Growth',
    icon: Star,
    description: 'Accelerate your campaign visibility with boosted placement and promotional credits.',
    isPopular: true,
    badgeText: 'RECOMMENDED',
    btnText: 'Boost My Campaign',
    btnClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    features: [
      '600 Creator Credits',
      'Featured placement on Explore page',
      'Save 17% per credit',
      'Analytics & backer insights',
      'Verified creator badge'
    ]
  },
  {
    id: 'creator_scale',
    credits: 1200,
    price: 95,
    title: 'Creator Scale',
    icon: Crown,
    description: 'Maximum campaign reach package designed for major fundraising goals.',
    isPopular: false,
    btnText: 'Get Creator Scale',
    btnClass: 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700',
    features: [
      '1200 Creator Credits',
      'Top-banner placement on Home page',
      'Save 21% per credit',
      'Direct backer messaging tools',
      'Priority approval support'
    ]
  }
];

const faqs = [
  {
    q: 'How do platform credits work?',
    a: 'Credits are FundSpark’s platform currency. You can purchase credits using Stripe and pledge them to back innovation campaigns.'
  },
  {
    q: 'How does Stripe payment escrow work?',
    a: 'When you pledge credits to a campaign, your credits are held in pending escrow until the creator reviews and approves your contribution.'
  },
  {
    q: 'Do platform credits expire?',
    a: 'No! Credits added to your account wallet never expire and remain available in your account balance at all times.'
  }
];

export default function PurchaseCreditView() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [roleTab, setRoleTab] = useState('supporters'); // 'supporters' | 'creators'
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

  const activePackages = roleTab === 'supporters' ? supporterPackages : creatorPackages;

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
      const intentRes = await axios.post(`${API_URL}/payments/create-intent`, {
        credits: selectedPkg.credits
      });

      await axios.post(`${API_URL}/payments/confirm`, {
        creditsPurchased: selectedPkg.credits,
        amountPaid: selectedPkg.price,
        packageName: `${selectedPkg.credits} credits package`,
        paymentIntentId: intentRes.data.clientSecret
      });

      setSuccessMsg(`Successfully added ${selectedPkg.credits} credits to your wallet balance!`);
      await refreshUserData();
      setShowStripeModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-16 transition-colors duration-300">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 block">
          TRANSPARENT PRICING
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Flexible plans tailored to your goals
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Whether you are an ambitious supporter backing groundbreaking campaigns or an expanding operation tracking down pristine talent, we have got you covered.
        </p>

        {/* Role Switcher Pill */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-inner gap-1">
            <button
              onClick={() => setRoleTab('supporters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'supporters'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Supporters</span>
            </button>
            <button
              onClick={() => setRoleTab('creators')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'creators'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>For Creators</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${activePackages.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 lg:gap-8 items-stretch`}>
        {activePackages.map((pkg) => {
          const IconComp = pkg.icon;
          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                pkg.isPopular
                  ? 'bg-white dark:bg-[#111625] border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 lg:-translate-y-2 z-10'
                  : 'bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-indigo-500/40 dark:hover:border-indigo-500/40'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  {pkg.badgeText || 'MOST POPULAR'}
                </span>
              )}

              <div className="space-y-5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{pkg.title}</h3>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                {/* Subtitle Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[2.75rem]">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 text-slate-900 dark:text-white pt-2">
                  <span className="text-4xl font-black tracking-tight">${pkg.price}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/{pkg.credits} credits</span>
                </div>

                {/* Checklist */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Full-width Bottom Action Button */}
              <button
                onClick={() => openCheckout(pkg)}
                className={`w-full mt-8 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${pkg.btnClass}`}
              >
                <span>{pkg.btnText}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shrink-0">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stripe Escrow</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Credits remain protected until approved by campaign creators.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Instant Delivery</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Credits are instantly added to your wallet balance after checkout.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 flex items-start gap-4 shadow-sm">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 shrink-0">
            <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">256-Bit Encryption</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Secured by official Stripe API end-to-end payment gateway.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-2">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Checkout for {selectedPkg.title} (+{selectedPkg.credits} Credits)</p>
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
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPkg.title} ({selectedPkg.credits} Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Charge</span>
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
                  <Lock className="w-4 h-4" />
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay $${selectedPkg.price}.00 & Add ${selectedPkg.credits} Credits`}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Encrypted via official Stripe Payment Gateway</span>
              </p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
