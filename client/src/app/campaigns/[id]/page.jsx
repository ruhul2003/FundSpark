'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { Coins, Clock, Target, Gift, UserCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const { user, refreshUserData } = useAuth();
  const router = useRouter();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      console.error('Error fetching campaign details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!user) {
      router.push('/login');
      return;
    }

    const amount = Number(contributionAmount);
    if (!amount || amount < (campaign.minContribution || 1)) {
      setFeedback({
        type: 'error',
        text: `Minimum contribution for this campaign is ${campaign.minContribution || 1} credits.`
      });
      return;
    }

    if (user.credits < amount) {
      setFeedback({
        type: 'error',
        text: `You only have ${user.credits} available credits. Please purchase more credits from your dashboard.`
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/contributions`, {
        campaignId: campaign._id,
        amount,
        message
      });

      setFeedback({
        type: 'success',
        text: `Successfully pledged ${amount} credits! The campaign creator will review your contribution.`
      });

      setContributionAmount('');
      setMessage('');
      await refreshUserData();
      await fetchCampaign();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit pledge. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason) return;

    try {
      setReporting(true);
      await axios.post(`${API_URL}/reports`, {
        campaignId: campaign._id,
        reason: reportReason
      });

      setShowReportModal(false);
      setReportReason('');
      alert('Thank you. Your report has been submitted to Admin for review.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 text-center text-slate-500">
        Campaign not found.
      </div>
    );
  }

  const progressPercentage = Math.min(
    100,
    Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100)
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel rounded-3xl overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200 bg-white shadow-sm">
          <div className="lg:col-span-7 relative h-72 lg:h-auto overflow-hidden">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-700 border border-slate-200 shadow-sm">
              {campaign.category}
            </div>
          </div>

          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>By {campaign.creatorName}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4">{campaign.title}</h1>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-700 font-bold flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>{campaign.amountRaised || 0} Credits Raised</span>
                  </span>
                  <span className="text-slate-500 font-medium">{progressPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Goal: {campaign.fundingGoal} Credits</span>
                  <span>Min Pledge: {campaign.minContribution} Credits</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start space-x-3">
              <Gift className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Backer Reward</h4>
                <p className="text-xs text-slate-600 mt-1">{campaign.rewardInfo}</p>
              </div>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 transition-colors self-start font-medium"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Report Suspicious Campaign</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-4">
                Campaign Story & Vision
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {campaign.story}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-sm sticky top-28 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Support This Project</h3>
              <p className="text-xs text-slate-500">
                Pledge your available platform credits to back this campaign.
              </p>

              {user && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <span className="text-slate-600">Your Balance:</span>
                  <span className="font-bold text-amber-600 flex items-center space-x-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{user.credits ?? 0} Credits</span>
                  </span>
                </div>
              )}

              {feedback && (
                <div className={`p-4 rounded-xl text-xs flex items-start space-x-2 ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />}
                  <span>{feedback.text}</span>
                </div>
              )}

              <form onSubmit={handlePledgeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Contribution Amount (Credits)
                  </label>
                  <input
                    type="number"
                    min={campaign.minContribution || 1}
                    placeholder={`Min ${campaign.minContribution || 10} credits`}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Message to Creator (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Leave words of encouragement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting Pledge...' : 'Pledge Credits Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-200 bg-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Report Campaign</span>
            </h3>
            <p className="text-xs text-slate-500">
              Please describe why you believe this campaign violates platform policies or is fraudulent.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Provide detailed reason..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-md"
                >
                  {reporting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
