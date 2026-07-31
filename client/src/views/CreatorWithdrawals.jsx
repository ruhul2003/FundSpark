'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Coins, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CreatorWithdrawalsView() {
  const { user, refreshUserData } = useAuth();

  const [creditsToWithdraw, setCreditsToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('Stripe');
  const [accountNumber, setAccountNumber] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const raisedCredits = user?.raisedCredits || 0;
  const withdrawAmountDollar = creditsToWithdraw ? (Number(creditsToWithdraw) / 20).toFixed(2) : '0.00';

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const credits = Number(creditsToWithdraw);
    if (!credits || credits < 200) {
      setFeedback({ type: 'error', text: 'Minimum withdrawal requirement is 200 credits ($10).' });
      return;
    }

    if (credits > raisedCredits) {
      setFeedback({ type: 'error', text: 'Credits to withdraw cannot exceed your total raised credits.' });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/withdrawals`, {
        withdrawalCredit: credits,
        paymentSystem,
        accountNumber
      });

      setFeedback({
        type: 'success',
        text: `Withdrawal request for $${withdrawAmountDollar} (${credits} credits) submitted successfully! Admin will process payment.`
      });

      setCreditsToWithdraw('');
      setAccountNumber('');
      await refreshUserData();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit withdrawal request.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Withdraw Creator Earnings</h1>
        <p className="text-xs text-slate-400">Convert raised platform credits into real USD payouts (20 Credits = $1 Dollar)</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400">
            <Coins className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Available Raised Credits</span>
            <span className="text-3xl font-extrabold text-amber-400">{raisedCredits} Credits</span>
          </div>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center sm:text-right">
          <span className="text-xs font-semibold text-slate-400 block">Equivalent Dollar Earnings</span>
          <span className="text-3xl font-extrabold text-emerald-400">${(raisedCredits / 20).toFixed(2)}</span>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
          feedback.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white">Withdrawal Request Form</h2>

        {raisedCredits < 200 ? (
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-rose-300">Insufficient credit</h3>
            <p className="text-xs text-slate-400">
              You need a minimum of 200 raised credits ($10.00) to request a payout. Currently, you have {raisedCredits} credits.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Credits To Withdraw *</label>
              <input
                type="number"
                required
                min={200}
                max={raisedCredits}
                placeholder="Minimum 200 credits"
                value={creditsToWithdraw}
                onChange={(e) => setCreditsToWithdraw(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Withdraw Amount ($ USD)</label>
              <input
                type="text"
                disabled
                value={`$${withdrawAmountDollar}`}
                className="w-full bg-slate-950 border border-slate-800 text-emerald-400 font-bold rounded-xl px-4 py-3 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment System *</label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Stripe">Stripe Direct Bank Transfer</option>
                <option value="Bkash">Bkash Mobile Financial</option>
                <option value="Nagad">Nagad Mobile Payment</option>
                <option value="Rocket">Rocket Mobile Banking</option>
                <option value="International Wire">International Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Account Number / IBAN / Phone *</label>
              <input
                type="text"
                required
                placeholder="Enter account number or IBAN"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <DollarSign className="w-5 h-5" />
              <span>{submitting ? 'Submitting Request...' : 'Submit Withdrawal Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
