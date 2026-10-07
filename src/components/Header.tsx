import React from 'react';
import { TestCase } from '../types/algebra';
import { IGCSE_CASES } from '../utils/algebraSolver';
import { Plus, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeCaseId: string;
  onSelectCase: (testCase: TestCase) => void;
  onOpenCustomModal: () => void;
  onOpenExamGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCaseId,
  onSelectCase,
  onOpenCustomModal,
  onOpenExamGuide
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            IGCSE Algebra Visualizer
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links / case selectors */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2 text-xs font-semibold text-slate-600">
          {IGCSE_CASES.slice(0, 4).map((tc, index) => {
            const isActive = tc.id === activeCaseId;
            return (
              <button
                key={tc.id}
                onClick={() => onSelectCase(tc)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Case {index + 1}
              </button>
            );
          })}

          {/* Practice Case */}
          <button
            onClick={() => onSelectCase(IGCSE_CASES[4])}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeCaseId === IGCSE_CASES[4].id || activeCaseId === IGCSE_CASES[5].id
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Practice
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenExamGuide}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Exam Guide</span>
          </button>

          <button
            onClick={onOpenCustomModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/70">
        {IGCSE_CASES.slice(0, 4).map((tc, index) => {
          const isActive = tc.id === activeCaseId;
          return (
            <button
              key={`m-${tc.id}`}
              onClick={() => onSelectCase(tc)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Case {index + 1}
            </button>
          );
        })}
        <button
          onClick={() => onSelectCase(IGCSE_CASES[4])}
          className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap font-medium ${
            activeCaseId === IGCSE_CASES[4].id || activeCaseId === IGCSE_CASES[5].id
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Practice
        </button>
      </div>
    </header>
  );
};
