'use client';

import React from 'react';
import HeroSlider from '../components/HeroSlider';
import TopCampaigns from '../components/TopCampaigns';
import HowItWorks from '../components/HowItWorks';
import CategoriesSection from '../components/CategoriesSection';
import ImpactStats from '../components/ImpactStats';
import TestimonialSlider from '../components/TestimonialSlider';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <HeroSlider />
      <TopCampaigns />
      <HowItWorks />
      <CategoriesSection />
      <ImpactStats />
      <TestimonialSlider />
    </div>
  );
}
