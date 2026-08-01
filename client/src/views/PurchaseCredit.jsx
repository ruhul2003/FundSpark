'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Check,
  HelpCircle,
  ChevronDown,
  User,
  Briefcase,
  Rocket,
  Star,
  Sparkles,
  CreditCard,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PurchaseCreditView() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [category, setCategory] = useState('seeker'); // 'seeker' | 'recruiter'
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

  const seekerPlans = [
    {
      name: 'Free',
      id: 'seeker_free',
      price: '$0',
      period: '/forever',
      credits: 50,
      description: 'Essential features for getting started and organizing your initial search tracking.',
      icon: <User className="w-4.5 h-4.5 text-slate-500 dark:text-zinc-400" />,
      iconBadge: 'bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60',
      features: [
        'Browse & save up to 10 jobs',
        'Apply to up to 3 jobs per month',
        'Basic profile page',
        'Standard email alerts'
      ],
      cta: 'Get Started Free',
      popular: false,
      btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-xl w-full shadow-md shadow-emerald-600/20 transition-all cursor-pointer'
    },
    {
      name: 'Pro',
      id: 'seeker_pro',
      price: '$19',
      period: '/month',
      credits: 300,
      description: 'Our most popular option for serious active candidates looking to rapidly accelerate landing a role.',
      icon: <Star className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />,
      iconBadge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 p-2 rounded-xl border border-blue-200/80 dark:border-blue-800/40',
      features: [
        'Apply to up to 30 jobs per month',
        'Unlimited saved jobs',
        'Advanced application tracking dashboard',
        'Comprehensive salary insights'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl w-full shadow-lg shadow-blue-600/30 transition-all cursor-pointer'
    },
    {
      name: 'Premium',
      id: 'seeker_premium',
      price: '$39',
      period: '/month',
      credits: 800,
      description: 'Uncapped potential and priority visibility tools tailored for elite competitive talent placement.',
      icon: <Sparkles className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />,
      iconBadge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 p-2 rounded-xl border border-purple-200/80 dark:border-purple-800/30',
      features: [
        'Everything in Pro + Unlimited applications',
        'Profile boost directly to recruiter feeds',
        'Early access to freshly published jobs',
        '24/7 Priority customer support queue'
      ],
      cta: 'Go Premium',
      popular: false,
      btnClass: 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white border border-slate-300 dark:border-zinc-700 font-semibold py-3.5 px-6 rounded-xl w-full transition-all cursor-pointer'
    }
  ];

  const recruiterPlans = [
    {
      name: 'Free',
      id: 'recruiter_free',
      price: '$0',
      period: '/forever',
      credits: 100,
      description: 'Ideal baseline solution matching startups launching their initial hiring infrastructure pipeline.',
      icon: <Briefcase className="w-4.5 h-4.5 text-slate-500 dark:text-zinc-400" />,
      iconBadge: 'bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60',
      features: [
        'Up to 3 active job posts simultaneously',
        'Basic applicant management pipeline',
        'Standard organic listing search visibility',
        'Great for a company’s first year of hiring'
      ],
      cta: 'Start Free Posting',
      popular: false,
      btnClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-xl w-full shadow-md shadow-emerald-600/20 transition-all cursor-pointer'
    },
    {
      name: 'Growth',
      id: 'recruiter_growth',
      price: '$49',
      period: '/month',
      credits: 600,
      description: 'Expanded allocation built for expanding companies with active multi-departmental team tracks.',
      icon: <Rocket className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />,
      iconBadge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 p-2 rounded-xl border border-blue-200/80 dark:border-blue-800/40',
      features: [
        'Up to 10 active job posts simultaneously',
        'Full automated applicant tracking workflow',
        'Basic listing performance metrics & analytics',
        'Dedicated email support desk response'
      ],
      cta: 'Scale Your Hiring',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl w-full shadow-lg shadow-blue-600/30 transition-all cursor-pointer'
    },
    {
      name: 'Enterprise',
      id: 'recruiter_enterprise',
      price: '$149',
      period: '/month',
      credits: 1500,
      description: 'High performance structural operations for organizations with continuous large-scale talent acquisition.',
      icon: <Sparkles className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />,
      iconBadge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 p-2 rounded-xl border border-purple-200/80 dark:border-purple-800/30',
      features: [
        'Up to 50 active job posts simultaneously',
        'Advanced interactive analytics visual dashboard',
        'Premium featured job listing styling boosts',
        'Dedicated account manager + priority support'
      ],
      cta: 'Contact Sales',
      popular: false,
      btnClass: 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white border border-slate-300 dark:border-zinc-700 font-semibold py-3.5 px-6 rounded-xl w-full transition-all cursor-pointer'
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, absolutely. All our premium tiers operate on flexible, non-binding month-to-month subscription structures. You can easily modify, downgrade, or cancel your renewal configurations through your profile billing dashboard settings at any time with no penalties.'
    },
    {
      question: 'How do refunds work if I change my mind?',
      answer: 'We maintain a 14-day satisfaction policy. If you determine the premium features aren’t a proper fit for your current search or hiring sequence within your initial two weeks of service, reach out to support for a complete refund.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all major international credit/debit networks including Visa, Mastercard, American Express, and Discover. Enterprise-grade recruiters also have options to establish monthly or annual invoicing arrangements via bank wire transfers.'
    },
    {
      question: 'What happens if I decide to switch plans mid-month?',
      answer: 'If you upgrade your plan tier mid-cycle, the transition occurs immediately, and your remaining days on the old tier are applied as a pro-rated credit toward your updated invoice. Downgrades take effect starting with your subsequent billing date.'
    }
  ];

  const activePlans = category === 'seeker' ? seekerPlans : recruiterPlans;

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
      const numericPrice = Number(selectedPkg.price.replace('$', '')) || 0;

      const intentRes = await axios.post(`${API_URL}/payments/create-intent`, {
        credits: selectedPkg.credits
      });

      await axios.post(`${API_URL}/payments/confirm`, {
        creditsPurchased: selectedPkg.credits,
        amountPaid: numericPrice,
        packageName: `${selectedPkg.name} Plan (${selectedPkg.credits} credits)`,
        paymentIntentId: intentRes.data.clientSecret
      });

      setSuccessMsg(`Successfully activated ${selectedPkg.name} Plan (+${selectedPkg.credits} credits)!`);
      await refreshUserData();
      setShowStripeModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#08080a] text-slate-900 dark:text-zinc-50 pt-20 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">

        {/* 1. Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mt-4 sm:mt-6">
          <span className="text-blue-600 dark:text-blue-500 font-semibold tracking-wider text-xs uppercase block">
            TRANSPARENT PRICING
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Flexible plans tailored to your goals
          </h1>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
            Whether you are an ambitious job seeker hunting for your next milestone or an expanding operation tracking down pristine talent, we have got you covered.
          </p>
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

        {/* 2. Category Toggle Switch */}
        <div className="bg-slate-200/90 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 p-1.5 rounded-2xl flex max-w-xs mx-auto my-10 shadow-inner">
          <button
            onClick={() => setCategory('seeker')}
            className={`w-1/2 rounded-xl flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              category === 'seeker'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-zinc-700/60'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <User className="w-4 h-4" />
            <span>For Job Seekers</span>
          </button>

          <button
            onClick={() => setCategory('recruiter')}
            className={`w-1/2 rounded-xl flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              category === 'recruiter'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-zinc-700/60'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>For Recruiters</span>
          </button>
        </div>

        {/* 3. Pricing Cards Container - Single Row with justify-around & centered items */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center md:justify-around gap-6 lg:gap-8 max-w-5xl mx-auto my-10">
          {activePlans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-[#111116] border rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 w-full max-w-sm md:max-w-[340px] flex-1 shadow-md hover:shadow-xl dark:shadow-black/60 ${
                plan.popular
                  ? 'border-2 border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/20'
                  : 'border-slate-200/90 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Featured Badge */}
              {plan.popular && (
                <span className="bg-blue-600 text-white text-[10px] font-extrabold tracking-wide uppercase px-3.5 py-1 rounded-full absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-md">
                  {plan.badgeText || 'MOST POPULAR'}
                </span>
              )}

              <div>
                {/* Top Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.name}</h3>
                  <div className={plan.iconBadge}>
                    {plan.icon}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-zinc-400 min-h-[2.75rem] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Indicator */}
                <div className="my-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
                  <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium ml-1">{plan.period}</span>
                </div>

                <hr className="border-slate-100 dark:border-zinc-800/80 mb-6" />

                {/* Feature Checklist */}
                <ul className="space-y-3.5 my-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                {plan.price === '$0' ? (
                  <Link
                    href="/explore"
                    className={`block text-center ${plan.btnClass}`}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openCheckout(plan)}
                    className={plan.btnClass}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Trust & Security Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-12 border-t border-slate-200 dark:border-zinc-800/80">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200/80 dark:border-zinc-800/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stripe Escrow</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Credits remain safely protected in escrow until campaign approval.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200/80 dark:border-zinc-800/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 shrink-0">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Instant Delivery</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Credits are instantly added to your wallet balance after checkout.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111116] border border-slate-200/80 dark:border-zinc-800/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 shrink-0">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Global Backing</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Accepted globally across 130+ currencies via Stripe Gateway.
              </p>
            </div>
          </div>
        </div>

        {/* 5. FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto border-t border-slate-200 dark:border-zinc-800/80 pt-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#111116] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 mb-3 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Have concerns regarding billing pipelines? Find instant clarity below.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#111116] border border-slate-200/90 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-4.5 gap-4 text-slate-800 dark:text-zinc-200 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-slate-100 dark:border-zinc-800/60' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 sm:p-5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed bg-slate-50/80 dark:bg-zinc-950/60">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl space-y-5 text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Checkout for {selectedPkg.name} Plan ({selectedPkg.price})</p>
                </div>
              </div>
              <button
                onClick={() => setShowStripeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPkg.name} Plan</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-zinc-400 block text-[11px]">Total Charge</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-base">{selectedPkg.price}.00 USD</span>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleStripePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                  Card Number (Stripe Test Card: 4242 4242 4242 4242)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
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
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay ${selectedPkg.price}.00 & Activate Plan`}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-zinc-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Encrypted via official Stripe Payment Gateway</span>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
