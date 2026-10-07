import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EquationTermState } from '../types/algebra';
import { MysteryBox } from './MysteryBox';
import { WeightCluster, WeightItem } from './WeightItem';
import { computeSideWeight } from '../utils/algebraSolver';
import { AlertTriangle, CheckCircle2, RotateCcw, Package, Sparkles } from 'lucide-react';

interface BalanceScaleProps {
  leftState: EquationTermState;
  rightState: EquationTermState;
  targetXValue: number;
  isSolved: boolean;
  isBalanced: boolean;
  onExpandBrackets?: () => void;
  onRebalance?: () => void;
  onUndo?: () => void;
  zeroPairMessage?: string | null;
}

export const BalanceScale: React.FC<BalanceScaleProps> = ({
  leftState,
  rightState,
  targetXValue,
  isSolved,
  isBalanced,
  onExpandBrackets,
  onRebalance,
  onUndo,
  zeroPairMessage
}) => {
  // Compute visual weights based on the actual target X value
  const leftWeight = computeSideWeight(leftState, targetXValue);
  const rightWeight = computeSideWeight(rightState, targetXValue);

  // Compute tilt angle (in degrees)
  let tiltAngle = 0;
  if (!isBalanced) {
    const diff = leftWeight - rightWeight;
    // Cap tilt between -14 and 14 degrees
    tiltAngle = Math.max(-14, Math.min(14, -diff * 2.5));
    if (tiltAngle === 0) tiltAngle = diff > 0 ? -9 : 9;
  }

  const hasUnexpandedLeft = Boolean(leftState.brackets && !leftState.brackets.expanded);
  const isFractionalLeft = Boolean(leftState.fractionDenominator && leftState.fractionDenominator > 1);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none pt-4 pb-2 px-2 sm:px-6">
      {/* Top Dial / Status Indicator */}
      <div className="flex items-center gap-2 mb-2 z-10">
        <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold shadow-sm transition-all duration-300 ${
          isSolved
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-400/30'
            : isBalanced
            ? 'bg-sky-50 text-sky-800 border border-sky-200'
            : 'bg-rose-100 text-rose-800 border border-rose-300 ring-2 ring-rose-400/40 animate-pulse'
        }`}>
          {isSolved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>EQUATION SOLVED · x = {targetXValue}</span>
            </>
          ) : isBalanced ? (
            <>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>SCALE BALANCED · EQUALITY MAINTAINED (=)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>SCALE UNBALANCED · EQUALITY BROKEN (≠)</span>
            </>
          )}
        </div>
      </div>

      {/* Zero Pair Floating Alert */}
      <AnimatePresence>
        {zeroPairMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 z-20 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{zeroPairMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Balance Scale Mechanical Rig */}
      <div className="relative w-full h-[370px] sm:h-[410px] flex items-center justify-center">
        {/* Central Fulcrum Stand (Stationary Base) */}
        <div className="absolute bottom-6 flex flex-col items-center pointer-events-none z-0">
          {/* Fulcrum Pillar */}
          <div className="w-5 sm:w-6 h-52 sm:h-56 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t-sm border border-slate-400/80 shadow-inner" />
          {/* Fulcrum Base / Pedestal */}
          <div className="w-36 sm:w-44 h-7 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 rounded-md border border-slate-400 shadow-md flex items-center justify-center">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-600 font-bold">
              IGCSE 0580 Fulcrum
            </span>
          </div>
        </div>

        {/* Pivot Center Bearing & Dial Background */}
        <div className="absolute top-[82px] sm:top-[88px] flex flex-col items-center pointer-events-none z-20">
          {/* Dial Protractor Arc */}
          <div className="relative w-28 h-14 overflow-hidden -mb-4">
            <div className={`w-28 h-28 rounded-full border-4 ${isBalanced ? 'border-emerald-400 bg-emerald-50/70' : 'border-rose-400 bg-rose-50/70'} transition-colors duration-300 flex items-start justify-center pt-1 shadow-inner`}>
              <div className="w-0.5 h-4 bg-slate-400 mt-1" />
            </div>
          </div>
          {/* Central Chrome Pivot Boss */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 border-2 border-slate-600 shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
        </div>

        {/* Rotating Lever Arm Assembly */}
        <motion.div
          animate={{ rotate: tiltAngle }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          className="absolute top-[94px] sm:top-[100px] w-full max-w-[560px] sm:max-w-[640px] flex items-center justify-between z-10"
        >
          {/* Main Horizontal Metallic Beam */}
          <div className="absolute inset-x-0 h-4 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 rounded-full border border-slate-600 shadow-md flex items-center justify-between px-3">
            {/* Beam measurement tick marks */}
            <div className="flex gap-2 opacity-50">
              <div className="w-0.5 h-2 bg-slate-700" />
              <div className="w-0.5 h-1.5 bg-slate-700" />
              <div className="w-0.5 h-2 bg-slate-700" />
            </div>
            <div className="flex gap-2 opacity-50">
              <div className="w-0.5 h-2 bg-slate-700" />
              <div className="w-0.5 h-1.5 bg-slate-700" />
              <div className="w-0.5 h-2 bg-slate-700" />
            </div>
          </div>

          {/* Pointer Needle attached to pivot */}
          <div 
            className="absolute left-1/2 -top-10 w-1 h-11 bg-rose-600 -translate-x-1/2 origin-bottom transition-transform shadow-sm pointer-events-none rounded-t"
            style={{ transform: `translateX(-50%) rotate(${tiltAngle * 1.5}deg)` }}
          >
            <div className="w-2.5 h-2.5 bg-rose-600 -ml-0.7 -mt-1 rotate-45" />
          </div>

          {/* --- LEFT SUSPENSION & PAN --- */}
          <div className="relative -ml-2 sm:-ml-4 flex flex-col items-center">
            {/* Left Suspension Strings/Rods */}
            <svg className="w-32 h-24 overflow-visible" viewBox="0 0 128 96">
              <line x1="64" y1="0" x2="16" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="64" y1="0" x2="112" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="64" cy="0" r="4" fill="#334155" />
            </svg>

            {/* Left Pan (Counter-rotates to stay level with gravity) */}
            <motion.div
              animate={{ rotate: -tiltAngle }}
              transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              className="relative -mt-2 flex flex-col items-center"
            >
              {/* Left Stage Content Deck */}
              <div className="min-w-[170px] sm:min-w-[210px] min-h-[140px] sm:min-h-[160px] pb-3 flex flex-col items-center justify-end">
                {/* Special Case 3: Unexpanded Brackets 2(x + 4) */}
                {hasUnexpandedLeft && leftState.brackets && (
                  <div className="flex flex-col items-center gap-2 mb-2 w-full">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {Array.from({ length: leftState.brackets.multiplier }).map((_, bagIdx) => (
                        <div
                          key={`bag-${bagIdx}`}
                          className="p-2 rounded-xl bg-blue-50/90 border-2 border-dashed border-blue-400 shadow-sm flex flex-col items-center gap-1.5"
                        >
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight flex items-center gap-1">
                            <Package className="w-3 h-3 text-blue-600" />
                            Group {bagIdx + 1}: (x + {leftState.brackets?.constInside})
                          </span>
                          <div className="flex items-center gap-1.5">
                            <MysteryBox size="sm" isRevealed={isSolved} revealedValue={targetXValue} />
                            <div className="flex flex-wrap gap-1 max-w-[60px]">
                              {Array.from({ length: leftState.brackets?.constInside || 0 }).map((_, wIdx) => (
                                <WeightItem key={`w-${bagIdx}-${wIdx}`} value={1} size="sm" />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {onExpandBrackets && (
                      <button
                        onClick={onExpandBrackets}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Expand Brackets (2x + 8)</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Special Case 4: Fractional Partitioned Tray (x + 3) / 4 */}
                {isFractionalLeft && (
                  <div className="flex flex-col items-center gap-1.5 mb-2 w-full">
                    <div className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase font-mono border border-indigo-200">
                      Partitioned Fraction: 1 of 4 parts
                    </div>
                    <div className="p-2 rounded-xl bg-indigo-50/90 border-2 border-indigo-400 shadow-sm flex items-center gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Array.from({ length: leftState.xCoeff }).map((_, i) => (
                          <MysteryBox key={`left-x-${i}`} size="sm" isRevealed={isSolved} revealedValue={targetXValue} />
                        ))}
                        <WeightCluster count={leftState.constant} maxIndividualRender={8} />
                      </div>
                      <div className="h-10 w-px bg-indigo-300" />
                      <span className="text-xs font-mono font-bold text-indigo-700">÷ 4</span>
                    </div>
                  </div>
                )}

                {/* Standard Left Items (Boxes & Weights) */}
                {!hasUnexpandedLeft && !isFractionalLeft && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[190px]">
                      {Array.from({ length: Math.max(0, leftState.xCoeff) }).map((_, i) => (
                        <MysteryBox key={`left-x-${i}`} isRevealed={isSolved} revealedValue={targetXValue} />
                      ))}
                    </div>
                    <WeightCluster count={leftState.constant} />
                  </div>
                )}

                {/* Empty Pan Indicator */}
                {!hasUnexpandedLeft && !isFractionalLeft && leftState.xCoeff === 0 && leftState.constant === 0 && (
                  <span className="text-xs text-slate-400 italic">Empty Pan (0)</span>
                )}
              </div>

              {/* Left Pan Base Dish */}
              <div className="w-40 sm:w-48 h-6 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-b-2xl border-t-2 border-slate-500 shadow-lg flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
                  Left Pan
                </span>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT SUSPENSION & PAN --- */}
          <div className="relative -mr-2 sm:-mr-4 flex flex-col items-center">
            {/* Right Suspension Strings/Rods */}
            <svg className="w-32 h-24 overflow-visible" viewBox="0 0 128 96">
              <line x1="64" y1="0" x2="16" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="3 2" />
              <line x1="64" y1="0" x2="112" y2="90" stroke="#64748b" strokeWidth="2" strokeDasharray="3 2" />
              <circle cx="64" cy="0" r="4" fill="#334155" />
            </svg>

            {/* Right Pan (Counter-rotates to stay level with gravity) */}
            <motion.div
              animate={{ rotate: -tiltAngle }}
              transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              className="relative -mt-2 flex flex-col items-center"
            >
              {/* Right Stage Content Deck */}
              <div className="min-w-[170px] sm:min-w-[210px] min-h-[140px] sm:min-h-[160px] pb-3 flex flex-col items-center justify-end">
                {/* Mystery Boxes on Right */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[190px]">
                  {Array.from({ length: Math.max(0, rightState.xCoeff) }).map((_, i) => (
                    <MysteryBox key={`right-x-${i}`} isRevealed={isSolved} revealedValue={targetXValue} />
                  ))}
                </div>

                {/* Weights on Right */}
                <WeightCluster count={rightState.constant} maxIndividualRender={18} />

                {/* Empty Pan Indicator */}
                {rightState.xCoeff === 0 && rightState.constant === 0 && (
                  <span className="text-xs text-slate-400 italic">Empty Pan (0)</span>
                )}
              </div>

              {/* Right Pan Base Dish */}
              <div className="w-40 sm:w-48 h-6 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-b-2xl border-t-2 border-slate-500 shadow-lg flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">
                  Right Pan
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Unbalanced Warning Banner with Immediate Actions */}
      <AnimatePresence>
        {!isBalanced && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-xl mt-1 p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-900"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wide text-rose-800">
                  Scale Tilted! Equality Broken
                </h4>
                <p className="text-xs text-rose-700 leading-snug">
                  You modified one side without modifying the other. In algebra, both sides must always balance!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onRebalance && (
                <button
                  onClick={onRebalance}
                  className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                >
                  Balance Other Side
                </button>
              )}
              {onUndo && (
                <button
                  onClick={onUndo}
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Undo
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
