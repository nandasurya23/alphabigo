/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - TYPES
 * Contract models for calculation engine and components
 */

export type HostStatus = 'new' | 'premium' | '';

export interface CalculationInput {
  readonly status: HostStatus;
  readonly beans: number;
  readonly days: number;
  readonly hours: number;
}

export interface HostBonusResult {
  readonly bonus: number;
  readonly ruleText: string;
  readonly tierName: string;
  readonly qualified: boolean;
  readonly isProrata: boolean;
}

export interface DurationBonusResult {
  readonly bonus: number;
  readonly ruleText: string;
  readonly qualified: boolean;
}

export interface CalculationResult {
  readonly baseBeans: number;
  readonly hostBonus: number;
  readonly hostBonusRule: string;
  readonly hostBonusQualified: boolean;
  readonly isProrata: boolean;
  readonly tierName: string;
  readonly durationBonus: number;
  readonly durationBonusRule: string;
  readonly durationQualified: boolean;
  readonly totalBeans: number;
  readonly usdValue: number;
  readonly idrValue: number;
  readonly totalIncomeIdr: number;
}
