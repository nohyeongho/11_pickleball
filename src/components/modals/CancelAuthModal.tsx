import React, { useState } from 'react';
import { TournamentApplication } from '../../types/tournament';
import { ShieldAlert } from 'lucide-react';

interface CancelAuthModalProps {
  application: TournamentApplication | null;
  onSuccess: (id: string) => void;
  onClose: () => void;
}

export const CancelAuthModal: React.FC<CancelAuthModalProps> = ({
  application,
  onSuccess,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  if (!application) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === (application.confirmPassword || '')) {
      setHasError(false);
      setPassword('');
      onSuccess(application.id);
    } else {
      setHasError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setHasError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="card-clean max-w-sm w-full p-6 space-y-4 shadow-xl bg-white border border-zinc-200">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-rose-50 text-rose-600 border border-rose-200">
          <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h3 className="text-lg font-bold text-center text-zinc-900">신청 취소 비밀번호 확인</h3>
        <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs space-y-1">
          <p className="font-bold text-rose-600">접수번호: {application.regNumber}</p>
          <p className="text-zinc-600">
            선수: {application.player1Name} / {application.player2Name} ({application.division})
          </p>
        </div>
        <p className="text-xs text-center text-zinc-500">
          신청 시 등록하셨던 <strong>확인용 비밀번호</strong>를 입력하세요.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setHasError(false);
            }}
            placeholder="비밀번호 입력"
            className="input-field text-center font-bold tracking-widest text-base"
          />
          {hasError && (
            <p className="text-xs text-center font-medium text-rose-600">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 font-bold rounded-xl text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-xs transition-colors"
            >
              확인 후 취소
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-4 font-semibold rounded-xl text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
