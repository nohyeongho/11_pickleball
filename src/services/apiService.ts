import {
  DivisionCapacities,
  DivisionCodes,
  EventType,
  TournamentApplication,
} from '../types/tournament';
import { firebaseService } from './firebaseService';

export interface TournamentDataResponse {
  result: 'success' | 'error';
  applications: TournamentApplication[];
  divisions: string[];
  capacities: DivisionCapacities;
  divisionCodes: DivisionCodes;
  depositAccount: string;
  openAt?: string;
  serverTime?: string;
  updatedAt: string;
  message?: string;
}

export interface ApplicationCreatePayload {
  eventType: EventType;
  division: string;
  clubName: string;
  player1Name: string;
  player1Phone: string;
  player2Name: string;
  player2Phone: string;
  depositorName: string;
  confirmPassword: string;
}

export const apiService = {
  async getTournamentData(): Promise<TournamentDataResponse> {
    return firebaseService.getTournamentData();
  },

  async createApplication(payload: ApplicationCreatePayload): Promise<{
    result: 'success' | 'error';
    application: TournamentApplication;
    applications: TournamentApplication[];
    depositAccount: string;
    message?: string;
  }> {
    return firebaseService.createApplication(payload);
  },

  async cancelApplication(
    id: string,
    password?: string,
    isAdmin = false
  ): Promise<{
    result: 'success' | 'error';
    message: string;
    applications: TournamentApplication[];
  }> {
    return firebaseService.cancelApplication(id, password, isAdmin);
  },

  async toggleDepositStatus(id: string): Promise<{
    result: 'success' | 'error';
    application: TournamentApplication;
    applications: TournamentApplication[];
    message?: string;
  }> {
    return firebaseService.toggleDepositStatus(id);
  },

  async updateDivisions(payload: {
    divisions: string[];
    capacities: DivisionCapacities;
    divisionCodes: DivisionCodes;
    applications?: TournamentApplication[];
  }): Promise<{
    result: 'success' | 'error';
    divisions: string[];
    capacities: DivisionCapacities;
    divisionCodes: DivisionCodes;
    applications: TournamentApplication[];
    message?: string;
  }> {
    const res = await firebaseService.updateDivisions(payload);
    const data = await firebaseService.getTournamentData();
    return {
      result: 'success',
      divisions: res.divisions,
      capacities: res.capacities,
      divisionCodes: res.divisionCodes,
      applications: data.applications,
    };
  },

  async updateCapacity(
    division: string,
    capacity: number
  ): Promise<{
    result: 'success' | 'error';
    capacities: DivisionCapacities;
    applications: TournamentApplication[];
    message?: string;
  }> {
    const res = await firebaseService.updateCapacity(division, capacity);
    const data = await firebaseService.getTournamentData();
    return {
      result: 'success',
      capacities: res.capacities,
      applications: data.applications,
    };
  },

  async updateDepositAccount(depositAccount: string): Promise<{
    result: 'success' | 'error';
    depositAccount: string;
    message?: string;
  }> {
    const res = await firebaseService.updateDepositAccount(depositAccount);
    return {
      result: 'success',
      depositAccount: res.depositAccount,
    };
  },

  async updateOpenTime(openAt: string): Promise<{
    result: 'success' | 'error';
    openAt: string;
    message?: string;
  }> {
    const res = await firebaseService.updateOpenTime(openAt);
    return {
      result: 'success',
      openAt: res.openAt,
    };
  },

  async checkServerHealth(): Promise<boolean> {
    return true;
  },

  async resetData(confirmText: string): Promise<{
    result: 'success' | 'error';
    message: string;
    data: unknown;
  }> {
    const res = await firebaseService.resetData(confirmText);
    const data = await firebaseService.getTournamentData();
    return {
      result: 'success',
      message: res.message,
      data,
    };
  },
};
