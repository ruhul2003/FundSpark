'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreatorPaymentHistoryView() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axios.get(`${API_URL}/withdrawals/creator`);
        setWithdrawals(res.data);
      } catch (err) {
        console.error('Error fetching creator payment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Withdrawal Payment History</h1>
        <p className="text-xs text-slate-400">All withdrawal payments processed for your creator account</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading payment history...</div>
        ) : withdrawals.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No withdrawal payment history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Credits Withdrawn</th>
                  <th className="p-3">Payout Amount ($)</th>
                  <th className="p-3">Payment Gateway</th>
                  <th className="p-3">Account No</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {withdrawals.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-400">{new Date(item.withdrawDate || item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-amber-400">{item.withdrawalCredit} Credits</td>
                    <td className="p-3 font-bold text-emerald-400">${item.withdrawalAmount.toFixed(2)}</td>
                    <td className="p-3 font-medium text-slate-200">{item.paymentSystem}</td>
                    <td className="p-3 text-slate-400">{item.accountNumber}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.status === 'approved' ? 'Success' : item.status}
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
