import React from 'react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 py-8 text-center text-xs mt-auto bg-white/70 backdrop-blur-sm relative">
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-fuchsia-500/35 to-transparent" />
      <div className="max-w-5xl mx-auto px-4 space-y-1.5">
        <p className="font-bold text-sm bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 bg-clip-text text-transparent">
          2027 전국 피클볼대회 조직위원회
        </p>
        <p className="text-slate-500">
          © 2027 Busan & National Pickleball Championship. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400">
          실시간 참가신청 접수, 대기자 자동 순번 배정 및 승격 관리 시스템
        </p>
      </div>
    </footer>
  );
};
