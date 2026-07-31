'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2.5 rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center ${
        isDark
          ? 'bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700 shadow-md'
          : 'bg-slate-100 border border-slate-200 text-indigo-600 hover:text-indigo-800 hover:border-slate-300 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 transform rotate-0 transition-transform duration-500 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 transform rotate-0 transition-transform duration-500 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
