import React from 'react';
import { Search, RotateCw, X, Filter } from 'lucide-react';
import { WorkCategory } from '../types/gallery';
import { useGallery } from '../context/GalleryContext';

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: WorkCategory;
  setSelectedCategory: (cat: WorkCategory) => void;
  selectedGrade: number | 'all';
  setSelectedGrade: (g: number | 'all') => void;
  sortBy: 'latest' | 'likes' | 'views' | 'title';
  setSortBy: (s: 'latest' | 'likes' | 'views' | 'title') => void;
}

const CATEGORIES: { id: WorkCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'ai', label: '🤖 AI·인공지능' },
  { id: 'school', label: '🏫 학교생활·편의' },
  { id: 'quiz', label: '🎯 학습·퀴즈' },
  { id: 'game', label: '🎮 게임·스포츠' },
  { id: 'science', label: '🧪 융합과학' },
  { id: 'utility', label: '⚡ 유틸리티' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedGrade,
  setSelectedGrade,
  sortBy,
  setSortBy,
}) => {
  const { refreshData, isSyncing } = useGallery();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 space-y-3.5">
      {/* Top Search & Sort Row */}
      <div className="bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="작품명, 제작 학생 이름, 학번, 내용 검색..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none text-sm text-slate-800 placeholder-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedGrade(1)}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 1
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              1학년
            </button>
            <button
              onClick={() => setSelectedGrade(2)}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 2
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              2학년
            </button>
            <button
              onClick={() => setSelectedGrade(3)}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedGrade === 3
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              3학년
            </button>
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="latest">최신 등록순</option>
            <option value="likes">좋아요 인기순</option>
            <option value="views">조회수순</option>
            <option value="title">작품명 가나다순</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => refreshData()}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
            title="새로고침 (승인 자료 갱신)"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">새로고침</span>
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
};
