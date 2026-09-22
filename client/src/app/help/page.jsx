'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  Coins,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Zap,
  Mail,
  FileQuestion,
  LifeBuoy
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const FAQS = [
  {
    category: 'Credits & Payments',
    question: 'How does the FundSpark credit system work?',
    answer: 'FundSpark operates on a secure, transparent credit currency system. Supporters purchase credit packages via our Stripe-powered payment gateway (1 Credit ≈ $1.00 USD). Credits are stored in your secure digital wallet and can be pledged to any verified campaign.'
  },
  {
    category: 'Backers & Pledges',
    question: 'What happens to my credits if a campaign does not reach its funding goal?',
    answer: 'FundSpark uses an escrow protection mechanism. If a campaign is cancelled or deleted before fulfillment, your pledged credits are automatically refunded directly back to your available credit balance with instant notification.'
  },
  {
    category: 'Creators & Campaigns',
    question: 'How do I submit a new campaign and get it approved?',
    answer: 'Creators can go to their Creator Dashboard and click "Add New Campaign". Provide your project story, funding goal, deadline, category, image, and reward details. Our platform administrators review campaigns for community guidelines compliance within 24-48 hours.'
  },
  {
    category: 'Creators & Campaigns',
    question: 'When and how can creators withdraw their raised funds?',
    answer: 'Once your campaign receives approved backer contributions, creators can submit a withdrawal request from the Creator Dashboard > Withdrawals view. Specify your preferred payout method (Bank Wire, PayPal, or Stripe Transfer). Admin verifies and releases the payout.'
  },
  {
    category: 'Trust & Security',
    question: 'Are backer payments and personal information secure?',
    answer: 'Yes! All financial transactions are processed using industry-standard 256-bit SSL encryption and Stripe payment processing. We never store raw credit card numbers on our servers, and all communications are strictly encrypted.'
  },
  {
    category: 'Credits & Payments',
    question: 'Do I get free bonus credits when signing up?',
    answer: 'Yes! When you register a new account on FundSpark, supporters receive 50 complimentary welcome credits, and creators receive 20 bonus credits to immediately start interacting with the community.'
  }
];

export default function HelpCenterPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'General Inquiry',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const categories = ['All', 'Credits & Payments', 'Backers & Pledges', 'Creators & Campaigns', 'Trust & Security'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFeedback({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/inquiries`, {
        ...formData,
        userId: user?._id || null
      });

      setFeedback({
        type: 'success',
        message: res.data.message || 'Support inquiry submitted successfully!',
        ticketId: res.data.ticketId
      });

      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        category: 'General Inquiry',
        subject: '',
        message: '',
        priority: 'normal'
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit inquiry. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>FundSpark Knowledge & Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How can we <span className="text-indigo-600 dark:text-indigo-400">help you</span> today?
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Search our comprehensive knowledge base or submit a ticket directly to the platform team.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search answers, policies, credit questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileQuestion className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions ({filteredFaqs.length})
            </h2>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching answers found for "{searchTerm}". Try a different keyword or submit a message below.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact / Support Ticket Form */}
        <div className="bg-gradient-to-br from-indigo-950/20 via-white dark:via-slate-900 to-white dark:to-slate-900 rounded-3xl border border-indigo-200/80 dark:border-indigo-900/40 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Submit a Support Ticket / Inquiry</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Need specialized assistance with pledges, campaign approvals, or platform policies?
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Average response: &lt; 24h</span>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{feedback.message}</p>
                {feedback.ticketId && (
                  <p className="font-mono text-[11px] mt-1 text-emerald-800 dark:text-emerald-200">
                    Ticket Reference: #{feedback.ticketId}
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Topic *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Backer & Credits">Backer & Credits</option>
                  <option value="Campaign Verification">Campaign Verification</option>
                  <option value="Creator Support">Creator Support</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Message *
              </label>
              <textarea
                rows="4"
                placeholder="Please describe your question or issue in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
