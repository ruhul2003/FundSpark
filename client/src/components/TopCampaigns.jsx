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
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Highest Funded</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Top Funded <span className="gradient-text">Campaigns</span>
            </h2>
          </div>
          <Link
            href="/explore"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl text-slate-400">
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
                  className="glass-card rounded-2xl overflow-hidden flex flex-col transition-all transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-300 border border-slate-700">
                      {campaign.category}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white line-clamp-1 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {campaign.story}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-400 font-semibold flex items-center space-x-1">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <span>{campaign.amountRaised || 0} Credits Raised</span>
                        </span>
                        <span className="text-slate-400 font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-slate-500" />
                          <span>Goal: {campaign.fundingGoal}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-xs flex items-center justify-center space-x-2 transition-all"
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
