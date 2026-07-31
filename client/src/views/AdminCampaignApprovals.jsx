'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminCampaignApprovalsView() {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/campaigns/pending`);
      setPendingCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching pending campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/campaigns/${id}/status`, { status });
      await fetchPending();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Campaign Approvals</h1>
        <p className="text-xs text-slate-400">Review newly submitted creator campaigns before public listing</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading pending approvals...</div>
        ) : pendingCampaigns.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No pending campaign submissions to review.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Creator Name & Email</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Funding Goal</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingCampaigns.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white max-w-xs">{item.title}</td>
                    <td className="p-3 text-slate-300">
                      <div>{item.creatorName}</div>
                      <div className="text-[10px] text-slate-500">{item.creatorEmail}</div>
                    </td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-bold text-amber-400">{item.fundingGoal} Credits</td>
                    <td className="p-3 text-slate-400">{new Date(item.deadline).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleStatusChange(item._id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(item._id, 'rejected')}
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
    </div>
  );
}
