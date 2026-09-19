'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Heart } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BookmarkButton({
  campaignId,
  variant = 'icon', // 'icon' | 'button'
  showLabel = false,
  className = ''
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkBookmarkStatus = async () => {
      if (!user || !campaignId) return;
      try {
        const res = await axios.get(`${API_URL}/bookmarks/check/${campaignId}`);
        if (isMounted) {
          setBookmarked(!!res.data.bookmarked);
        }
      } catch (err) {
        // Silently handle if unauthenticated or network issue
      }
    };

    checkBookmarkStatus();

    return () => {
      isMounted = false;
    };
  }, [user, campaignId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      // Optimistic update
      setBookmarked((prev) => !prev);

      const res = await axios.post(`${API_URL}/bookmarks/${campaignId}`);
      setBookmarked(res.data.bookmarked);
    } catch (err) {
      // Revert on error
      setBookmarked((prev) => !prev);
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        type="button"
        title={bookmarked ? 'Remove from saved' : 'Save to favorites'}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
          bookmarked
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 shadow-sm'
            : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200'
        } ${className}`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            bookmarked ? 'fill-rose-500 text-rose-500 scale-110' : 'scale-100'
          }`}
        />
        <span>{bookmarked ? 'Saved' : 'Save Campaign'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      type="button"
      title={bookmarked ? 'Remove from saved' : 'Save to favorites'}
      className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 shadow-sm ${
        bookmarked
          ? 'bg-rose-500 text-white shadow-rose-500/20 scale-105'
          : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-700/80'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          bookmarked ? 'fill-white text-white' : ''
        }`}
      />
    </button>
  );
}
