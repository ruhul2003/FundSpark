'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Bookmark, Coins, Clock, ArrowRight, Trash2, Heart, Compass } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SavedCampaignsView() {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchSavedCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bookmarks`);
      setSavedList(res.data);
    } catch (err) {
      console.error('Error fetching saved campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCampaigns();
  }, []);

  const handleRemove = async (campaignId) => {
    try {
      setRemovingId(campaignId);
      await axios.post(`${API_URL}/bookmarks/${campaignId}`);
      setSavedList((prev) => prev.filter((item) => item.campaign._id !== campaignId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove saved campaign');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Campaigns</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Campaigns you have bookmarked to follow or support later
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all w-fit"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Explore More</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : savedList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 mx-auto flex items-center justify-center text-rose-500">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No saved campaigns yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Whenever you find an innovative project you like on the explore page, click the heart button to save it here.
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Projects</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map(({ campaign, savedAt }) => {
            const progress = Math.min(
              100,
              Math.round(((campaign.amountRaised || 0) / (campaign.fundingGoal || 1)) * 100)
            );

            return (
              <div
                key={campaign._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {campaign.category}
                  </span>
                  <button
                    onClick={() => handleRemove(campaign._id)}
                    disabled={removingId === campaign._id}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {campaign.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {campaign.story}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{campaign.amountRaised || 0} Credits</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-bold">{progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>Goal: {campaign.fundingGoal}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/campaigns/${campaign._id}`}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>View & Support Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
