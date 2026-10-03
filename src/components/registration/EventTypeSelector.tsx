import React from 'react';
import { EventType } from '../../types/tournament';
import { Users } from 'lucide-react';

interface EventTypeSelectorProps {
  value: EventType;
  onChange: (value: EventType) => void;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ value, onChange }) => {
  const options: EventType[] = ['남자복식', '여자복식'];

  return (
    <div>
      <label className="block text-sm font-bold mb-2.5 flex items-center gap-1.5 text-slate-900">
        <span>복식 종목 선택</span>
        <span className="text-rose-600 font-bold">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <label
              key={option}
              onClick={() => onChange(option)}
              className={`p-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold cursor-pointer select-none border-2 transition-all ${
                isSelected
                  ? 'border-fuchsia-500 bg-white text-rose-600 shadow-xs ring-2 ring-pink-400/25'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="eventType"
                value={option}
                checked={isSelected}
                onChange={() => onChange(option)}
                className="hidden"
              />
              <Users
                className={`w-4 h-4 ${
                  isSelected ? 'text-rose-600' : 'text-slate-400'
                }`}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
