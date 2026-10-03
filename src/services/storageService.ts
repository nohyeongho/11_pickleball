import {
  DEFAULT_CAPACITIES,
  DEFAULT_DIVISIONS,
  DEFAULT_DIVISION_CODES,
  STORAGE_KEYS,
  DEFAULT_ACCOUNT,
  DEFAULT_OPEN_AT,
} from '../constants/defaults';
import { DivisionCapacities, DivisionCodes, TournamentApplication } from '../types/tournament';

export const storageService = {
  getApplications(): TournamentApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setApplications(apps: TournamentApplication[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to cache applications to localStorage', e);
    }
  },

  getDivisions(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIVISIONS);
      const parsed = data ? JSON.parse(data) : DEFAULT_DIVISIONS;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...new Set(parsed.map((d) => String(d).trim()).filter(Boolean))];
      }
      return DEFAULT_DIVISIONS;
    } catch {
      return DEFAULT_DIVISIONS;
    }
  },

  setDivisions(divisions: string[]) {
    try {
      const clean = [...new Set(divisions.map((d) => String(d).trim()).filter(Boolean))];
      localStorage.setItem(STORAGE_KEYS.DIVISIONS, JSON.stringify(clean));
    } catch (e) {
      console.error('Failed to cache divisions to localStorage', e);
    }
  },

  getCapacities(): DivisionCapacities {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CAPACITIES);
      return data ? JSON.parse(data) : DEFAULT_CAPACITIES;
    } catch {
      return DEFAULT_CAPACITIES;
    }
  },

  setCapacities(capacities: DivisionCapacities) {
    try {
      localStorage.setItem(STORAGE_KEYS.CAPACITIES, JSON.stringify(capacities));
    } catch (e) {
      console.error('Failed to cache capacities to localStorage', e);
    }
  },

  getDivisionCodes(): DivisionCodes {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIVISION_CODES);
      return data ? JSON.parse(data) : DEFAULT_DIVISION_CODES;
    } catch {
      return DEFAULT_DIVISION_CODES;
    }
  },

  setDivisionCodes(codes: DivisionCodes) {
    try {
      localStorage.setItem(STORAGE_KEYS.DIVISION_CODES, JSON.stringify(codes));
    } catch (e) {
      console.error('Failed to cache division codes to localStorage', e);
    }
  },

  getDepositAccount(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEPOSIT_ACCOUNT) || DEFAULT_ACCOUNT;
    } catch {
      return DEFAULT_ACCOUNT;
    }
  },

  setDepositAccount(account: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.DEPOSIT_ACCOUNT, account);
    } catch (e) {
      console.error('Failed to cache deposit account to localStorage', e);
    }
  },

  getOpenAt(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.OPEN_AT) || DEFAULT_OPEN_AT;
    } catch {
      return DEFAULT_OPEN_AT;
    }
  },

  setOpenAt(openAt: string) {
    try {
      localStorage.setItem(STORAGE_KEYS.OPEN_AT, openAt);
    } catch (e) {
      console.error('Failed to cache openAt to localStorage', e);
    }
  },
};
