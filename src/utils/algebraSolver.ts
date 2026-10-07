import { TestCase, EquationState, EquationTermState, OperationType } from '../types/algebra';

export const IGCSE_CASES: TestCase[] = [
  {
    id: 'case-1',
    title: 'Case 1: Two-Step Foundation',
    category: 'Foundation',
    equation: '3x + 5 = 17',
    description: 'Left side has 3 mystery boxes and 5 positive weights. Right side has 17 weights.',
    learningGoal: 'Master subtracting the constant first to isolate the variable term, then dividing by the coefficient.',
    stepsGuide: [
      'Subtract 5 from both sides to remove the constants on the left.',
      'Divide both sides by 3 to find the value of a single mystery box x.'
    ],
    initialState: {
      left: { xCoeff: 3, constant: 5 },
      right: { xCoeff: 0, constant: 17 },
      originalEquationStr: '3x + 5 = 17',
      targetXValue: 4
    }
  },
  {
    id: 'case-2',
    title: 'Case 2: Variables on Both Sides',
    category: 'Core',
    equation: '5x - 2 = 2x + 10',
    description: 'Left has 5 x-boxes and 2 negative weights; Right has 2 x-boxes and 10 positive weights.',
    learningGoal: 'Collect variable terms on one side and constant terms on the other using balanced inverse operations.',
    stepsGuide: [
      'Subtract 2x from both sides to eliminate variables on the right.',
      'Add 2 to both sides (creates zero pairs with -2 on the left) to eliminate negative weights.',
      'Divide both sides by 3 to isolate x.'
    ],
    initialState: {
      left: { xCoeff: 5, constant: -2 },
      right: { xCoeff: 2, constant: 10 },
      originalEquationStr: '5x - 2 = 2x + 10',
      targetXValue: 4
    }
  },
  {
    id: 'case-3',
    title: 'Case 3: Expanding Brackets First',
    category: 'Extended',
    equation: '2(x + 4) = 14',
    description: 'Left side contains 2 distinct bags/groups of (x + 4). Right side has 14 unit weights.',
    learningGoal: 'Expand the grouped packages first using the distributive law, or divide both sides by the external factor.',
    stepsGuide: [
      'Click "Expand / Unpack" to multiply 2 by each item inside: 2x + 8.',
      'Subtract 8 from both sides.',
      'Divide both sides by 2 to isolate x.'
    ],
    initialState: {
      left: {
        xCoeff: 0,
        constant: 0,
        brackets: {
          multiplier: 2,
          xInside: 1,
          constInside: 4,
          expanded: false
        }
      },
      right: { xCoeff: 0, constant: 14 },
      originalEquationStr: '2(x + 4) = 14',
      targetXValue: 3
    }
  },
  {
    id: 'case-4',
    title: 'Case 4: Fractional Equations',
    category: 'Higher Tier',
    equation: '(x + 3) / 4 = 2',
    description: 'The left side is grouped in a fractional container divided by 4. Right side has 2 weights.',
    learningGoal: 'Clear the algebraic denominator first by applying the inverse operation (multiplication by 4 on both sides).',
    stepsGuide: [
      'Multiply both sides by 4 to eliminate the fraction denominator.',
      'Subtract 3 from both sides to isolate x.'
    ],
    initialState: {
      left: {
        xCoeff: 1,
        constant: 3,
        fractionDenominator: 4
      },
      right: { xCoeff: 0, constant: 2 },
      originalEquationStr: '(x + 3) / 4 = 2',
      targetXValue: 5
    }
  },
  {
    id: 'case-5',
    title: 'Exam Practice: 4x + 7 = 31',
    category: 'Foundation',
    equation: '4x + 7 = 31',
    description: 'IGCSE 0580 Paper 2 typical 2-mark linear equation with positive constants.',
    learningGoal: 'Practice the standard two-step method: subtract 7, then divide by 4.',
    stepsGuide: [
      'Subtract 7 from both sides: 4x = 24.',
      'Divide both sides by 4: x = 6.'
    ],
    initialState: {
      left: { xCoeff: 4, constant: 7 },
      right: { xCoeff: 0, constant: 31 },
      originalEquationStr: '4x + 7 = 31',
      targetXValue: 6
    }
  },
  {
    id: 'case-6',
    title: 'Exam Practice: 7x - 9 = 3x + 11',
    category: 'Extended',
    equation: '7x - 9 = 3x + 11',
    description: 'Multi-term IGCSE equation requiring variable collection and negative constant resolution.',
    learningGoal: 'Move smaller variable term (3x) first, then resolve negative constant.',
    stepsGuide: [
      'Subtract 3x from both sides: 4x - 9 = 11.',
      'Add 9 to both sides: 4x = 20.',
      'Divide both sides by 4: x = 5.'
    ],
    initialState: {
      left: { xCoeff: 7, constant: -9 },
      right: { xCoeff: 3, constant: 11 },
      originalEquationStr: '7x - 9 = 3x + 11',
      targetXValue: 5
    }
  }
];

