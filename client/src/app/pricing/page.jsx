'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Rocket,
  Check,
  Coins,
  Zap,
  Sparkles,
  ShieldCheck,
  Globe,
  HelpCircle,
  ChevronDown,
  X,
  Lock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PricingSection() {
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('supporters'); // 'supporters' | 'creators'
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

  // Supporters Credit Plans
  const supporterPlans = [
    {
      name: 'Starter Backer',
      credits: 100,
      description: 'Ideal baseline credit bundle to back innovative campaigns, support creators, and claim rewards.',
      price: '$10',
      period: '/one-time',
      icon: <Heart className="w-5 h-5 text-emerald-400" />,
      popular: false,
      buttonText: 'Buy 100 Credits',
      buttonVariant: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
      features: [
        '100 Instant Supporter Credits',
        'Back up to 10 active crowdfunding campaigns',
        'Exclusive supporter updates & project posts',
        'Lifetime credit validity (Never expires)',
      ],
    },
    {
      name: 'Pro Supporter',
      credits: 300,
      description: 'Our most popular bundle for active backers looking to boost campaigns and gain priority perks.',
      price: '$25',
      period: '/one-time',
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      popular: true,
      buttonText: 'Buy 300 Credits',
      buttonVariant: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30',
      features: [
        '300 Instant Supporter Credits (+30 Bonus)',
        'Early access to high-impact campaign launches',
        'Supporter leaderboard badge & priority updates',
        'Fast-track customer support queue',
      ],
    },
    {
      name: 'VIP Backer',
      credits: 800,
      description: 'Maximum credit volume tailored for major backers, angel supporters, and community champions.',
      price: '$60',
      period: '/one-time',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      popular: false,
      buttonText: 'Buy 800 Credits',
      buttonVariant: 'bg-purple-600/90 hover:bg-purple-500 text-white border border-purple-400/30 shadow-md',
      features: [
        '800 Instant Supporter Credits (+100 Bonus)',
        'Verified VIP Backer profile badge & top ranking',
        'Direct messaging access to campaign creators',
        '24/7 Priority support queue',
      ],
    },
  ];

  // Creators Credit Plans
  const creatorPlans = [
    {
      name: 'Creator Launch',
      credits: 100,
      description: 'Essential credit package for launching and featuring your first crowdfunding campaign.',
      price: '$49',
      period: '/one-time',
      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
      popular: false,
      buttonText: 'Launch Campaign',
      buttonVariant: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20',
      features: [
        '100 Instant Creator Credits',
        'Launch up to 2 active crowdfunding campaigns',
        'Basic campaign analytics & backer tracking',
        'Email notifications for new supporter pledges',
      ],
    },
    {
      name: 'Pro Campaign',
      credits: 300,
      description: 'Built for ambitious creators seeking featured homepage placement and backer outreach tools.',
      price: '$149',
      period: '/one-time',
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      popular: true,
      buttonText: 'Promote Campaign',
      buttonVariant: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30',
      features: [
        '300 Instant Creator Credits (+30 Bonus)',
        'Featured campaign badge & top search placement',
        'Direct backer messaging & updates broadcast',
        'Advanced campaign analytics & conversion insights',
      ],
    },
    {
      name: 'Enterprise Creator',
      credits: 800,
      description: 'Unrestricted credit allocation with dedicated promotion management for large-scale campaigns.',
      price: '$299',
      period: '/one-time',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      popular: false,
      buttonText: 'Scale Campaign',
      buttonVariant: 'bg-purple-600/90 hover:bg-purple-500 text-white border border-purple-400/30 shadow-md',
      features: [
        '800 Instant Creator Credits (+100 Bonus)',
        'Unlimited active campaign launches & featured placement',
        'Custom campaign media formatting & video highlights',
        '24/7 Dedicated campaign manager & priority support',
      ],
    },
  ];

  const faqs = [
    {
      question: 'Do purchased credits ever expire?',
      answer: 'No! All credit packages purchased on FundSpark come with lifetime validity. Your balance remains completely safe in your account until you choose to use it.'
    },
    {
      question: 'How do credit top-ups work?',
      answer: 'Credits are instantly added to your wallet balance upon checkout via our Stripe Payment Gateway. You can use them immediately to back projects or feature campaigns.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We support all major international credit and debit cards including Visa, Mastercard, American Express, and Discover through secure Stripe processing.'
    }
  ];

  const currentPlans = activeTab === 'supporters' ? supporterPlans : creatorPlans;

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
        packageName: `${selectedPkg.name} (${selectedPkg.credits} credits)`,
        paymentIntentId: intentRes.data.clientSecret
      });

      setSuccessMsg(`Successfully purchased ${selectedPkg.name} (+${selectedPkg.credits} credits added to your wallet balance)!`);
      await refreshUserData();
      setShowStripeModal(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <section className="bg-[#0b0c0e] min-h-screen text-white py-20 px-4 flex flex-col items-center justify-center font-sans">
      <div className="max-w-7xl w-full mx-auto text-center space-y-4">

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
          <Coins className="w-3.5 h-3.5" />
          <span>TRANSPARENT CREDIT PRICING</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          Flexible credit plans built for your goals
        </h2>

        {/* Subtitle Description */}
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Whether you are a passionate supporter backing groundbreaking ideas or a creator bringing innovations to life, buy credits with zero hidden fees and lifetime validity.
        </p>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Toggle Controls */}
        <div className="pt-6 pb-10 flex justify-center">
          <div className="bg-[#16181d] p-1.5 rounded-2xl inline-flex border border-zinc-800/80 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('supporters')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'supporters'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Supporters</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('creators')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'creators'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>Creators</span>
            </button>
          </div>
        </div>

        {/* 3 CARDS IN 1 ROW - FLEX CONTAINER */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-5 lg:gap-6 text-left my-8 max-w-7xl mx-auto px-2 sm:px-4">
          {currentPlans.map((plan, index) => (
            <div
              key={index}
              className={`flex-1 w-full max-w-[400px] relative bg-[#121318] rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 border ${
                plan.popular
                  ? 'border-blue-600 ring-1 ring-blue-600/50 shadow-2xl shadow-blue-900/20'
                  : 'border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-wider shadow-md border border-blue-400/40">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Header: Name + Icon */}
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide block mt-0.5">
                      {plan.credits} Credits Package
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                    {plan.icon}
                  </div>
                </div>

                {/* Card Description */}
                <p className="text-zinc-400 text-xs leading-relaxed min-h-[42px] mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-zinc-400 text-xs font-medium">{plan.period}</span>
                </div>

                {/* Divider Line */}
                <div className="h-px bg-zinc-800/80 w-full my-6" />

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3 text-xs text-zinc-300 leading-snug">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Button */}
              <button
                type="button"
                onClick={() => openCheckout(plan)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${plan.buttonVariant}`}
              >
                <span>{plan.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-14 border-t border-zinc-800/80 text-left">
          <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800/80 flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 shrink-0 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">256-Bit SSL Encrypted</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Transactions processed safely through official Stripe Payment Gateway encryption.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800/80 flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 shrink-0 text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Instant Credit Top-Up</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Credits are added directly to your wallet balance for immediate use right after checkout.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121318] border border-zinc-800/80 flex items-start gap-4 shadow-md">
            <div className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/30 shrink-0 text-purple-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Lifetime Validity</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Purchased credits never expire. Use your credits whenever you need to achieve your goals.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto border-t border-zinc-800/80 pt-14 text-left">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#121318] border border-zinc-800 text-blue-400 mb-3 shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">Have questions regarding credit purchases? Here are fast answers.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#121318] border border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left p-5 gap-4 text-zinc-200 hover:text-white transition cursor-pointer"
                  >
                    <span className="text-sm font-bold">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-zinc-800/80' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 text-xs sm:text-sm text-zinc-400 leading-relaxed bg-[#0b0c0e]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in text-left">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-[#0f121d] shadow-2xl space-y-6 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Stripe Payment Gateway</h3>
                  <p className="text-xs text-zinc-400">Checkout for {selectedPkg.name} ({selectedPkg.price})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStripeModal(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#080a12] border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400 block text-[11px]">Selected Package</span>
                <span className="font-bold text-white text-sm">{selectedPkg.name}</span>
                <span className="text-emerald-400 text-xs block font-semibold">{selectedPkg.credits} Credits</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">Total Charge</span>
                <span className="font-black text-blue-400 text-base">{selectedPkg.price}.00 USD</span>
              </div>
            </div>

            {/* Stripe Card Form */}
            <form onSubmit={handleStripePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#121624] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Card Number (Stripe Test Card: 4242 4242 4242 4242)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-[#121624] border border-zinc-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    placeholder="12/28"
                    className="w-full bg-[#121624] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-[#121624] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={purchasing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>{purchasing ? 'Processing Stripe Payment...' : `Pay ${selectedPkg.price}.00 & Add ${selectedPkg.credits} Credits`}</span>
                </button>
              </div>

              <p className="text-[10px] text-zinc-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted via Official Stripe Gateway</span>
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}