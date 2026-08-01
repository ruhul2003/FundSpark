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
  CreditCard,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  HelpCircle,
  ChevronDown
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
      icon: <User className="w-4 h-4 text-zinc-300" />,
      iconBadge: 'bg-zinc-900 border border-zinc-800 p-2 rounded-xl',
      features: [
        'Browse & save up to 10 jobs',
        'Apply to up to 3 jobs per month',
        'Basic profile page',
        'Standard email alerts'
      ],
      cta: 'Get Started Free',
      popular: false,
      btnClass: 'bg-[#00a86b] hover:bg-[#00915c] text-white font-medium py-3 px-4 rounded-xl w-full transition-all text-center text-sm block'
    },
    {
      name: 'Pro',
      id: 'seeker_pro',
      price: '$19',
      period: '/month',
      credits: 300,
      description: 'Our most popular option for serious active candidates looking to rapidly accelerate landing a role.',
      icon: <Star className="w-4 h-4 text-blue-400" />,
      iconBadge: 'bg-blue-950/40 border border-blue-800/40 p-2 rounded-xl',
      features: [
        'Apply to up to 30 jobs per month',
        'Unlimited saved jobs',
        'Advanced application tracking dashboard',
        'Comprehensive salary insights'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-[#1a62ff] hover:bg-[#1552d6] text-white font-medium py-3 px-4 rounded-xl w-full shadow-lg shadow-blue-600/30 transition-all text-center text-sm block'
    },
    {
      name: 'Premium',
      id: 'seeker_premium',
      price: '$39',
      period: '/month',
      credits: 800,
      description: 'Uncapped potential and priority visibility tools tailored for elite competitive talent placement.',
      icon: <Star className="w-4 h-4 text-purple-400" />,
      iconBadge: 'bg-purple-950/30 border border-purple-800/30 p-2 rounded-xl',
      features: [
        'Everything in Pro + Unlimited applications',
        'Profile boost directly to recruiter feeds',
        'Early access to freshly published jobs',
        '24/7 Priority customer support queue'
      ],
      cta: 'Go Premium',
      popular: false,
      btnClass: 'bg-[#212228] hover:bg-[#2b2d35] text-white border border-zinc-700/80 font-medium py-3 px-4 rounded-xl w-full transition-all text-center text-sm block'
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
      icon: <Briefcase className="w-4 h-4 text-zinc-300" />,
      iconBadge: 'bg-zinc-900 border border-zinc-800 p-2 rounded-xl',
      features: [
        'Up to 3 active job posts simultaneously',
        'Basic applicant management pipeline',
        'Standard organic listing search visibility',
        'Great for a company’s first year of hiring'
      ],
      cta: 'Start Free Posting',
      popular: false,
      btnClass: 'bg-[#00a86b] hover:bg-[#00915c] text-white font-medium py-3 px-4 rounded-xl w-full transition-all text-center text-sm block'
    },
    {
      name: 'Growth',
      id: 'recruiter_growth',
      price: '$49',
      period: '/month',
      credits: 600,
      description: 'Expanded allocation built for expanding companies with active multi-departmental team tracks.',
      icon: <Star className="w-4 h-4 text-blue-400" />,
      iconBadge: 'bg-blue-950/40 border border-blue-800/40 p-2 rounded-xl',
      features: [
        'Up to 10 active job posts simultaneously',
        'Full automated applicant tracking workflow',
        'Basic listing performance metrics & analytics',
        'Dedicated email support desk response'
      ],
      cta: 'Scale Your Hiring',
      popular: true,
      badgeText: 'MOST POPULAR',
      btnClass: 'bg-[#1a62ff] hover:bg-[#1552d6] text-white font-medium py-3 px-4 rounded-xl w-full shadow-lg shadow-blue-600/30 transition-all text-center text-sm block'
    },
    {
      name: 'Enterprise',
      id: 'recruiter_enterprise',
      price: '$149',
      period: '/month',
      credits: 1500,
      description: 'High performance structural operations for organizations with continuous large-scale talent acquisition.',
      icon: <Star className="w-4 h-4 text-purple-400" />,
      iconBadge: 'bg-purple-950/30 border border-purple-800/30 p-2 rounded-xl',
      features: [
        'Up to 50 active job posts simultaneously',
        'Advanced interactive analytics visual dashboard',
        'Premium featured job listing styling boosts',
        'Dedicated account manager + priority support'
      ],
      cta: 'Contact Sales',
      popular: false,
      btnClass: 'bg-[#212228] hover:bg-[#2b2d35] text-white border border-zinc-700/80 font-medium py-3 px-4 rounded-xl w-full transition-all text-center text-sm block'
    }
  ];

  const faqs = [
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, absolutely. All our premium tiers operate on flexible, non-binding month-to-month subscription structures. You can easily modify or cancel anytime.'
    },
    {
      question: 'How do refunds work if I change my mind?',
      answer: 'We maintain a 14-day satisfaction policy. Reach out to support within your initial two weeks for a full refund if you determine it is not a fit.'
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
    <div
      style={{ backgroundColor: '#07090e', color: '#ffffff' }}
      className="w-full min-h-screen bg-[#07090e] text-white py-16 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[#2563eb] font-semibold tracking-wider text-xs uppercase block">
            TRANSPARENT PRICING
          </span>
          <h1 style={{ color: '#ffffff' }} className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flexible plans tailored to your goals
          </h1>
          <p style={{ color: '#9ca3af' }} className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Whether you are an ambitious job seeker hunting for your next milestone or an expanding operation tracking down pristine talent, we have got you covered.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Category Toggle Switch */}
        <div className="flex justify-center w-full my-6">
          <div
            style={{ backgroundColor: '#131722', borderColor: '#1e2638' }}
            className="bg-[#131722] border border-[#1e2638] p-1.5 rounded-2xl flex items-center justify-center w-full max-w-xs mx-auto"
          >
            <button
              type="button"
              onClick={() => setCategory('seeker')}
              style={category === 'seeker' ? { backgroundColor: '#222834', color: '#ffffff' } : { color: '#9ca3af' }}
              className={`w-1/2 rounded-xl flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                category === 'seeker'
                  ? 'bg-[#222834] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Job Seekers</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('recruiter')}
              style={category === 'recruiter' ? { backgroundColor: '#222834', color: '#ffffff' } : { color: '#9ca3af' }}
              className={`w-1/2 rounded-xl flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                category === 'recruiter'
                  ? 'bg-[#222834] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>For Recruiters</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Container - Flex Row */}
        <div className="flex flex-col md:flex-row items-stretch justify-center md:justify-around gap-6 lg:gap-8 max-w-5xl mx-auto pt-4">
          {activePlans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#131722',
                borderColor: plan.popular ? '#2563eb' : '#1e2638'
              }}
              className={`bg-[#131722] border rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative transition-all w-full max-w-sm md:max-w-[340px] flex-1 ${
                plan.popular
                  ? 'border-2 border-[#2563eb] shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                  : 'border-[#1e2638] hover:border-zinc-700'
              }`}
            >
              {/* Featured Badge */}
              {plan.popular && (
                <span
                  style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                  className="bg-[#2563eb] text-white text-[10px] font-extrabold tracking-wide uppercase px-3 py-0.5 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 shadow-md"
                >
                  {plan.badgeText || 'MOST POPULAR'}
                </span>
              )}

              <div>
                {/* Card Title & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ color: '#ffffff' }} className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                  <div className={plan.iconBadge}>
                    {plan.icon}
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p style={{ color: '#9ca3af' }} className="text-xs text-zinc-400 min-h-[2.5rem] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="my-5 flex items-baseline">
                  <span style={{ color: '#ffffff' }} className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span style={{ color: '#6b7280' }} className="text-xs text-zinc-500 font-normal ml-1">{plan.period}</span>
                </div>

                <hr style={{ borderColor: '#1e2638' }} className="border-[#1e2638] mb-5" />

                {/* Checklist */}
                <ul className="space-y-3.5 my-5">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ color: '#d1d5db' }} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-[#00c885] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {plan.price === '$0' ? (
                  <Link href="/explore" className={plan.btnClass}>
                    {plan.cta}
                  </Link>
                ) : (
                  <button type="button" onClick={() => openCheckout(plan)} className={plan.btnClass}>
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4. Trust & Security Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-14 border-t border-[#1e2638]">
          <div style={{ backgroundColor: '#131722', borderColor: '#1e2638' }} className="p-6 rounded-2xl bg-[#131722] border border-[#1e2638] flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 style={{ color: '#ffffff' }} className="text-xs font-bold text-white uppercase tracking-wider">Stripe Escrow</h4>
              <p style={{ color: '#9ca3af' }} className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Credits remain safely protected in escrow until campaign approval.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#131722', borderColor: '#1e2638' }} className="p-6 rounded-2xl bg-[#131722] border border-[#1e2638] flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 shrink-0">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 style={{ color: '#ffffff' }} className="text-xs font-bold text-white uppercase tracking-wider">Instant Delivery</h4>
              <p style={{ color: '#9ca3af' }} className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Credits are instantly added to your wallet balance after checkout.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#131722', borderColor: '#1e2638' }} className="p-6 rounded-2xl bg-[#131722] border border-[#1e2638] flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/50 shrink-0">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 style={{ color: '#ffffff' }} className="text-xs font-bold text-white uppercase tracking-wider">Global Backing</h4>
              <p style={{ color: '#9ca3af' }} className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Accepted globally across 130+ currencies via Stripe Gateway.
              </p>
            </div>
          </div>
        </div>

        {/* 5. FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto border-t border-[#1e2638] pt-14 pb-8">
          <div className="text-center mb-8">
            <div style={{ backgroundColor: '#131722', borderColor: '#1e2638' }} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#131722] border border-[#1e2638] text-zinc-400 mb-3 shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 style={{ color: '#ffffff' }} className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p style={{ color: '#9ca3af' }} className="text-xs text-zinc-400 mt-1">Have concerns regarding billing pipelines? Find instant clarity below.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{ backgroundColor: '#131722', borderColor: '#1e2638' }}
                  className="bg-[#131722] border border-[#1e2638] rounded-2xl overflow-hidden transition-colors duration-200 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-4.5 gap-4 text-zinc-200 hover:text-white transition cursor-pointer"
                  >
                    <span className="text-sm font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-[#1e2638]' : 'max-h-0'
                    }`}
                  >
                    <div style={{ backgroundColor: '#0b0d14' }} className="p-4 sm:p-5 text-xs text-zinc-400 leading-relaxed bg-[#0b0d14]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl space-y-5 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-zinc-400">Checkout for {selectedPkg.name} Plan ({selectedPkg.price})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStripeModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
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
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-white text-sm">{selectedPkg.name} Plan</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">Total Charge</span>
                <span className="font-black text-blue-400 text-base">{selectedPkg.price}.00 USD</span>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleStripePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Card Number (Stripe Test Card: 4242 4242 4242 4242)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay ${selectedPkg.price}.00 & Activate Plan`}</span>
                </button>
              </div>

              <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1">
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
