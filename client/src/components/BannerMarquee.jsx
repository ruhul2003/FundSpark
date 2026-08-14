'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Zap,
  Flame,
  ShieldCheck,
  Coins,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const marqueeItems = [
  {
    icon: TrendingUp,
    badge: 'TRENDING',
    badgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    text: 'EcoTech Solar Water Purifier — 92% Funded ($46,000 / $50,000)',
    link: '/explore'
  },
  {
    icon: Zap,
    badge: 'PLATFORM STAT',
    badgeStyle: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    text: '$2.4M+ Total Pledged across 1,200+ Verified Crowdfunding Projects',
    link: '/explore'
  },
  {
    icon: Flame,
    badge: 'NEW LAUNCH',
    badgeStyle: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    text: 'AI Healthcare Diagnostic Assistant — 500+ Active Backers Joined',
    link: '/explore'
  },
  {
    icon: ShieldCheck,
    badge: 'VERIFIED ESCROW',
    badgeStyle: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    text: '100% Transparent Milestone Payouts & Escrow Pledged Credits Protection',
    link: '/pricing'
  },
  {
    icon: Coins,
    badge: 'CREATOR BONUS',
    badgeStyle: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    text: 'Get 100 Welcome Credits on New Campaign Registration & Instant Boost',
    link: '/pricing'
  },
  {
    icon: Award,
    badge: 'VIP PERKS',
    badgeStyle: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    text: 'Angel Supporters unlock direct creator access & exclusive reward badges',
    link: '/pricing'
  }
];

const BannerMarquee = () => {
  // Duplicate array twice to guarantee continuous 100% smooth infinite marquee scroll
  const duplicatedItems = [...marqueeItems, ...marqueeItems];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 border-y border-indigo-500/20 shadow-md backdrop-blur-md z-30 transition-colors duration-300">
      
      {/* Side Fade Gradient Overlays for Smooth Visual Edges */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-900 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-900 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

      {/* Marquee Content Wrapper */}
      <div className="py-2.5 sm:py-3 flex items-center">
        
        {/* Fixed Left Live Indicator Tag */}
        <div className="hidden sm:flex items-center space-x-2 pl-4 pr-3 py-1 bg-indigo-600/90 text-white rounded-r-full text-[11px] font-black tracking-wider uppercase shadow-sm z-20 shrink-0 border-r border-indigo-400/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5" />
          <span>LIVE</span>
        </div>

        {/* Animated Infinite Marquee Container */}
        <div className="animate-marquee flex items-center space-x-6 sm:space-x-8">
          {duplicatedItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={idx}
                href={item.link}
                className="group flex items-center space-x-3 px-3 py-1 rounded-xl hover:bg-white/10 dark:hover:bg-slate-800/60 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <div className={`flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border tracking-wider uppercase ${item.badgeStyle}`}>
                  <IconComponent className="w-3 h-3" />
                  <span>{item.badge}</span>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                  {item.text}
                </span>

                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerMarquee;
