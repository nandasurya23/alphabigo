/**
 * ALPHA × BIGO HOST INCOME CALCULATOR - POLICY TYPES
 * Policy definitions for tiers, bonus caps, and constants
 */

export interface NewHostTierPolicy {
  readonly minBeans: number;
  readonly rate: number;
  readonly label: string;
}

export interface PremiumFlatTierPolicy {
  readonly minBeans: number;
  readonly flatBonus: number;
  readonly agencyBonus?: number;
  readonly label: string;
}

export interface PremiumPercentTierPolicy {
  readonly minBeans: number;
  readonly rate: number;
  readonly agencyBonus?: number;
  readonly label: string;
}

export interface AgencyBonusPolicy {
  readonly minBeans: number;
  readonly bonusIdr: number;
  readonly label: string;
}

export interface ExtraAgencyBonusPolicy {
  readonly minBeans: number;
  readonly maxBeans: number;
  readonly extraBonusIdr: number;
  readonly level?: string;
  readonly label: string;
}

export interface PolicyConstants {
  readonly EXCHANGE_RATE_BEANS_TO_USD: 210;
  readonly BEANS_PER_USD: 210;
  readonly USD_TO_IDR_RATE: 17800;
  readonly NEW_HOST_BONUS_CAP: 360000;
  readonly MIN_VALID_DAYS: 15;
  readonly MIN_VALID_HOURS: 40;
  readonly PRORATA_MIN_DAYS: 10;
  readonly PRORATA_MIN_BEANS: 2001;
  readonly DAYS_MIN: 0;
  readonly DAYS_MAX: 31;
  readonly HOURS_MIN: 0;
  readonly HOURS_MAX: 155;
}
