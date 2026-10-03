export type EventType = '남자복식' | '여자복식' | '혼합복식';

export interface TournamentApplication {
  id: string;
  regNumber: string;
  division: string;
  clubName: string;
  player1Name: string;
  player1Phone: string;
  player2Name: string;
  player2Phone: string;
  depositorName: string;
  confirmPassword?: string;
  eventType: EventType;
  status: string;
  createdAt: string;
}

export type DivisionCapacities = Record<string, number>;
export type DivisionCodes = Record<string, string>;

export type ServerSyncStatus = 'connected' | 'syncing' | 'error' | 'offline';

export interface AdminStats {
  totalCount: number;
  normalCount: number;
  paidCount: number;
  waitCount: number;
  cancelCount: number;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onConfirm?: () => void;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}
