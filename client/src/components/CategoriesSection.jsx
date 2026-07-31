'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, Leaf, GraduationCap, HeartPulse, Palette, Users } from 'lucide-react';

const categories = [
  { name: 'Technology', count: '14 Active Projects', icon: Cpu, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/60' },
  { name: 'Environment', count: '9 Active Projects', icon: Leaf, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
  { name: 'Education', count: '11 Active Projects', icon: GraduationCap, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/60' },
  { name: 'Health', count: '8 Active Projects', icon: HeartPulse, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/60' },
  { name: 'Art', count: '6 Active Projects', icon: Palette, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60' },
  { name: 'Community', count: '12 Active Projects', icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/60' }
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore by <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 dark:from-indigo-300 dark:via-indigo-400 dark:to-sky-400 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Discover innovative crowdfunding projects tailored to your passion.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <Link
                  href={`/explore?category=${cat.name}`}
                  className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:border-indigo-500/50 hover:shadow-lg shadow-sm h-full"
                >
                  <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-7 h-7 ${cat.color}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{cat.name}</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{cat.count}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
