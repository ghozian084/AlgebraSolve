import React, { useState } from 'react';
import { TestCase } from '../types/algebra';
import { Sparkles, X, Plus } from 'lucide-react';

interface CustomEquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetCustomCase: (customCase: TestCase) => void;
}

export const CustomEquationModal: React.FC<CustomEquationModalProps> = ({
  isOpen,
  onClose,
  onSetCustomCase
}) => {
  const [leftX, setLeftX] = useState<number>(3);
  const [leftConst, setLeftConst] = useState<number>(5);
  const [rightX, setRightX] = useState<number>(0);
  const [rightConst, setRightConst] = useState<number>(17);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    setError(null);

    // ax + b = cx + d => (a - c)x = d - b => x = (d - b) / (a - c)
    const netX = leftX - rightX;
    const netConst = rightConst - leftConst;

    if (netX === 0) {
      setError('Cannot create an equation where variable coefficients are identical on both sides (0x).');
      return;
    }

    const sol = netConst / netX;
    if (!Number.isInteger(sol)) {
      setError(`Notice: The solution is a fraction (${sol.toFixed(2)}). For visual unit weights, please choose numbers that give a whole integer solution (e.g., 3x + 5 = 17 -> x = 4).`);
      return;
    }

    if (sol <= 0) {
      setError('Visual unit weights require a positive integer solution (x > 0). Please adjust the numbers.');
      return;
    }

    // Format equation string
    const leftXPart = leftX === 1 ? 'x' : leftX !== 0 ? `${leftX}x` : '';
    const leftConstPart = leftConst !== 0 ? (leftXPart ? (leftConst > 0 ? ` + ${leftConst}` : ` - ${Math.abs(leftConst)}`) : `${leftConst}`) : '';
    const leftStr = `${leftXPart}${leftConstPart}` || '0';

    const rightXPart = rightX === 1 ? 'x' : rightX !== 0 ? `${rightX}x` : '';
    const rightConstPart = rightConst !== 0 ? (rightXPart ? (rightConst > 0 ? ` + ${rightConst}` : ` - ${Math.abs(rightConst)}`) : `${rightConst}`) : '';
    const rightStr = `${rightXPart}${rightConstPart}` || '0';

    const eqStr = `${leftStr} = ${rightStr}`;

    const newCase: TestCase = {
      id: `custom-${Date.now()}`,
      title: `Custom: ${eqStr}`,
      category: 'Extended',
      equation: eqStr,
      description: 'User-defined linear equation for balance scale exploration.',
      learningGoal: 'Solve the custom linear equation by balancing like terms on both sides of the scale.',
      stepsGuide: [
        'Isolate variable terms on one side.',
        'Collect constants on the opposite side.',
        'Divide by coefficient of x.'
      ],
      initialState: {
        left: { xCoeff: leftX, constant: leftConst },
        right: { xCoeff: rightX, constant: rightConst },
        originalEquationStr: eqStr,
        targetXValue: sol
      }
    };

    onSetCustomCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Equation Builder</h3>
              <p className="text-xs text-slate-500">Configure ax + b = cx + d</p>
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
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block mb-1">
              Live Preview
            </span>
            <div className="text-lg font-mono font-bold text-slate-900">
              {leftX !== 0 ? `${leftX}x` : ''} {leftConst >= 0 ? `+ ${leftConst}` : `- ${Math.abs(leftConst)}`} = {rightX !== 0 ? `${rightX}x` : ''} {rightConst >= 0 ? `+ ${rightConst}` : `- ${Math.abs(rightConst)}`}
            </div>
          </div>

          {/* Left Side Inputs */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">Left Pan</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Boxes (x Coeff)</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={leftX}
                  onChange={(e) => setLeftX(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Weights (Constant)</label>
                <input
                  type="number"
                  min="-20"
                  max="50"
                  value={leftConst}
                  onChange={(e) => setLeftConst(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Right Side Inputs */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">Right Pan</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Boxes (x Coeff)</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={rightX}
                  onChange={(e) => setRightX(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-medium">Weights (Constant)</label>
                <input
                  type="number"
                  min="-20"
                  max="50"
                  value={rightConst}
                  onChange={(e) => setRightConst(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            Load onto Scale
          </button>
        </div>
      </div>
    </div>
  );
};
