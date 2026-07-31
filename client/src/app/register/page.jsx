'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, User, Upload, AlertCircle, Coins } from 'lucide-react';
import axios from 'axios';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'b2c836a99478f0d8a571ec8e398939a8';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [role, setRole] = useState('Supporter');
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      setError('');
      
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      if (res.data?.data?.url) {
        setPhotoURL(res.data.data.url);
      }
    } catch (err) {
      console.warn('imgBB fallback to FileReader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const userData = await register({
        name,
        email,
        password,
        photoURL: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role
      });

      const roleRoutes = {
        Creator: '/dashboard/creator-home',
        Admin: '/dashboard/admin-home',
        Supporter: '/dashboard/supporter-home'
      };
      router.push(roleRoutes[userData.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl text-slate-900 dark:text-slate-100"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5 mx-auto mb-3">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join FundSpark and start empowering global initiatives</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 flex items-start space-x-3">
          <Coins className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block">Registration Credit Bonus:</span>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
              {role === 'Supporter' ? 'Supporters receive 50 default credits upon registration!' : 'Creators receive 20 default credits upon registration!'}
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Select Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="Supporter" className="dark:bg-slate-900">Supporter (Browse campaigns & pledge credits)</option>
              <option value="Creator" className="dark:bg-slate-900">Creator (Launch campaigns & withdraw funds)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Profile Picture</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Image URL or upload below"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <label className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-all">
                <Upload className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{uploadingImage ? 'Uploading...' : 'imgBB'}</span>
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : 'Complete Registration'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
