'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FolderKanban, Coins, DollarSign, ShieldCheck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminHomeView() {
  const [stats, setStats] = useState({
    totalSupporters: 0,
    totalCreators: 0,
    totalAvailableCredits: 0,
    totalPaymentsProcessed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats/admin`);
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Operations Center</h1>
        <p className="text-xs text-slate-400">Platform metrics, user management, and campaign moderation</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Supporters</span>
            <span className="text-2xl font-extrabold text-white">{stats.totalSupporters}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Creators</span>
            <span className="text-2xl font-extrabold text-white">{stats.totalCreators}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Platform Credits</span>
            <span className="text-2xl font-extrabold text-amber-400">{stats.totalAvailableCredits}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Volume Paid ($)</span>
            <span className="text-2xl font-extrabold text-emerald-400">${stats.totalPaymentsProcessed.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
          <h2 className="text-lg font-bold text-white">System Health & Escrow Overview</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          All creator campaign submissions and withdrawal requests are routed through verified platform escrow logic. Admin approval triggers automated supporter/creator notifications and immediate balance synchronization.
        </p>
      </div>
    </div>
  );
}
