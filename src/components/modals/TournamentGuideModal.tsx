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

export const TournamentGuideModal: React.FC<TournamentGuideModalProps> = ({
  isOpen,
  onClose,
  onHideToday,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5 transition-opacity">
      <div className="card-clean max-w-3xl w-full max-h-[90vh] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-2xl">
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-brand-bar shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-gradient-to-r from-pink-50/50 via-white to-purple-50/40 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl border-gradient-tab text-rose-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold text-gradient-brand block tracking-wide">
                대회 공식 요강 및 운영 안내
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
                2027년 부산광역시 피클볼협회장기 전국 피클볼대회
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* 1. 대회 개요 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Trophy className="w-4 h-4 text-rose-500 shrink-0" />
              <span>1. 대회 개요</span>
            </h3>
            <ul className="space-y-1.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">대 회 명:</strong> 2027년 부산광역시피클볼협회장기 전국 피클볼대회
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">일 시:</strong> 2027. 1. 9.(토) 08:30 ~ 18:00
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">장 소:</strong> 스포원파크 실내체육관(부산시 금정구 체육공원로 339번길324)
                  <span className="block text-xs text-slate-500 mt-0.5">- 운영 코트 수: 실내 10면</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">주최/주관:</strong> 부산광역시피클볼협회
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">후 원:</strong> 북구피클볼협회. 남구피클볼협회. 부산진구피클볼협회. 연제구피클볼협회. 영도구피클볼협회. 해운대구피클볼협회.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">협 찬:</strong> -
                </div>
              </li>
            </ul>
          </section>

          {/* 2. 대회 목적 */}
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-4 h-4 text-rose-500 shrink-0" />
              <span>2. 대회 목적</span>
            </h3>
            <ul className="space-y-1.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <span>부산 지역 피클볼 저변 확대 및 생활체육 활성화 기여</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <span>부산시 피클볼 동호인 및 경남. 울산 동호인 간의 교류와 화합을 도모하고, 네트워크 강화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <span>종목별 경기 운영을 통한 개인 실력 향상과 건강한 스포츠 문화 확산</span>
              </li>
            </ul>
          </section>

          {/* 3. 경기 종목 및 시상 내역 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Users className="w-4 h-4 text-rose-500 shrink-0" />
              <span>3. 경기 종목 및 시상 내역</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">운영 규모:</strong> 15개 종목(연령 구분 없음)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div className="w-full">
                  <strong className="text-slate-900">경기 종목 및 팀 수</strong>
                  <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs bg-white p-3 rounded-lg border border-slate-200/80">
                    <div>• <strong>1부:</strong> 남자복식 8팀, 여자복식 8팀, 혼합복식 8팀 (48명)</div>
                    <div>• <strong>2부:</strong> 남자복식 8팀, 여자복식 8팀, 혼합복식 8팀 (48명)</div>
                    <div>• <strong>3부:</strong> 남자복식 8팀, 여자복식 8팀, 혼합복식 8팀 (48명)</div>
                    <div>• <strong>4부:</strong> 남자복식 12팀, 여자복식 12팀, 혼합복식 12팀 (72명)</div>
                    <div className="sm:col-span-2">• <strong>5부:</strong> 남자복식 12팀, 여자복식 12팀, 혼합복식 12팀 (72명)</div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    ※ 모든 종목은 12팀 미만으로 제한하나 종목별 참가팀 수를 고려하여 조정할 수 있고, 6팀 미만으로 신청된 종목은 폐부 될 수 있음.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">시상 내역:</strong> 우승: 메달+상품 or 상금 / 준우승: 메달+상품 or 상금 / 3위: 메달+상품 or 상금
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
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">참가대상:</strong> 2026년 11월 부산광역시 피클볼협회 회원 가입된 회원.
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">
                    ※ 시외 참가자는 참가비만 납부하면 가능.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div className="space-y-1">
                  <strong className="text-slate-900">종목별 참가 자격</strong>
                  <ul className="text-xs space-y-1 text-slate-700 pl-1">
                    <li>- 두 종목 이상 출전 시 같은 레벨로만 출전 가능 (4부 남복+4부 혼복 출전 가능, 3부 남복+4부 혼복 출전 불가능)</li>
                    <li>- <strong>4부:</strong> 부산시 구협회 대회 4부 출전자 및 5부 우승자(5부 혼복우승자 제외)</li>
                    <li>- <strong>5부:</strong> 부산시 구협회 대회 5부 출전자 및 비기너</li>
                  </ul>
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-900 space-y-0.5 mt-1">
                    <p>※ 5부 레벨의 참가자가 4부로 신청 가능하나, 4부 레벨은 5부 신청은 불가함.</p>
                    <p>※ 4부, 5부 팀은 부산시 회원등록된 팀으로 한정한다.</p>
                    <p>※ 4부, 5부 출전자 테니스, 배드민턴 등 라켓운동 경력 3개월 미만인 자.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">레벨 위반 및 부정 출전</strong>
                  <ul className="text-xs space-y-1 text-slate-700 mt-1 pl-1">
                    <li>- 참가 신청 시 기재된 레벨이 사실과 다르거나, 대회 운영진 판단하에 명백한 레벨 위반이 확인될 경우 해당 팀은 즉시 실격(몰수패) 처리되며, 참가비는 반환되지 않음.</li>
                    <li>- 해당 판단은 대회 운영위원회의 결정에 따르며, 이에 대한 이의 제기는 불가함.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 접수 및 문의 */}
          <section className="rounded-xl border border-pink-200/80 bg-gradient-to-br from-pink-50/50 via-white to-purple-50/40 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-pink-100 pb-2">
              <Phone className="w-4 h-4 text-rose-500 shrink-0" />
              <span>5. 접수 및 문의</span>
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">접수 기간:</strong> 2026. 11. 28.(토) 09시 ~ 12. 11.(금) 18시
                  <p className="text-xs text-slate-500 mt-0.5">
                    ※ 접수는 입금 완료 기준으로 선착순 마감, 조기 마감 시 대기자 운영.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">접수 방법:</strong> 온라인 및 문자접수 — 종목-성명 순으로 기재 (예: 4부남복: 김길동, 홍길동)
                  <span className="block text-xs text-slate-600 mt-0.5">사무국장: 김희정 (010-2544-0000)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">대진표 공개:</strong> 2026. 12. 23.(수) 예정
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">참 가 비:</strong> 팀별 6만원 (참가자 전원에게 기념품 증정)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">참가비 납부 (참가비가 입금되어야 접수 완료됨)</strong>
                  <p className="text-xs text-slate-700 mt-0.5">- 팀 대표 1인이 송금자명에 파트너 이름을 함께 기록하여 송금 (예시: 이순신,홍길동)</p>
                  <p className="text-xs font-bold text-rose-600 mt-0.5">- 입금계좌: 카카오뱅크 3333-36-8513229 (김희정)</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">참가비 환불</strong>
                  <ul className="text-xs space-y-0.5 text-slate-700 mt-0.5">
                    <li>- 접수 기간 내: 100% 환불</li>
                    <li>- 접수 마감 후부터 대진표 생성 전: 50% 환불</li>
                    <li>- 대진표 공개 후: 환불 불가</li>
                  </ul>
                  <p className="text-xs text-rose-600 mt-0.5">※ 레벨 위반/부정 출전/No-show 등 제재 사유 발생 시 참가비 환불 불가</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">문 의:</strong> 부산시피클볼협회 사무국장 김희정 (010-2544-0000 / 이메일: ab42003@naver.com)
                </div>
              </li>
            </ul>
          </section>

          {/* 6. 대회 운영 및 경기 방식 */}
          <section className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <span>6. 대회 운영 및 경기 방식</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">적용 규정:</strong> 본 대회는 『2026. 대한피클볼협회 경기 규정』을 기본으로 하며, 규정에 명시되지 않은 사항은 대회운영위원회의 결정에 따름.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">복장 및 장비 규정:</strong> 출전 선수는 공인구(오렌지색)와 비슷한 색깔의 의류는 착용 금지하고, 실내 체육관에 적합한 운동복과 실내 전용 운동화를 착용해야 함. 경기장 바닥 손상을 유발하는 신발은 착용을 금지하며, 미준수 시 경기 출전이 제한될 수 있음.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">경기 시간:</strong> 오전 - 모든 종목 남자복식 및 여자복식 진행 / 오후 - 모든 종목 혼합복식 (※ 참가 팀 수에 따라 조정될 수 있음)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">경기 방식:</strong>
                  <ul className="text-xs space-y-0.5 mt-1 pl-1">
                    <li>- 예선 조별 풀리그, 본선 토너먼트 진행</li>
                    <li>- 예선·본선·결승전: 11점 단세트 (노애드, 듀스 없음)</li>
                    <li>- 8팀 참가 종목: 2개조 풀리그 진행, 각 조 1, 2위팀 4강전 진행</li>
                    <li>- 12팀 참가 종목: 4개조 풀리그 진행, 각 조 1, 2위팀 8강·4강·결승 진행</li>
                    <li>- 코트 체인지 없음 / 서브가 네트에 맞고 서브 구역 내에 떨어지면 경기 계속 진행</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">타임아웃 & 워밍업:</strong> 경기당 각 팀별 1분씩 1회 / 메디컬 타임아웃: 부상 발생 시 최대 5분간 1회 허용 (이후 진행 불가 시 기권 처리) / 연습(워밍업): 경기당 1분 후 바로 경기 진행
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">심판 운영 및 분쟁 처리:</strong> 예선전 및 4강전 미만은 선수 간 자율 심판제 운영(판정 분쟁 2회 이상 시 본부 진행요원 투입), 결승전부터 심판 배정. 과도한 항의 및 경기 지연 행위는 테크니컬 파울 및 몰수패 처리 가능.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">동률 시 순위 산정 기준:</strong> ① 승점(승 3점, 패 0점) → ② 승자승(2팀 동률 시) → ③ 총득점-총실점 → ④ 추첨
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">대회 사용구:</strong> 트라이온 T-10
                </div>
              </li>
            </ul>
          </section>

          {/* 7. 선수 준수 사항 등 */}
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 space-y-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>7. 선수 준수 사항 등</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  참가 선수는 <strong>신분증(주민등록증, 운전면허증, 여권만 해당)</strong>을 지참 후, 경기 시작 1시간 전까지 선수 등록을 완료하여야 합니다.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">출전 시간 규정:</strong> 모든 선수들은 경기 시작 10분 전까지 대회 장소에서 대기하여야 함. 정시 진행 시 경기 시작 시간 5분 이내, 지연 진행 시 호명 후 5분 이내에 출전하지 않는 경우 <strong>기권패(11:0)</strong> 처리함. 사전 연락 없는 불참(No-show)팀은 향후 본 협회 주최 대회 참가에 제한을 받을 수 있음.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">안전 관리:</strong> 사고 발생 시 참가 선수 본인의 100% 책임이며, 대회 주최 및 주관 단체는 민·형사상 어떠한 책임도 지지 않음을 참가 신청 시 동의한 것으로 간주함.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">개인정보 수집·이용 및 사진/영상 활용 동의:</strong> 대회 중 촬영된 사진 및 영상은 주최·주관 측의 홍보 자료(홈페이지, SNS, 보도자료 등)로 활용될 수 있으며, 참가자는 참가 신청과 동시에 개인정보 수집·이용(성명, 전화번호, 생년월일, 소속클럽 등) 및 홍보 활용에 동의한 것으로 간주함.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">◈</span>
                <div>
                  <strong className="text-slate-900">참가 클럽 현수막 게시:</strong> 각 클럽별 현수막 게시는 가능하며 끈이나 압정만 사용 가능함 (관중석 난간이나 창문쪽 칸막이에 부착 가능).
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onHideToday}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/90 transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span>오늘 그만 보기</span>
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
