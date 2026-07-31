'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'Creator') router.replace('/dashboard/creator-home');
      else if (user.role === 'Admin') router.replace('/dashboard/admin-home');
      else router.replace('/dashboard/supporter-home');
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-400 text-xs font-medium">Loading role dashboard...</p>
    </div>
  );
}
