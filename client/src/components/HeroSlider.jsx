'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BannerMarquee from './BannerMarquee';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    title: 'Fuel Innovations That Change the Future',
    subtitle: 'Back visionary tech, environmental solutions, and community projects with verified platform credits.',
    cta: 'Explore Campaigns',
    badge: 'Trending Platform',
    lightImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Empower Visionary Creators Worldwide',
    subtitle: 'Launch your campaign today, gain instant backer contributions, and receive 100% transparent payouts.',
    cta: 'Start a Campaign',
    badge: 'For Creators',
    lightImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Secure, Transparent & Credit-Based Crowdfunding',
    subtitle: 'Supporters earn instant registration credits and track their pledges in real-time with full admin oversight.',
    cta: 'Join as Supporter',
    badge: 'Verified Escrow',
    lightImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'
  }
];

const HeroSlider = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="w-full h-[82vh] min-h-[580px] max-h-[850px] overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full relative overflow-hidden bg-gradient-to-br from-indigo-50/90 via-sky-50/70 to-indigo-100/80 dark:bg-none dark:bg-slate-950">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              
              {/* Light Mode Glowing Ambient Mesh Orbs */}
              <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-indigo-200/50 dark:bg-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-sky-200/50 dark:bg-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Background Image Layer */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-35 dark:opacity-40 filter contrast-105 pointer-events-none transform scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url(${slide.lightImage})` }}
              />

              {/* Dynamic Overlay Layer (Light vs Dark) */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-white/85 via-white/60 to-indigo-50/50 dark:from-slate-950 dark:via-slate-950/85 dark:to-indigo-950/60 pointer-events-none" />

              {/* Text Content Layer */}
              <div className="relative z-20 text-center max-w-4xl px-6 py-10 flex flex-col items-center justify-center">
                <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/95 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold border border-indigo-200/80 dark:border-indigo-500/40 mb-5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{slide.badge}</span>
                </span>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-5">
                  {slide.title}
                </h1>

                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                  {slide.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/explore"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>Explore Campaigns</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>

                  {user ? (
                    user.role === 'Creator' && (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/dashboard/add-campaign"
                          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center space-x-2"
                        >
                          <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span>Create Campaign</span>
                        </Link>
                      </motion.div>
                    )
                  ) : (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/register"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sm sm:text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center space-x-2"
                      >
                        <span>Register Account</span>
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <BannerMarquee />
    </div>
  );
};

export default HeroSlider;
