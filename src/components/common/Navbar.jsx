import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../utils/permissions';

export const Navbar = ({ onMenuToggle }) => {
  const { role, studentId, logout } = useRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/role-selection');
  };

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuToggle}
          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white md:hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand logo/title */}
        <div className="flex items-center gap-2 select-none">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            CampusVotes
          </span>
          <span className="hidden sm:inline-block text-xs px-2 py-0.5 font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900">
            Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Session details */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {role === ROLES.STUDENT ? 'Student Voter' : 'Election Manager'}
          </span>
          {role === ROLES.STUDENT && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              ID: <code className="px-1.5 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 font-mono text-indigo-600 dark:text-indigo-400">{studentId}</code>
            </span>
          )}
        </div>

        {/* Action button to logout/switch role */}
        <button
          onClick={handleLogout}
          id="btn-switch-role"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 dark:text-slate-350 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Switch Role
        </button>
      </div>
    </nav>
  );
};
