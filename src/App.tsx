import React, { useState, useMemo } from 'react';
import { GalleryProvider, useGallery } from './context/GalleryContext';
import { Header } from './components/Header';
import { HeroStats } from './components/HeroStats';
import { Toolbar } from './components/Toolbar';
import { WorkCard } from './components/WorkCard';
import { AppRunnerModal } from './components/AppRunnerModal';
import { SubmitModal } from './components/SubmitModal';
import { TeacherAdminModal } from './components/TeacherAdminModal';
import { NoticeSection } from './components/NoticeSection';
import { Footer } from './components/Footer';
import { WorkCategory, WebAppWork } from './types/gallery';
import { SearchX, Sparkles, PlusCircle } from 'lucide-react';

function GalleryMain() {
  const {
    approvedWorks,
    selectedWorkForPreview,
    setSelectedWorkForPreview,
  } = useGallery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkCategory>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views' | 'title'>('latest');

  // Modal open states
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);

  // Filtered & Sorted Works
  const filteredWorks = useMemo(() => {
    let result = [...approvedWorks];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((w) => {
        const text = `${w.title} ${w.studentName} ${w.studentId || ''} ${w.description} ${w.creativity || ''} ${(w.tags || []).join(' ')}`.toLowerCase();
        return text.includes(q);
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((w) => w.category === selectedCategory);
    }

    // Filter by grade
    if (selectedGrade !== 'all') {
      result = result.filter((w) => w.grade === selectedGrade);
    }

    // Sort
    result.sort((a, b) => {
      // Put featured works on top if sorting by latest
      if (sortBy === 'latest') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      if (sortBy === 'likes') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '', 'ko');
      }
      return 0;
    });

    return result;
  }, [approvedWorks, searchQuery, selectedCategory, selectedGrade, sortBy]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenTeacher={() => setIsTeacherOpen(true)}
      />

      <main className="flex-1">
        {/* Hero & Statistics */}
        <HeroStats onOpenSubmit={() => setIsSubmitOpen(true)} />

        {/* Toolbar & Filter */}
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGrade={selectedGrade}
          setSelectedGrade={setSelectedGrade}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Gallery Cards Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {filteredWorks.length === 0 ? (
            <div className="py-20 px-4 text-center bg-white/90 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  조건에 일치하는 작품이 없습니다
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  검색어를 변경하거나 다른 카테고리를 선택해 보세요.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedGrade('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  필터 초기화
                </button>
                <button
                  onClick={() => setIsSubmitOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>새 작품 등록하기</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work, index) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  rank={index + 1}
                  onOpenPreview={(targetWork) => setSelectedWorkForPreview(targetWork)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Operating Notice and AI Ethics */}
        <NoticeSection />
      </main>

      {/* Footer */}
      <Footer onOpenTeacher={() => setIsTeacherOpen(true)} />

      {/* Modals */}
      {selectedWorkForPreview && (
        <AppRunnerModal
          work={selectedWorkForPreview}
          onClose={() => setSelectedWorkForPreview(null)}
        />
      )}

      {isSubmitOpen && (
        <SubmitModal onClose={() => setIsSubmitOpen(false)} />
      )}

      {isTeacherOpen && (
        <TeacherAdminModal
          onClose={() => setIsTeacherOpen(false)}
          onOpenPreview={(work) => {
            setSelectedWorkForPreview(work);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GalleryProvider>
      <GalleryMain />
    </GalleryProvider>
  );
}
