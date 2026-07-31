'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminWithdrawalsView() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/withdrawals/admin`);
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Error fetching admin withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handlePaymentSuccess = async (id) => {
    try {
      await axios.patch(`${API_URL}/withdrawals/${id}/success`);
      await fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Withdrawal Payout Requests</h1>
        <p className="text-xs text-slate-400">Process creator credit cashout requests via Stripe or mobile gateways</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading withdrawal requests...</div>
        ) : withdrawals.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No pending creator withdrawal requests.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Creator Name & Email</th>
                  <th className="p-3">Credits To Cashout</th>
                  <th className="p-3">Dollar Amount ($)</th>
                  <th className="p-3">Payment System</th>
                  <th className="p-3">Account Number</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {withdrawals.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">
                      <div>{item.creatorName}</div>
                      <div className="text-[10px] text-slate-500">{item.creatorEmail}</div>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{item.withdrawalCredit} Credits</td>
                    <td className="p-3 font-bold text-emerald-400">${item.withdrawalAmount.toFixed(2)}</td>
                    <td className="p-3 font-medium text-slate-200">{item.paymentSystem}</td>
                    <td className="p-3 text-slate-400">{item.accountNumber}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handlePaymentSuccess(item._id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold inline-flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Payment Success</span>
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
