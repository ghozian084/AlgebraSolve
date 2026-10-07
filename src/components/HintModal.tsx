import React, { useState } from 'react';
import { HintRecommendation } from '../utils/algebraSolver';
import { HelpCircle, X, Lightbulb, Compass, Target, ArrowRight } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: HintRecommendation | null;
  onApplyRecommendation: (hint: HintRecommendation) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  hint,
  onApplyRecommendation
}) => {
  const [revealedTier, setRevealedTier] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">What's My Next Goal?</h3>
              <p className="text-xs text-slate-500">IGCSE 0580 Algebra Strategy Coach</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!hint ? (
            <div className="text-center py-6 text-slate-600">
              <p className="text-sm font-semibold">The equation is already balanced or fully solved!</p>
              <p className="text-xs text-slate-400 mt-1">Try another case or restart to practice again.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Tier 1: Strategic Direction */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Strategic Objective</span>
                </div>
                <p className="text-sm font-semibold text-blue-950">
                  {hint.strategicGoal}
                </p>
              </div>

              {/* Tier 2: Targeted Clue */}
              {revealedTier >= 2 ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Targeted Clue</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {hint.nudge}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setRevealedTier(2)}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Still unsure? Reveal Targeted Clue (Nudge)</span>
                </button>
              )}

              {/* Tier 3: Direct Action */}
              {revealedTier >= 3 ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 animate-in fade-in duration-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exact Balanced Move</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-950 font-mono">
                    {hint.exactAction}
                  </p>
                  <button
                    onClick={() => {
                      onApplyRecommendation(hint);
                      onClose();
                    }}
                    className="mt-1 self-start px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Execute this move</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : revealedTier >= 2 ? (
                <button
                  onClick={() => setRevealedTier(3)}
                  className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Need the exact answer? Reveal Exact Action</span>
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
