'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  User,
  Briefcase,
  Star,
  Sparkles,
  Crown,
  CreditCard,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PurchaseCreditView() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [billingTarget, setBillingTarget] = useState('seeker');
  const [openFaq, setOpenFaq] = useState(null);

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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const supporterPlans = [
    {
      name: 'Free',
      id: 'supporter_free',
      price: '$10',
      period: '/100 credits',
      credits: 100,
      description: 'Essential features for getting started and organizing your initial search tracking.',
      icon: <User className="w-4 h-4 text-slate-300" />,
      features: [
        '100 Platform Credits',
        'Browse & back active campaigns',
        'Basic supporter profile page',
        'Protected Stripe escrow guarantee'
      ],
      cta: 'Get Started Free',
      popular: false,
      btnClass: 'bg-[#00b074] hover:bg-[#009663] text-white shadow-lg shadow-emerald-900/20'
    },
    {
      name: 'Pro',
      id: 'supporter_pro',
      price: '$25',
      period: '/300 credits',
      credits: 300,
      description: 'Our most popular option for serious active candidates looking to rapidly accelerate landing a role.',
      icon: <Star className="w-4 h-4 text-blue-400" />,
      features: [
        '300 Platform Credits',
        'Save 16% per platform credit',
        'Advanced application tracking dashboard',
        'Priority campaign backing status'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-600/30'
    },
    {
      name: 'Premium',
      id: 'supporter_premium',
      price: '$60',
      period: '/800 credits',
      credits: 800,
      description: 'Uncapped potential and priority visibility tools tailored for elite competitive talent placement.',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      features: [
        '800 Platform Credits',
        'Save 25% per platform credit',
        'Early access to freshly published projects',
        '24/7 Priority customer support queue'
      ],
      cta: 'Go Premium',
      popular: false,
      btnClass: 'bg-[#222834] hover:bg-[#2c3444] text-slate-200 border border-[#2e3748]'
    }
  ];

  const creatorPlans = [
    {
      name: 'Free',
      id: 'creator_free',
      price: '$20',
      period: '/200 credits',
      credits: 200,
      description: 'Ideal baseline solution matching startups launching their initial hiring infrastructure pipeline.',
      icon: <Briefcase className="w-4 h-4 text-slate-300" />,
      features: [
        '200 Creator Credits',
        'Basic applicant management pipeline',
        'Standard organic listing search visibility',
        'Verified creator badge'
      ],
      cta: 'Start Free Posting',
      popular: false,
      btnClass: 'bg-[#00b074] hover:bg-[#009663] text-white shadow-lg shadow-emerald-900/20'
    },
    {
      name: 'Growth',
      id: 'creator_growth',
      price: '$50',
      period: '/600 credits',
      credits: 600,
      description: 'Expanded allocation built for expanding companies with active multi-departmental team tracks.',
      icon: <Star className="w-4 h-4 text-blue-400" />,
      features: [
        '600 Creator Credits',
        'Featured placement on Explore page',
        'Basic listing performance metrics & analytics',
        'Save 17% per creator credit'
      ],
      cta: 'Scale Your Hiring',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg shadow-blue-600/30'
    },
    {
      name: 'Enterprise',
      id: 'creator_enterprise',
      price: '$110',
      period: '/1500 credits',
      credits: 1500,
      description: 'High performance structural operations for organizations with continuous large-scale talent acquisition.',
      icon: <Crown className="w-4 h-4 text-purple-400" />,
      features: [
        '1500 Creator Credits',
        'Top-banner placement on Home page',
        'Save 27% per creator credit',
        '24/7 Priority customer support queue'
      ],
      cta: 'Contact Corporate Tier',
      popular: false,
      btnClass: 'bg-[#222834] hover:bg-[#2c3444] text-slate-200 border border-[#2e3748]'
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, absolutely. All our premium tiers operate on flexible, non-binding month-to-month subscription structures. You can easily modify or cancel your renewal configurations through your billing dashboard settings at any time.'
    },
    {
      question: 'How do refunds work if I change my mind?',
      answer: 'We maintain a 14-day satisfaction policy. When you pledge credits to a campaign, your credits remain safely held in escrow until creator approval.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all major international credit/debit networks including Visa, Mastercard, American Express, and Discover via 256-bit encrypted Stripe Payment Gateway.'
    },
    {
      question: 'What happens if I decide to switch plans mid-month?',
      answer: 'Purchased credits are immediately added to your wallet balance upon transaction approval, allowing seamless upgrades without downtime.'
    }
  ];

  const activePlans = billingTarget === 'seeker' ? supporterPlans : creatorPlans;

  const openCheckout = (plan) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedPkg(plan);
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
        amountPaid: selectedPkg.price.replace('$', ''),
        packageName: `${selectedPkg.name} (${selectedPkg.credits} credits)`,
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
    <div className="w-full min-h-screen bg-[#07090e] dark:bg-[#07090e] text-white py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">

        {/* Header Title Typography */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#3b82f6] block">
            TRANSPARENT PRICING
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Flexible plans tailored to your goals
          </h1>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Whether you are an ambitious job seeker hunting for your next milestone or an expanding operation tracking down pristine talent, we have got you covered.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Switch Segment Control Toggle Grid Wrapper */}
        <div className="flex justify-center mb-14">
          <div className="p-1 bg-[#131722] border border-[#1e2638] rounded-2xl flex items-center gap-1 shadow-md">
            <button
              onClick={() => setBillingTarget('seeker')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                billingTarget === 'seeker'
                  ? 'bg-[#1e2638] text-white shadow-md border border-[#2d384e]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Job Seekers</span>
            </button>
            <button
              onClick={() => setBillingTarget('recruiter')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                billingTarget === 'recruiter'
                  ? 'bg-[#1e2638] text-white shadow-md border border-[#2d384e]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>For Recruiters</span>
            </button>
          </div>
        </div>

        {/* 3-Tier Pricing Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {activePlans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-[#131722] border rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-[#2563eb] shadow-2xl shadow-blue-600/20'
                  : 'border-[#1e2638] hover:border-[#2d384e]'
              }`}
            >
              {/* Popular Highlight Pill */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 text-[10px] font-extrabold text-white bg-[#2563eb] rounded-full uppercase tracking-wider shadow-md border border-blue-400/30">
                  {plan.badgeText || 'MOST POPULAR'}
                </span>
              )}

              {/* Plan Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <div className="w-8 h-8 rounded-full bg-[#1c2230] border border-[#283248] flex items-center justify-center text-slate-300 shrink-0">
                    {plan.icon}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Indicator */}
                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tight">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-[#00c885] shrink-0 mt-0.5" />
                      <span className="leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan Action CTA Callout Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => openCheckout(plan)}
                  className={`w-full text-center text-xs font-bold py-3.5 rounded-2xl transition-all cursor-pointer ${plan.btnClass}`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section Layout Wrapper */}
        <div className="max-w-3xl mx-auto border-t border-[#1e2638] pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#131722] border border-[#1e2638] text-slate-400 mb-3 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-1">Have concerns regarding billing pipelines? Find instant clarity below.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#131722] border border-[#1e2638] rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-4.5 gap-4 text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {/* Collapsible Accordion Element View Body */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-[#1e2638]' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 text-xs text-slate-400 leading-relaxed bg-[#0c0f17]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Stripe Payment Modal */}
      {showStripeModal && selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-800 bg-[#131722] shadow-2xl space-y-5 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-slate-400">Checkout for {selectedPkg.name} (+{selectedPkg.credits} Credits)</p>
                </div>
              </div>
              <button
                onClick={() => setShowStripeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#0c0f17] border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-white text-sm">{selectedPkg.name} ({selectedPkg.credits} Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Total Charge</span>
                <span className="font-black text-blue-400 text-base">{selectedPkg.price}.00 USD</span>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleStripePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#0c0f17] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Card Number (Stripe Test Card: 4242 4242 4242 4242)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#0c0f17] border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-[#0c0f17] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-[#0c0f17] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay ${selectedPkg.price}.00 & Add ${selectedPkg.credits} Credits`}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted via official Stripe Payment Gateway</span>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
