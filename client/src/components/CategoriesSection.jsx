'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Leaf, GraduationCap, HeartPulse, Palette, Users } from 'lucide-react';

const categories = [
  { name: 'Technology', count: '14 Active Projects', icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Environment', count: '9 Active Projects', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Education', count: '11 Active Projects', icon: GraduationCap, color: 'text-sky-600', bg: 'bg-sky-50' },
  { name: 'Health', count: '8 Active Projects', icon: HeartPulse, color: 'text-rose-600', bg: 'bg-rose-50' },
  { name: 'Art', count: '6 Active Projects', icon: Palette, color: 'text-amber-600', bg: 'bg-amber-50' },
  { name: 'Community', count: '12 Active Projects', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
];

const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Find and support groundbreaking projects across diverse domains.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={idx}
                href={`/explore?category=${cat.name}`}
                className="glass-card p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-7 h-7 ${cat.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h3>
                <span className="text-[11px] text-slate-500 font-medium">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
