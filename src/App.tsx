/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  TestCase, 
  EquationTermState, 
  OperationType, 
  TargetSide, 
  StepRecord 
} from './types/algebra';
import { 
  IGCSE_CASES, 
  formatEquation, 
  formatSide, 
  isEquationSolved, 
  getSmartNextStep,
  HintRecommendation 
} from './utils/algebraSolver';
import { Header } from './components/Header';
import { CaseBanner } from './components/CaseBanner';
import { BalanceScale } from './components/BalanceScale';
import { ControlsDeck } from './components/ControlsDeck';
import { StepTracker } from './components/StepTracker';
import { HintModal } from './components/HintModal';
import { SubstitutionVerifier } from './components/SubstitutionVerifier';
import { CustomEquationModal } from './components/CustomEquationModal';
import { ExamGuideModal } from './components/ExamGuideModal';

export default function App() {
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [testCase, setTestCase] = useState<TestCase>(IGCSE_CASES[0]);

  // Current equation state
  const [leftState, setLeftState] = useState<EquationTermState>(IGCSE_CASES[0].initialState.left);
  const [rightState, setRightState] = useState<EquationTermState>(IGCSE_CASES[0].initialState.right);
  const [isBalanced, setIsBalanced] = useState<boolean>(true);
  const [pendingUnbalancedOp, setPendingUnbalancedOp] = useState<{
    op: OperationType;
    type: 'number' | 'variable';
    val: number;
    missedSide: 'left' | 'right';
  } | null>(null);

  // History / Steps
  const [steps, setSteps] = useState<StepRecord[]>([]);
  const [zeroPairMessage, setZeroPairMessage] = useState<string | null>(null);

  // Modals
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isSubstitutionOpen, setIsSubstitutionOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isExamGuideOpen, setIsExamGuideOpen] = useState<boolean>(false);

  // Audio tone synthesizer for tactile pedagogical feedback
  const playTone = (type: 'balanced' | 'unbalanced' | 'solved') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'balanced') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.15); // A4 -> D5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'unbalanced') {
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'solved') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio playback silently disabled if not allowed
    }
  };

  // Check if solved
  const isSolved = isBalanced && isEquationSolved(leftState, rightState);
  const solvedRef = useRef(false);

  // Initialize or change case
  const loadTestCase = (tc: TestCase, index?: number) => {
    setTestCase(tc);
    if (index !== undefined) setCurrentCaseIndex(index);
    setLeftState(JSON.parse(JSON.stringify(tc.initialState.left)));
    setRightState(JSON.parse(JSON.stringify(tc.initialState.right)));
    setIsBalanced(true);
    setPendingUnbalancedOp(null);
    setZeroPairMessage(null);
    solvedRef.current = false;

    const initialEqDisplay = formatEquation(tc.initialState.left, tc.initialState.right, true);
    setSteps([
      {
        id: `step-0-${Date.now()}`,
        stepNumber: 0,
        operationText: 'Initial Equation',
        algebraicNotation: '',
        equationDisplay: initialEqDisplay,
        leftState: JSON.parse(JSON.stringify(tc.initialState.left)),
        rightState: JSON.parse(JSON.stringify(tc.initialState.right)),
        isBalanced: true
      }
    ]);
  };

  useEffect(() => {
    loadTestCase(testCase);
  }, []);

  // Trigger celebration on solved
  useEffect(() => {
    if (isSolved && !solvedRef.current) {
      solvedRef.current = true;
      playTone('solved');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isSolved]);

  // Apply single side term mutation
  const applySideOperation = (
    side: EquationTermState,
    op: OperationType,
    type: 'number' | 'variable',
    val: number
  ): { newState: EquationTermState; zeroPairs: boolean } => {
    const s: EquationTermState = JSON.parse(JSON.stringify(side));
    let zeroPairs = false;

    // If brackets exist and unexpanded
    if (s.brackets && !s.brackets.expanded) {
      if (op === 'divide' && type === 'number' && val === s.brackets.multiplier) {
        // Divide by outer multiplier: 2(x + 4) / 2 -> x + 4
        s.xCoeff = s.brackets.xInside;
        s.constant = s.brackets.constInside;
        s.brackets = undefined;
        return { newState: s, zeroPairs: false };
      }
      // Otherwise auto-expand before standard arithmetic
      s.xCoeff = s.brackets.multiplier * s.brackets.xInside;
      s.constant = s.brackets.multiplier * s.brackets.constInside;
      s.brackets = undefined;
    }

    // If fraction exists
    if (s.fractionDenominator && s.fractionDenominator > 1) {
      if (op === 'multiply' && type === 'number' && val === s.fractionDenominator) {
        // Clear denominator: (x + 3) / 4 * 4 -> x + 3
        s.fractionDenominator = undefined;
        return { newState: s, zeroPairs: false };
      }
    }

    if (type === 'variable') {
      if (op === 'add') s.xCoeff += val;
      else if (op === 'subtract') s.xCoeff -= val;
      else if (op === 'multiply') s.xCoeff *= val;
      else if (op === 'divide' && val !== 0) s.xCoeff /= val;
    } else {
      if (op === 'add') {
        if (s.constant < 0 && val > 0) zeroPairs = true;
        s.constant += val;
      } else if (op === 'subtract') {
        if (s.constant > 0 && val > 0) {
          // Normal subtraction
        }
        s.constant -= val;
      } else if (op === 'multiply') {
        s.constant *= val;
        s.xCoeff *= val;
      } else if (op === 'divide' && val !== 0) {
        s.constant /= val;
        s.xCoeff /= val;
      }
    }

    return { newState: s, zeroPairs };
  };

  // Perform Operation
  const handleApplyOperation = (
    op: OperationType,
    operandType: 'number' | 'variable',
    value: number,
    target: TargetSide
  ) => {
    setZeroPairMessage(null);

    const opSymbol = {
      add: '+',
      subtract: '−',
      multiply: '×',
      divide: '÷'
    }[op];

    const operandStr = operandType === 'variable' ? (value === 1 ? 'x' : `${value}x`) : `${value}`;

    if (target === 'both') {
      // Balanced operation on both sides
      const resLeft = applySideOperation(leftState, op, operandType, value);
      const resRight = applySideOperation(rightState, op, operandType, value);

      setLeftState(resLeft.newState);
      setRightState(resRight.newState);
      setIsBalanced(true);
      setPendingUnbalancedOp(null);
      playTone('balanced');

      if (resLeft.zeroPairs || resRight.zeroPairs) {
        setZeroPairMessage(`Zero pairs formed! (+${value}) canceled out the negative weights.`);
      }

      // Generate Mark Scheme note if applicable
      let examNote: string | undefined = undefined;
      if (operandType === 'variable' && op === 'subtract') {
        examNote = 'M1: Method mark for collecting variable terms on one side';
      } else if (operandType === 'number' && (op === 'subtract' || op === 'add')) {
        examNote = 'M1: Method mark for collecting constant terms';
      } else if (op === 'divide') {
        if (isEquationSolved(resLeft.newState, resRight.newState)) {
          examNote = 'A1: Accuracy mark for final isolated solution';
        } else {
          examNote = 'M1: Method mark for dividing by coefficient';
        }
      }

      const eqDisplay = formatEquation(resLeft.newState, resRight.newState, true);
      const newStep: StepRecord = {
        id: `step-${steps.length}-${Date.now()}`,
        stepNumber: steps.length,
        operationText: `${opSymbol} ${operandStr} (both sides)`,
        algebraicNotation: `${opSymbol} ${operandStr}`,
        equationDisplay: eqDisplay,
        leftState: resLeft.newState,
        rightState: resRight.newState,
        examNote,
        isBalanced: true
      };

      setSteps(prev => [...prev, newStep]);
    } else if (target === 'left') {
      // Applied ONLY to left side
      const resLeft = applySideOperation(leftState, op, operandType, value);
      setLeftState(resLeft.newState);
      setIsBalanced(false);
      setPendingUnbalancedOp({
        op,
        type: operandType,
        val: value,
        missedSide: 'right'
      });
      playTone('unbalanced');

      const eqDisplay = formatEquation(resLeft.newState, rightState, false);
      const newStep: StepRecord = {
        id: `step-${steps.length}-${Date.now()}`,
        stepNumber: steps.length,
        operationText: `${opSymbol} ${operandStr} (LEFT PAN ONLY - Scale Broken!)`,
        algebraicNotation: `${opSymbol} ${operandStr} [Left]`,
        equationDisplay: eqDisplay,
        leftState: resLeft.newState,
        rightState: JSON.parse(JSON.stringify(rightState)),
        examNote: 'Warning: Equality broken (≠). In algebra, must apply to both sides.',
        isBalanced: false
      };

      setSteps(prev => [...prev, newStep]);
    } else if (target === 'right') {
      // Applied ONLY to right side
      const resRight = applySideOperation(rightState, op, operandType, value);
      setRightState(resRight.newState);
      setIsBalanced(false);
      setPendingUnbalancedOp({
        op,
        type: operandType,
        val: value,
        missedSide: 'left'
      });
      playTone('unbalanced');

      const eqDisplay = formatEquation(leftState, resRight.newState, false);
      const newStep: StepRecord = {
        id: `step-${steps.length}-${Date.now()}`,
        stepNumber: steps.length,
        operationText: `${opSymbol} ${operandStr} (RIGHT PAN ONLY - Scale Broken!)`,
        algebraicNotation: `${opSymbol} ${operandStr} [Right]`,
        equationDisplay: eqDisplay,
        leftState: JSON.parse(JSON.stringify(leftState)),
        rightState: resRight.newState,
        examNote: 'Warning: Equality broken (≠). In algebra, must apply to both sides.',
        isBalanced: false
      };

      setSteps(prev => [...prev, newStep]);
    }
  };

  // Case 3 Expand Brackets Handler
  const handleExpandBrackets = () => {
    if (!leftState.brackets) return;
    const { multiplier, xInside, constInside } = leftState.brackets;
    const newLeft: EquationTermState = {
      xCoeff: multiplier * xInside,
      constant: multiplier * constInside,
      brackets: undefined
    };

    setLeftState(newLeft);
    playTone('balanced');

    const eqDisplay = formatEquation(newLeft, rightState, true);
    const newStep: StepRecord = {
      id: `step-${steps.length}-${Date.now()}`,
      stepNumber: steps.length,
      operationText: `Expand 2(x + 4) → 2x + 8 (Distributive law)`,
      algebraicNotation: 'Expand brackets',
      equationDisplay: eqDisplay,
      leftState: newLeft,
      rightState: JSON.parse(JSON.stringify(rightState)),
      examNote: 'M1: Method mark for expanding brackets: 2 × x + 2 × 4',
      isBalanced: true
    };

    setSteps(prev => [...prev, newStep]);
  };

  // Rebalance from asymmetrical operation
  const handleRebalance = () => {
    if (!pendingUnbalancedOp) return;
    const { op, type, val, missedSide } = pendingUnbalancedOp;

    if (missedSide === 'right') {
      const resRight = applySideOperation(rightState, op, type, val);
      setRightState(resRight.newState);
      setIsBalanced(true);
      setPendingUnbalancedOp(null);
      playTone('balanced');

      const eqDisplay = formatEquation(leftState, resRight.newState, true);
      const newStep: StepRecord = {
        id: `step-${steps.length}-${Date.now()}`,
        stepNumber: steps.length,
        operationText: `Rebalanced: Applied same operation to Right side`,
        algebraicNotation: 'Rebalance',
        equationDisplay: eqDisplay,
        leftState: JSON.parse(JSON.stringify(leftState)),
        rightState: resRight.newState,
        examNote: 'Equality restored (=)',
        isBalanced: true
      };
      setSteps(prev => [...prev, newStep]);
    } else {
      const resLeft = applySideOperation(leftState, op, type, val);
      setLeftState(resLeft.newState);
      setIsBalanced(true);
      setPendingUnbalancedOp(null);
      playTone('balanced');

      const eqDisplay = formatEquation(resLeft.newState, rightState, true);
      const newStep: StepRecord = {
        id: `step-${steps.length}-${Date.now()}`,
        stepNumber: steps.length,
        operationText: `Rebalanced: Applied same operation to Left side`,
        algebraicNotation: 'Rebalance',
        equationDisplay: eqDisplay,
        leftState: resLeft.newState,
        rightState: JSON.parse(JSON.stringify(rightState)),
        examNote: 'Equality restored (=)',
        isBalanced: true
      };
      setSteps(prev => [...prev, newStep]);
    }
  };

  // Undo Last Step
  const handleUndo = () => {
    if (steps.length <= 1) return;
    const prevSteps = steps.slice(0, steps.length - 1);
    const lastValidStep = prevSteps[prevSteps.length - 1];

    setLeftState(JSON.parse(JSON.stringify(lastValidStep.leftState)));
    setRightState(JSON.parse(JSON.stringify(lastValidStep.rightState)));
    setIsBalanced(lastValidStep.isBalanced);
    setPendingUnbalancedOp(null);
    setZeroPairMessage(null);
    setSteps(prevSteps);
  };

  // Reset to initial
  const handleReset = () => {
    loadTestCase(testCase, currentCaseIndex);
  };

  // Navigation between cases
  const handleSelectCase = (tc: TestCase) => {
    const idx = IGCSE_CASES.findIndex(c => c.id === tc.id);
    loadTestCase(tc, idx !== -1 ? idx : 0);
  };

  const handlePrevCase = () => {
    if (currentCaseIndex > 0) {
      const prevIdx = currentCaseIndex - 1;
      loadTestCase(IGCSE_CASES[prevIdx], prevIdx);
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < IGCSE_CASES.length - 1) {
      const nextIdx = currentCaseIndex + 1;
      loadTestCase(IGCSE_CASES[nextIdx], nextIdx);
    }
  };

  // Handle hint recommendation auto-apply
  const handleApplyRecommendation = (rec: HintRecommendation) => {
    if (rec.canExpand) {
      handleExpandBrackets();
    } else {
      handleApplyOperation(rec.operationType, rec.operandType, rec.operandValue, 'both');
    }
  };

  const smartHint = getSmartNextStep(leftState, rightState);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeCaseId={testCase.id}
        onSelectCase={handleSelectCase}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenExamGuide={() => setIsExamGuideOpen(true)}
      />

      {/* Main Sandbox Stage Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
        {/* Case Banner & Syllabus Context */}
        <CaseBanner
          testCase={testCase}
          onPrevCase={handlePrevCase}
          onNextCase={handleNextCase}
          hasPrev={currentCaseIndex > 0}
          hasNext={currentCaseIndex < IGCSE_CASES.length - 1}
        />

        {/* 2-Zone Educational Sandbox: Visual Balance Stage (Left/Top) + Working Deck (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Visual Balance Stage (7 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative grid-blueprint">
              {/* Scale Stage Canvas */}
              <BalanceScale
                leftState={leftState}
                rightState={rightState}
                targetXValue={testCase.initialState.targetXValue}
                isSolved={isSolved}
                isBalanced={isBalanced}
                onExpandBrackets={handleExpandBrackets}
                onRebalance={handleRebalance}
                onUndo={handleUndo}
                zeroPairMessage={zeroPairMessage}
              />
            </div>

            {/* Interactive Operations Deck */}
            <ControlsDeck
              leftState={leftState}
              rightState={rightState}
              onApplyOperation={handleApplyOperation}
              onExpandBrackets={handleExpandBrackets}
              onOpenHint={() => setIsHintOpen(true)}
              isSolved={isSolved}
            />
          </div>

          {/* Step-by-Step Notation Tracker & Mark Scheme (4 cols on desktop) */}
          <div className="lg:col-span-4 h-full">
            <StepTracker
              steps={steps}
              isSolved={isSolved}
              targetXValue={testCase.initialState.targetXValue}
              onUndo={handleUndo}
              onReset={handleReset}
              onOpenSubstitution={() => setIsSubstitutionOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Educational Modals */}
      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        hint={smartHint}
        onApplyRecommendation={handleApplyRecommendation}
      />

      <SubstitutionVerifier
        isOpen={isSubstitutionOpen}
        onClose={() => setIsSubstitutionOpen(false)}
        testCase={testCase}
        solvedXValue={testCase.initialState.targetXValue}
      />

      <CustomEquationModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSetCustomCase={(customCase) => {
          loadTestCase(customCase);
          setCurrentCaseIndex(-1);
        }}
      />

      <ExamGuideModal
        isOpen={isExamGuideOpen}
        onClose={() => setIsExamGuideOpen(false)}
      />
    </div>
  );
}
