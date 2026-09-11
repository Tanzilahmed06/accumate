import type { InstrumentCategory, TestReading } from '../types';

export interface ToleranceRule {
  category: InstrumentCategory;
  standardTests: {
    parameter: string;
    standardValue: number;
    unit: string;
    allowedTolerancePercent: number; // e.g., 0.05%
  }[];
}

export const CATEGORY_TOLERANCE_RULES: Record<InstrumentCategory, ToleranceRule> = {
  'Weighbridge': {
    category: 'Weighbridge',
    standardTests: [
      { parameter: 'Min Load Test (500 kg)', standardValue: 500, unit: 'kg', allowedTolerancePercent: 0.05 },
      { parameter: 'Half Load Test (30,000 kg)', standardValue: 30000, unit: 'kg', allowedTolerancePercent: 0.05 },
      { parameter: 'Full Capacity Test (60,000 kg)', standardValue: 60000, unit: 'kg', allowedTolerancePercent: 0.05 },
      { parameter: 'Eccentricity (Corner Load Test)', standardValue: 15000, unit: 'kg', allowedTolerancePercent: 0.05 },
      { parameter: 'Repeatability Test', standardValue: 30000, unit: 'kg', allowedTolerancePercent: 0.05 },
    ],
  },
  'Weighing Scale': {
    category: 'Weighing Scale',
    standardTests: [
      { parameter: 'Minimum Load (10 kg)', standardValue: 10, unit: 'kg', allowedTolerancePercent: 0.1 },
      { parameter: 'Medium Load (100 kg)', standardValue: 100, unit: 'kg', allowedTolerancePercent: 0.1 },
      { parameter: 'Maximum Capacity (300 kg)', standardValue: 300, unit: 'kg', allowedTolerancePercent: 0.1 },
      { parameter: 'Corner Load Sensitivity', standardValue: 75, unit: 'kg', allowedTolerancePercent: 0.1 },
      { parameter: 'Zero Setting Return', standardValue: 0, unit: 'kg', allowedTolerancePercent: 0.01 },
    ],
  },
  'Fuel Dispenser': {
    category: 'Fuel Dispenser',
    standardTests: [
      { parameter: 'Low Flow Rate Test (5 L)', standardValue: 5, unit: 'Litres', allowedTolerancePercent: 0.3 },
      { parameter: 'Standard Flow Rate (20 L)', standardValue: 20, unit: 'Litres', allowedTolerancePercent: 0.3 },
      { parameter: 'Maximum Delivery Test (50 L)', standardValue: 50, unit: 'Litres', allowedTolerancePercent: 0.3 },
      { parameter: 'Preset Accuracy Test', standardValue: 10, unit: 'Litres', allowedTolerancePercent: 0.3 },
    ],
  },
  'Electricity Meter': {
    category: 'Electricity Meter',
    standardTests: [
      { parameter: 'Light Load Test (5A, PF=1.0)', standardValue: 5, unit: 'Amps', allowedTolerancePercent: 0.5 },
      { parameter: 'Full Rated Load (60A, PF=1.0)', standardValue: 60, unit: 'Amps', allowedTolerancePercent: 0.5 },
      { parameter: 'Inductive Load (30A, PF=0.5)', standardValue: 30, unit: 'Amps', allowedTolerancePercent: 1.0 },
      { parameter: 'Creep & No-Load Test', standardValue: 0, unit: 'kWh', allowedTolerancePercent: 0.01 },
    ],
  },
  'Water Meter': {
    category: 'Water Meter',
    standardTests: [
      { parameter: 'Minimum Flow Rate Q1', standardValue: 10, unit: 'L/min', allowedTolerancePercent: 2.0 },
      { parameter: 'Transitional Flow Rate Q2', standardValue: 25, unit: 'L/min', allowedTolerancePercent: 2.0 },
      { parameter: 'Permanent Flow Rate Q3', standardValue: 100, unit: 'L/min', allowedTolerancePercent: 2.0 },
      { parameter: 'Overload Flow Rate Q4', standardValue: 125, unit: 'L/min', allowedTolerancePercent: 2.0 },
    ],
  },
  'Measuring Equipment': {
    category: 'Measuring Equipment',
    standardTests: [
      { parameter: 'Standard Calibration Point 1', standardValue: 10, unit: 'Units', allowedTolerancePercent: 0.2 },
      { parameter: 'Standard Calibration Point 2', standardValue: 50, unit: 'Units', allowedTolerancePercent: 0.2 },
      { parameter: 'Standard Calibration Point 3', standardValue: 100, unit: 'Units', allowedTolerancePercent: 0.2 },
    ],
  },
};

export function evaluateTestReading(
  parameter: string,
  standardValue: number,
  observedValue: number,
  unit: string,
  allowedTolerancePercent: number
): TestReading {
  const error = Math.abs(observedValue - standardValue);
  const errorPercentage = standardValue === 0 ? (error > 0.05 ? 100 : 0) : (error / standardValue) * 100;
  const isPass = errorPercentage <= allowedTolerancePercent;

  return {
    parameter,
    standardValue,
    observedValue,
    unit,
    toleranceMargin: allowedTolerancePercent,
    errorPercentage: Number(errorPercentage.toFixed(3)),
    result: isPass ? 'PASS' : 'FAIL',
  };
}
