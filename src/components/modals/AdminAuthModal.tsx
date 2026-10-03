import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../../constants/defaults';
import { Lock } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setHasError(false);
      setPassword('');
      onSuccess();
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
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 text-rose-600 border border-pink-200">
          <Lock className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h3 className="text-lg font-bold text-center text-zinc-900">관리자 인증</h3>
        <p className="text-sm text-center text-zinc-500">
          대회 관리자 메뉴에 접근하려면 비밀번호를 입력하세요.
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
            placeholder="관리자 비밀번호 입력"
            className="input-field text-center font-bold tracking-widest text-base"
          />
          {hasError && (
            <p className="text-xs text-center font-medium text-rose-600">
              비밀번호가 일치하지 않습니다. (기본: 1029)
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 btn-primary-athletic font-bold rounded-xl text-xs shadow-xs"
            >
              확인
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-4 font-semibold rounded-xl text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
