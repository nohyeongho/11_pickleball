import React, { useState, useEffect } from 'react';
import { Server, Activity, X, RotateCcw, Database } from 'lucide-react';
import { ServerSyncStatus } from '../../types/tournament';

interface ServerStatusModalProps {
  isOpen: boolean;
  status: ServerSyncStatus;
  totalApps: number;
  lastUpdated?: string;
  onRefresh: () => void;
  onReset: (confirmText: string) => void;
  onClose: () => void;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({
  isOpen,
  status,
  totalApps,
  lastUpdated,
  onRefresh,
  onReset,
  onClose,
}) => {
  const [resetInput, setResetInput] = useState('');
  const [showResetBox, setShowResetBox] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setResetInput('');
      setShowResetBox(false);
      const start = performance.now();
      fetch('/api/health')
        .then((res) => {
          if (res.ok) {
            setPingMs(Math.round(performance.now() - start));
          } else {
            setPingMs(null);
          }
        })
        .catch(() => setPingMs(null));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetInput !== '초기화') {
      alert("정확히 '초기화'를 입력해 주세요.");
      return;
    }
    onReset(resetInput);
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="card-clean max-w-lg w-full p-6 space-y-4 shadow-xl bg-white border border-zinc-200">
        <div
          className="flex justify-between items-center border-b border-zinc-200 pb-3"
        >
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-zinc-900">Firebase 클라우드 DB 상태 및 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 font-bold p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-sm">
          <div
            className="p-3.5 rounded-xl border flex items-center justify-between"
            style={{
              background: status === 'connected' ? '#F0FDF4' : '#FDF2F8',
              borderColor: status === 'connected' ? '#BBF7D0' : '#FBCFE8',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  status === 'connected'
                    ? 'bg-emerald-500 ring-4 ring-emerald-100'
                    : status === 'syncing'
                    ? 'bg-rose-500 ring-4 ring-rose-100'
                    : 'bg-rose-500'
                }`}
              />
              <div>
                <p className="font-bold text-sm text-zinc-900">
                  {status === 'connected'
                    ? 'Google Firebase Firestore 연결됨'
                    : status === 'syncing'
                    ? '실시간 데이터 동기화 중...'
                    : '데이터베이스 연결 확인 필요'}
                </p>
                <p className="text-xs text-zinc-500">실시간 WebSocket onSnapshot 동기화 가동 중</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold mono px-2 py-1 rounded bg-white/80 border border-zinc-200 text-emerald-700">
                실시간 연동
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-500 block mb-1">영구 보존 클라우드 저장소</span>
              <span className="font-semibold mono text-zinc-900 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-rose-500" /> Cloud Firestore
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-zinc-500 block mb-1">총 등록 신청서</span>
              <span className="font-bold text-sm text-zinc-900">{totalApps}건</span>
            </div>
          </div>

          {lastUpdated && (
            <div className="text-xs text-zinc-500 flex items-center gap-1.5 px-1">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              <span>최근 클라우드 동기화 시간: {new Date(lastUpdated).toLocaleString('ko-KR')}</span>
            </div>
          )}

          {/* Danger zone */}
          <div className="border-t border-zinc-200 pt-3">
            {!showResetBox ? (
              <button
                type="button"
                onClick={() => setShowResetBox(true)}
                className="text-xs text-rose-600 hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>클라우드 테스트 데이터 초기화 (관리자 전용)</span>
              </button>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-2 p-3 rounded-xl bg-rose-50 border border-rose-200">
                <p className="text-xs font-semibold text-rose-700">
                  클라우드 DB의 모든 신청 내역을 비우고 부수 설정을 기본값으로 되돌립니다.
                </p>
                <p className="text-[11px] text-zinc-500">확인을 위해 아래에 '초기화'를 입력하세요:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="초기화"
                    className="input-field py-1.5 px-3 text-xs flex-1 bg-white font-bold"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white rounded-lg shadow-2xs bg-rose-600 hover:bg-rose-700"
                  >
                    초기화 실행
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetBox(false)}
                    className="px-2 py-1.5 text-xs font-semibold text-zinc-500"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={onRefresh}
            className="flex-1 py-2.5 btn-primary-athletic font-semibold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>지금 실시간 갱신</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 font-semibold rounded-xl text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
