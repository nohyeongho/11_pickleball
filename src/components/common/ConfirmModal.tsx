import React from 'react';
import { ConfirmModalState } from '../../types/tournament';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  state: ConfirmModalState;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ state, onClose }) => {
  if (!state.isOpen) return null;

  const handleOk = () => {
    onClose();
    state.onConfirm();
  };

  const handleCancel = () => {
    onClose();
    if (state.onCancel) {
      state.onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-zinc-200 relative">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-amber-50 text-amber-600 border border-amber-200">
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="text-lg font-black text-center text-zinc-900">{state.title}</h3>

        <p className="text-sm font-semibold text-center whitespace-pre-line text-zinc-700 leading-relaxed px-1">
          {state.message}
        </p>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-2.5 font-bold rounded-xl text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors border border-zinc-200"
          >
            {state.cancelLabel || '취소'}
          </button>
          <button
            type="button"
            onClick={handleOk}
            className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
          >
            {state.confirmLabel || '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};
