import React, { useState, useMemo } from 'react';
import { Layers, Plus, Trash2, Edit3, Check } from 'lucide-react';
import { sortDivisions } from '../../utils/formatters';

interface DivisionManagerProps {
  divisions: string[];
  onAddDivision: (name: string) => void;
  onEditDivision: (oldName: string, newName: string) => void;
  onDeleteDivision: (name: string) => void;
}

export const DivisionManager: React.FC<DivisionManagerProps> = ({
  divisions,
  onAddDivision,
  onEditDivision,
  onDeleteDivision,
}) => {
  const sortedDivisions = useMemo(() => sortDivisions(divisions), [divisions]);
  const [newDivName, setNewDivName] = useState('');
  const [editingDiv, setEditingDiv] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDivName.trim()) return;
    onAddDivision(newDivName.trim());
    setNewDivName('');
  };

  const startEdit = (div: string) => {
    setEditingDiv(div);
    setEditVal(div);
  };

  const saveEdit = (oldName: string) => {
    if (!editVal.trim()) return;
    onEditDivision(oldName, editVal.trim());
    setEditingDiv(null);
  };

  return (
    <div className="rounded-2xl p-5 mb-6 border border-zinc-200 bg-white shadow-2xs">
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm font-bold text-zinc-900">참가부수 동적 관리</h3>
      </div>
      <p className="text-xs mb-3.5 text-zinc-500">
        참가부수를 자유롭게 추가, 수정, 삭제할 수 있습니다. 변경사항은 참가신청 폼과 정원 설정에 실시간 적용됩니다.
      </p>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <input
          type="text"
          value={newDivName}
          onChange={(e) => setNewDivName(e.target.value)}
          placeholder="새 참가부수 이름 (예: 6부, 오픈부, 초심자부 등)"
          className="input-field flex-1 text-sm bg-zinc-50 focus:bg-white"
        />
        <button
          type="submit"
          className="px-5 py-2.5 btn-primary-athletic rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>부수 추가</span>
        </button>
      </form>

      <div className="space-y-2" id="divisionManageList">
        {sortedDivisions.map((div) => {
          const isCurrentEditing = editingDiv === div;

          return (
            <div
              key={div}
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50/60 transition-colors gap-2"
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="font-black text-sm min-w-[50px] text-rose-600">{div}</span>
                {isCurrentEditing ? (
                  <input
                    type="text"
                    autoFocus
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    className="input-field py-1 px-3 text-xs flex-1 max-w-[200px] bg-white font-bold border-2 border-fuchsia-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(div);
                      if (e.key === 'Escape') setEditingDiv(null);
                    }}
                  />
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isCurrentEditing ? (
                  <button
                    type="button"
                    onClick={() => saveEdit(div)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold btn-primary-athletic flex items-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>완료</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(div)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold btn-secondary-athletic flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3 text-zinc-500" />
                    <span>수정</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteDivision(div)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>삭제</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
