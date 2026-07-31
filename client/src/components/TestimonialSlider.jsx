'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star, UserCheck } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'SolarFlow Creator',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    quote: 'FundSpark allowed us to raise 850 credits within two weeks for our clean water initiative! The admin validation gave our backers total confidence.',
    rating: 5
  },
  {
    name: 'Michael Vance',
    role: 'Tech Supporter',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'I received 50 free credits right upon signing up and pledged to an eco-friendly marine packaging project. The real-time notification popups kept me updated.',
    rating: 5
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Horizon VR Lead',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    quote: 'The credit-to-dollar withdrawal ratio was clear and instant. As a creator, I was able to transfer funds directly to my bank via Stripe without friction.',
    rating: 5
  },
  {
    name: 'Elena Rostova',
    role: 'Community Backer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'FundSpark is hands-down the best crowdfunding platform. The dashboard pagination makes managing all my past contributions super convenient!',
    rating: 5
  }
];

const TestimonialSlider = () => {
  return (
    <section className="py-20 bg-slate-950/80 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Community Stories</span>
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Loved by Backers & <span className="gradient-text">Creators</span>
          </h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-14"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="glass-card rounded-2xl p-8 flex flex-col justify-between h-full relative">
                <Quote className="w-10 h-10 text-indigo-500/20 absolute top-6 right-6" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-slate-800">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-indigo-400 font-medium">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSlider;
