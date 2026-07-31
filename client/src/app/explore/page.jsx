'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Search, Filter, Coins, Clock, Target, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Explore Approved <span className="gradient-text">Campaigns</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover verified tech, environmental, and community projects. Support creators with your available credits.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl mb-12 space-y-6 bg-white border border-slate-200 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search campaigns by title or story..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="raised">Highest Raised</option>
                <option value="goal">Highest Goal</option>
                <option value="deadline">Ending Soonest</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
            <p className="text-slate-500 font-medium">No campaigns match your selected criteria.</p>
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
                  className="glass-card bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 border border-slate-200 shadow-sm hover:shadow-md"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-700 border border-slate-200 shadow-sm">
                      {campaign.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {campaign.story}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-indigo-700 font-semibold flex items-center space-x-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{campaign.amountRaised || 0} Raised</span>
                        </span>
                        <span className="text-slate-500 font-medium">{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3 text-slate-400" />
                          <span>Goal: {campaign.fundingGoal} Credits</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-400" />
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-12 text-center text-slate-500">Loading campaigns...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
