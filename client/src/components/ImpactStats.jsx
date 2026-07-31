import React from 'react';
import { Coins, FolderCheck, Users, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Total Credits Raised', value: '45,280+', icon: Coins, color: 'text-amber-400' },
  { label: 'Approved Projects', value: '184+', icon: FolderCheck, color: 'text-indigo-400' },
  { label: 'Global Backers', value: '2,400+', icon: Users, color: 'text-sky-400' },
  { label: 'Payout Success Rate', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-400' }
];

const ImpactStats = () => {
  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-950 to-indigo-950/40">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {stats.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-8' : ''} flex flex-col items-center sm:items-start text-center sm:text-left`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComp className={`w-6 h-6 ${item.color}`} />
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{item.value}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
