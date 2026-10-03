import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import {
  DEFAULT_ACCOUNT,
  DEFAULT_CAPACITIES,
  DEFAULT_DIVISION_CODES,
  DEFAULT_DIVISIONS,
  DEFAULT_OPEN_AT,
  MAX_WAITLIST,
} from '../constants/defaults';
import {
  DivisionCapacities,
  DivisionCodes,
  TournamentApplication,
} from '../types/tournament';
import { getNextDivisionCode, sortDivisions } from '../utils/formatters';
import {
  ApplicationCreatePayload,
  TournamentDataResponse,
} from './apiService';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface TournamentSettingsDoc {
  depositAccount: string;
  divisions: string[];
  capacities: DivisionCapacities;
  divisionCodes: DivisionCodes;
  openAt?: string;
  updatedAt: string;
}

const SETTINGS_DOC_PATH = 'settings/tournament';
const APPLICATIONS_COLL_PATH = 'applications';

export const firebaseService = {
  /**
   * Initializes default tournament settings in Firestore if not already present
   */
  async ensureSettingsInitialized(): Promise<TournamentSettingsDoc> {
    try {
      const settingsRef = doc(db, 'settings', 'tournament');
      const snap = await getDoc(settingsRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<TournamentSettingsDoc>;
        return {
          depositAccount: data.depositAccount || DEFAULT_ACCOUNT,
          divisions: sortDivisions(data.divisions && data.divisions.length > 0 ? data.divisions : DEFAULT_DIVISIONS),
          capacities: data.capacities || DEFAULT_CAPACITIES,
          divisionCodes: data.divisionCodes || DEFAULT_DIVISION_CODES,
          openAt: data.openAt || DEFAULT_OPEN_AT,
          updatedAt: data.updatedAt || new Date().toISOString(),
        };
      } else {
        const initialSettings: TournamentSettingsDoc = {
          depositAccount: DEFAULT_ACCOUNT,
          divisions: DEFAULT_DIVISIONS,
          capacities: DEFAULT_CAPACITIES,
          divisionCodes: DEFAULT_DIVISION_CODES,
          openAt: DEFAULT_OPEN_AT,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(settingsRef, initialSettings);
        return initialSettings;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, SETTINGS_DOC_PATH);
      throw err;
    }
  },

  subscribeToTournament(
    onData: (data: TournamentDataResponse) => void,
    onError: (err: unknown) => void
  ): () => void {
    let currentApplications: TournamentApplication[] = [];
    let currentSettings: TournamentSettingsDoc = {
      depositAccount: DEFAULT_ACCOUNT,
      divisions: DEFAULT_DIVISIONS,
      capacities: DEFAULT_CAPACITIES,
      divisionCodes: DEFAULT_DIVISION_CODES,
      openAt: DEFAULT_OPEN_AT,
      updatedAt: new Date().toISOString(),
    };

    const emit = () => {
      onData({
        result: 'success',
        applications: currentApplications,
        divisions: currentSettings.divisions,
        capacities: currentSettings.capacities,
        divisionCodes: currentSettings.divisionCodes,
        depositAccount: currentSettings.depositAccount,
        openAt: currentSettings.openAt,
        serverTime: new Date().toISOString(),
        updatedAt: currentSettings.updatedAt,
      });
    };

    // 1. Applications collection listener
    const unsubApps = onSnapshot(
      collection(db, APPLICATIONS_COLL_PATH),
      (snapshot) => {
        const list: TournamentApplication[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TournamentApplication;
          list.push({
            ...data,
            id: docSnap.id,
          });
        });

        // Sort applications by registration number or createdAt
        list.sort((a, b) => {
          if (a.division !== b.division) {
            return a.division.localeCompare(b.division, 'ko');
          }
          return a.regNumber.localeCompare(b.regNumber);
        });

        currentApplications = list;
        emit();
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, APPLICATIONS_COLL_PATH);
        onError(error);
      }
    );

    // 2. Settings document listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'tournament'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<TournamentSettingsDoc>;
          currentSettings = {
            depositAccount: data.depositAccount || DEFAULT_ACCOUNT,
            divisions: sortDivisions(data.divisions && data.divisions.length > 0 ? data.divisions : DEFAULT_DIVISIONS),
            capacities: data.capacities || DEFAULT_CAPACITIES,
            divisionCodes: data.divisionCodes || DEFAULT_DIVISION_CODES,
            openAt: data.openAt || DEFAULT_OPEN_AT,
            updatedAt: data.updatedAt || new Date().toISOString(),
          };
        } else {
          firebaseService.ensureSettingsInitialized().catch(console.error);
        }
        emit();
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, SETTINGS_DOC_PATH);
        onError(error);
      }
    );

    return () => {
      unsubApps();
      unsubSettings();
    };
  },

  async getTournamentData(): Promise<TournamentDataResponse> {
    try {
      const settings = await this.ensureSettingsInitialized();
      const appsSnap = await getDocs(collection(db, APPLICATIONS_COLL_PATH));
      const applications: TournamentApplication[] = [];
      appsSnap.forEach((docSnap) => {
        applications.push({
          ...(docSnap.data() as TournamentApplication),
          id: docSnap.id,
        });
      });

      applications.sort((a, b) => {
        if (a.division !== b.division) {
          return a.division.localeCompare(b.division, 'ko');
        }
        return a.regNumber.localeCompare(b.regNumber);
      });

      return {
        result: 'success',
        applications,
        divisions: settings.divisions,
        capacities: settings.capacities,
        divisionCodes: settings.divisionCodes,
        depositAccount: settings.depositAccount,
        openAt: settings.openAt,
        serverTime: new Date().toISOString(),
        updatedAt: settings.updatedAt,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, APPLICATIONS_COLL_PATH);
      throw err;
    }
  },

  /**
   * Register a new participant application in Firestore
   */
  async createApplication(payload: ApplicationCreatePayload): Promise<{
    result: 'success';
    application: TournamentApplication;
    applications: TournamentApplication[];
    depositAccount: string;
  }> {
    const {
      eventType,
      division,
      clubName,
      player1Name,
      player1Phone,
      player2Name,
      player2Phone,
      depositorName,
      confirmPassword,
    } = payload;

    if (!eventType || !division || !player1Name || !player2Name || !player1Phone || !player2Phone) {
      throw new Error('모든 필수 정보를 입력해주세요.');
    }

    const currentData = await this.getTournamentData();
    const { applications, capacities, divisionCodes, depositAccount, openAt } = currentData;

    if (openAt) {
      const openTime = new Date(openAt).getTime();
      if (!isNaN(openTime) && Date.now() < openTime) {
        const openTimeStr = new Date(openAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
        throw new Error(`대회 참가신청 접수 오픈 전입니다. (오픈 일시: ${openTimeStr})`);
      }
    }

    const p1PhoneClean = player1Phone.replace(/[^0-9]/g, '');
    const p2PhoneClean = player2Phone.replace(/[^0-9]/g, '');
    const isDuplicate = applications.some((a) => {
      if (a.status === '취소됨') return false;
      const existP1 = a.player1Phone.replace(/[^0-9]/g, '');
      const existP2 = a.player2Phone.replace(/[^0-9]/g, '');
      return (
        (existP1 === p1PhoneClean && a.player1Name.trim() === player1Name.trim()) ||
        (existP2 === p2PhoneClean && a.player2Name.trim() === player2Name.trim())
      );
    });

    if (isDuplicate) {
      throw new Error('이미 등록된 선수 정보(성함 및 연락처)로 접수된 내역이 있습니다.');
    }

    const capacity = capacities[division] || 16;
    const divApps = applications.filter((a) => a.division === division && a.status !== '취소됨');
    const normalApps = divApps.filter((a) => a.status.startsWith('정상'));
    const waitApps = divApps.filter((a) => a.status.includes('대기자'));

    let status = '정상 (입금대기)';
    if (normalApps.length >= capacity) {
      if (waitApps.length >= MAX_WAITLIST) {
        throw new Error(
          `해당 종목(${division})은 정원(${capacity}팀) 및 대기(${MAX_WAITLIST}팀)가 모두 마감되었습니다.`
        );
      }
      status = `대기자 (${waitApps.length + 1}순번)`;
    }

    // Generate unique ID and registration number
    const newId = Date.now().toString();
    let divCode = divisionCodes[division];
    if (!divCode) {
      divCode = getNextDivisionCode(divisionCodes);
      divisionCodes[division] = divCode;
      await updateDoc(doc(db, 'settings', 'tournament'), {
        divisionCodes,
        updatedAt: new Date().toISOString(),
      });
    }

    const allDivApps = applications.filter((a) => a.division === division);
    const seqNum = allDivApps.length + 1;
    const regNumber = `2027-${divCode}-${String(seqNum).padStart(3, '0')}`;
    const createdAt = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    const newApp: TournamentApplication = {
      id: newId,
      regNumber,
      division,
      clubName: clubName || '개인',
      player1Name,
      player1Phone,
      player2Name,
      player2Phone,
      depositorName: depositorName || player1Name,
      confirmPassword: confirmPassword || '0000',
      eventType,
      status,
      createdAt,
    };

    try {
      await setDoc(doc(db, APPLICATIONS_COLL_PATH, newId), newApp);
      const updatedApplications = [...applications, newApp];

      return {
        result: 'success',
        application: newApp,
        applications: updatedApplications,
        depositAccount,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `${APPLICATIONS_COLL_PATH}/${newId}`);
      throw err;
    }
  },

  /**
   * Cancel an application and auto-promote waitlist
   */
  async cancelApplication(
    id: string,
    password?: string,
    isAdmin = false
  ): Promise<{
    result: 'success';
    message: string;
    applications: TournamentApplication[];
  }> {
    const currentData = await this.getTournamentData();
    const appIndex = currentData.applications.findIndex((a) => a.id === id);

    if (appIndex === -1) {
      throw new Error('해당 신청 내역을 찾을 수 없습니다.');
    }

    const app = currentData.applications[appIndex];

    if (!isAdmin) {
      if (!password || app.confirmPassword !== password) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
    }

    if (app.status === '취소됨') {
      throw new Error('이미 취소된 신청입니다.');
    }

    const wasNormal = app.status.startsWith('정상');
    const division = app.division;

    // Use Batch write to guarantee atomic waitlist promotion
    const batch = writeBatch(db);
    batch.update(doc(db, APPLICATIONS_COLL_PATH, id), { status: '취소됨' });
    app.status = '취소됨';

    let message = '신청이 정상적으로 취소되었습니다.';

    // If a normal team cancelled, promote the first waitlisted team
    if (wasNormal) {
      const waitlist = currentData.applications
        .filter((a) => a.division === division && a.status.includes('대기자'))
        .sort((a, b) => a.regNumber.localeCompare(b.regNumber));

      if (waitlist.length > 0) {
        const firstWait = waitlist[0];
        firstWait.status = '정상 (입금대기)';
        batch.update(doc(db, APPLICATIONS_COLL_PATH, firstWait.id), {
          status: '정상 (입금대기)',
        });
        message += ` 대기 1순번 [${firstWait.player1Name}/${firstWait.player2Name}] 팀이 정상 접수로 자동 승급되었습니다.`;

        // Re-index remaining waitlist
        for (let i = 1; i < waitlist.length; i++) {
          const newStatus = `대기자 (${i}순번)`;
          waitlist[i].status = newStatus;
          batch.update(doc(db, APPLICATIONS_COLL_PATH, waitlist[i].id), {
            status: newStatus,
          });
        }
      }
    }

    try {
      await batch.commit();
      return {
        result: 'success',
        message,
        applications: currentData.applications,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${APPLICATIONS_COLL_PATH}/${id}`);
      throw err;
    }
  },

  /**
   * Toggle deposit confirmation status
   */
  async toggleDepositStatus(id: string): Promise<{
    result: 'success';
    application: TournamentApplication;
    applications: TournamentApplication[];
    message: string;
  }> {
    const currentData = await this.getTournamentData();
    const app = currentData.applications.find((a) => a.id === id);

    if (!app) {
      throw new Error('신청 내역을 찾을 수 없습니다.');
    }

    let nextStatus = app.status;
    let message = '';

    if (app.status === '정상 (입금대기)') {
      nextStatus = '정상 (입금확인완료)';
      message = '입금 확인 처리가 완료되었습니다.';
    } else if (app.status === '정상 (입금확인완료)') {
      nextStatus = '정상 (입금대기)';
      message = '입금 상태가 [입금대기]로 변경되었습니다.';
    } else {
      throw new Error('정상 접수 상태의 신청만 입금 처리를 변경할 수 있습니다.');
    }

    try {
      await updateDoc(doc(db, APPLICATIONS_COLL_PATH, id), { status: nextStatus });
      app.status = nextStatus;

      return {
        result: 'success',
        application: app,
        applications: currentData.applications,
        message,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${APPLICATIONS_COLL_PATH}/${id}`);
      throw err;
    }
  },

  /**
   * Update divisions, capacities, and division codes
   */
  async updateDivisions(payload: {
    divisions: string[];
    capacities: DivisionCapacities;
    divisionCodes: DivisionCodes;
  }): Promise<{
    result: 'success';
    divisions: string[];
    capacities: DivisionCapacities;
    divisionCodes: DivisionCodes;
  }> {
    try {
      const sorted = sortDivisions(payload.divisions);
      await updateDoc(doc(db, 'settings', 'tournament'), {
        divisions: sorted,
        capacities: payload.capacities,
        divisionCodes: payload.divisionCodes,
        updatedAt: new Date().toISOString(),
      });

      return {
        result: 'success',
        divisions: sorted,
        capacities: payload.capacities,
        divisionCodes: payload.divisionCodes,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, SETTINGS_DOC_PATH);
      throw err;
    }
  },

  /**
   * Update capacity of a division
   */
  async updateCapacity(
    division: string,
    capacity: number
  ): Promise<{
    result: 'success';
    capacities: DivisionCapacities;
  }> {
    const currentData = await this.getTournamentData();
    const newCapacities = { ...currentData.capacities, [division]: capacity };

    try {
      await updateDoc(doc(db, 'settings', 'tournament'), {
        capacities: newCapacities,
        updatedAt: new Date().toISOString(),
      });

      return {
        result: 'success',
        capacities: newCapacities,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, SETTINGS_DOC_PATH);
      throw err;
    }
  },

  /**
   * Update deposit account information
   */
  async updateDepositAccount(depositAccount: string): Promise<{
    result: 'success';
    depositAccount: string;
  }> {
    try {
      await updateDoc(doc(db, 'settings', 'tournament'), {
        depositAccount,
        updatedAt: new Date().toISOString(),
      });

      return {
        result: 'success',
        depositAccount,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, SETTINGS_DOC_PATH);
      throw err;
    }
  },

  async updateOpenTime(openAt: string): Promise<{
    result: 'success';
    openAt: string;
  }> {
    try {
      await updateDoc(doc(db, 'settings', 'tournament'), {
        openAt,
        updatedAt: new Date().toISOString(),
      });

      return {
        result: 'success',
        openAt,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, SETTINGS_DOC_PATH);
      throw err;
    }
  },

  async resetData(confirmText: string): Promise<{
    result: 'success';
    message: string;
  }> {
    if (confirmText !== '초기화') {
      throw new Error("확인 문구('초기화')가 올바르지 않습니다.");
    }

    try {
      const appsSnap = await getDocs(collection(db, APPLICATIONS_COLL_PATH));
      const batch = writeBatch(db);
      appsSnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });

      const defaultSettings: TournamentSettingsDoc = {
        depositAccount: DEFAULT_ACCOUNT,
        divisions: DEFAULT_DIVISIONS,
        capacities: { ...DEFAULT_CAPACITIES },
        divisionCodes: { ...DEFAULT_DIVISION_CODES },
        openAt: DEFAULT_OPEN_AT,
        updatedAt: new Date().toISOString(),
      };
      batch.set(doc(db, 'settings', 'tournament'), defaultSettings);

      await batch.commit();

      return {
        result: 'success',
        message: 'Firebase 클라우드 데이터가 기본 상태로 깨끗하게 초기화되었습니다.',
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, APPLICATIONS_COLL_PATH);
      throw err;
    }
  },
};
