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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 text-center text-slate-500 dark:text-slate-400">
        Campaign not found.
      </div>
    );
  }

  const progressPercentage = Math.min(
    100,
    Math.round(((campaign.amountRaised || 0) / campaign.fundingGoal) * 100)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Back Link & Header */}
        <div className="mb-6 space-y-3">
          <button
            onClick={() => router.back()}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <span>&larr; Back</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {campaign.category}
            </span>
            <span className="text-slate-400 text-xs font-light">•</span>
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>By {campaign.creatorName}</span>
            </span>
            <span className="text-slate-400 text-xs font-light">•</span>
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Ends {new Date(campaign.deadline).toLocaleDateString()}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {campaign.title}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Image & Story */}
          <div className="lg:col-span-7 space-y-6">
            {/* Compact Image */}
            <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900 shadow-sm">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Campaign Story */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-slate-800 pb-3">
                About this campaign
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {campaign.story}
              </p>
            </div>

            {/* Backer Reward Card */}
            {campaign.rewardInfo && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-3">
                <Gift className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Backer Reward</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{campaign.rewardInfo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Pledge Form */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5 text-slate-900 dark:text-slate-100">
              
              {/* Progress Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span>{campaign.amountRaised || 0}</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Credits Raised</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{progressPercentage}%</span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Goal: <strong className="text-slate-700 dark:text-slate-300">{campaign.fundingGoal}</strong> Credits</span>
                  <span>Min Pledge: <strong className="text-slate-700 dark:text-slate-300">{campaign.minContribution || 1}</strong></span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Support This Project</h3>

                {user && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Your Balance:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      <span>{user.credits ?? 0} Credits</span>
                    </span>
                  </div>
                )}

                {feedback && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    feedback.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />}
                    <span>{feedback.text}</span>
                  </div>
                )}

                {user?.email === campaign?.creatorEmail ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-medium leading-relaxed">
                    You are the creator of this campaign and cannot pledge credits to your own project.
                  </div>
                ) : (
                  <form onSubmit={handlePledgeSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Contribution Amount (Credits)
                      </label>
                      <input
                        type="number"
                        min={campaign.minContribution || 1}
                        placeholder={`Min ${campaign.minContribution || 1} credits`}
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Message to Creator (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Leave words of encouragement..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Pledge...' : 'Pledge Credits Now'}
                    </button>
                  </form>
                )}
              </div>

              {/* Report Button */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-center">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors font-medium"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Report Suspicious Campaign</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Report Campaign</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please describe why you believe this campaign violates platform policies or is fraudulent.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Provide detailed reason..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 shadow-md"
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
