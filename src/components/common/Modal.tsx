import React from 'react';
import { ModalState } from '../../types/tournament';
import { Check, AlertCircle, Info } from 'lucide-react';

interface ModalProps {
  state: ModalState;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ state, onClose }) => {
  if (!state.isOpen) return null;

  const handleConfirm = () => {
    onClose();
    if (state.onConfirm) {
      state.onConfirm();
    }
  };

  const getIcon = () => {
    switch (state.type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg mx-auto font-bold shadow-xs bg-pink-50 text-rose-600 border border-pink-100">
            <Info className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-zinc-200 relative">
        {getIcon()}
        <h3 className="text-lg font-black text-center text-zinc-900">{state.title}</h3>
        <p className="text-sm font-semibold text-center whitespace-pre-line text-zinc-700 leading-relaxed px-1">
          {state.message}
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-2.5 btn-primary-athletic font-bold rounded-xl text-sm shadow-xs"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
