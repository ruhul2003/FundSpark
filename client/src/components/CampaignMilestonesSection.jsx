'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Flag,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Plus,
  Trash2,
  Target,
  AlertCircle,
  Coins,
  Trophy,
  Zap
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CampaignMilestonesSection({ campaign, user, isCreator }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/milestones/campaign/${campaign._id}`);
      setMilestones(res.data);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaign?._id) {
      fetchMilestones();
    }
  }, [campaign?._id]);

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.targetAmount) {
      setErrorMsg('Please fill in all milestone fields.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/milestones`,
        {
          campaignId: campaign._id,
          title: formData.title,
          description: formData.description,
          targetAmount: Number(formData.targetAmount),
          order: milestones.length + 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData({ title: '', description: '', targetAmount: '' });
      setShowAddForm(false);
      await fetchMilestones();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!confirm('Are you sure you want to delete this stretch goal milestone?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/milestones/${milestoneId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchMilestones();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete milestone.');
    }
  };

  const amountRaised = campaign?.amountRaised || 0;
  const fundingGoal = campaign?.fundingGoal || 1;

  // If creator hasn't added custom milestones yet, provide default smart phases derived from funding goal
  const defaultPhases = [
    {
      _id: 'auto-1',
      title: 'Initial Concept & Core Prototype',
      description: 'Kickstart foundation development, technical architecture setup, and prototype validation.',
      targetAmount: Math.round(fundingGoal * 0.25),
      isAuto: true
    },
    {
      _id: 'auto-2',
      title: 'Beta Release & Community Testing',
      description: 'Deploy early access build to initial backers, gather feedback, and optimize performance.',
      targetAmount: Math.round(fundingGoal * 0.6),
      isAuto: true
    },
    {
      _id: 'auto-3',
      title: 'Full Production Launch & Goal Reached',
      description: 'Deliver the full production scope, distribute perks, and roll out public release.',
      targetAmount: fundingGoal,
      isAuto: true
    },
    {
      _id: 'auto-4',
      title: 'Stretch Goal: Enhanced Ecosystem & Mobile App',
      description: 'Extended roadmap feature unlocked once campaign exceeds the initial funding target.',
      targetAmount: Math.round(fundingGoal * 1.3),
      isAuto: true
    }
  ];

  const displayList = milestones.length > 0 ? milestones : defaultPhases;
  const achievedCount = displayList.filter(
    (m) => amountRaised >= m.targetAmount || m.status === 'completed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Flag className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Project Roadmap & Stretch Goals</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {achievedCount} of {displayList.length} Unlocked
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track project milestone deliverables and unlocked community perks.
                </p>
              </div>
            </div>
          </div>

          {isCreator && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Close Form' : 'Add Milestone'}</span>
            </button>
          )}
        </div>

        {/* Milestone Unlocked Progress Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Currently Raised: <strong className="text-white">{amountRaised}</strong> Credits</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{Math.round((amountRaised / fundingGoal) * 100)}% of primary goal</span>
          </div>
        </div>
      </div>

      {/* Creator Add Milestone Form */}
      {isCreator && showAddForm && (
        <form
          onSubmit={handleAddMilestone}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Define New Stretch Goal / Milestone</span>
            </h4>
            <span className="text-[11px] text-slate-500">Creator Control</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Milestone Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Alpha Testing & Mobile Companion App"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Credits to Unlock *
              </label>
              <input
                type="number"
                min="1"
                placeholder={`e.g. ${Math.round(fundingGoal * 1.2)}`}
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deliverables & Description *
            </label>
            <textarea
              rows="3"
              placeholder="Explain what this stretch goal delivers to the community when achieved..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Save Milestone'}
            </button>
          </div>
        </form>
      )}

      {/* Milestones Stepper / Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {displayList.map((milestone, idx) => {
          const isUnlocked = amountRaised >= milestone.targetAmount || milestone.status === 'completed';
          const progressPercent = Math.min(
            100,
            Math.round((amountRaised / milestone.targetAmount) * 100)
          );
          const creditsRemaining = Math.max(0, milestone.targetAmount - amountRaised);

          return (
            <div
              key={milestone._id || idx}
              className={`relative bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all duration-300 ${
                isUnlocked
                  ? 'border-emerald-500/40 dark:border-emerald-500/30 shadow-md shadow-emerald-500/5'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              {/* Stepper Node Circle */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-5 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-950 transition-colors ${
                  isUnlocked
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Header Info */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Phase {idx + 1}
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <Unlock className="w-3 h-3" />
                        <span>UNLOCKED & FUNDED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <Target className="w-3 h-3 text-indigo-500" />
                        <span>{creditsRemaining} Credits Needed</span>
                      </span>
                    )}
                    {milestone.isAuto && (
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        (Platform Benchmark)
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {milestone.title}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>{milestone.targetAmount}</span>
                    <span className="text-[11px] font-normal text-slate-500">Credits</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {progressPercent}% Funded
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {milestone.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-indigo-500 to-sky-400'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Progress toward milestone</span>
                  <span>{amountRaised} / {milestone.targetAmount}</span>
                </div>
              </div>

              {/* Action Buttons for Custom Milestones */}
              {isCreator && !milestone.isAuto && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDeleteMilestone(milestone._id)}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Milestone</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
