'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const slides = [
  {
    title: 'Fuel Innovations That Change the Future',
    subtitle: 'Back visionary tech, environmental solutions, and community projects with verified platform credits.',
    cta: 'Explore Campaigns',
    badge: 'Trending Platform',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Empower Visionary Creators Worldwide',
    subtitle: 'Launch your campaign today, gain instant backer contributions, and receive 100% transparent payouts.',
    cta: 'Start a Campaign',
    badge: 'For Creators',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Secure, Transparent & Credit-Based Crowdfunding',
    subtitle: 'Supporters earn instant registration credits and track their pledges in real-time with full admin oversight.',
    cta: 'Join as Supporter',
    badge: 'Verified Escrow',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'
  }
];

const HeroSlider = () => {
  return (
    <div className="relative overflow-hidden bg-slate-50 pt-4 pb-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden bg-white"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center overflow-hidden">
                {/* Background Image with soft opacity */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 filter contrast-125"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                {/* Clean Light White Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-indigo-50/70" />

                <div className="relative z-10 text-center max-w-3xl px-6 py-12">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/80 mb-6 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{slide.badge}</span>
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    {slide.title}
                  </h1>

                  <p className="text-slate-600 text-sm sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/explore"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/register"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
                    >
                      Register Account
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HeroSlider;
