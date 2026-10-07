export type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';

export type TargetSide = 'both' | 'left' | 'right';

export interface EquationTermState {
  xCoeff: number;        // e.g. 3 for 3x
  constant: number;      // e.g. 5
  brackets?: {
    multiplier: number;  // e.g. 2 for 2(x + 4)
    xInside: number;     // e.g. 1
    constInside: number; // e.g. 4
    expanded: boolean;
  };
  fractionDenominator?: number; // e.g. 4 for (x + 3) / 4
}

export interface EquationState {
  left: EquationTermState;
  right: EquationTermState;
  originalEquationStr: string;
  targetXValue: number;
}

export interface StepRecord {
  id: string;
  stepNumber: number;
  operationText: string;
  algebraicNotation: string;
  equationDisplay: string;
  leftState: EquationTermState;
  rightState: EquationTermState;
  examNote?: string;
  isBalanced: boolean;
}

export interface TestCase {
  id: string;
  title: string;
  category: 'Foundation' | 'Core' | 'Extended' | 'Higher Tier';
  equation: string;
  description: string;
  initialState: EquationState;
  learningGoal: string;
  stepsGuide: string[];
}
