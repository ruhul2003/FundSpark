'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coins, Clock, CheckCircle2, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SupporterHomeView() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0, totalContributedAmount: 0 });
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupporterData = async () => {
      try {
        setLoading(true);
        const [statsRes, approvedRes] = await Promise.all([
          axios.get(`${API_URL}/stats/supporter`),
          axios.get(`${API_URL}/contributions/supporter/approved`)
        ]);
        setStats(statsRes.data);
        setApprovedContributions(approvedRes.data);
      } catch (err) {
        console.error('Error loading supporter stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupporterData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Supporter Dashboard</h1>
        <p className="text-xs text-slate-400">Overview of your contributions, available balance, and pledged credits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Contributions</span>
            <span className="text-2xl font-extrabold text-white">{stats.totalCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Pending Review</span>
            <span className="text-2xl font-extrabold text-amber-400">{stats.pendingCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Contributed Credits</span>
            <span className="text-2xl font-extrabold text-emerald-400">{stats.totalContributedAmount}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Approved Contributions</span>
        </h2>

        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading approved contributions...</div>
        ) : approvedContributions.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No approved contributions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Creator Name</th>
                  <th className="p-3">Contribution Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {approvedContributions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{item.campaignTitle}</td>
                    <td className="p-3 text-slate-300">{item.creatorName}</td>
                    <td className="p-3 font-bold text-amber-400">{item.amount} Credits</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {item.status}
                      </span>
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
