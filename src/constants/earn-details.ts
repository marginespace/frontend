export const DEFAULT_STABLE = 'USDC';

export enum EarnTab {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export enum StopLossValue {
  NONE = 'NONE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type TStopLossOption = {
  id: number;
  label?: string;
  color: string;
};

export const stopLossesLabels = {
  [StopLossValue.NONE]: {
    id: -1,
    label: 'None',
    color: '#FFFFFF',
  },
  [StopLossValue.LOW]: {
    id: 0,
    label: 'Low',
    color: '#59B38A',
  },
  [StopLossValue.MEDIUM]: {
    id: 1,
    label: 'Medium',
    color: '#E9C268',
  },
  [StopLossValue.HIGH]: {
    id: 2,
    label: 'High',
    color: '#D85F5A',
  },
} as Record<StopLossValue, TStopLossOption>;
