'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Linkedin, Facebook, Heart, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Fund<span className="text-indigo-600">Spark</span>
              </span>
            </Link>
            <p className="text-slate-600 text-xs leading-relaxed">
              Empowering global innovators, creators, and supporters through transparent credit-based crowdfunding.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-500 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-500 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/explore" className="hover:text-indigo-600 transition-colors">Explore Campaigns</Link></li>
              <li><Link href="/register" className="hover:text-indigo-600 transition-colors">Start a Campaign</Link></li>
              <li><Link href="/explore?category=Technology" className="hover:text-indigo-600 transition-colors">Tech & Innovation</Link></li>
              <li><Link href="/explore?category=Environment" className="hover:text-indigo-600 transition-colors">Eco & Environment</Link></li>
            </ul>
          </div>

          {/* User Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Roles</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="text-slate-600">Supporter (50 Bonus Credits)</span></li>
              <li><span className="text-slate-600">Creator (20 Bonus Credits)</span></li>
              <li><span className="text-slate-600">Admin Platform Moderation</span></li>
              <li><span className="text-slate-600">Stripe Payment Gateway</span></li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform Security</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Escrow & Refunds</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Credit Allocation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 FundSpark Crowdfunding Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for global creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
