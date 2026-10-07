import React, { useState } from 'react';
import { OperationType, TargetSide, EquationTermState } from '../types/algebra';
import { getSmartNextStep } from '../utils/algebraSolver';
import { Plus, Minus, X, Divide, Sparkles, HelpCircle, Layers, ArrowRight } from 'lucide-react';

interface ControlsDeckProps {
  leftState: EquationTermState;
  rightState: EquationTermState;
  onApplyOperation: (op: OperationType, operandType: 'number' | 'variable', value: number, target: TargetSide) => void;
  onExpandBrackets?: () => void;
  onOpenHint: () => void;
  isSolved: boolean;
}

export const ControlsDeck: React.FC<ControlsDeckProps> = ({
  leftState,
  rightState,
  onApplyOperation,
  onExpandBrackets,
  onOpenHint,
  isSolved
}) => {
  const [selectedOp, setSelectedOp] = useState<OperationType>('subtract');
  const [operandType, setOperandType] = useState<'number' | 'variable'>('number');
  const [numericValue, setNumericValue] = useState<number>(5);
  const [variableCoeff, setVariableCoeff] = useState<number>(1);
  const [targetSide, setTargetSide] = useState<TargetSide>('both');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute smart next step
  const smartRecommendation = getSmartNextStep(leftState, rightState);

  const handleExecute = () => {
    setErrorMessage(null);
    const value = operandType === 'number' ? numericValue : variableCoeff;

    if (isNaN(value) || value <= 0) {
      setErrorMessage('Please enter a positive value greater than 0.');
      return;
    }

    if (selectedOp === 'divide' && value === 0) {
      setErrorMessage('Division by zero is undefined.');
      return;
    }

    onApplyOperation(selectedOp, operandType, value, targetSide);
  };

  const handleApplySmart = (
    op: OperationType, 
    type: 'number' | 'variable', 
    val: number,
    isExpand?: boolean
  ) => {
    if (isExpand && onExpandBrackets) {
      onExpandBrackets();
      return;
    }
    onApplyOperation(op, type, val, 'both');
  };

  const hasUnexpandedLeft = Boolean(leftState.brackets && !leftState.brackets.expanded);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {/* Top Deck: Contextual Smart Quick Actions & Hint Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Recommended Balance Moves
          </span>
        </div>

        <button
          onClick={onOpenHint}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>What's my next goal?</span>
        </button>
      </div>

      {/* Smart Suggestions Chips */}
      {!isSolved && (
        <div className="flex flex-wrap items-center gap-2">
          {hasUnexpandedLeft && onExpandBrackets && (
            <button
              onClick={() => handleApplySmart('multiply', 'number', 2, true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Expand 2(x + 4) → 2x + 8</span>
            </button>
          )}

          {smartRecommendation && !hasUnexpandedLeft && (
            <button
              onClick={() => handleApplySmart(
                smartRecommendation.operationType,
                smartRecommendation.operandType,
                smartRecommendation.operandValue,
                smartRecommendation.canExpand
              )}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition-all active:scale-95 group"
            >
              <span>{smartRecommendation.exactAction}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Quick preset buttons based on current state */}
          {leftState.xCoeff > 0 && rightState.xCoeff > 0 && (
            <button
              onClick={() => handleApplySmart('subtract', 'variable', Math.min(leftState.xCoeff, rightState.xCoeff))}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
            >
              − {Math.min(leftState.xCoeff, rightState.xCoeff) === 1 ? 'x' : `${Math.min(leftState.xCoeff, rightState.xCoeff)}x`} (both sides)
            </button>
          )}

          {leftState.fractionDenominator && leftState.fractionDenominator > 1 && (
            <button
              onClick={() => handleApplySmart('multiply', 'number', leftState.fractionDenominator!)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold border border-indigo-200 transition-colors"
            >
              × {leftState.fractionDenominator} (clear denominator)
            </button>
          )}
        </div>
      )}

      {/* Main Interactive Operation Builder */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Step 1: Choose Operator */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">1. Select Operation</label>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedOp('add')}
              className={`py-2 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                selectedOp === 'add'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Add"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedOp('subtract')}
              className={`py-2 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                selectedOp === 'subtract'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Subtract"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedOp('multiply')}
              className={`py-2 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                selectedOp === 'multiply'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Multiply"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedOp('divide')}
              className={`py-2 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                selectedOp === 'divide'
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Divide"
            >
              <Divide className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 2: Choose Operand (Number vs Variable x) & Value */}
        <div className="md:col-span-5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">2. Operand</label>
            <div className="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setOperandType('number')}
                className={`px-2 py-0.5 rounded ${
                  operandType === 'number' ? 'bg-blue-600 text-white font-medium' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Constant
              </button>
              <button
                type="button"
                onClick={() => setOperandType('variable')}
                className={`px-2 py-0.5 rounded ${
                  operandType === 'variable' ? 'bg-blue-600 text-white font-medium' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Variable (x)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {operandType === 'number' ? (
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={numericValue}
                  onChange={(e) => setNumericValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  placeholder="Number e.g. 5"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">units</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={variableCoeff}
                  onChange={(e) => setVariableCoeff(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-center"
                />
                <div className="px-3 py-2 bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-sm font-bold font-serif italic">
                  x
                </div>
              </div>
            )}

            {/* Quick +/- 1 buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  if (operandType === 'number') setNumericValue(prev => Math.max(1, prev - 1));
                  else setVariableCoeff(prev => Math.max(1, prev - 1));
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  if (operandType === 'number') setNumericValue(prev => prev + 1);
                  else setVariableCoeff(prev => prev + 1);
                }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Target Application & Execute */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">3. Apply Target</label>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetSide}
              onChange={(e) => setTargetSide(e.target.value as TargetSide)}
              className="flex-1 px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">Both Sides (Balanced)</option>
              <option value="left">Left Only (Break Scale!)</option>
              <option value="right">Right Only (Break Scale!)</option>
            </select>

            <button
              onClick={handleExecute}
              disabled={isSolved}
              className={`px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-sm active:scale-95 whitespace-nowrap ${
                isSolved
                  ? 'bg-slate-300 cursor-not-allowed'
                  : targetSide === 'both'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <span className="text-xs font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
