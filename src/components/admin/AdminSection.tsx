import React, { useState } from 'react';
import {
  AdminStats,
  DivisionCapacities,
  ServerSyncStatus,
  TournamentApplication,
} from '../../types/tournament';
import { AdminStatsGrid } from './AdminStatsGrid';
import { BankAccountManager } from './BankAccountManager';
import { OpenTimeManager } from './OpenTimeManager';
import { DivisionManager } from './DivisionManager';
import { CapacityManager } from './CapacityManager';
import { AdminTable } from './AdminTable';
import { ServerStatusModal } from './ServerStatusModal';
import {
  RefreshCw,
  Server,
  Download,
  LayoutDashboard,
} from 'lucide-react';

interface AdminSectionProps {
  stats: AdminStats;
  applications: TournamentApplication[];
  divisions: string[];
  capacities: DivisionCapacities;
  depositAccount: string;
  openAt?: string;
  serverStatus: ServerSyncStatus;
  lastUpdated?: string;
  onRefreshData: () => void;
  onExportCSV: () => void;
  onSaveDepositAccount: (account: string) => void;
  onSaveOpenAt: (openAt: string) => void;
  onAddDivision: (name: string) => void;
  onEditDivision: (oldName: string, newName: string) => void;
  onDeleteDivision: (name: string) => void;
  onUpdateCapacity: (division: string, newCapacity: number) => void;
  onToggleDepositStatus: (id: string) => void;
  onCancelApplication: (id: string) => void;
  onResetDatabase: (confirmText: string) => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  stats,
  applications,
  divisions,
  capacities,
  depositAccount,
  openAt,
  serverStatus,
  lastUpdated,
  onRefreshData,
  onExportCSV,
  onSaveDepositAccount,
  onSaveOpenAt,
  onAddDivision,
  onEditDivision,
  onDeleteDivision,
  onUpdateCapacity,
  onToggleDepositStatus,
  onCancelApplication,
  onResetDatabase,
}) => {
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const getServerStatusLabel = () => {
    switch (serverStatus) {
      case 'connected':
        return (
          <span
            onClick={() => setIsServerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firebase 클라우드 연동됨</span>
          </span>
        );
      case 'syncing':
        return (
          <span
            onClick={() => setIsServerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-pink-50 text-rose-700 border border-pink-200 cursor-pointer animate-pulse"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>동기화 중...</span>
          </span>
        );
      case 'error':
        return (
          <span
            onClick={() => setIsServerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>서버 확인 필요</span>
          </span>
        );
      default:
        return (
          <span
            onClick={() => setIsServerModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
          >
            <span>상태 확인</span>
          </span>
        );
    }
  };

  return (
    <section id="tab-admin" className="space-y-6">
      <div className="card-clean p-6 sm:p-8 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/80 pb-5 mb-7">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-rose-600 border border-pink-200/70">
                <LayoutDashboard className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-black bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 bg-clip-text text-transparent tracking-tight">
                대회 운영 관리자 대시보드
              </h2>
              {getServerStatusLabel()}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              신청자 입금 대조, 부수별 정원 조정, 계좌번호 설정, 엑셀/CSV 데이터 출력
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={onRefreshData}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>실시간 동기화</span>
            </button>

            <button
              type="button"
              onClick={() => setIsServerModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>서버 정보</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              className="px-3.5 py-2 btn-primary-athletic text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 내보내기</span>
            </button>
          </div>
        </div>

        <AdminStatsGrid stats={stats} />

        <div className="space-y-6">
          <OpenTimeManager
            initialOpenAt={openAt || ''}
            onSave={onSaveOpenAt}
          />

          <BankAccountManager
            initialAccount={depositAccount}
            onSave={onSaveDepositAccount}
          />

          <DivisionManager
            divisions={divisions}
            onAddDivision={onAddDivision}
            onEditDivision={onEditDivision}
            onDeleteDivision={onDeleteDivision}
          />

          <CapacityManager
            divisions={divisions}
            capacities={capacities}
            onUpdateCapacity={onUpdateCapacity}
          />

          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">전체 참가 신청 명단</h3>
              <span className="text-xs text-slate-400 font-medium">총 {applications.length}건 등록됨</span>
            </div>
            <AdminTable
              applications={applications}
              divisions={divisions}
              onToggleDepositStatus={onToggleDepositStatus}
              onCancelApplication={onCancelApplication}
            />
          </div>
        </div>

        <ServerStatusModal
          isOpen={isServerModalOpen}
          status={serverStatus}
          totalApps={applications.length}
          lastUpdated={lastUpdated}
          onRefresh={() => {
            onRefreshData();
            setIsServerModalOpen(false);
          }}
          onReset={(confirmText) => {
            onResetDatabase(confirmText);
            setIsServerModalOpen(false);
          }}
          onClose={() => setIsServerModalOpen(false)}
        />
      </div>
    </section>
  );
};
