'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Flame, Coins, ArrowRight, Clock, Target } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TopCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await axios.get(`${API_URL}/campaigns/top`);
        setCampaigns(res.data);
      } catch (err) {
        console.error('Error fetching top campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCampaigns();
  }, []);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Featured Projects</span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Top Trending <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 dark:from-indigo-300 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">Campaigns</span>
            </h2>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl text-slate-500 dark:text-slate-400">
            No top campaigns currently available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => {
              const progressPercentage = Math.min(
                100,
                Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100)
              );

              return (
                <div
                  key={campaign._id}
                  className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col transition-all transform hover:-translate-y-1 hover:shadow-lg border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      {campaign.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {campaign.story}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-700 dark:text-indigo-400 font-semibold flex items-center space-x-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{campaign.amountRaised || 0} Credits Raised</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-slate-400" />
                          <span>Goal: {campaign.fundingGoal}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white dark:hover:text-white border border-indigo-200 dark:border-indigo-500/30 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopCampaigns;
