import React from 'react';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export const NoticeSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operating Guide */}
        <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-extrabold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Info className="w-4 h-4 text-indigo-600" />
            </div>
            <span>운영 및 이용 안내</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦉</span>
              <span>
                <strong>궁금한 점은 정보·AI 담당 선생님께 문의해 주세요:</strong> 작품 등록 오류나 주소 변경이 필요한 경우 선생님께 말씀드리면 즉시 수정 가능합니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦉</span>
              <span>
                <strong>구글 설문으로 제출된 작품은 교사 승인 후 공개됩니다:</strong> 안전성 검토가 완료된 자료는 상단의 <strong>[새로고침]</strong> 버튼을 누르면 즉시 반영됩니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦉</span>
              <span>
                <strong>따뜻한 좋아요(❤️)로 친구들을 응원하세요:</strong> 멋진 아이디어와 정성이 담긴 동료 학생들의 웹앱에 좋아요를 눌러 칭찬을 나눠주세요!
              </span>
            </p>
          </div>
        </div>

        {/* Caution & AI Ethics */}
        <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <span>저작권 및 생성형 AI 윤리 수칙</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 space-y-2 leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦕</span>
              <span>
                <strong>타인의 작품 무단 제출 금지:</strong> 인터넷 오픈소스를 그대로 복사하거나 출처 없이 도용한 경우 전시 및 심사 대상에서 제외될 수 있습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦕</span>
              <span>
                <strong>클린 미디어 라이선스 준수:</strong> 학생이 직접 제작한 이미지, AI 프롬프트로 생성한 이미지, 상업적 무료 라이선스가 확인된 자원만 허용됩니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-base select-none shrink-0">🦕</span>
              <span>
                <strong>건전한 학교 문화 존중:</strong> 특정인 비하, 유해 광고, 개인정보 노출 등이 포함된 웹앱은 승인이 거절되거나 즉시 삭제 조치됩니다.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
