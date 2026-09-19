'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, Coins, Zap, Shield, Trophy, Award } from 'lucide-react';

export default function CreditCalculator({ isDark = true }) {
  const [credits, setCredits] = useState(300);

  // Calculate pricing with volume discount
  const getPrice = (num) => {
    let rate = 0.1; // $0.10 per credit
    if (num >= 2000) rate = 0.08; // 20% discount
    else if (num >= 500) rate = 0.09; // 10% discount
    return (num * rate).toFixed(2);
  };

  const getTier = (num) => {
    if (num >= 2500) return { name: 'Platinum Innovator', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    if (num >= 1000) return { name: 'Gold Supporter', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (num >= 300) return { name: 'Silver Backer', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    return { name: 'Bronze Explorer', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const tier = getTier(credits);
  const estimatedProjects = Math.max(1, Math.floor(credits / 25));

  const presets = [100, 300, 500, 1000, 2500];

  return (
    <div
      className={`max-w-4xl mx-auto rounded-3xl p-8 border transition-all duration-300 shadow-xl space-y-6 ${
        isDark
          ? 'bg-gradient-to-b from-[#161821] to-[#0f1015] border-zinc-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 transition-colors border-inherit">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Interactive Credit Impact Calculator</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-400">
              Estimate your platform contribution power, volume savings, and backer privileges
            </p>
          </div>
        </div>

        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${tier.badge} flex items-center gap-1.5 w-fit`}>
          <Trophy className="w-3.5 h-3.5" />
          <span>{tier.name}</span>
        </span>
      </div>

      {/* Slider Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Select Desired Credits
          </label>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {credits}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Credits</span>
          </div>
        </div>

        <input
          type="range"
          min={50}
          max={5000}
          step={25}
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">Quick Select:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCredits(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                credits === preset
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className={`p-4 rounded-2xl border transition-colors ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">
            Estimated Cost
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white">${getPrice(credits)}</span>
            <span className="text-[10px] text-emerald-500 font-bold">
              {credits >= 2000 ? '20% Off' : credits >= 500 ? '10% Off' : 'Standard'}
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-colors ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">
            Projects Supported
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">~{estimatedProjects}</span>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500">Campaigns</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-colors ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 block">
            Bonus Privileges
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{credits >= 1000 ? 'VIP Leaderboard + Discord' : 'Verified Backer Badge'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
