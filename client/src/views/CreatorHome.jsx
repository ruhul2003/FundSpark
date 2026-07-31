'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderKanban, Flame, Coins, Eye, CheckCircle2, XCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreatorHomeView() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, totalAmountRaised: 0 });
  const [pendingContributions, setPendingContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedContribution, setSelectedContribution] = useState(null);

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      const [statsRes, contribRes] = await Promise.all([
        axios.get(`${API_URL}/stats/creator`),
        axios.get(`${API_URL}/contributions/creator`)
      ]);
      setStats(statsRes.data);
      setPendingContributions(contribRes.data);
    } catch (err) {
      console.error('Error fetching creator home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_URL}/contributions/${id}/approve`);
      setSelectedContribution(null);
      await fetchCreatorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_URL}/contributions/${id}/reject`);
      setSelectedContribution(null);
      await fetchCreatorData();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Creator Overview</h1>
        <p className="text-xs text-slate-400">Track your campaign analytics and review backer contributions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Campaigns</span>
            <span className="text-2xl font-extrabold text-white">{stats.totalCampaigns}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Campaigns</span>
            <span className="text-2xl font-extrabold text-white">{stats.activeCampaigns}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Raised Credits</span>
            <span className="text-2xl font-extrabold text-amber-400">{stats.totalAmountRaised}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Contributions To Review</h2>

        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading pending contributions...</div>
        ) : pendingContributions.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No pending contributions to review.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Supporter Name</th>
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Pledged Credits</th>
                  <th className="p-3">Detail</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingContributions.map((contrib) => (
                  <tr key={contrib._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{contrib.supporterName}</td>
                    <td className="p-3 text-slate-300">{contrib.campaignTitle}</td>
                    <td className="p-3 font-bold text-amber-400">{contrib.amount} Credits</td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedContribution(contrib)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 font-semibold flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(contrib._id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(contrib._id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-4 relative">
            <button
              onClick={() => setSelectedContribution(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white">Contribution Details</h3>
            <div className="space-y-2 text-xs text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <p><strong className="text-slate-400">Supporter:</strong> {selectedContribution.supporterName} ({selectedContribution.supporterEmail})</p>
              <p><strong className="text-slate-400">Campaign:</strong> {selectedContribution.campaignTitle}</p>
              <p><strong className="text-slate-400">Amount:</strong> <span className="text-amber-400 font-bold">{selectedContribution.amount} Credits</span></p>
              <p><strong className="text-slate-400">Message:</strong> {selectedContribution.message || 'No message attached'}</p>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => handleReject(selectedContribution._id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Reject & Refund
              </button>
              <button
                onClick={() => handleApprove(selectedContribution._id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Approve Contribution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
