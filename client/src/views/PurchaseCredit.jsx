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
  Crown,
  CreditCard,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
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

  const seekerPlans = [
    {
      name: 'Starter',
      id: 'seeker_free',
      price: '$10',
      period: '/100 credits',
      credits: 100,
      description: 'Essential features for getting started and organizing your initial campaign backing.',
      icon: <User className="w-5 h-5 text-zinc-400" />,
      features: [
        '100 Platform Credits',
        'Instant credit wallet allocation',
        'Use on any active campaign',
        'Protected Stripe escrow guarantee'
      ],
      cta: 'Get Starter Pack',
      popular: false
    },
    {
      name: 'Pro',
      id: 'seeker_pro',
      price: '$25',
      period: '/300 credits',
      credits: 300,
      description: 'Our most popular option for serious active supporters looking to rapidly back projects.',
      icon: <Star className="w-5 h-5 text-blue-400" />,
      features: [
        '300 Platform Credits',
        'Instant credit wallet allocation',
        'Save 16% per platform credit',
        'Priority backing status',
        'Protected Stripe escrow guarantee'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Premium',
      id: 'seeker_premium',
      price: '$60',
      period: '/800 credits',
      credits: 800,
      description: 'Uncapped potential and priority tools tailored for high-impact community champions.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      features: [
        '800 Platform Credits',
        'Instant credit wallet allocation',
        'Save 25% per platform credit',
        'Early access to freshly published campaigns',
        '24/7 Priority customer support queue'
      ],
      cta: 'Go Premium',
      popular: false
    }
  ];

  const recruiterPlans = [
    {
      name: 'Creator Launch',
      id: 'recruiter_free',
      price: '$20',
      period: '/200 credits',
      credits: 200,
      description: 'Ideal baseline solution matching creators launching their initial project pipeline.',
      icon: <Briefcase className="w-5 h-5 text-zinc-400" />,
      features: [
        '200 Creator Credits',
        'Basic applicant & backer tracking pipeline',
        'Standard organic campaign search visibility',
        'Great for a campaign’s launch phase'
      ],
      cta: 'Start Creator Pack',
      popular: false
    },
    {
      name: 'Growth',
      id: 'recruiter_growth',
      price: '$50',
      period: '/600 credits',
      credits: 600,
      description: 'Expanded allocation built for expanding campaigns with active promotional tracks.',
      icon: <Rocket className="w-5 h-5 text-blue-400" />,
      features: [
        '600 Creator Credits',
        'Featured placement on Explore page',
        'Save 17% per creator credit',
        'Listing performance metrics & analytics',
        'Dedicated email support desk response'
      ],
      cta: 'Scale Your Campaign',
      popular: true
    },
    {
      name: 'Enterprise',
      id: 'recruiter_enterprise',
      price: '$110',
      period: '/1500 credits',
      credits: 1500,
      description: 'High performance structural operations for organizations with large-scale fundraising.',
      icon: <Crown className="w-5 h-5 text-purple-400" />,
      features: [
        '1500 Creator Credits',
        'Top-banner placement on Home page',
        'Save 27% per creator credit',
        'Multi-user team collaboration seats',
        'Custom campaign branding options',
        'Dedicated account manager + priority support'
      ],
      cta: 'Get Enterprise Pack',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, absolutely. All our credit packages operate on flexible, non-binding structures. You can manage your wallet balance and active campaign pledges directly through your profile dashboard at any time.'
    },
    {
      question: 'How do refunds work if I change my mind?',
      answer: 'When you pledge credits to a campaign, your credits are held in escrow. If a contribution is rejected or cancelled before creator acceptance, your credits are immediately refunded back to your account balance.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all major international credit/debit networks including Visa, Mastercard, American Express, and Discover via official 256-bit Stripe Payment Gateway encryption.'
    },
    {
      question: 'What happens if I decide to switch plans mid-month?',
      answer: 'You can top-up or purchase additional credit packages at any time. Newly purchased credits are added directly onto your existing balance immediately upon Stripe confirmation.'
    }
  ];

  const activePlans = billingTarget === 'seeker' ? seekerPlans : recruiterPlans;

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
        amountPaid: selectedPkg.price,
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
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Header Title Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500">
            Transparent Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight">
            Flexible plans tailored to your goals
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed">
            Whether you are an ambitious job seeker hunting for your next milestone or an expanding operation tracking down pristine talent, we have got you covered.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 dark:text-emerald-400 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Switch Segment Control Toggle Grid Wrapper */}
        <div className="flex justify-center mb-16">
          <div className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-1 shadow-md">
            <button
              onClick={() => setBillingTarget('seeker')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                billingTarget === 'seeker'
                  ? 'bg-zinc-900 dark:bg-zinc-800 text-white shadow-md border border-zinc-800 dark:border-zinc-700/50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <User className="w-4 h-4" />
              For Job Seekers
            </button>
            <button
              onClick={() => setBillingTarget('recruiter')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                billingTarget === 'recruiter'
                  ? 'bg-zinc-900 dark:bg-zinc-800 text-white shadow-md border border-zinc-800 dark:border-zinc-700/50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              For Recruiters
            </button>
          </div>
        </div>

        {/* 3-Tier Pricing Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
          {activePlans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-xl shadow-slate-200/80 dark:shadow-2xl dark:shadow-black/80 flex flex-col justify-between min-h-[480px] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-blue-500/15 ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Popular Highlight Pill */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              {/* Plan Name & Core Header Metadata */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-950/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                    {plan.icon}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>

                {/* Dynamic Price Indicator Text Block */}
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{plan.price}</span>
                  <span className="text-xs text-zinc-500 font-medium">{plan.period}</span>
                </div>

                <hr className="border-zinc-200 dark:border-zinc-800/80 mb-6" />

                {/* Interactive Checkbox Checklist Array Mapping */}
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-normal font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan Action CTA Callout Button */}
              <div className="mt-8">
                {plan.name === 'Starter' && plan.price === '$0' ? (
                  <Link
                    href="/register"
                    className="block w-full text-center text-sm font-semibold px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition text-white shadow-md shadow-emerald-600/20"
                  >
                    Get Started Free
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => openCheckout(plan)}
                    className={`block w-full text-center text-sm font-semibold px-6 py-3.5 rounded-2xl transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white'
                        : plan.name === 'Starter'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section Layout Wrapper */}
        <div className="max-w-3xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 mb-3 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">Have concerns regarding billing pipelines? Find instant clarity below.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-4 gap-4 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {/* Collapsible Accordion Element View Body */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-zinc-200 dark:border-zinc-800/60' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Checkout for {selectedPkg.name} (+{selectedPkg.credits} Credits)</p>
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
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedPkg.name} ({selectedPkg.credits} Credits)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Total Charge</span>
                <span className="font-black text-blue-600 dark:text-blue-400 text-base">{selectedPkg.price}.00 USD</span>
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
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
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
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono"
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
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
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
                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
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
