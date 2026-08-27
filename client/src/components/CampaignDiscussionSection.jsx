'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send, Trash2, ShieldCheck, UserCheck, Sparkles, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CampaignDiscussionSection({ campaignId, user }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/comments/campaign/${campaignId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) fetchComments();
  }, [campaignId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!user) {
      router.push('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/comments`, {
        campaignId,
        text: commentText.trim()
      });

      setCommentText('');
      await fetchComments();
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment.');
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
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Community Discussion & Q&A ({comments.length})</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Ask questions, discuss project ideas, and interact with the creator and community.
        </p>
      </div>

      {/* Post Comment Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        {feedback && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{feedback}</span>
          </div>
        )}

        {user ? (
          <form onSubmit={handlePostComment} className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-sm">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </div>
              <textarea
                rows={3}
                required
                placeholder="Ask a question or leave a message for the creator..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Want to join the conversation or ask a question?
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Sign In to Comment
            </button>
          </div>
        )}
      </div>

      {/* Comments Feed */}
      {comments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-indigo-500 mx-auto" />
          <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400">Be the first to leave a comment!</h4>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                    {comment.userName ? comment.userName.charAt(0) : comment.userEmail.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {comment.userName}
                      </span>

                      {/* Role Badges */}
                      {comment.userRole === 'creator' && (
                        <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200 dark:border-amber-800">
                          <UserCheck className="w-3 h-3" /> Creator
                        </span>
                      )}
                      {comment.userRole === 'admin' && (
                        <span className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      )}
                      {comment.userRole === 'supporter' && (
                        <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Backer
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {(comment.userEmail === user?.email || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 pl-10 leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
