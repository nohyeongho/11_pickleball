import React, { useState, useEffect } from 'react';
import {
  DivisionCapacities,
  EventType,
  TournamentApplication,
} from '../../types/tournament';
import { EventTypeSelector } from './EventTypeSelector';
import { DivisionSelector } from './DivisionSelector';
import { formatPhoneNumber } from '../../utils/formatters';
import {
  UserCheck,
  Building2,
  CreditCard,
  Send,
  Lock,
  Copy,
  Check,
  Trophy,
  Sparkles,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface RegistrationSectionProps {
  divisions: string[];
  capacities: DivisionCapacities;
  applications: TournamentApplication[];
  depositAccount: string;
  openAt?: string;
  onSubmit: (formData: {
    eventType: EventType;
    division: string;
    clubName: string;
    player1Name: string;
    player1Phone: string;
    player2Name: string;
    player2Phone: string;
    depositorName: string;
    confirmPassword: string;
  }) => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  divisions,
  capacities,
  applications,
  depositAccount,
  openAt,
  onSubmit,
}) => {
  const [eventType, setEventType] = useState<EventType>('남자복식');
  const [selectedDivision, setSelectedDivision] = useState<string>(divisions[0] || '2부');
  const [clubName, setClubName] = useState<string>('');
  const [player1Name, setPlayer1Name] = useState<string>('');
  const [player1Phone, setPlayer1Phone] = useState<string>('');
  const [player2Name, setPlayer2Name] = useState<string>('');
  const [player2Phone, setPlayer2Phone] = useState<string>('');
  const [depositorName, setDepositorName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const [isBeforeOpen, setIsBeforeOpen] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [openDateFormatted, setOpenDateFormatted] = useState('');

  useEffect(() => {
    if (divisions.length > 0 && (!selectedDivision || !divisions.includes(selectedDivision))) {
      setSelectedDivision(divisions[0]);
    }
  }, [divisions, selectedDivision]);

  useEffect(() => {
    const checkOpenStatus = () => {
      if (!openAt) {
        setIsBeforeOpen(false);
        setCountdownText('');
        setOpenDateFormatted('');
        return;
      }

      const target = new Date(openAt).getTime();
      if (isNaN(target)) {
        setIsBeforeOpen(false);
        setCountdownText('');
        return;
      }

      setOpenDateFormatted(
        new Date(openAt).toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsBeforeOpen(false);
        setCountdownText('');
      } else {
        setIsBeforeOpen(true);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const parts: string[] = [];
        if (days > 0) parts.push(`${days}일`);
        parts.push(`${String(hours).padStart(2, '0')}:`);
        parts.push(`${String(minutes).padStart(2, '0')}:`);
        parts.push(`${String(seconds).padStart(2, '0')}`);
        setCountdownText(parts.join(''));
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 1000);
    return () => clearInterval(interval);
  }, [openAt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBeforeOpen) {
      alert(`아직 참가신청 접수 오픈 전입니다. (${openDateFormatted} 오픈 예정)`);
      return;
    }

    if (!selectedDivision) {
      alert('참가 부수를 선택해 주세요.');
      return;
    }

    onSubmit({
      eventType,
      division: selectedDivision,
      clubName,
      player1Name,
      player1Phone,
      player2Name,
      player2Phone,
      depositorName,
      confirmPassword,
    });
  };

  const handleCopyAccount = () => {
    if (!depositAccount) return;
    navigator.clipboard.writeText(depositAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tab-register" className="space-y-6">
      <div className="bg-gradient-to-br from-pink-50/70 via-white to-purple-50/40 border border-pink-200/80 rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-rose-500/10 via-pink-400/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-rose-500" />
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent font-extrabold">
              2027 NATIONAL PICKLEBALL CHAMPIONSHIP
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-100/70 text-rose-700 border border-pink-200/60 ml-1">
              <Sparkles className="w-2.5 h-2.5 text-rose-500" /> 실시간 접수
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 bg-clip-text text-transparent tracking-tight mt-1.5">
            전국 피클볼대회 참가신청 접수
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            정원 내 선착순 마감되며, 정원 초과 시 실시간 대기 순번으로 자동 배정됩니다.
          </p>
        </div>
      </div>

      {isBeforeOpen && (
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-300 text-xs font-extrabold tracking-wider uppercase mb-1">
                <Clock className="w-4 h-4 animate-spin text-rose-400" />
                <span>접수 시작 카운트다운</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                대회 참가신청 오픈 대기 중입니다
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                오픈 예정 일시: <strong className="text-rose-300 underline">{openDateFormatted}</strong> (정각 실시간 오픈)
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/15 text-center min-w-[200px]">
              <span className="text-[11px] font-bold text-rose-300 block mb-0.5">남은 시간</span>
              <span className="text-2xl sm:text-3xl font-black mono text-white tracking-widest tabular-nums">
                {countdownText}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="card-clean p-6 sm:p-8 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-rose-600 border border-pink-200/70">
              <UserCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">참가팀 정보 입력</h3>
          </div>
          <span className="text-xs text-slate-400">* 표시는 필수 입력 항목입니다</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
          <EventTypeSelector value={eventType} onChange={setEventType} />

          <DivisionSelector
            divisions={divisions}
            capacities={capacities}
            applications={applications}
            selectedDivision={selectedDivision}
            onSelectDivision={setSelectedDivision}
          />

          <div>
            <label className="block text-sm font-bold mb-2 flex items-center gap-1.5 text-slate-800" htmlFor="clubName">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>소속 (클럽 · 구협회 · 동호회)</span>
              <span className="text-xs font-normal text-slate-400">(선택)</span>
            </label>
            <input
              type="text"
              id="clubName"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="예: 서울피클볼클럽, 부산남구협회 (소속 없을 시 빈칸)"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60">
            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500"></span>
                  선수 1 (주장)
                </span>
                <span className="text-[11px] font-medium text-slate-400">대회 대표 연락처</span>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700" htmlFor="player1Name">
                  이름 <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="player1Name"
                  required
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="홍길동"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700" htmlFor="player1Phone">
                  연락처 <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  id="player1Phone"
                  required
                  value={player1Phone}
                  onChange={(e) => setPlayer1Phone(formatPhoneNumber(e.target.value))}
                  placeholder="010-1234-5678"
                  className="input-field mono"
                />
              </div>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></span>
                  선수 2 (파트너)
                </span>
                <span className="text-[11px] font-medium text-slate-400">복식 파트너</span>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700" htmlFor="player2Name">
                  이름 <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="player2Name"
                  required
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="김피클"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700" htmlFor="player2Phone">
                  연락처 <span className="text-rose-600 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  id="player2Phone"
                  required
                  value={player2Phone}
                  onChange={(e) => setPlayer2Phone(formatPhoneNumber(e.target.value))}
                  placeholder="010-9876-5432"
                  className="input-field mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 text-slate-800" htmlFor="depositorName">
              <span>입금자명 (통장 표기 성명)</span>
              <span className="text-rose-600 font-bold ml-1">*</span>
            </label>
            <input
              type="text"
              id="depositorName"
              required
              value={depositorName}
              onChange={(e) => setDepositorName(e.target.value)}
              placeholder="예: 홍길동"
              className="input-field"
            />
            <p className="text-xs mt-1.5 text-slate-500">
              * 참가비 송금 시 통장에 표기되는 이름과 정확히 같아야 신속하게 입금확인 처리가 완료됩니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1.5 flex items-center gap-1.5 text-slate-800" htmlFor="confirmPassword">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>신청 확인용 비밀번호</span>
              <span className="text-rose-600 font-bold">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="추후 조회 및 신청 취소 시 사용할 비밀번호 입력"
              className="input-field"
            />
            <p className="text-xs mt-1.5 text-slate-500">
              * 신청 후 [신청 조회] 메뉴에서 본인 실명 조회 및 취소 신청 시 사용됩니다.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-pink-200/80 bg-gradient-to-r from-pink-50/80 via-purple-50/40 to-rose-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white text-rose-600 border border-pink-200/80 shrink-0 shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-600 block">참가비 입금 계좌 안내</span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {depositAccount || '관리자 입금 계좌 설정 대기 중'}
                </span>
              </div>
            </div>

            {depositAccount && (
              <button
                type="button"
                onClick={handleCopyAccount}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-rose-600 border border-pink-200 hover:bg-pink-50/80 transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-center shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>계좌번호 복사</span>
                  </>
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isBeforeOpen}
            className={`w-full py-4 rounded-xl text-base font-black shadow-md flex items-center justify-center gap-2 transition-all ${
              isBeforeOpen
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                : 'btn-primary-athletic'
            }`}
          >
            {isBeforeOpen ? (
              <>
                <Clock className="w-5 h-5 text-slate-400 animate-pulse" />
                <span>대회 접수 오픈 대기 중 ({countdownText})</span>
              </>
            ) : (
              <>
                <Send className="w-4.5 h-4.5" />
                <span>2027 피클볼대회 참가신청 완료하기</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
