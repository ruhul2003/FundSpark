'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Search, Filter, Coins, Clock, Target, ArrowRight, X, RotateCcw, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import BookmarkButton from '../../components/BookmarkButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function ExploreContent() {
  const searchParams = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [goalRange, setGoalRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const categories = ['All', 'Technology', 'Environment', 'Education', 'Health', 'Art', 'Community'];

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (sortBy) params.append('sort', sortBy);

      const res = await axios.get(`${API_URL}/campaigns?${params.toString()}`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
    setGoalRange('all');
    setStatusFilter('all');
  };

  const isFiltered = searchTerm || selectedCategory !== 'All' || sortBy !== 'newest' || goalRange !== 'all' || statusFilter !== 'all';

  const filteredCampaigns = campaigns.filter((c) => {
    if (goalRange === 'under500' && c.fundingGoal >= 500) return false;
    if (goalRange === '500to2000' && (c.fundingGoal < 500 || c.fundingGoal > 2000)) return false;
    if (goalRange === 'above2000' && c.fundingGoal <= 2000) return false;

    if (statusFilter === 'funded' && (c.amountRaised || 0) < c.fundingGoal) return false;
    if (statusFilter === 'active' && (c.amountRaised || 0) >= c.fundingGoal) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Explore Approved <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 dark:from-indigo-300 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">Campaigns</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover verified tech, environmental, and community projects. Support creators with your available credits.
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl mb-8 space-y-6 shadow-sm">
          {/* Search Row */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search campaigns by title or story..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Search
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1 text-indigo-500" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="raised">Highest Raised</option>
                <option value="goal">Highest Goal</option>
                <option value="deadline">Ending Soonest</option>
              </select>
            </div>
          </div>

          {/* Extended Filters: Goal Range & Funding Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Goal:</span>
                <select
                  value={goalRange}
                  onChange={(e) => setGoalRange(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">Any Goal</option>
                  <option value="under500">&lt; 500 Credits</option>
                  <option value="500to2000">500 - 2,000 Credits</option>
                  <option value="above2000">&gt; 2,000 Credits</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Fundraising</option>
                  <option value="funded">100% Funded</option>
                </select>
              </div>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6 px-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing <strong className="text-slate-900 dark:text-white">{filteredCampaigns.length}</strong> active campaigns</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-16 text-center rounded-2xl shadow-sm space-y-3">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No campaigns match your selected criteria.</p>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => {
              const progressPercentage = Math.min(
                100,
                Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100)
              );

              return (
                <div
                  key={campaign._id}
                  className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/40 dark:hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                      {campaign.category}
                    </span>
                    <div className="absolute top-3 right-3 z-10">
                      <BookmarkButton campaignId={campaign._id} />
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
                          <span>{campaign.amountRaised || 0} Raised</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>Goal: {campaign.fundingGoal} Credits</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
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
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-12 text-center text-slate-500 dark:text-slate-400">Loading campaigns...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
