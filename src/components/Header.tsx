import React from 'react';
import { Sparkles, ShieldCheck, PlusCircle, ExternalLink } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

interface HeaderProps {
  onOpenSubmit: () => void;
  onOpenTeacher: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSubmit, onOpenTeacher }) => {
  const { stats, isTeacherLoggedIn } = useGallery();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* School Emblem & Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black tracking-tighter text-blue-800 leading-none">인천</span>
              <span className="text-xs font-black tracking-tight text-indigo-700 leading-none">남고</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                인천남고등학교
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3 h-3 text-blue-600" />
                시민개발자
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium truncate">
              학생 AI · 웹앱 갤러리 쇼케이스
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">학생 웹앱</span> 등록하기
          </button>

          <button
            onClick={onOpenTeacher}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
              isTeacherLoggedIn
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
            title="교사 승인 및 관리자 모드"
          >
            <ShieldCheck className={`w-4 h-4 ${isTeacherLoggedIn ? 'text-white' : 'text-indigo-600'}`} />
            <span>교사 관리</span>
            {stats.totalPending > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                {stats.totalPending}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
