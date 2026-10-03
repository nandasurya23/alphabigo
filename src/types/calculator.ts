/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - TYPES
 * Contract models for calculation engine and components
 */

export type HostStatus = 'new' | 'premium' | '';
export type NewHostMonth = 1 | 2; // 1 = Bulan 1, 2 = Bulan 2-3

export interface TargetMonthInfo {
  readonly monthIndex: number; // 0 - 11
  readonly year: number;
  readonly monthName: string;
  readonly daysInMonth: number;
  readonly isPreviousMonth?: boolean;
  readonly isCurrentMonth?: boolean;
}

export interface CalculationInput {
  readonly status: HostStatus;
  readonly newHostMonth?: NewHostMonth;
  readonly targetMonth?: TargetMonthInfo;
  readonly beans: number;
  readonly days: number;
  readonly hours: number;
  readonly monthDays?: number;
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
  readonly newHostExtraBonus: number;
  readonly newHostExtraBonusRule: string;
  readonly durationBonus: number;
  readonly durationBonusRule: string;
  readonly durationQualified: boolean;
  readonly totalBeans: number;
  readonly usdValue: number;
  readonly idrValue: number;
  readonly totalIncomeIdr: number;
}

