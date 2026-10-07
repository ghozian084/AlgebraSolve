import React from 'react';
import { BookOpen, X, Check, Award, AlertCircle } from 'lucide-react';

interface ExamGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamGuideModal: React.FC<ExamGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">IGCSE 0580 Exam Guide</h3>
              <p className="text-xs text-slate-500">Official Cambridge Mark Scheme Principles</p>
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
        <div className="p-5 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-700">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h4 className="font-bold text-blue-900 text-sm mb-1">
              Mark Scheme Hierarchy (Linear Equations)
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              In Cambridge IGCSE 0580 Paper 2 (Extended) and Paper 1 (Core), linear equations typically carry 2 to 3 marks.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-xs">M1</span>
                <span>Method Mark (Term Collection / Isolation)</span>
              </div>
              <p className="text-xs text-slate-600">
                Awarded for a correct first step to collect like terms on one side (e.g. subtracting constant or variable term from both sides: <code className="bg-slate-200 px-1 py-0.5 rounded">3x = 17 - 5</code>).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-xs">M1</span>
                <span>Method Mark (Expansion or Fraction Clearing)</span>
              </div>
              <p className="text-xs text-slate-600">
                Awarded for expanding brackets correctly (<code className="bg-slate-200 px-1 py-0.5 rounded">2(x + 4) → 2x + 8</code>) or multiplying both sides by denominator (<code className="bg-slate-200 px-1 py-0.5 rounded">(x + 3)/4 = 2 → x + 3 = 8</code>).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-xs">A1</span>
                <span>Accuracy Mark (Final Answer)</span>
              </div>
              <p className="text-xs text-slate-600">
                Awarded only for the correct isolated numerical solution (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded">x = 4</code>). An unsupported correct answer usually receives full marks, but any arithmetic slip without working receives 0.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Examiner Warning Tip:</span>
              <p className="mt-0.5 leading-snug">
                Never write unbalanced intermediate lines on your exam paper. Every equal sign (<code className="font-bold font-mono">=</code>) must be mathematically equivalent to the previous line!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
