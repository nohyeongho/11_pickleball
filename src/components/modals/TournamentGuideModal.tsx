import React from 'react';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Award,
  Phone,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  X,
  CheckSquare,
} from 'lucide-react';

interface TournamentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHideToday: () => void;
}

/**
 * 2027년 부산광역시 피클볼협회장기 전국 피클볼대회 요강 안내 모달 컴포넌트
 * - (11.17 수정) 대회 요강 원문 전문(1번~7번 항목 전체)을 원형 그대로 100% 반영하여 재작성함
 */
export const TournamentGuideModal: React.FC<TournamentGuideModalProps> = ({
  isOpen,
  onClose,
  onHideToday,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5 transition-opacity">
      <div className="card-clean max-w-3xl w-full max-h-[90vh] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-2xl">
        {/* 상단 포인트 그라디언트 바 */}
        <div className="h-1.5 w-full bg-gradient-brand-bar shrink-0" />

        {/* 모달 헤더 */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-pink-50/50 via-white to-purple-50/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl border-gradient-tab text-rose-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold text-gradient-brand block tracking-wider uppercase">
                Official Tournament Guide
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                2027년 부산광역시 피클볼협회장기 전국 피클볼대회
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 (대회 요강 전문 1~7번 원본 100% 반영) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">

          {/* 1. 대회 개요 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Trophy className="w-4 h-4 text-rose-500 shrink-0" />
              <span>1. 대회 개요</span>
            </h3>
            <div className="space-y-2 pl-1">
              <div>
                <span className="font-bold text-slate-900">◈ 대 회 명:</span> 2027년 부산광역시피클볼협회장기 전국 피클볼대회
              </div>
              <div>
                <span className="font-bold text-slate-900">◈ 일 시:</span> 2027. 1. 9.(토) 08:30 ~ 18:00
              </div>
              <div>
                <span className="font-bold text-slate-900">◈ 장 소:</span> 스포원파크 실내체육관(부산시 금정구 체육공원로 339번길324)
                <p className="text-xs text-slate-600 mt-0.5 pl-4">- 운영 코트 수: 실내 10면</p>
              </div>
              <div>
                <span className="font-bold text-slate-900">◈ 주최/주관:</span> 부산광역시피클볼협회
              </div>
              <div>
                <span className="font-bold text-slate-900">◈ 후 원:</span> 부산광역시. 부산광역시 체육회, 북구피클볼협회. 남구피클볼협회. 부산진구피클볼협회. 연제구피클볼협회. 영도구피클볼협회. 해운대구피클볼협회.
              </div>
              <div>
                <span className="font-bold text-slate-900">◈ 협 찬:</span>
              </div>
            </div>
          </section>

          {/* 2. 대회 목적 */}
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-rose-500 shrink-0" />
              <span>2. 대회 목적</span>
            </h3>
            <div className="space-y-1.5 pl-1">
              <p>◈ 부산 지역 피클볼 저변 확대 및 생활체육 활성화 기여</p>
              <p>◈ 부산시 피클볼 동호인 및 경남. 울산 동호인 간의 교류와 화합을 도모하고, 네트워크 강화</p>
              <p>◈ 종목별 경기 운영을 통한 개인 실력 향상과 건강한 스포츠 문화 확산</p>
            </div>
          </section>

          {/* 3. 경기 종목 및 시상 내역 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Users className="w-4 h-4 text-rose-500 shrink-0" />
              <span>3. 경기 종목 및 시상 내역</span>
            </h3>
            <div className="space-y-3 pl-1">
              <div>
                <p className="font-bold text-slate-900">◈ 운영 규모: 15개 종목(연령 구분 없음)</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">◈ 경기 종목 및 팀 수</p>
                <ul className="text-xs space-y-1 pl-4 text-slate-700">
                  <li>- 1부: 남자복식 12팀, 여자복식 12팀, 혼합복식 12팀-72명</li>
                  <li>- 2부: 남자복식 12팀, 여자복식 12팀, 혼합복식 12팀-72명</li>
                  <li>- 3부: 남자복식 12팀, 여자복식 12팀, 혼합복식 12팀-72명</li>
                  <li>- 4부: 남자복식 16팀, 여자복식 16팀, 혼합복식 16팀-96명</li>
                  <li>- 5부: 남자복식 16팀, 여자복식 16팀, 혼합복식 16팀-96명</li>
                </ul>
                <p className="text-xs text-rose-600 mt-1 pl-4">
                  ※ 참가팀은 12팀(1~3부) 또는 16팀(4~5부) 이하로 제한하나 종목별 참가팀 수를 고려하여 조정할 수 있고, 6팀 미만으로 신청된 종목은 폐부 될 수 있음.
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-1">◈ 시상 내역</p>
                <div className="pl-4">
                  <p className="font-semibold text-rose-600">
                    - 우승: 메달 + 상금 15만원 / 준우승: 메달 + 상금 10만원 / 3위: 메달 + 상금 5만원
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ※ 종목별 참가팀이 8팀 미만일 경우 시상품 등 시상 내역이 조정될 수 있음.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 참가 자격 */}
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
              <span>4. 참가 자격</span>
            </h3>
            <div className="space-y-3 pl-1">
              <div>
                <p className="font-bold text-slate-900">
                  ◈ 참가대상: 2026년 11월 부산광역시 피클볼협회 회원으로 가입된 회원
                </p>
                <p className="text-xs text-slate-500 pl-4 mt-0.5">※ 시외(타시도) 참가자는 참가비만 납부하면 가능</p>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-1">◈ 종목별 참가 자격</p>
                <ul className="text-xs space-y-1 pl-4 text-slate-700">
                  <li>- 두 종목 이상 출전시 같은 레벨로만 출전 가능(4부 남복+4부 혼복 출전 가능, 3부 남복+4부 혼복 출전 불가능)</li>
                  <li>- 4부: 부산시 구협회 대회 4부 출전자 및 5부 우승자(5부 혼복우승자제외)</li>
                  <li>- 5부: 부산시 구협회 대회 5부 출전자 및 비기너.</li>
                  <li>- 5부 레벨의 참가자가 4부로 신청 가능하나, 4부 레벨은 5부 신청은 불가함.</li>
                  <li>- 4부. 5부 팀은 부산시 회원 등록된 팀으로 한정한다(타시도 팀은 4~5부 출전 제한).</li>
                  <li className="font-semibold text-rose-600">- 4부. 5부 출전자 테니스. 배드민턴..등 라켓운동 경력 3개월 미만인자.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-1">◈ 레벨 위반 및 부정 출전</p>
                <ul className="text-xs space-y-1 pl-4 text-slate-700">
                  <li>- 참가 신청 시 기재된 레벨이 사실과 다르거나, 대회 운영진 판단하에 명백한 레벨 위반이 확인 될 경우 해당 팀은 즉시 실격(몰수패) 처리되며, 참가비는 반환되지 않음.</li>
                  <li>- 해당 판단은 대회 운영위원회의 결정에 따르며, 이에 대한 이의 제기는 불가함.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. 접수 및 문의 */}
          <section className="rounded-xl border border-pink-200/80 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/40 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-pink-100 pb-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>5. 접수 및 문의</span>
            </h3>
            <div className="space-y-3 pl-1 text-slate-700">
              <div>
                <p className="font-bold text-slate-900">◈ 접수 기간: ~ 2026년 11월 까지</p>
                <div className="pl-4 mt-1 space-y-0.5">
                  <p className="text-xs text-slate-500">※ 접수는 입금 완료 기준으로 선착순 마감, 조기 마감 시 대기자 운영.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 접수 방법 : 아래 어플을 통한 온라인 접수</p>
                <div className="pl-4 mt-1">
                  <a
                    href="https://busan-pickleball.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 font-bold underline break-all"
                  >
                    https://busan-pickleball.netlify.app/
                  </a>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 대진표 공개: 2026.12. 23.(수) 예정</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 참 가 비: 팀별 6만원</p>
                <p className="text-xs text-slate-600 pl-4 mt-0.5">- 참가자 전원에게 기념품 증정.</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 참가비 납부 (참가비가 입금되어야 접수 완료됨)</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 팀 대표 1인이 송금자명에 파트너 이름을 함께 기록하여 송금(예시: 이순신,홍길동)</p>
                  <p className="font-bold text-rose-600">- 입금계좌: 카카오뱅크 3333-36-8513229 (김희정)</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 참가비 환불</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 접수 기간 내: 100% 환불</p>
                  <p>- 접수 마감 후부터 대진표 생성 전: 50% 환불</p>
                  <p>- 대진표 공개 후: 환불 불가</p>
                  <p className="text-rose-600 font-semibold mt-0.5">※ 레벨 위반/부정 출전/No-show 등 제재 사유 발생 시 참가비 환불 불가</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 문 의</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 부산시피클볼협회 사무국장: 김희정. 010-2544-0000.</p>
                  <p>이메일: ab42003@naver.com</p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. 대회 운영 및 경기 방식 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <span>6. 대회 운영 및 경기 방식</span>
            </h3>
            <div className="space-y-3 pl-1 text-slate-700 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-slate-900">◈ 적용 규정</p>
                <p className="text-xs pl-4 mt-0.5">
                  - 본 대회는 『2026. 대한피클볼협회 경기 규정』을 기본으로 하며, 규정에 명시되지 않은 사항은 대회운영위원회의 결정에 따름.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 복장 및 장비 규정</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 출전 선수는 공인구(트라이온 T-10, 오렌지색)와 비슷한 색깔의 의류는 착용 금지하고, 실내 체육관에 적합한 운동복과 실내 전용 운동화를 착용해야 함.</p>
                  <p>- 경기장 바닥 손상을 유발하는 신발은 착용을 금지하며, 미준수 시 경기 출전이 제한될 수 있음.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 경기 시간</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 오전: 모든 종목 남자복식 및 여자복식 진행</p>
                  <p>- 오후: 모든 종목 혼합복식.</p>
                  <p className="text-slate-500">※ 상기 일정은 참가 팀 수에 따라 조정될 수 있음.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 경기 방식</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 예선 조별 풀리그, 본선 토너먼트 진행</p>
                  <p>- 예선 및 본선(4강,결승.)</p>
                  <p className="font-semibold text-rose-600">=&gt; 예선.본선.결승전: 11점 단세트(노애드, 듀스 없음)</p>
                  <p>- 8팀 참가 종목: 2개조 풀리그 진행, 각 조 1, 2위팀 4강전 진행</p>
                  <p>- 16팀 참가 종목: 4개조 풀리그 진행, 각 조 1.2위팀 8강. 4강. 결승 진행</p>
                  <p className="text-slate-500">※ 참가 팀 수에 따라 일부 조정될 수 있음.</p>
                  <p>- 코트 체인지 없음</p>
                  <p>- 서브가 네트에 맞고 서브 구역 내에 떨어지면 경기 계속 진행</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 타임아웃</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 타임아웃: 경기당 각 팀별로 1분씩 1회</p>
                  <p>- 메디컬 타임아웃: 경기 중 부상 발생 시 최대 5분간 1회 허용, 이후 경기 진행 불가 시 기권 처리</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 연습(워밍업): 경기당 1분으로 하고 바로 경기 진행</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 심판 운영 및 분쟁 처리</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 예선전 및 4강전 미만: 선수 간 자율 심판제 운영 (단, 판정 분쟁이 2회 이상 발생할 경우 본부 진행요원 투입)</p>
                  <p>- 결승전 부터 심판 배정</p>
                  <p>- 분쟁 발생 시, 경기 중단 후 즉시 대회 운영위원회 호출</p>
                  <p>- 대회 운영위원회 판단을 최종 결정으로 함.</p>
                  <p className="text-rose-600 font-semibold">- 과도한 항의 및 경기 지연 행위는 테크니컬 파울 및 몰수패로 처리할 수 있음.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 동률 시 순위 산정 기준</p>
                <p className="text-xs pl-4 mt-0.5">① 승점(승-3점.패-0) ② 승자승(2팀이 동률인 경우) ③ 총득점-총실점 ④ 추첨</p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 대회 사용구: 트라이온 T-10</p>
              </div>
            </div>
          </section>

          {/* 7. 선수 준수 사항 등 */}
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>7. 선수 준수 사항 등</span>
            </h3>
            <div className="space-y-3 pl-1 text-slate-700 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-slate-900">◈ 신분증 지참 및 선수 등록</p>
                <p className="text-xs pl-4 mt-0.5">
                  참가 선수는 신분증(주민등록증, 운전면허증, 여권만 해당)을 지참 후, 경기 시작 1시간 전까지 선수 등록을 완료하여야 합니다.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 출전 시간 규정</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 모든 선수들은 경기 시작 10분 전까지 대회 장소에서 대기하여야 함.</p>
                  <p className="font-semibold text-rose-600">- 다음의 경우에는 기권패(11:0) 처리함.</p>
                  <p className="pl-3">① 정시 진행 시, 경기 시작 시간 5분 이내에 출전하지 않는 경우</p>
                  <p className="pl-3">② 지연 진행 시 출전 선수 호명 후 5분 이내에 출전하지 않는 경우</p>
                  <p>- 불가항력적인 이유로 늦어지는 경우는 대회운영위원장의 판단에 따라 경기 순서를 조정하여 운영할 수 있음.</p>
                  <p className="text-rose-600 font-semibold">- 사전 연락 없는 불참(No-show)팀은 향후 본 협회 주최 대회 참가에 제한을 받을 수 있음.</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 안전 관리</p>
                <p className="text-xs pl-4 mt-0.5">
                  - 사고 발생 시 참가 선수 본인의 100% 책임이며, 대회 주최 및 주관 단체는 민·형사상 어떠한 책임도 지지 않음을 참가 신청 시 동의한 것으로 간주함.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 개인정보 수집이용 사진 및 영상 활용 동의</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 대회 중 촬영된 사진 및 영상은 주최·주관 측의 홍보 자료(홈페이지, SNS, 보도자료 등)로 활용될 수 있으며, 참가자는 참가 신청과 동시에 이에 동의한 것으로 간주함.</p>
                  <p className="text-slate-500">※ 개인정보 수집 이용 동의 (성명,전화번호,생년월일,소속클럽등) 한 것으로 간주함</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-900">◈ 참가 클럽 현수막 게시</p>
                <div className="pl-4 mt-1 space-y-0.5 text-xs">
                  <p>- 각 클럽별 현수막 게시는 가능하며 끈이나 압정만 사용 가능하다.</p>
                  <p>- 부착 위치는 관중석 난간이나 창문쪽 칸막이에 부착 가능함.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 모달 하단 버튼 */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80 shrink-0">
          <button
            type="button"
            onClick={onHideToday}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span>오늘 하루 보지 않기</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold btn-primary-athletic shadow-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
