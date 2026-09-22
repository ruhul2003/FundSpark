'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  Trophy,
  Award,
  Crown,
  Medal,
  Flame,
  Sparkles,
  Coins,
  Compass,
  Search,
  Users,
  Target,
  ArrowUpRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('backers');
  const [data, setData] = useState({
    topBackers: [],
    topCampaigns: [],
    topCreators: [],
    overview: {
      totalCampaigns: 0,
      totalMembers: 0,
      totalContributionsCount: 0,
      totalCreditsMobilized: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/stats/leaderboard`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 font-black flex items-center justify-center shadow-lg shadow-amber-400/30 ring-2 ring-amber-300">
          <Crown className="w-4 h-4 fill-amber-900" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black flex items-center justify-center shadow-md ring-2 ring-slate-300">
          <Medal className="w-4 h-4 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-black flex items-center justify-center shadow-md ring-2 ring-amber-600">
          <Award className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
        #{rank}
      </div>
    );
  };

  const filteredBackers = (data.topBackers || []).filter(
    (b) =>
      b.supporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.badge?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCampaigns = (data.topCampaigns || []).filter(
    (c) =>
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.creatorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCreators = (data.topCreators || []).filter((c) =>
    c.creatorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 sm:p-12 border border-indigo-500/20 shadow-2xl overflow-hidden text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Champions & Hall of Fame</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Community <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Leaderboard</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Celebrating our visionary creators and most dedicated backers whose contributions fuel life-changing ideas around the world.
            </p>
          </div>

          {/* Platform Impact Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Mobilized</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {(data.overview?.totalCreditsMobilized || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Total Credits Pledged</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Projects</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {data.overview?.totalCampaigns || 0}
              </div>
              <span className="text-[11px] text-slate-400">Active Campaigns</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Contributions</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {data.overview?.totalContributionsCount || 0}
              </div>
              <span className="text-[11px] text-slate-400">Approved Pledges</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1.5 text-sky-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Community</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {data.overview?.totalMembers || 0}
              </div>
              <span className="text-[11px] text-slate-400">Total Members</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-200 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300/80 dark:border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('backers')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'backers'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Top Backers</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'campaigns'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Top Campaigns</span>
            </button>

            <button
              onClick={() => setActiveTab('creators')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'creators'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Top Creators</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Tab 1: Top Backers */}
        {activeTab === 'backers' && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-4">Loading hall of fame backers...</p>
              </div>
            ) : filteredBackers.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Trophy className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Backer Records Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first supporter to back campaigns on FundSpark and claim your spot atop the community leaderboard!
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Campaigns</span>
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredBackers.map((backer) => (
                    <div
                      key={backer.rank}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(backer.rank)}

                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5 shrink-0">
                          <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                            {backer.supporterName?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {backer.supporterName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                backer.rank === 1
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                  : backer.rank === 2
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                              }`}
                            >
                              {backer.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            {backer.maskedEmail} &bull; {backer.campaignsCount} campaigns backed
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1.5">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{(backer.totalContributed || 0).toLocaleString()}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {backer.contributionsCount} total contributions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Top Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-4">Loading top funded campaigns...</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <Flame className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Campaigns Listed</h3>
                <p className="text-xs text-slate-500">No campaigns match the current criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCampaigns.map((camp) => (
                  <Link
                    key={camp._id}
                    href={`/campaigns/${camp._id}`}
                    className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {getRankBadge(camp.rank)}
                          <div>
                            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                              {camp.category}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {camp.title}
                            </h3>
                          </div>
                        </div>

                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </div>

                      <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={camp.imageUrl}
                          alt={camp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-baseline text-xs">
                        <div className="flex items-center gap-1 font-extrabold text-indigo-600 dark:text-indigo-400">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{camp.amountRaised?.toLocaleString()} Credits</span>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {camp.percentFunded}% funded
                        </span>
                      </div>

                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-sky-400 rounded-full"
                          style={{ width: `${camp.percentFunded}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Goal: {camp.fundingGoal}</span>
                        <span>Creator: {camp.creatorName}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Top Creators */}
        {activeTab === 'creators' && (
          <div className="space-y-4">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 mt-4">Loading top creators...</p>
              </div>
            ) : filteredCreators.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <TrendingUp className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No Creators Found</h3>
                <p className="text-xs text-slate-500">Launch a campaign to join the hall of fame creators!</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredCreators.map((creator) => (
                    <div
                      key={creator.rank}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getRankBadge(creator.rank)}

                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shrink-0">
                          <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                            {creator.creatorName?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {creator.creatorName}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Innovator
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">
                            {creator.campaignsCount} campaigns published
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1.5">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span>{(creator.totalRaised || 0).toLocaleString()}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">Total Credits Raised</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
