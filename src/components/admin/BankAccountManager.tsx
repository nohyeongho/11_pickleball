import React, { useState, useEffect } from 'react';
import { CreditCard, Save } from 'lucide-react';

interface BankAccountManagerProps {
  initialAccount: string;
  onSave: (account: string) => void;
}

export const BankAccountManager: React.FC<BankAccountManagerProps> = ({
  initialAccount,
  onSave,
}) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    setAccount(initialAccount);
  }, [initialAccount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(account.trim());
  };

  return (
    <div className="rounded-2xl p-5 mb-6 shadow-2xs border bg-white border-zinc-200">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="w-4 h-4 text-rose-500" />
        <h3 className="text-sm font-bold text-zinc-900">참가비 입금 계좌번호 설정</h3>
      </div>
      <p className="text-xs mb-3.5 text-zinc-500">
        여기에 입력한 계좌번호는 참가신청 폼 하단 및 완료 알림창에 자동으로 노출됩니다.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="예: 카카오뱅크 3333-36-8513229 (피클볼대회 조직위원회)"
          className="input-field flex-1 font-semibold text-sm bg-zinc-50 focus:bg-white"
        />
        <button
          type="submit"
          className="px-6 py-2.5 btn-primary-athletic rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>계좌 저장</span>
        </button>
      </form>
    </div>
  );
};
