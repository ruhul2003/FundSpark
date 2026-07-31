import React from 'react';
import { UserPlus, PlusCircle, Coins, DollarSign } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create an Account',
    desc: 'Register as a Supporter to claim 50 free default credits, or as a Creator with 20 default credits.',
    icon: UserPlus,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    step: '02',
    title: 'Launch or Discover',
    desc: 'Creators post campaign goals with image uploads. Supporters explore verified, admin-approved projects.',
    icon: PlusCircle,
    color: 'from-sky-500 to-indigo-500'
  },
  {
    step: '03',
    title: 'Contribute Credits',
    desc: 'Supporters pledge available credits. Escrow safely holds credits until the creator reviews and approves.',
    icon: Coins,
    color: 'from-amber-500 to-emerald-500'
  },
  {
    step: '04',
    title: 'Withdraw Earnings',
    desc: 'Creators withdraw raised credits at 20 Credits = $1 Dollar directly via Stripe, Bkash, or Bank transfer.',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-600'
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Simple 4-Step Process</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            How <span className="gradient-text">FundSpark Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, i) => {
            const IconComp = item.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 relative flex flex-col justify-between transition-all hover:scale-105"
              >
                <div>
                  <span className="text-4xl font-black text-slate-200 absolute top-6 right-6">
                    {item.step}
                  </span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/10`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
