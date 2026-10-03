import { DivisionCapacities, DivisionCodes } from '../types/tournament';

export const DEFAULT_DIVISIONS: string[] = ['2부', '3부', '4부', '6부'];

export const DEFAULT_CAPACITIES: DivisionCapacities = {
  '2부': 16,
  '3부': 16,
  '4부': 16,
  '6부': 16,
};

export const DEFAULT_DIVISION_CODES: DivisionCodes = {
  '2부': 'B',
  '3부': 'C',
  '4부': 'D',
  '6부': 'E',
};

export const DEFAULT_ACCOUNT = '카카오뱅크 3333-36-8513229 (피클볼대회 조직위원회)';
export const MAX_WAITLIST = 4;
export const ADMIN_PASSWORD = '1029';

export const DEFAULT_OPEN_AT = '';

export const STORAGE_KEYS = {
  APPLICATIONS: 'pickle_applications',
  DIVISIONS: 'pickle_divisions',
  CAPACITIES: 'pickle_capacities',
  DIVISION_CODES: 'pickle_division_codes',
  DEPOSIT_ACCOUNT: 'pickle_deposit_account',
  OPEN_AT: 'pickle_open_at',
};
