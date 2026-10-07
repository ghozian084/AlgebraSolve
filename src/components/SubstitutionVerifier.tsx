import React from 'react';
import { TestCase } from '../types/algebra';
import { CheckCircle2, X, Award, Sparkles } from 'lucide-react';

interface SubstitutionVerifierProps {
  isOpen: boolean;
  onClose: () => void;
  testCase: TestCase;
  solvedXValue: number;
}

export const SubstitutionVerifier: React.FC<SubstitutionVerifierProps> = ({
  isOpen,
  onClose,
  testCase,
  solvedXValue
}) => {
  if (!isOpen) return null;

  const { initialState } = testCase;
  
  // Calculate evaluation steps
  let leftCalculated = 0;
  let leftExplanation = '';
  let rightCalculated = 0;
  let rightExplanation = '';

  if (initialState.left.brackets) {
    const { multiplier, constInside } = initialState.left.brackets;
    const inside = solvedXValue + constInside;
    leftCalculated = multiplier * inside;
    leftExplanation = `${multiplier}((${solvedXValue}) + ${constInside}) = ${multiplier}(${inside}) = ${leftCalculated}`;
  } else if (initialState.left.fractionDenominator) {
    const denom = initialState.left.fractionDenominator;
    const top = solvedXValue + initialState.left.constant;
    leftCalculated = top / denom;
    leftExplanation = `((${solvedXValue}) + ${initialState.left.constant}) / ${denom} = ${top} / ${denom} = ${leftCalculated}`;
  } else {
    const xTerm = initialState.left.xCoeff * solvedXValue;
    leftCalculated = xTerm + initialState.left.constant;
    const sign = initialState.left.constant >= 0 ? '+' : '-';
    leftExplanation = `${initialState.left.xCoeff}(${solvedXValue}) ${sign} ${Math.abs(initialState.left.constant)} = ${xTerm} ${sign} ${Math.abs(initialState.left.constant)} = ${leftCalculated}`;
  }

  // Right side evaluation
  const rightXTerm = initialState.right.xCoeff * solvedXValue;
  rightCalculated = rightXTerm + initialState.right.constant;
  if (initialState.right.xCoeff > 0) {
    const sign = initialState.right.constant >= 0 ? '+' : '-';
    rightExplanation = `${initialState.right.xCoeff}(${solvedXValue}) ${sign} ${Math.abs(initialState.right.constant)} = ${rightXTerm} ${sign} ${Math.abs(initialState.right.constant)} = ${rightCalculated}`;
  } else {
    rightExplanation = `${initialState.right.constant}`;
  }

  const isVerified = Math.abs(leftCalculated - rightCalculated) < 0.001;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">IGCSE Checking Method</h3>
              <p className="text-xs text-emerald-700">Proof by Algebraic Substitution</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">
              Original Equation
            </span>
            <div className="text-base font-bold font-mono text-slate-900">
              {testCase.equation}
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              Substitute x = {solvedXValue} into both sides
            </div>
          </div>

          {/* Verification Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Left Hand Side (LHS) */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Left Hand Side (LHS)
                </span>
                <p className="text-xs font-mono text-slate-800 break-words font-semibold leading-relaxed">
                  {leftExplanation}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/80 flex items-center justify-between">
                <span className="text-xs text-blue-800 font-medium">LHS Value:</span>
                <span className="text-base font-extrabold font-mono text-blue-900">{leftCalculated}</span>
              </div>
            </div>

            {/* Right Hand Side (RHS) */}
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  Right Hand Side (RHS)
                </span>
                <p className="text-xs font-mono text-slate-800 break-words font-semibold leading-relaxed">
                  {rightExplanation}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-200/80 flex items-center justify-between">
                <span className="text-xs text-indigo-800 font-medium">RHS Value:</span>
                <span className="text-base font-extrabold font-mono text-indigo-900">{rightCalculated}</span>
              </div>
            </div>
          </div>

          {/* Final Verification Result */}
          {isVerified && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  LHS = RHS ({leftCalculated} = {rightCalculated})
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  The equality holds true! In an IGCSE exam, checking your answer guarantees maximum marks.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
