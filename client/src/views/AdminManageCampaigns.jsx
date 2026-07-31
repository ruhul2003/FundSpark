'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminManageCampaignsView() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/campaigns/all`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching all campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCampaigns();
  }, []);

  const handleDeleteCampaign = async (id, title) => {
    if (!window.confirm(`Admin Action: Are you sure you want to delete campaign "${title}"?`)) return;

    try {
      await axios.delete(`${API_URL}/campaigns/${id}`);
      await fetchAllCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete campaign');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Campaigns</h1>
        <p className="text-xs text-slate-400">Directory of all campaigns across the platform with moderation options</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading campaign directory...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No campaigns found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Creator Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Raised / Goal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {campaigns.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white max-w-xs truncate">{c.title}</td>
                    <td className="p-3 text-slate-300">{c.creatorName}</td>
                    <td className="p-3">{c.category}</td>
                    <td className="p-3 font-bold text-amber-400">
                      {c.amountRaised || 0} / {c.fundingGoal} Credits
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.isSuspended ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        c.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {c.isSuspended ? 'Suspended' : c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/campaigns/${c._id}`}
                        target="_blank"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteCampaign(c._id, c.title)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
