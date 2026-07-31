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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Supporter Dashboard</h1>
        <p className="text-xs text-slate-500">Overview of your contributions, available balance, and pledged credits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Total Contributions</span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.totalCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Pending Review</span>
            <span className="text-2xl font-extrabold text-amber-600">{stats.pendingCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Total Contributed Credits</span>
            <span className="text-2xl font-extrabold text-emerald-600">{stats.totalContributedAmount}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Approved Contributions</span>
        </h2>

        {loading ? (
          <div className="text-slate-400 text-xs py-8 text-center">Loading approved contributions...</div>
        ) : approvedContributions.length === 0 ? (
          <div className="text-slate-400 text-xs py-8 text-center">No approved contributions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Campaign Title</th>
                  <th className="p-3">Creator Name</th>
                  <th className="p-3">Contribution Amount</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {approvedContributions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{item.campaignTitle}</td>
                    <td className="p-3 text-slate-600">{item.creatorName}</td>
                    <td className="p-3 font-bold text-amber-600">{item.amount} Credits</td>
                    <td className="p-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
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
