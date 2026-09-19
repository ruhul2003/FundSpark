'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trophy, Coins, MessageSquareQuote, HeartHandshake, Sparkles } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CampaignBackersSection({ campaignId }) {
  const [data, setData] = useState({ totalBackers: 0, totalRaised: 0, backers: [], topBackers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBackers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/contributions/campaign/${campaignId}/backers`);
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load backers:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (campaignId) fetchBackers();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6 text-slate-900 dark:text-slate-100">
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Backer Community</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                {data.totalBackers} Backers
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Supporters bringing this vision to life</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 w-fit">
          <Coins className="w-4 h-4 text-amber-500" />
          <span>{data.totalRaised} Credits Pledged</span>
        </div>
      </div>

      {/* Top Supporters Podium */}
      {data.topBackers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Top Contributors</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.topBackers.slice(0, 3).map((backer, idx) => (
              <div
                key={backer._id}
                className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/30 dark:to-transparent border border-indigo-100 dark:border-indigo-900/40 space-y-1 relative"
              >
                <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  #{idx + 1}
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white block truncate pr-6">
                  {backer.supporterName}
                </span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span>{backer.amount} Credits</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backers List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          All Backers
        </h4>

        {data.backers.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No public backers yet</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Be the very first backer to support this campaign!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.backers.map((backer) => (
              <div key={backer._id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {backer.supporterName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {new Date(backer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {backer.message && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic flex items-center gap-1">
                      <MessageSquareQuote className="w-3 h-3 text-indigo-400 shrink-0 inline" />
                      <span>"{backer.message}"</span>
                    </p>
                  )}
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 shrink-0">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>{backer.amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
