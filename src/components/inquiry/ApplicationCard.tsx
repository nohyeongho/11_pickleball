import React, { useState } from 'react';
import { TournamentApplication } from '../../types/tournament';
import { StatusBadge } from '../common/StatusBadge';
import { maskName } from '../../utils/formatters';
import { KeyRound, User, Phone, Calendar, Trash2, CheckCircle2, Building2, Tag } from 'lucide-react';

interface ApplicationCardProps {
  application: TournamentApplication;
  onRequestCancel: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onRequestCancel,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyName, setVerifyName] = useState('');
  const [verifyPass, setVerifyPass] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleVerify = () => {
    const trimmedName = verifyName.trim();
    const nameMatches =
      trimmedName === application.player1Name || trimmedName === application.player2Name;
    const passMatches = verifyPass === (application.confirmPassword || '');

    if (nameMatches && passMatches) {
      setIsVerified(true);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const displayName1 = isVerified ? application.player1Name : maskName(application.player1Name);
  const displayName2 = isVerified ? application.player2Name : maskName(application.player2Name);

  return (
    <div className="card-clean p-5 sm:p-6 bg-white border border-slate-200 hover:border-pink-200 transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="mono font-black text-rose-600 tracking-wider bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
              {application.regNumber}
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-500 font-medium">{application.createdAt}</span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1.5 flex flex-wrap items-center gap-2">
            <span>{application.division}</span>
            <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
            <span className="text-sm font-bold text-slate-700">{application.eventType || '혼합복식'}</span>
            {application.clubName && application.clubName !== '소속없음' && (
              <>
                <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {application.clubName}
                </span>
              </>
            )}
          </h3>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="block mb-1 text-slate-400 font-semibold flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" /> 선수1 (주장)
          </span>
          <span className="font-bold text-sm text-slate-900">{displayName1}</span>
          <span className="block mono text-slate-500 mt-0.5 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            {application.player1Phone}
          </span>
        </div>

        <div>
          <span className="block mb-1 text-slate-400 font-semibold flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" /> 선수2 (파트너)
          </span>
          <span className="font-bold text-sm text-slate-900">{displayName2}</span>
          <span className="block mono text-slate-500 mt-0.5 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            {application.player2Phone}
          </span>
        </div>

        <div>
          <span className="block mb-1 text-slate-400 font-semibold flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" /> 입금자명
          </span>
          <span className="font-bold text-sm text-slate-800">{application.depositorName}</span>
          <span className="block text-[11px] text-slate-400 mt-0.5">통장 기재명</span>
        </div>

        <div>
          <span className="block mb-1 text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> 신청 상태
          </span>
          <span className="font-bold text-xs text-slate-700">{application.status}</span>
        </div>
      </div>

      {!isVerified && (
        <div className="rounded-xl p-3.5 border border-pink-200 bg-gradient-to-r from-pink-50/70 via-purple-50/40 to-rose-50/30 space-y-2.5">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-rose-600" />
            <span>선수 실명 조회 (선수 성함 + 확인용 비밀번호)</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={verifyName}
              onChange={(e) => {
                setVerifyName(e.target.value);
                setHasError(false);
              }}
              placeholder="선수 성함 (홍길동)"
              className="input-field flex-1 py-1.5 px-3 text-xs bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
            />
            <input
              type="password"
              value={verifyPass}
              onChange={(e) => {
                setVerifyPass(e.target.value);
                setHasError(false);
              }}
              placeholder="신청 비밀번호"
              className="input-field flex-1 py-1.5 px-3 text-xs bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
            />
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-2 btn-secondary-athletic rounded-xl text-xs font-bold whitespace-nowrap shadow-2xs hover:border-pink-300 hover:text-rose-600"
            >
              마스킹 해제
            </button>
          </div>
          {hasError && (
            <p className="text-xs font-semibold text-rose-600">
              선수 성함 또는 확인용 비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>
      )}

      {isVerified && (
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>본인 확인이 완료되어 마스킹이 정상 해제되었습니다.</span>
        </div>
      )}

      {application.status !== '취소됨' && (
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onRequestCancel(application.id)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>신청 취소하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
