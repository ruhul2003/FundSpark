'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';
import { Sparkles, Coins, Code, LayoutDashboard, LogOut, Menu, X, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'Creator') return '/dashboard/creator-home';
    if (user.role === 'Admin') return '/dashboard/admin-home';
    return '/dashboard/supporter-home';
  };

  // Hide main Navbar if inside Dashboard (since Dashboard has its own header/layout)
  if (pathname && pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center">
                Fund<span className="text-indigo-600 dark:text-indigo-400">Spark</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">Crowdfunding</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/explore"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                pathname === '/explore' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Campaigns</span>
            </Link>

            <Link
              href="/pricing"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                pathname === '/pricing' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pricing</span>
            </Link>

            {/* Join as Developer button redirects to client repository */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Join as Developer</span>
            </a>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Available Credits */}
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-200 text-xs font-semibold">
                  <Coins className="w-4 h-4 text-amber-500 animate-bounce" />
                  <span>{user.credits ?? 0} Credits</span>
                </div>

                {/* Dashboard Button */}
                <Link
                  href={getDashboardRoute()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide shadow-md shadow-indigo-600/20 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Floating Notification Popover */}
                <NotificationDropdown />

                {/* User Profile & Logout */}
                <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <ThemeToggle />
            {user && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 px-4 pt-2 pb-6 space-y-4">
          <Link
            href="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-slate-700 dark:text-slate-200 text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Explore Campaigns</span>
          </Link>

          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-slate-700 dark:text-slate-200 text-sm font-medium"
          >
            <CreditCard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Pricing / Purchase Credit</span>
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 py-2 text-slate-700 text-sm font-medium"
          >
            <Code className="w-4 h-4 text-indigo-600" />
            <span>Join as Developer</span>
          </a>

          {user ? (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs bg-slate-100 p-3 rounded-xl">
                <span className="text-slate-600">Available Credits</span>
                <span className="font-bold text-amber-600">{user.credits ?? 0} Credits</span>
              </div>
              <Link
                href={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-semibold text-sm border border-rose-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-slate-100 text-slate-800 rounded-xl font-semibold text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
