import markLogo from '../../assets/images/mark.png';
import { ShieldCheck, Search, UserPlus } from 'lucide-react';

interface AppHeaderProps {
  currentTab: 'register' | 'inquiry' | 'admin';
  onTabChange: (tab: 'register' | 'inquiry' | 'admin') => void;
  onAdminClick: () => void;
  adminUnlocked: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentTab,
  onTabChange,
  onAdminClick,
  adminUnlocked,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs relative">
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500" />
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer select-none group w-full md:w-auto justify-center md:justify-start"
          onClick={() => onTabChange('register')}
        >
          <div className="p-1 rounded-xl bg-white border border-pink-200/70 shadow-xs group-hover:scale-105 transition-transform duration-300 flex items-center justify-center overflow-hidden">
            <img src={markLogo} alt="대회 로고" className="w-8 h-8 object-contain shrink-0" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 bg-clip-text text-transparent leading-none">
              2027 전국 피클볼대회
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              National Pickleball Championship
            </p>
          </div>
        </div>

        <nav className="flex bg-slate-100/90 p-1 rounded-xl gap-1 text-sm font-semibold w-full md:w-auto border border-slate-200/70">
          <button
            onClick={() => onTabChange('register')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${
              currentTab === 'register'
                ? 'bg-white text-rose-600 shadow-xs font-bold border border-pink-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className={`w-3.5 h-3.5 ${currentTab === 'register' ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>신청 접수</span>
          </button>
          <button
            onClick={() => onTabChange('inquiry')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${
              currentTab === 'inquiry'
                ? 'bg-white text-rose-600 shadow-xs font-bold border border-pink-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className={`w-3.5 h-3.5 ${currentTab === 'inquiry' ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>신청 조회</span>
          </button>
          <button
            onClick={onAdminClick}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${
              currentTab === 'admin'
                ? 'bg-white text-rose-600 shadow-xs font-bold border border-pink-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${currentTab === 'admin' ? 'text-rose-600' : 'text-slate-400'}`} />
            <span>대회 관리 {adminUnlocked ? '🟢' : ''}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
