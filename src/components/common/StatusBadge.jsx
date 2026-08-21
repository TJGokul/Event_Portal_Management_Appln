import React from 'react';

export const StatusBadge = ({ status }) => {
  const isOpen = status === 'OPEN';
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
        isOpen
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400'
          : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
      }`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
      Voting {isOpen ? 'Open' : 'Closed'}
    </span>
  );
};
