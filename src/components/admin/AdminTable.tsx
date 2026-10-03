import React, { useState, useMemo } from 'react';
import { TournamentApplication } from '../../types/tournament';
import { StatusBadge } from '../common/StatusBadge';
import { sortDivisions } from '../../utils/formatters';
import { Search, Filter, CheckCircle2, RotateCcw, Trash2, Phone, Tag } from 'lucide-react';

interface AdminTableProps {
  applications: TournamentApplication[];
  divisions: string[];
  onToggleDepositStatus: (id: string) => void;
  onCancelApplication: (id: string) => void;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  applications,
  divisions,
  onToggleDepositStatus,
  onCancelApplication,
}) => {
  const sortedDivisions = useMemo(() => sortDivisions(divisions), [divisions]);
  const [filterDivision, setFilterDivision] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filtered = applications.filter((a) => {
    const matchDiv = !filterDivision || a.division === filterDivision;
    let matchStatus = true;
    if (filterStatus === '정상') {
      matchStatus = a.status.startsWith('정상');
    } else if (filterStatus === '대기') {
      matchStatus = a.status.includes('대기자');
    } else if (filterStatus === '취소됨') {
      matchStatus = a.status === '취소됨';
    }

    const q = searchKeyword.trim().toLowerCase();
    const matchSearch =
      !q ||
      a.player1Name.toLowerCase().includes(q) ||
      a.player2Name.toLowerCase().includes(q) ||
      a.player1Phone.includes(q) ||
      a.player2Phone.includes(q) ||
      a.depositorName.toLowerCase().includes(q) ||
      a.regNumber.toLowerCase().includes(q) ||
      a.clubName.toLowerCase().includes(q);

    return matchDiv && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:w-44">
          <select
            id="adminFilterDivision"
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="input-field cursor-pointer font-semibold text-sm bg-white"
          >
            <option value="">모든 부수</option>
            {sortedDivisions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="relative sm:w-48">
          <select
            id="adminFilterStatus"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field cursor-pointer font-semibold text-sm bg-white"
          >
            <option value="">모든 상태</option>
            <option value="정상">정상(입금대기/완료)</option>
            <option value="대기">대기자</option>
            <option value="취소됨">취소됨</option>
          </select>
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            id="adminSearchInput"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="이름, 연락처, 입금자명, 접수번호, 소속 검색"
            className="input-field pl-10 text-sm bg-white"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-2xs">
        <table className="admin-table">
          <thead>
            <tr>
              <th>접수번호</th>
              <th>부수 · 종목</th>
              <th>선수1 (주장) / 선수2 (파트너)</th>
              <th>소속</th>
              <th>입금자명</th>
              <th>상태</th>
              <th className="text-right">관리</th>
            </tr>
          </thead>
          <tbody id="adminTableBody">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-14 text-center text-zinc-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-7 h-7 text-zinc-300" />
                    <span className="font-semibold text-sm text-zinc-600">
                      조건에 일치하는 참가 신청 내역이 없습니다.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const isPaid = app.status.includes('입금확인완료');
                const isCancelled = app.status === '취소됨';

                return (
                  <tr key={app.id}>
                    <td data-label="접수번호" className="mono font-black text-rose-600">
                      {app.regNumber}
                    </td>

                    <td data-label="부수 · 종목">
                      <div className="font-bold text-zinc-900">{app.division}</div>
                      <div className="text-[11px] font-medium text-zinc-500">{app.eventType || '혼합복식'}</div>
                    </td>

                    <td data-label="선수1 / 선수2">
                      <div className="font-bold text-sm text-zinc-900">
                        {app.player1Name} / {app.player2Name}
                      </div>
                      <div className="text-xs mono text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-zinc-400 inline" />
                        <span>
                          {app.player1Phone} · {app.player2Phone}
                        </span>
                      </div>
                    </td>

                    <td data-label="소속" className="text-xs font-medium text-zinc-600">
                      {app.clubName || '소속없음'}
                    </td>

                    <td data-label="입금자명" className="font-bold text-xs text-zinc-800">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="w-3 h-3 text-zinc-400" />
                        {app.depositorName}
                      </span>
                    </td>

                    <td data-label="상태">
                      <StatusBadge status={app.status} />
                    </td>

                    <td data-label="관리" className="text-right">
                      {!isCancelled ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onToggleDepositStatus(app.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              isPaid
                                ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                : 'bg-pink-50 text-rose-700 border border-pink-200 hover:bg-rose-600 hover:text-white'
                            }`}
                          >
                            {isPaid ? (
                              <>
                                <RotateCcw className="w-3 h-3" />
                                <span>입금취소</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>입금확인</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onCancelApplication(app.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>취소</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-zinc-400">취소됨</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
