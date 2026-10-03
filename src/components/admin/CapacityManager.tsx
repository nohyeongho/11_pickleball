import React, { useState, useEffect, useMemo } from 'react';
import { DivisionCapacities } from '../../types/tournament';
import { sortDivisions } from '../../utils/formatters';
import { Sliders, Save } from 'lucide-react';

interface CapacityManagerProps {
  divisions: string[];
  capacities: DivisionCapacities;
  onUpdateCapacity: (division: string, newCapacity: number) => void;
}

export const CapacityManager: React.FC<CapacityManagerProps> = ({
  divisions,
  capacities,
  onUpdateCapacity,
}) => {
  const sortedDivisions = useMemo(() => sortDivisions(divisions), [divisions]);
  const [localCaps, setLocalCaps] = useState<DivisionCapacities>(capacities);

  useEffect(() => {
    setLocalCaps(capacities);
  }, [capacities]);

  const handleChange = (div: string, val: string) => {
    const num = parseInt(val, 10);
    setLocalCaps((prev) => ({
      ...prev,
      [div]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSave = (div: string) => {
    const val = localCaps[div] || 16;
    if (val < 1) {
      alert('정원은 최소 1팀 이상이어야 합니다.');
      return;
    }
    onUpdateCapacity(div, val);
  };

  return (
    <div className="rounded-2xl p-5 mb-6 shadow-2xs border border-zinc-200 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <Sliders className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm font-bold text-zinc-900">부수별 정원(최대 참가팀 수) 설정</h3>
      </div>
      <p className="text-xs mb-3.5 text-zinc-500">
        각 부수별 기본 정원(팀 수)을 변경할 수 있습니다. 정원 초과 시 자동으로 대기자 명단으로 배정됩니다.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" id="capacityConfigGrid">
        {sortedDivisions.map((div) => {
          const val = localCaps[div] !== undefined ? localCaps[div] : 16;
          return (
            <div
              key={div}
              className="flex flex-col gap-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200"
            >
              <label className="text-xs font-bold text-zinc-700">{div} 정원</label>
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  value={val || ''}
                  min={1}
                  max={256}
                  onChange={(e) => handleChange(div, e.target.value)}
                  className="input-field text-center font-black text-sm py-1.5 px-1 bg-white border border-zinc-300"
                />
                <button
                  type="button"
                  onClick={() => handleSave(div)}
                  className="px-3 py-2 btn-primary-athletic rounded-lg text-xs font-bold shrink-0 shadow-2xs"
                  title="저장"
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
