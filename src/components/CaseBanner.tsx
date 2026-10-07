import React from 'react';
import { TestCase } from '../types/algebra';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

interface CaseBannerProps {
  testCase: TestCase;
  onPrevCase: () => void;
  onNextCase: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const CaseBanner: React.FC<CaseBannerProps> = ({
  testCase,
  onPrevCase,
  onNextCase,
  hasPrev,
  hasNext
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-blue-700">{testCase.category}</span>
          <span aria-hidden="true">·</span>
          <span>IGCSE 0580 Algebra</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{testCase.equation}</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {testCase.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex items-start gap-1.5 pt-0.5">
          <Compass className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>{testCase.learningGoal}</span>
        </p>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button
          onClick={onPrevCase}
          disabled={!hasPrev}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous level"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNextCase}
          disabled={!hasNext}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next level"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
