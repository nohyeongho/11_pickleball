import React, { useState } from 'react';
import { TournamentApplication } from '../../types/tournament';
import { ApplicationCard } from './ApplicationCard';
import { Search, HelpCircle, FileText } from 'lucide-react';

interface InquirySectionProps {
  applications: TournamentApplication[];
  onRequestCancel: (id: string) => void;
}

export const InquirySection: React.FC<InquirySectionProps> = ({
  applications,
  onRequestCancel,
}) => {
  const [keyword, setKeyword] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<TournamentApplication[]>([]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = keyword.trim().toLowerCase();
    setHasSearched(true);

    if (!q) {
      setSearchResults([]);
      return;
    }

    const matches = applications.filter(
      (a) =>
        a.regNumber.toLowerCase().includes(q) ||
        a.player1Name.toLowerCase().includes(q) ||
        a.player2Name.toLowerCase().includes(q) ||
        a.player1Phone.includes(q) ||
        a.player2Phone.includes(q) ||
        a.depositorName.toLowerCase().includes(q) ||
        a.clubName.toLowerCase().includes(q)
    );

    setSearchResults(matches);
  };

  return (
    <section id="tab-inquiry">
      <div className="card-clean p-6 sm:p-8 bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-sm">
        <div className="border-b border-slate-100 pb-5 mb-7">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 text-rose-600 border border-pink-200/70">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 bg-clip-text text-transparent tracking-tight">
                참가신청 조회 및 취소
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                발급받은 접수번호(예: 2027-A-001) 또는 선수 성함, 연락처로 내역을 검색할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              id="searchKeyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="접수번호(예: 2027-A-001) 또는 선수 이름, 휴대폰번호 검색"
              className="input-field pl-10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-7 py-3 btn-primary-athletic font-bold rounded-xl text-sm shadow-sm hover:opacity-95 shrink-0"
          >
            검색하기
          </button>
        </form>

        <div id="searchResultContainer" className="space-y-4">
          {!hasSearched ? (
            <div
              className="text-center py-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 text-slate-500"
            >
              <HelpCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">검색어(접수번호 또는 선수 성함)를 입력하세요.</p>
              <p className="text-xs text-slate-400">
                조회된 카드 하단에서 신청 시 등록한 비밀번호를 통해 안전하게 실명 확인 및 취소가 가능합니다.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div
              className="text-center py-14 rounded-2xl border border-rose-200 bg-rose-50/60 flex flex-col items-center justify-center gap-2"
            >
              <FileText className="w-8 h-8 text-rose-500" />
              <p className="text-sm font-bold text-rose-800">
                일치하는 참가신청 내역이 없습니다.
              </p>
              <p className="text-xs text-rose-600/80">
                접수번호 철자나 선수 성함이 정확한지 확인 후 다시 검색해 주세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="text-xs font-semibold text-slate-500 px-1">
                검색 결과 <span className="font-bold text-rose-600">{searchResults.length}</span>건
              </div>
              {searchResults.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onRequestCancel={onRequestCancel}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
