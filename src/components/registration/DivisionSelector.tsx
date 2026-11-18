import React, { useMemo } from 'react';
import { DivisionCapacities, TournamentApplication } from '../../types/tournament';
import { MAX_WAITLIST } from '../../constants/defaults';
import { sortDivisions } from '../../utils/formatters';
import { Trophy, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DivisionSelectorProps {
  divisions: string[];
  capacities: DivisionCapacities;
  applications: TournamentApplication[];
  selectedDivision: string;
  onSelectDivision: (division: string) => void;
}

export const DivisionSelector: React.FC<DivisionSelectorProps> = ({
  divisions,
  capacities,
  applications,
  selectedDivision,
  onSelectDivision,
}) => {
  const sortedDivisions = useMemo(() => sortDivisions(divisions), [divisions]);
  const getDivisionStatus = (div: string) => {
    const currentNormal = applications.filter(
      (a) => a.division === div && a.status !== '취소됨' && a.status.startsWith('정상')
    ).length;
    const maxCap = capacities[div] || 16;
    const isFull = currentNormal >= maxCap;
    const remaining = Math.max(0, maxCap - currentNormal);
    const pct = Math.min(100, Math.round((currentNormal / maxCap) * 100));

    const waitListCount = applications.filter(
      (a) => a.division === div && a.status !== '취소됨' && a.status.includes('대기자')
    ).length;

    return {
      currentNormal,
      maxCap,
      isFull,
      remaining,
      pct,
      waitListCount,
    };
  };

  const getInfoMessage = () => {
    if (!selectedDivision) return null;
    const info = getDivisionStatus(selectedDivision);

    if (!info.isFull) {
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-start sm:items-center gap-2 break-keep leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            선택하신 <strong>{selectedDivision}</strong>는 현재 정원 내 즉시 신청이 가능합니다. (
            <span className="font-bold underline whitespace-nowrap">{info.currentNormal}/{info.maxCap}팀</span> 접수됨)
          </span>
        </div>
      );
    } else if (info.waitListCount < MAX_WAITLIST) {
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-900 flex items-start sm:items-center gap-2 break-keep leading-relaxed">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            선택하신 <strong>{selectedDivision}</strong>는 정원이 마감되어{' '}
            <strong className="text-amber-800 font-bold underline whitespace-nowrap">
              대기팀 ({info.waitListCount + 1}/{MAX_WAITLIST} 순번)
            </strong>
            으로 접수됩니다. (정원 취소 발생 시 자동 승격)
          </span>
        </div>
      );
    } else {
      return (
        <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-900 flex items-start sm:items-center gap-2 break-keep leading-relaxed">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            선택하신 <strong>{selectedDivision}</strong>는 정원({info.maxCap}팀)과 대기팀(최대{' '}
            {MAX_WAITLIST}팀)이 모두 마감되어 신청이 불가합니다.
          </span>
        </div>
      );
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2.5 flex items-center gap-1.5 text-slate-900">
        <Trophy className="w-4 h-4 text-rose-500" />
        <span>참가 부수 선택</span>
        <span className="text-rose-600 font-bold">*</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="divisionRadioGroup">
        {sortedDivisions.map((div) => {
          const info = getDivisionStatus(div);
          const isSelected = selectedDivision === div;

          return (
            <button
              type="button"
              key={div}
              onClick={() => onSelectDivision(div)}
              className={`p-3.5 cursor-pointer select-none text-left transition-all rounded-xl ${
                isSelected
                  ? 'border-gradient-selected'
                  : 'border-2 border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-base font-black ${isSelected ? 'text-rose-600' : 'text-slate-900'}`}>
                  {div}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {info.currentNormal}/{info.maxCap}
                </span>
              </div>
              <div
                className="text-xs mb-2.5 font-bold"
                style={{ color: info.isFull ? '#D97706' : '#E11D48' }}
              >
                {info.isFull ? (
                  info.waitListCount < MAX_WAITLIST ? (
                    `대기 ${info.waitListCount + 1}순번`
                  ) : (
                    '접수 마감'
                  )
                ) : (
                  `잔여 ${info.remaining}팀`
                )}
              </div>
              <div className="fill-bar">
                <span
                  style={{
                    width: `${info.pct}%`,
                    background: info.isFull
                      ? '#D97706'
                      : 'linear-gradient(135deg, #8B5CF6 0%, #D96B98 50%, #F43F5E 100%)',
                  }}
                ></span>
              </div>
            </button>
          );
        })}
      </div>

      <input type="hidden" id="selectedDivision" value={selectedDivision} />
      {getInfoMessage()}
    </div>
  );
};
