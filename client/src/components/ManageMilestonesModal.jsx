'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  X,
  Flag,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Coins,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManageMilestonesModal({ campaign, onClose, onUpdated }) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');

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

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newTitle.trim() || !newDescription.trim() || !newTargetAmount) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/milestones`,
        {
          campaignId: campaign._id,
          title: newTitle,
          description: newDescription,
          targetAmount: Number(newTargetAmount),
          order: milestones.length + 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setNewTitle('');
      setNewDescription('');
      setNewTargetAmount('');
      await fetchMilestones();
      if (onUpdated) onUpdated();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (milestone) => {
    try {
      const token = localStorage.getItem('token');
      const nextStatus = milestone.status === 'completed' ? 'pending' : 'completed';
      await axios.put(
        `${API_URL}/milestones/${milestone._id}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchMilestones();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update milestone status.');
    }
  };

  const handleDelete = async (milestoneId) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/milestones/${milestoneId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchMilestones();
      if (onUpdated) onUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete milestone.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="max-w-2xl w-full max-h-[90vh] flex flex-col p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative text-slate-900 dark:text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Roadmap & Stretch Goals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {campaign.title} &bull; Goal: <strong className="text-indigo-600 dark:text-indigo-400">{campaign.fundingGoal} Credits</strong>
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* New Milestone Form */}
          <form
            onSubmit={handleCreateMilestone}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                <span>Add New Milestone</span>
              </h4>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Milestone title (e.g. Beta SDK Release)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  placeholder="Target Credits"
                  value={newTargetAmount}
                  onChange={(e) => setNewTargetAmount(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <textarea
                rows="2"
                placeholder="What will be delivered or unlocked when this stretch goal is funded?"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{submitting ? 'Adding...' : 'Save Milestone'}</span>
              </button>
            </div>
          </form>

          {/* Existing Milestones List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Configured Milestones ({milestones.length})
            </h4>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">Loading roadmap...</div>
            ) : milestones.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No custom milestones defined yet. The campaign currently uses platform default progress phases. Add custom stretch goals above!
              </div>
            ) : (
              milestones.map((m, idx) => {
                const isCompleted = m.status === 'completed';
                return (
                  <div
                    key={m._id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleStatus(m)}
                        title="Click to toggle status"
                        className={`mt-0.5 p-1 rounded-lg transition-colors ${
                          isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {m.title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isCompleted
                                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Pending Goal'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{m.targetAmount}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Target</span>
                      </div>

                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
