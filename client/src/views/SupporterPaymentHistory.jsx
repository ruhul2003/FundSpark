'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SupporterPaymentHistoryView() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${API_URL}/payments/history`);
        setPayments(res.data);
      } catch (err) {
        console.error('Error fetching supporter payment history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Credit Purchase History</h1>
        <p className="text-xs text-slate-400">All Stripe transactions and purchased credit package invoices</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading payment history...</div>
        ) : payments.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No payment history found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Package Name</th>
                  <th className="p-3">Credits Purchased</th>
                  <th className="p-3">Amount Paid ($)</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3 text-right">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 font-semibold text-white">{item.packageName}</td>
                    <td className="p-3 font-bold text-amber-400">{item.creditsPurchased} Credits</td>
                    <td className="p-3 font-bold text-emerald-400">${item.amountPaid.toFixed(2)}</td>
                    <td className="p-3 text-slate-300">{item.paymentMethod || 'Stripe'}</td>
                    <td className="p-3 text-right font-mono text-[10px] text-slate-500">{item.paymentIntentId}</td>
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
