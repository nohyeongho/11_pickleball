import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle2, Zap, Save, RotateCcw } from 'lucide-react';

interface OpenTimeManagerProps {
  initialOpenAt: string;
  onSave: (openAt: string) => void;
}

export const OpenTimeManager: React.FC<OpenTimeManagerProps> = ({
  initialOpenAt,
  onSave,
}) => {
  const [openAt, setOpenAt] = useState(initialOpenAt);
  const [localInput, setLocalInput] = useState('');
  const [timeDiffText, setTimeDiffText] = useState('');
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    setOpenAt(initialOpenAt);
    if (initialOpenAt) {
      try {
        const d = new Date(initialOpenAt);
        if (!isNaN(d.getTime())) {
          const tzOffset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 19);
          setLocalInput(localISOTime);
        } else {
          setLocalInput('');
        }
      } catch {
        setLocalInput('');
      }
    } else {
      setLocalInput('');
    }
  }, [initialOpenAt]);

  useEffect(() => {
    const updateCountdown = () => {
      if (!openAt) {
        setIsOpenNow(true);
        setTimeDiffText('설정 없음 (현재 누구나 즉시 참가신청 가능)');
        return;
      }

      const target = new Date(openAt).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsOpenNow(true);
        setTimeDiffText('오픈 완료 (현재 정상 접수 진행 중)');
      } else {
        setIsOpenNow(false);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const parts: string[] = [];
        if (days > 0) parts.push(`${days}일`);
        parts.push(`${String(hours).padStart(2, '0')}시간`);
        parts.push(`${String(minutes).padStart(2, '0')}분`);
        parts.push(`${String(seconds).padStart(2, '0')}초`);

        setTimeDiffText(`오픈까지 ${parts.join(' ')} 남음`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [openAt]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput) {
      onSave('');
      return;
    }
    const isoString = new Date(localInput).toISOString();
    onSave(isoString);
  };

  const handleSetInstantOpen = () => {
    setLocalInput('');
    onSave('');
  };

  const handleSetQuickTime = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    target.setSeconds(0, 0);
    const tzOffset = target.getTimezoneOffset() * 60000;
    const localISOTime = new Date(target.getTime() - tzOffset).toISOString().slice(0, 19);
    setLocalInput(localISOTime);
  };

  return (
    <div className="rounded-2xl p-5 mb-6 shadow-2xs border bg-white border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4.5 h-4.5 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-900">대회 참가신청 오픈 일시 설정</h3>
        </div>
        <div>
          {isOpenNow ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>접수 오픈 중</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>오픈 대기 예약</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-xs mb-3 text-slate-500">
        지정한 오픈 일시 전까지 사용자 신청 버튼이 비활성화되며 실시간 카운트다운이 표시됩니다. 서버에서도 오픈 시간 전 요청은 엄격히 차단됩니다.
      </p>

      <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">현재 상태:</span>
          <span className={`font-bold ${isOpenNow ? 'text-emerald-700' : 'text-rose-600'}`}>
            {timeDiffText}
          </span>
        </div>
        {openAt && (
          <span className="mono text-slate-500 text-[11px]">
            설정 일시: {new Date(openAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="datetime-local"
              step="1"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              className="input-field text-sm font-semibold bg-slate-50 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 btn-primary-athletic rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>오픈 일시 저장</span>
          </button>

          <button
            type="button"
            onClick={handleSetInstantOpen}
            className="px-4 py-2.5 btn-secondary-athletic rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>상시 오픈(해제)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-500" /> 빠른 설정:
          </span>
          <button
            type="button"
            onClick={() => handleSetQuickTime(1)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-rose-600 border border-slate-200 transition-colors"
          >
            1시간 뒤
          </button>
          <button
            type="button"
            onClick={() => handleSetQuickTime(3)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-rose-600 border border-slate-200 transition-colors"
          >
            3시간 뒤
          </button>
          <button
            type="button"
            onClick={() => handleSetQuickTime(24)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-rose-600 border border-slate-200 transition-colors"
          >
            24시간 뒤
          </button>
        </div>
      </form>
    </div>
  );
};
