import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useElectionQuery } from '../../hooks/queries/useElectionQuery';
import { useVoterStatusQuery } from '../../hooks/queries/useVoterStatusQuery';
import { useRole } from '../../hooks/useRole';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PageTransition } from '../../components/motion/PageTransition';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { role, studentId } = useRole();
  
  // Queries
  const { data: electionRes, isLoading: electionLoading, isError: electionError } = useElectionQuery();
  const { data: statusRes, isLoading: statusLoading } = useVoterStatusQuery(role, studentId);

  if (electionLoading || statusLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-450 text-sm">Loading election dashboard...</p>
      </div>
    );
  }

  if (electionError || !electionRes?.success) {
    return (
      <div className="text-center py-12">
        <div className="text-rose-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Failed to Load Election Data</h2>
        <p className="text-slate-500 dark:text-slate-450 mt-1">Please check your connection and try again.</p>
      </div>
    );
  }

  const { election, categories } = electionRes.data;
  const voterStatus = statusRes?.data || { votedCategoryIds: {}, hasVotedAny: false };
  
  const totalCategories = categories.length;
  const votedCount = Object.keys(voterStatus.votedCategoryIds).length;
  const progressPercent = totalCategories > 0 ? Math.round((votedCount / totalCategories) * 100) : 0;
  const isElectionOpen = election.status === 'OPEN';

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Dashboard Header Banner */}
        <div className="relative bg-gradient-to-r from-indigo-900 to-violet-905 rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-lg">
          <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/6 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-350 bg-indigo-950/60 border border-indigo-850 px-2.5 py-0.5 rounded-full">
                  Student Voter Workspace
                </span>
                <StatusBadge status={election.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {election.title}
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                Welcome, {studentId}! Browse current categories, review candidates, and submit your secure ballot. You can vote exactly once per category.
              </p>
            </div>

            {/* Voting Progress Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-center min-w-[200px]">
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Voting Progress</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold">{votedCount}</span>
                <span className="text-slate-300 text-sm">/ {totalCategories} categories</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-400 h-full rounded-full transition-all duration-550" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-300 mt-2 text-right">
                {progressPercent}% Completed
              </span>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Voting Categories</h2>
            <span className="text-xs text-slate-500">{totalCategories} Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const votedInfo = voterStatus.votedCategoryIds[category.id];
              const hasVoted = !!votedInfo;

              return (
                <div 
                  key={category.id} 
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm dark:bg-slate-900 ${
                    hasVoted 
                      ? 'border-indigo-100 dark:border-indigo-950 ring-1 ring-indigo-50 dark:ring-indigo-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Category State Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {category.id}
                      </span>
                      {hasVoted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Ballot Cast
                        </span>
                      ) : !isElectionOpen ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-100 dark:border-rose-900">
                          Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900">
                          Ballot Available
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {hasVoted 
                          ? 'Your ballot has been successfully received and counted in this category.' 
                          : isElectionOpen 
                          ? 'Review candidate profiles and manifestos to submit your choice.' 
                          : 'Voting is disabled because the manager has closed this election.'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {hasVoted ? (
                      <button
                        onClick={() => navigate(`/student/receipt/${votedInfo.receiptId}`)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-350 dark:hover:text-white rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-750 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Receipt
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/student/vote/${category.id}`)}
                        disabled={!isElectionOpen}
                        className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                          isElectionOpen
                            ? 'bg-indigo-600 hover:bg-indigo-750 text-white shadow-md shadow-indigo-100 dark:shadow-none focus-visible:ring-2 focus-visible:ring-indigo-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-750 cursor-not-allowed'
                        }`}
                      >
                        {isElectionOpen ? (
                          <>
                            Browse Candidates
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        ) : (
                          'Voting Closed'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentDashboard;
