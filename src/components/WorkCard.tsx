import React from 'react';
import { Heart, Eye, ExternalLink, Play, Lightbulb, MessageSquareQuote, Check } from 'lucide-react';
import { WebAppWork } from '../types/gallery';
import { useGallery } from '../context/GalleryContext';
import { getCategoryLabel } from '../utils/helpers';

interface WorkCardProps {
  work: WebAppWork;
  rank: number;
  onOpenPreview: (work: WebAppWork) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, rank, onOpenPreview }) => {
  const { likeWork, likedIds, recordView } = useGallery();
  const isLiked = likedIds.includes(work.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeWork(work.id);
  };

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordView(work.id);
    onOpenPreview(work);
  };

  const handleDirectLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordView(work.id);
    window.open(work.url, '_blank', 'noopener,noreferrer');
  };

  // Color gradient based on hue
  const primaryHue = work.hue ?? 210;
  const secondaryHue = (primaryHue + 45) % 360;

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Poster Top */}
      <div>
        <div
          className="relative h-44 sm:h-48 p-4 flex flex-col justify-between overflow-hidden"
          style={{
            background: `linear-gradient(135deg, hsl(${primaryHue}, 80%, 55%), hsl(${secondaryHue}, 85%, 45%))`
          }}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-black pointer-events-none" />

          {/* Top Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-black/35 backdrop-blur-md text-white shadow-xs">
                #{rank}
              </span>
              {(work.likes >= 10 || work.featured) && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-xs flex items-center gap-1 animate-pulse">
                  🔥 인기작
                </span>
              )}
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/30 backdrop-blur-md text-white border border-white/40 shadow-xs">
              {getCategoryLabel(work.category)}
            </span>
          </div>

          {/* Big Center Emoji */}
          <div className="relative z-10 my-auto text-center transform group-hover:scale-110 transition-transform duration-300 select-none">
            <span className="text-5xl sm:text-6xl drop-shadow-lg filter inline-block">
              {work.emoji || '💻'}
            </span>
          </div>

          {/* Bottom Student Badge */}
          <div className="relative z-10 flex items-center justify-between text-white/95 text-xs font-medium bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">
                {work.grade}학년 {work.className ? work.className : ''} {work.studentName}
              </span>
              {work.studentId && (
                <span className="text-[11px] opacity-80">({work.studentId})</span>
              )}
            </div>
            <span className="text-[11px] opacity-75">{work.createdAt}</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-3.5">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-700 transition-colors">
            {work.title}
          </h3>

          {/* Stats Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-semibold border border-rose-100">
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{work.likes || 0}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span>{work.views || 0}</span>
            </span>

            {work.tags && work.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 ml-auto overflow-hidden">
                {work.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-500 truncate">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {work.description}
          </p>

          {/* Creativity Point Box */}
          {work.creativity && (
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>창의 포인트 & AI 활용</span>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed line-clamp-2">
                {work.creativity}
              </p>
            </div>
          )}

          {/* Teacher Review Feedback */}
          {work.teacherComment && (
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-start gap-2">
              <MessageSquareQuote className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 italic line-clamp-2">
                "{work.teacherComment}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 mt-2 flex items-center gap-2">
        <button
          onClick={handleRun}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>작품 실행하기</span>
        </button>

        <button
          onClick={handleDirectLink}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          title="새 탭에서 열기"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          onClick={handleLike}
          className={`flex items-center gap-1 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-50 text-rose-600 border-rose-300'
              : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-200'
          }`}
          title={isLiked ? '이미 좋아요를 눌렀습니다' : '작품 응원하기'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
          <span>{work.likes || 0}</span>
        </button>
      </div>
    </article>
  );
};
