import React from 'react';
import { AdminStats } from '../../types/tournament';
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface AdminStatsGridProps {
  stats: AdminStats;
}

export const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-7" id="adminStatsGrid">
      <div className="card-clean p-4.5 flex flex-col justify-between bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">전체 신청 접수</span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl sm:text-3xl font-black mono text-slate-900 tabular-nums">
            {stats.totalCount}
          </span>
          <span className="text-xs font-medium ml-1.5 text-slate-400">팀</span>
        </div>
      </div>

      <div className="card-clean p-4.5 flex flex-col justify-between bg-gradient-to-br from-purple-50/90 via-pink-50/80 to-rose-50/70 border border-pink-200/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700">정원 등록 (완료/대기)</span>
          <div className="p-1.5 rounded-lg bg-white text-rose-600 border border-pink-200/80 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black mono text-rose-600 tabular-nums">
            {stats.normalCount}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            (완료 {stats.paidCount}팀)
          </span>
        </div>
      </div>

      <div className="card-clean p-4.5 flex flex-col justify-between bg-amber-50/60 border border-amber-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800">대기 순번 접수</span>
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl sm:text-3xl font-black mono text-amber-900 tabular-nums">
            {stats.waitCount}
          </span>
          <span className="text-xs font-medium ml-1.5 text-amber-700">팀 대기중</span>
        </div>
      </div>

      <div className="card-clean p-4.5 flex flex-col justify-between bg-rose-50/50 border border-rose-200/90 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800">취소 이력</span>
          <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5">
          <span className="text-2xl sm:text-3xl font-black mono text-rose-800 tabular-nums">
            {stats.cancelCount}
          </span>
          <span className="text-xs font-medium ml-1.5 text-rose-600">건 취소</span>
        </div>
      </div>
    </div>
  );
};
