'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PlusCircle, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'b2c836a99478f0d8a571ec8e398939a8';

export default function AddCampaignView() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState('Technology');
  const [fundingGoal, setFundingGoal] = useState('');
  const [minContribution, setMinContribution] = useState('10');
  const [deadline, setDeadline] = useState('');
  const [rewardInfo, setRewardInfo] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      if (res.data?.data?.url) {
        setImageUrl(res.data.data.url);
      }
    } catch (err) {
      console.warn('imgBB fallback to FileReader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!title || !story || !fundingGoal || !deadline || !imageUrl) {
      setFeedback({ type: 'error', text: 'Please fill in all required campaign fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      
      await axios.post(
        `${API_URL}/campaigns`,
        {
          title,
          story,
          category,
          fundingGoal: Number(fundingGoal),
          minContribution: Number(minContribution || 10),
          deadline,
          rewardInfo: rewardInfo || 'Supporter reward badge',
          imageUrl
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      setFeedback({
        type: 'success',
        text: 'Campaign submitted successfully! It has been placed in "pending" status for Admin review.'
      });

      setTimeout(() => {
        router.push('/dashboard/my-campaigns');
      }, 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to submit campaign.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Launch New Campaign</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Fill out your campaign details for Admin validation</p>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{feedback.text}</span>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm text-slate-900 dark:text-slate-100"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Campaign Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Help us build a solar-powered water pump"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="Technology" className="dark:bg-slate-900">Technology</option>
            <option value="Environment" className="dark:bg-slate-900">Environment</option>
            <option value="Education" className="dark:bg-slate-900">Education</option>
            <option value="Health" className="dark:bg-slate-900">Health</option>
            <option value="Art" className="dark:bg-slate-900">Art</option>
            <option value="Community" className="dark:bg-slate-900">Community</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Campaign Story & Pitch *</label>
          <textarea
            rows={5}
            required
            placeholder="Describe your project vision, target impact, and roadmap..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Funding Goal (Credits) *</label>
            <input
              type="number"
              required
              min={50}
              placeholder="e.g. 1500"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Minimum Contribution (Credits) *</label>
            <input
              type="number"
              required
              min={1}
              placeholder="e.g. 10"
              value={minContribution}
              onChange={(e) => setMinContribution(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Deadline *</label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Reward Info</label>
            <input
              type="text"
              placeholder="What backers receive (e.g. Early Access Pass)"
              value={rewardInfo}
              onChange={(e) => setRewardInfo(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover Image URL *</label>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              required
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <label className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer flex items-center space-x-2 border border-slate-200 dark:border-slate-700 transition-all">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{uploadingImage ? 'Uploading...' : 'Upload imgBB'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting || uploadingImage}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{submitting ? 'Submitting Campaign...' : 'Add Campaign'}</span>
        </motion.button>
      </motion.form>
    </div>
  );
}
