import React from 'react';
import { StepRecord } from '../types/algebra';
import { RotateCcw, Award, CheckCircle2, History, ArrowRight } from 'lucide-react';

interface StepTrackerProps {
  steps: StepRecord[];
  isSolved: boolean;
  targetXValue: number;
  onUndo: () => void;
  onReset: () => void;
  onOpenSubstitution: () => void;
}

export const StepTracker: React.FC<StepTrackerProps> = ({
  steps,
  isSolved,
  targetXValue,
  onUndo,
  onReset,
  onOpenSubstitution
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Step-by-Step Working
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={steps.length <= 1}
            className="p-1.5 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 rounded-lg transition-colors"
            title="Undo last step"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onReset}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Solved Celebration Banner in Tracker */}
      {isSolved && (
        <div className="mb-3 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Equation Solved!
              </h4>
              <p className="text-sm font-extrabold text-emerald-900 font-mono">
                x = {targetXValue}
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            The mystery box has been isolated to a single unit. Each x-box has an exact mass of {targetXValue}.
          </p>
          <button
            onClick={onOpenSubstitution}
            className="mt-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verify by Substitution (IGCSE Method)</span>
          </button>
        </div>
      )}

      {/* Step List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px]">
        {steps.map((step, idx) => {
          const isLatest = idx === steps.length - 1;
          const isInitial = idx === 0;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all ${
                isLatest && !isSolved
                  ? 'bg-blue-50/70 border-blue-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700 font-mono">
                  {isInitial ? 'Initial Equation' : `Step ${step.stepNumber}`}
                </span>

                {!step.isBalanced && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                    Unbalanced
                  </span>
                )}
              </div>

              {!isInitial && (
                <div className="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-blue-500" />
                  <span>{step.operationText}</span>
                </div>
              )}

              {/* Algebraic Equation Display */}
              <div className="font-mono font-bold text-sm sm:text-base text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 shadow-2xs">
                {step.equationDisplay}
              </div>

              {/* IGCSE Mark Scheme Annotation */}
              {step.examNote && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded-md">
                  <Award className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="font-mono text-amber-800 font-medium">{step.examNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>Total steps: {steps.length - 1}</span>
        <span className="font-mono text-[11px]">IGCSE 0580 Algebra</span>
      </div>
    </div>
  );
};
