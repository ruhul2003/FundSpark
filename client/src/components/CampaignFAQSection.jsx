'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Gift, Coins, Clock, Sparkles } from 'lucide-react';

export default function CampaignFAQSection({ campaign }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How does backing with platform credits work?',
      icon: Coins,
      answer: `When you pledge credits to "${campaign?.title || 'this project'}", your credits are held in platform escrow until the campaign reaches its deadline or funding target. You will receive an immediate confirmation and appear in the campaign backer showcase.`
    },
    {
      question: 'What happens if the project does not reach its funding goal?',
      icon: ShieldCheck,
      answer: 'FundSpark operates with full escrow protection. If a campaign is canceled, removed, or fails to meet the creator verification requirements, 100% of your pledged credits are automatically refunded to your available platform balance.'
    },
    {
      question: 'How do I claim my backer reward?',
      icon: Gift,
      answer: `This campaign offers: "${campaign?.rewardInfo || 'Special thank you badge & digital updates'}". Once the campaign concludes successfully, the creator will contact you directly via your registered email or release digital rewards via the Updates tab.`
    },
    {
      question: 'When is the deadline for this campaign?',
      icon: Clock,
      answer: `This campaign is scheduled to conclude on ${campaign?.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'the specified deadline'}. Pledges remain active until that date.`
    },
    {
      question: 'Can I discuss or ask questions directly to the creator?',
      icon: HelpCircle,
      answer: 'Yes! Navigate to the "Community & Q&A" tab right above to post questions or encouraging comments. The creator and fellow backers receive real-time notifications and can reply directly.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Clear information on funding, rewards, and escrow safety</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Escrow Protected</span>
        </span>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20'
                  : 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'transform rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100/60 dark:border-slate-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
