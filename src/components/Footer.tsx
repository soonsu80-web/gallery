import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTeacher: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeacher }) => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-slate-700">
            <span>인천남고등학교 시민개발자 웹앱 갤러리</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-indigo-600 font-semibold">2026 AI 코딩 페스타</span>
          </div>
          <p className="text-slate-400">
            인천남고 학생들의 배움과 성장을 응원합니다. All student web applications are verified by school instructors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTeacher}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>교사 관리 모드</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