export function formatSide(side: EquationTermState): string {
  if (side.brackets && !side.brackets.expanded) {
    const { multiplier, xInside, constInside } = side.brackets;
    const xPart = xInside === 1 ? 'x' : xInside === -1 ? '-x' : `${xInside}x`;
    const sign = constInside >= 0 ? '+' : '-';
    const constPart = Math.abs(constInside);
    const inside = `${xPart} ${sign} ${constPart}`;
    return `${multiplier}(${inside})`;
  }

  if (side.fractionDenominator && side.fractionDenominator > 1) {
    const xPart = side.xCoeff === 1 ? 'x' : side.xCoeff === 0 ? '' : `${side.xCoeff}x`;
    let numerator = xPart;
    if (side.constant !== 0) {
      if (numerator) {
        numerator += side.constant > 0 ? ` + ${side.constant}` : ` - ${Math.abs(side.constant)}`;
      } else {
        numerator = `${side.constant}`;
      }
    }
    if (!numerator) numerator = '0';
    return `(${numerator}) / ${side.fractionDenominator}`;
  }

  const parts: string[] = [];
  if (side.xCoeff !== 0) {
    if (side.xCoeff === 1) parts.push('x');
    else if (side.xCoeff === -1) parts.push('-x');
    else parts.push(`${side.xCoeff}x`);
  }

  if (side.constant !== 0) {
    if (parts.length > 0) {
      if (side.constant > 0) parts.push(`+ ${side.constant}`);
      else parts.push(`- ${Math.abs(side.constant)}`);
    } else {
      parts.push(`${side.constant}`);
    }
  }

  if (parts.length === 0) return '0';
  return parts.join(' ');
}

export function formatEquation(left: EquationTermState, right: EquationTermState, isBalanced: boolean = true): string {
  const symbol = isBalanced ? '=' : '≠';
  return `${formatSide(left)} ${symbol} ${formatSide(right)}`;
}

export function computeSideWeight(side: EquationTermState, xValue: number): number {
  if (side.brackets && !side.brackets.expanded) {
    return side.brackets.multiplier * (side.brackets.xInside * xValue + side.brackets.constInside);
  }
  const base = side.xCoeff * xValue + side.constant;
  if (side.fractionDenominator && side.fractionDenominator > 1) {
    return base / side.fractionDenominator;
  }
  return base;
}

export function isEquationSolved(left: EquationTermState, right: EquationTermState): boolean {
  // Case A: x = C
  if (left.xCoeff === 1 && left.constant === 0 && !left.brackets?.expanded && !left.fractionDenominator &&
      right.xCoeff === 0 && (!right.brackets || right.brackets.expanded) && !right.fractionDenominator) {
    return true;
  }
  // Case B: C = x
  if (right.xCoeff === 1 && right.constant === 0 && !right.brackets?.expanded && !right.fractionDenominator &&
      left.xCoeff === 0 && (!left.brackets || left.brackets.expanded) && !left.fractionDenominator) {
    return true;
  }
  return false;
}

export interface HintRecommendation {
  strategicGoal: string;
  nudge: string;
  exactAction: string;
  operationType: OperationType;
  operandType: 'number' | 'variable';
  operandValue: number;
  canExpand?: boolean;
}

