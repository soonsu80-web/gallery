import React from 'react';
import { Sparkles, Heart, Eye, Users, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

interface HeroStatsProps {
  onOpenSubmit: () => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ onOpenSubmit }) => {
  const { stats, teacherConfig } = useGallery();

  const handleOpenGoogleForm = () => {
    if (teacherConfig.googleFormUrl) {
      window.open(teacherConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
    } else {
      onOpenSubmit();
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Glows matching reference style */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-12 right-10 w-80 h-80 bg-pink-200/35 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Notice Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 -ml-3 rounded-full bg-emerald-500" />
            <span>교사 승인 완료 작품 실시간 전시</span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            마지막 업데이트: <span className="font-semibold text-slate-700">{stats.lastUpdatedAt}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-br from-white/95 via-blue-50/40 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl shadow-blue-900/5 backdrop-blur-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600/10 text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>INCHEON NAM HIGH SCHOOL • AI WEB APP FESTA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              인천남고 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-pink-600">시민개발자 갤러리</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              인천남고등학교 학생들이 생성형 AI와 코딩을 융합하여 직접 기획하고 구현한 웹 기반 프로그램을 공유하는 공간입니다.
              동료들의 창의적인 웹앱을 직접 실행해보고, 따뜻한 <span className="text-rose-500 font-semibold">좋아요(❤️)</span>로 응원해 주세요!
            </p>
          </div>

          {/* Quick CTA to Google Form */}
          <div className="mt-6 p-4 rounded-2xl bg-white/90 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  학생 웹앱 주소 접수 중 (구글 설문지)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  선생님께서 배포하신 구글 설문지에 주소를 등록하면 교사 승인 후 이곳 갤러리에 정식 등록됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenGoogleForm}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>구글 설문지로 접수하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenSubmit}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <span>직접 등록</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalApproved}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                승인된 공개 작품
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalLikes}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                누적 좋아요 응원
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalViews}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                작품 실행 조회수
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalStudents}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                참여 시민개발자
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
