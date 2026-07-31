'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../../components/NotificationDropdown';
import ThemeToggle from '../../components/ThemeToggle';
import ProtectedRoute from '../../components/ProtectedRoute';
import {
  Sparkles,
  PlusCircle,
  FolderKanban,
  Coins,
  DollarSign,
  History,
  Users,
  CheckSquare,
  ShieldAlert,
  Home,
  Compass,
  LogOut,
  Menu,
  X,
  CreditCard,
  FileCheck
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const role = user?.role || 'Supporter';

  const supporterNav = [
    { label: 'Supporter Home', path: '/dashboard/supporter-home', icon: Home },
    { label: 'Explore Campaigns', path: '/explore', icon: Compass },
    { label: 'My Contributions', path: '/dashboard/my-contributions', icon: FileCheck },
    { label: 'Purchase Credit', path: '/dashboard/purchase-credit', icon: CreditCard },
    { label: 'Payment History', path: '/dashboard/supporter-payments', icon: History }
  ];

  const creatorNav = [
    { label: 'Creator Home', path: '/dashboard/creator-home', icon: Home },
    { label: 'Add New Campaign', path: '/dashboard/add-campaign', icon: PlusCircle },
    { label: 'My Campaigns', path: '/dashboard/my-campaigns', icon: FolderKanban },
    { label: 'Withdrawals', path: '/dashboard/withdrawals', icon: DollarSign },
    { label: 'Payment History', path: '/dashboard/creator-payments', icon: History }
  ];

  const adminNav = [
    { label: 'Admin Home', path: '/dashboard/admin-home', icon: Home },
    { label: 'Manage Users', path: '/dashboard/manage-users', icon: Users },
    { label: 'Manage Campaigns', path: '/dashboard/manage-campaigns', icon: FolderKanban },
    { label: 'Campaign Approvals', path: '/dashboard/admin-approvals', icon: CheckSquare },
    { label: 'Withdrawal Requests', path: '/dashboard/admin-withdrawals', icon: DollarSign },
    { label: 'Reports', path: '/dashboard/admin-reports', icon: ShieldAlert }
  ];

  const navItems = role === 'Admin' ? adminNav : role === 'Creator' ? creatorNav : supporterNav;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 p-0.5">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-slate-900 hidden sm:inline">
                Fund<span className="text-indigo-600">Spark</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{user?.credits ?? 0} Credits</span>
            </div>

            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</span>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{user?.role}</span>
            </div>

            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
            />

            <ThemeToggle />

            <NotificationDropdown />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside
            className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 pt-20 lg:pt-6 pb-6 px-4 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="space-y-6">
              <div className="px-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  {role} Navigation
                </span>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={idx}
                      href={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <Link
                href="/"
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 lg:ml-64 p-6 sm:p-10 overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