export function getSmartNextStep(left: EquationTermState, right: EquationTermState): HintRecommendation | null {
  // 1. If brackets exist and not expanded
  if (left.brackets && !left.brackets.expanded) {
    return {
      strategicGoal: 'Distribute & Unpack Brackets',
      nudge: 'The left side has grouped packages. Expand them so individual terms can be manipulated.',
      exactAction: 'Click the "Expand / Unpack" button to multiply the outer factor with inside terms.',
      operationType: 'multiply',
      operandType: 'number',
      operandValue: left.brackets.multiplier,
      canExpand: true
    };
  }

  // 2. If fraction exists
  if (left.fractionDenominator && left.fractionDenominator > 1) {
    const denom = left.fractionDenominator;
    return {
      strategicGoal: 'Eliminate the Denominator',
      nudge: `The left side is currently divided by ${denom}. What is the opposite of dividing by ${denom}?`,
      exactAction: `Multiply both sides by ${denom}`,
      operationType: 'multiply',
      operandType: 'number',
      operandValue: denom
    };
  }

  if (right.fractionDenominator && right.fractionDenominator > 1) {
    const denom = right.fractionDenominator;
    return {
      strategicGoal: 'Eliminate the Denominator',
      nudge: `The right side is divided by ${denom}. Multiply both sides by ${denom} to clear the fraction.`,
      exactAction: `Multiply both sides by ${denom}`,
      operationType: 'multiply',
      operandType: 'number',
      operandValue: denom
    };
  }

  // 3. Variables on both sides? Move the smaller x term to the other side
  if (left.xCoeff !== 0 && right.xCoeff !== 0) {
    if (left.xCoeff >= right.xCoeff) {
      // Remove right.xCoeff from both sides
      const coeff = right.xCoeff;
      if (coeff > 0) {
        return {
          strategicGoal: 'Collect Variable Terms on One Side',
          nudge: `There are ${left.xCoeff}x on the left and ${coeff}x on the right. Remove ${coeff}x from both sides.`,
          exactAction: `Subtract ${coeff === 1 ? 'x' : `${coeff}x`} from both sides`,
          operationType: 'subtract',
          operandType: 'variable',
          operandValue: coeff
        };
      } else {
        const absVal = Math.abs(coeff);
        return {
          strategicGoal: 'Eliminate Negative Variables',
          nudge: `The right side has negative variables (${coeff}x). Add ${absVal}x to both sides.`,
          exactAction: `Add ${absVal === 1 ? 'x' : `${absVal}x`} to both sides`,
          operationType: 'add',
          operandType: 'variable',
          operandValue: absVal
        };
      }
    } else {
      // Move left.xCoeff to right
      const coeff = left.xCoeff;
      return {
        strategicGoal: 'Collect Variable Terms',
        nudge: `Remove ${coeff}x from both sides to keep the variable positive on the right.`,
        exactAction: `Subtract ${coeff === 1 ? 'x' : `${coeff}x`} from both sides`,
        operationType: 'subtract',
        operandType: 'variable',
        operandValue: coeff
      };
    }
  }

  // 4. Now variables are only on one side! Check constants on that side
  if (left.xCoeff !== 0 && right.xCoeff === 0) {
    if (left.constant !== 0) {
      if (left.constant > 0) {
        return {
          strategicGoal: 'Isolate the Variable Term',
          nudge: `The left side has a constant term +${left.constant}. Apply the inverse operation to eliminate it.`,
          exactAction: `Subtract ${left.constant} from both sides`,
          operationType: 'subtract',
          operandType: 'number',
          operandValue: left.constant
        };
      } else {
        const absConst = Math.abs(left.constant);
        return {
          strategicGoal: 'Eliminate Negative Constant (Zero Pairs)',
          nudge: `The left side has ${left.constant}. Add ${absConst} to both sides to make zero pairs.`,
          exactAction: `Add ${absConst} to both sides`,
          operationType: 'add',
          operandType: 'number',
          operandValue: absConst
        };
      }
    }

    // Now left.constant === 0, but left.xCoeff !== 1
    if (left.xCoeff !== 1 && left.xCoeff !== 0) {
      if (left.xCoeff === -1) {
        return {
          strategicGoal: 'Make x Positive',
          nudge: 'We have -x. Multiply or divide both sides by -1 to find positive x.',
          exactAction: 'Multiply both sides by -1',
          operationType: 'multiply',
          operandType: 'number',
          operandValue: -1
        };
      }
      return {
        strategicGoal: 'Isolate the Single Variable x',
        nudge: `We have ${left.xCoeff} mystery boxes totaling ${right.constant}. How much does 1 box weigh?`,
        exactAction: `Divide both sides by ${left.xCoeff}`,
        operationType: 'divide',
        operandType: 'number',
        operandValue: left.xCoeff
      };
    }
  }

  // 5. If variable is only on the right
  if (right.xCoeff !== 0 && left.xCoeff === 0) {
    if (right.constant !== 0) {
      if (right.constant > 0) {
        return {
          strategicGoal: 'Isolate Variable on Right',
          nudge: `Subtract ${right.constant} from both sides to clear the constant from the right pan.`,
          exactAction: `Subtract ${right.constant} from both sides`,
          operationType: 'subtract',
          operandType: 'number',
          operandValue: right.constant
        };
      } else {
        const absVal = Math.abs(right.constant);
        return {
          strategicGoal: 'Eliminate Negative Constant',
          nudge: `Add ${absVal} to both sides to cancel out the ${right.constant}.`,
          exactAction: `Add ${absVal} to both sides`,
          operationType: 'add',
          operandType: 'number',
          operandValue: absVal
        };
      }
    }

    if (right.xCoeff !== 1) {
      return {
        strategicGoal: 'Isolate Single x',
        nudge: `Divide both sides by ${right.xCoeff} to solve for x.`,
        exactAction: `Divide both sides by ${right.xCoeff}`,
        operationType: 'divide',
        operandType: 'number',
        operandValue: right.xCoeff
      };
    }
  }

  return null;
}
