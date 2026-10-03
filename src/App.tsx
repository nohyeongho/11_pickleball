import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AdminStats,
  ConfirmModalState,
  DivisionCapacities,
  DivisionCodes,
  EventType,
  ModalState,
  ServerSyncStatus,
  TournamentApplication,
} from './types/tournament';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import { firebaseService } from './services/firebaseService';
import { testConnection } from './services/firebase';
import { getNextDivisionCode, sortDivisions } from './utils/formatters';
import { exportApplicationsToCSV } from './utils/csvExport';

import { AppHeader } from './components/common/AppHeader';
import { AppFooter } from './components/common/AppFooter';
import { Modal } from './components/common/Modal';
import { ConfirmModal } from './components/common/ConfirmModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { CancelAuthModal } from './components/modals/CancelAuthModal';

import { RegistrationSection } from './components/registration/RegistrationSection';
import { InquirySection } from './components/inquiry/InquirySection';
import { AdminSection } from './components/admin/AdminSection';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'register' | 'inquiry' | 'admin'>('register');
  const [applications, setApplications] = useState<TournamentApplication[]>(() =>
    storageService.getApplications()
  );
  const [divisions, setDivisions] = useState<string[]>(() =>
    sortDivisions(storageService.getDivisions())
  );
  const [capacities, setCapacities] = useState<DivisionCapacities>(() =>
    storageService.getCapacities()
  );
  const [divisionCodes, setDivisionCodes] = useState<DivisionCodes>(() =>
    storageService.getDivisionCodes()
  );
  const [depositAccount, setDepositAccount] = useState<string>(() =>
    storageService.getDepositAccount()
  );
  const [openAt, setOpenAt] = useState<string>(() => storageService.getOpenAt());
  const [serverStatus, setServerStatus] = useState<ServerSyncStatus>('syncing');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [cancellingApp, setCancellingApp] = useState<TournamentApplication | null>(null);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    onConfirm?: () => void
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmLabel?: string,
    cancelLabel?: string
  ) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
      confirmLabel,
      cancelLabel,
    });
  };

  // Fetch data from Firebase Firestore
  const fetchServerData = useCallback(async (isSilent = false) => {
    try {
      setServerStatus('syncing');
      const data = await apiService.getTournamentData();
      if (data && data.result === 'success') {
        setApplications(data.applications);
        const sortedDivs = sortDivisions(data.divisions);
        setDivisions(sortedDivs);
        setCapacities(data.capacities);
        setDivisionCodes(data.divisionCodes);
        setDepositAccount(data.depositAccount);
        if (data.openAt !== undefined) {
          setOpenAt(data.openAt);
          storageService.setOpenAt(data.openAt);
        }
        setLastUpdated(data.updatedAt);

        // Cache to localStorage
        storageService.setApplications(data.applications);
        storageService.setDivisions(sortedDivs);
        storageService.setCapacities(data.capacities);
        storageService.setDivisionCodes(data.divisionCodes);
        storageService.setDepositAccount(data.depositAccount);

        setServerStatus('connected');
        if (!isSilent) {
          showModal('동기화 완료', 'Firebase 클라우드 데이터베이스와 성공적으로 동기화되었습니다.', 'success');
        }
      } else {
        setServerStatus('error');
        if (!isSilent) {
          showModal('동기화 오류', data.message || '데이터 불러오기 실패', 'error');
        }
      }
    } catch (err) {
      console.error('Firebase sync error:', err);
      setServerStatus('error');
      if (!isSilent) {
        showModal('연결 실패', 'Firebase 데이터베이스 통신 중 오류가 발생했습니다.', 'error');
      }
    }
  }, []);

  // Real-time Firestore onSnapshot synchronization
  useEffect(() => {
    testConnection();
    setServerStatus('syncing');

    const unsubscribe = firebaseService.subscribeToTournament(
      (data) => {
        setApplications(data.applications);
        const sortedDivs = sortDivisions(data.divisions);
        setDivisions(sortedDivs);
        setCapacities(data.capacities);
        setDivisionCodes(data.divisionCodes);
        setDepositAccount(data.depositAccount);
        if (data.openAt !== undefined) {
          setOpenAt(data.openAt);
          storageService.setOpenAt(data.openAt);
        }
        setLastUpdated(data.updatedAt || new Date().toISOString());

        storageService.setApplications(data.applications);
        storageService.setDivisions(sortedDivs);
        storageService.setCapacities(data.capacities);
        storageService.setDivisionCodes(data.divisionCodes);
        storageService.setDepositAccount(data.depositAccount);

        setServerStatus('connected');
      },
      (err) => {
        console.error('Firebase realtime sync error:', err);
        setServerStatus('error');
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Statistics calculation
  const stats: AdminStats = useMemo(() => {
    const totalCount = applications.length;
    const normalCount = applications.filter(
      (a) => a.status !== '취소됨' && a.status.startsWith('정상')
    ).length;
    const paidCount = applications.filter((a) => a.status.includes('입금확인완료')).length;
    const waitCount = applications.filter((a) => a.status.includes('대기자')).length;
    const cancelCount = applications.filter((a) => a.status === '취소됨').length;

    return { totalCount, normalCount, paidCount, waitCount, cancelCount };
  }, [applications]);

  // Registration handler with Server API
  const handleRegistrationSubmit = async (formData: {
    eventType: EventType;
    division: string;
    clubName: string;
    player1Name: string;
    player1Phone: string;
    player2Name: string;
    player2Phone: string;
    depositorName: string;
    confirmPassword: string;
  }) => {
    try {
      setServerStatus('syncing');
      const response = await apiService.createApplication(formData);

      if (response.result === 'success') {
        setApplications(response.applications);
        storageService.setApplications(response.applications);
        setServerStatus('connected');

        const app = response.application;
        const accountLine = response.depositAccount ? `\n\n[입금 계좌번호] ${response.depositAccount}` : '';
        showModal(
          '참가신청 완료',
          `자체 서버에 참가신청이 정상 등록되었습니다!\n\n[접수번호] ${app.regNumber}\n[신청종목] ${app.division} (${app.eventType})\n[신청상태] ${app.status}${accountLine}`,
          'success'
        );
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const errorMessage = err instanceof Error ? err.message : '참가신청 등록에 실패했습니다.';
      showModal('신청 실패', errorMessage, 'error');
    }
  };

  // Cancel flow with Server API
  const handleRequestCancel = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    setCancellingApp(app);
  };

  const handlePasswordVerifiedForCancel = (id: string) => {
    setCancellingApp(null);
    const target = applications.find((a) => a.id === id);
    if (!target) return;

    showConfirm(
      '신청 취소 확인',
      `정말 [${target.regNumber}] ${target.player1Name}/${target.player2Name} 팀의 신청을 취소하시겠습니까?\n\n* 취소 시 정원 건이었다면 대기 1순위 팀이 서버에서 자동으로 승격됩니다.`,
      () => {
        executeCancellation(id, target.confirmPassword, false);
      },
      undefined,
      '네, 취소합니다',
      '닫기'
    );
  };

  const executeCancellation = async (id: string, password?: string, isAdmin = false) => {
    try {
      setServerStatus('syncing');
      const response = await apiService.cancelApplication(id, password, isAdmin);

      if (response.result === 'success') {
        setApplications(response.applications);
        storageService.setApplications(response.applications);
        setServerStatus('connected');
        showModal('취소 완료', '서버에서 참가신청이 정상적으로 취소 처리되었습니다.', 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '취소 처리에 실패했습니다.';
      showModal('취소 실패', msg, 'error');
    }
  };

  // Admin Actions with Server API
  const handleToggleDepositStatus = async (id: string) => {
    try {
      setServerStatus('syncing');
      const response = await apiService.toggleDepositStatus(id);
      if (response.result === 'success') {
        setApplications(response.applications);
        storageService.setApplications(response.applications);
        setServerStatus('connected');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '입금 상태 변경 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleAdminCancel = (id: string) => {
    const target = applications.find((a) => a.id === id);
    if (!target) return;

    showConfirm(
      '관리자 취소 확인',
      `관리자 권한으로 [${target.regNumber}] ${target.player1Name}/${target.player2Name} 팀의 신청을 취소 처리하시겠습니까?`,
      () => {
        executeCancellation(id, undefined, true);
      },
      undefined,
      '취소 처리',
      '아니오'
    );
  };

  const handleAddDivision = async (name: string) => {
    if (divisions.includes(name)) {
      showModal('알림', '이미 존재하는 부수 이름입니다.', 'error');
      return;
    }

    const updatedDivs = sortDivisions([...divisions, name]);
    const updatedCaps = { ...capacities, [name]: 16 };
    const updatedCodes = { ...divisionCodes, [name]: getNextDivisionCode(divisionCodes) };

    try {
      setServerStatus('syncing');
      const res = await apiService.updateDivisions({
        divisions: updatedDivs,
        capacities: updatedCaps,
        divisionCodes: updatedCodes,
        applications,
      });

      if (res.result === 'success') {
        setDivisions(res.divisions);
        setCapacities(res.capacities);
        setDivisionCodes(res.divisionCodes);
        storageService.setDivisions(res.divisions);
        storageService.setCapacities(res.capacities);
        storageService.setDivisionCodes(res.divisionCodes);
        setServerStatus('connected');
        showModal('저장 완료', `'${name}' 부수가 서버에 성공적으로 추가되었습니다.`, 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '부수 추가 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleEditDivision = async (oldName: string, newName: string) => {
    if (divisions.includes(newName)) {
      showModal('알림', '이미 존재하는 부수 이름입니다.', 'error');
      return;
    }

    const updatedDivs = divisions.map((d) => (d === oldName ? newName : d));
    const updatedCaps = { ...capacities, [newName]: capacities[oldName] || 16 };
    delete updatedCaps[oldName];

    const updatedCodes = {
      ...divisionCodes,
      [newName]: divisionCodes[oldName] || getNextDivisionCode(divisionCodes),
    };
    delete updatedCodes[oldName];

    const updatedApps = applications.map((a) =>
      a.division === oldName ? { ...a, division: newName } : a
    );

    try {
      setServerStatus('syncing');
      const res = await apiService.updateDivisions({
        divisions: updatedDivs,
        capacities: updatedCaps,
        divisionCodes: updatedCodes,
        applications: updatedApps,
      });

      if (res.result === 'success') {
        setDivisions(res.divisions);
        setCapacities(res.capacities);
        setDivisionCodes(res.divisionCodes);
        setApplications(res.applications);
        storageService.setDivisions(res.divisions);
        storageService.setCapacities(res.capacities);
        storageService.setDivisionCodes(res.divisionCodes);
        storageService.setApplications(res.applications);
        setServerStatus('connected');
        showModal('수정 완료', `'${oldName}' 부수가 '${newName}'(으)로 변경되었습니다.`, 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '부수 수정 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleDeleteDivision = (name: string) => {
    if (divisions.length <= 1) {
      showModal('알림', '최소 1개 이상의 부수가 유지되어야 합니다.', 'error');
      return;
    }

    const hasActive = applications.some((a) => a.division === name && a.status !== '취소됨');
    if (hasActive) {
      showModal(
        '삭제 불가',
        `'${name}'에 접수된 신청 내역이 존재하여 삭제할 수 없습니다. 취소 처리 후 삭제해 주세요.`,
        'error'
      );
      return;
    }

    showConfirm(
      '부수 삭제',
      `'${name}' 부수를 서버에서 삭제하시겠습니까?`,
      async () => {
        const updatedDivs = divisions.filter((d) => d !== name);
        const updatedCaps = { ...capacities };
        delete updatedCaps[name];
        const updatedCodes = { ...divisionCodes };
        delete updatedCodes[name];

        try {
          setServerStatus('syncing');
          const res = await apiService.updateDivisions({
            divisions: updatedDivs,
            capacities: updatedCaps,
            divisionCodes: updatedCodes,
            applications,
          });

          if (res.result === 'success') {
            setDivisions(res.divisions);
            setCapacities(res.capacities);
            setDivisionCodes(res.divisionCodes);
            storageService.setDivisions(res.divisions);
            storageService.setCapacities(res.capacities);
            storageService.setDivisionCodes(res.divisionCodes);
            setServerStatus('connected');
            showModal('삭제 완료', `'${name}' 부수가 서버에서 삭제되었습니다.`, 'success');
          }
        } catch (err: unknown) {
          setServerStatus('error');
          const msg = err instanceof Error ? err.message : '부수 삭제 실패';
          showModal('오류', msg, 'error');
        }
      },
      undefined,
      '삭제',
      '취소'
    );
  };

  const handleUpdateCapacity = async (division: string, newCap: number) => {
    try {
      setServerStatus('syncing');
      const res = await apiService.updateCapacity(division, newCap);
      if (res.result === 'success') {
        setCapacities(res.capacities);
        setApplications(res.applications);
        storageService.setCapacities(res.capacities);
        storageService.setApplications(res.applications);
        setServerStatus('connected');
        showModal('정원 설정 완료', `${division} 정원이 ${newCap}팀으로 설정되었습니다.`, 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '정원 설정 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleSaveDepositAccount = async (newAccount: string) => {
    try {
      setServerStatus('syncing');
      const res = await apiService.updateDepositAccount(newAccount);
      if (res.result === 'success') {
        setDepositAccount(res.depositAccount);
        storageService.setDepositAccount(res.depositAccount);
        setServerStatus('connected');
        showModal('저장 완료', '입금 계좌번호가 서버에 저장되었습니다.', 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '계좌번호 저장 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleSaveOpenAt = async (newOpenAt: string) => {
    try {
      setServerStatus('syncing');
      const res = await apiService.updateOpenTime(newOpenAt);
      if (res.result === 'success') {
        const savedTime = res.openAt || '';
        setOpenAt(savedTime);
        storageService.setOpenAt(savedTime);
        setServerStatus('connected');
        const msg = savedTime
          ? `대회 접수 오픈 일시가 ${new Date(savedTime).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (KST)로 설정되었습니다.`
          : '오픈 일시 제한이 해제되어 상시 접수 가능하도록 변경되었습니다.';
        showModal('오픈 일시 설정 완료', msg, 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '오픈 시간 설정 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleResetDatabase = async (confirmText: string) => {
    try {
      setServerStatus('syncing');
      const res = await apiService.resetData(confirmText);
      if (res.result === 'success') {
        await fetchServerData(true);
        showModal('초기화 완료', '서버 데이터가 깨끗하게 초기화되었습니다.', 'success');
      }
    } catch (err: unknown) {
      setServerStatus('error');
      const msg = err instanceof Error ? err.message : '초기화 실패';
      showModal('오류', msg, 'error');
    }
  };

  const handleExportCSV = () => {
    const success = exportApplicationsToCSV(applications);
    if (!success) {
      showModal('알림', '내보낼 신청 데이터가 없습니다.', 'info');
    }
  };

  const handleAdminHeaderClick = () => {
    if (adminUnlocked) {
      setCurrentTab('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-[var(--ink)] relative overflow-x-hidden">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/15 via-fuchsia-400/12 to-rose-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-gradient-to-bl from-rose-400/15 via-pink-400/12 to-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-fuchsia-400/12 via-rose-300/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <AppHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onAdminClick={handleAdminHeaderClick}
        adminUnlocked={adminUnlocked}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full relative z-0">
        {currentTab === 'register' && (
          <RegistrationSection
            divisions={divisions}
            capacities={capacities}
            applications={applications}
            depositAccount={depositAccount}
            openAt={openAt}
            onSubmit={handleRegistrationSubmit}
          />
        )}

        {currentTab === 'inquiry' && (
          <InquirySection
            applications={applications}
            onRequestCancel={handleRequestCancel}
          />
        )}

        {currentTab === 'admin' && (
          <AdminSection
            stats={stats}
            applications={applications}
            divisions={divisions}
            capacities={capacities}
            depositAccount={depositAccount}
            openAt={openAt}
            serverStatus={serverStatus}
            lastUpdated={lastUpdated}
            onRefreshData={() => fetchServerData(false)}
            onExportCSV={handleExportCSV}
            onSaveDepositAccount={handleSaveDepositAccount}
            onSaveOpenAt={handleSaveOpenAt}
            onAddDivision={handleAddDivision}
            onEditDivision={handleEditDivision}
            onDeleteDivision={handleDeleteDivision}
            onUpdateCapacity={handleUpdateCapacity}
            onToggleDepositStatus={handleToggleDepositStatus}
            onCancelApplication={handleAdminCancel}
            onResetDatabase={handleResetDatabase}
          />
        )}
      </main>

      <AppFooter />

      {/* Global Modals */}
      <Modal state={modalState} onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))} />

      <ConfirmModal
        state={confirmModalState}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={() => {
          setAdminUnlocked(true);
          setIsAdminAuthModalOpen(false);
          setCurrentTab('admin');
        }}
        onClose={() => setIsAdminAuthModalOpen(false)}
      />

      <CancelAuthModal
        application={cancellingApp}
        onSuccess={handlePasswordVerifiedForCancel}
        onClose={() => setCancellingApp(null)}
      />
    </div>
  );
}
