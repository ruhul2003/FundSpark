'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, PlusCircle, Trash2, Calendar, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CampaignUpdatesSection({ campaignId, isCreator, user }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/updates/campaign/${campaignId}`);
      setUpdates(res.data);
    } catch (err) {
      console.error('Error fetching campaign updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) fetchUpdates();
  }, [campaignId]);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    setFeedback(null);
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/updates`, {
        campaignId,
        title: title.trim(),
        content: content.trim()
      });

      setTitle('');
      setContent('');
      setShowModal(false);
      await fetchUpdates();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Failed to post update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    try {
      await axios.delete(`${API_URL}/updates/${updateId}`);
      setUpdates(updates.filter((u) => u._id !== updateId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete update.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Post Button */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Campaign Announcements & Updates ({updates.length})</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct milestone progress and news straight from the project creator.
          </p>
        </div>

        {(isCreator || user?.role === 'admin') && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Update</span>
          </button>
        )}
      </div>

      {/* Updates List */}
      {updates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Updates Posted Yet</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            The campaign creator hasn't published any milestone updates yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, idx) => (
            <div
              key={update._id || idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3 relative group"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Update #{updates.length - idx}
                    </span>
                    <span className="text-xs text-slate-400 font-light">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(update.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {update.title}
                  </h4>
                </div>

                {(update.creatorEmail === user?.email || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteUpdate(update._id)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Update"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800/80 pt-3">
                {update.content}
              </p>

              <div className="pt-1 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>By Creator: <strong>{update.creatorName}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-lg w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Post Campaign Update</span>
            </h3>

            {feedback && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 border border-rose-200 dark:border-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Update Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Milestone Reached: Prototype Shipped!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Update Content & Details
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share details about project progress, manufacturing, logistics, or thank-yous..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
