import React from 'react';
import { EventType } from '../../types/tournament';
import { Users } from 'lucide-react';

interface EventTypeSelectorProps {
  value: EventType;
  onChange: (value: EventType) => void;
}

export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ value, onChange }) => {
  const options: EventType[] = ['남자복식', '여자복식', '혼합복식'];

  return (
    <div>
      <label className="block text-sm font-bold mb-2.5 flex items-center gap-1.5 text-slate-900">
        <span>복식 종목 선택</span>
        <span className="text-rose-600 font-bold">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {options.map((option) => {
          const isSelected = value === option;
          return (
            <label
              key={option}
              onClick={() => onChange(option)}
              /* 모바일 좁은 가로폭에서 '남자복/식'처럼 한 글자가 밀려 내려가는 현상을 막기 위해
                 모바일에서는 아이콘 상단 배치(flex-col) + 줄바꿈 방지(whitespace-nowrap)를 적용하고,
                 태블릿/PC(sm 이상)에서는 기존 가로 배치(sm:flex-row)를 그대로 유지함 */
              className={`px-2 py-3 sm:p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer select-none transition-all ${
                isSelected
                  ? 'border-gradient-selected text-rose-600'
                  : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'
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
                className={`w-4 h-4 shrink-0 ${
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
