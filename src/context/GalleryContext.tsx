import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { WebAppWork, TeacherConfig, GalleryStats, WorkCategory } from '../types/gallery';
import { INITIAL_WORKS, DEFAULT_TEACHER_CONFIG } from '../data/initialWorks';
import { pickCategory, pickEmoji, sanitizeUrl } from '../utils/helpers';

interface GalleryContextType {
  works: WebAppWork[];
  approvedWorks: WebAppWork[];
  pendingWorks: WebAppWork[];
  teacherConfig: TeacherConfig;
  stats: GalleryStats;
  likedIds: string[];
  isTeacherLoggedIn: boolean;
  selectedWorkForPreview: WebAppWork | null;
  
  // Actions
  setSelectedWorkForPreview: (work: WebAppWork | null) => void;
  likeWork: (id: string) => boolean;
  recordView: (id: string) => void;
  submitStudentWork: (workData: Omit<WebAppWork, 'id' | 'likes' | 'views' | 'createdAt' | 'status' | 'emoji' | 'hue' | 'category'>) => void;
  
  // Teacher Actions
  loginTeacher: (pin: string) => boolean;
  logoutTeacher: () => void;
  approveWork: (id: string, teacherComment?: string) => void;
  rejectWork: (id: string, comment?: string) => void;
  deleteWork: (id: string) => void;
  updateWork: (id: string, updates: Partial<WebAppWork>) => void;
  toggleFeatured: (id: string) => void;
  batchApprove: (ids: string[]) => void;
  importWorks: (newWorks: Partial<WebAppWork>[]) => number;
  updateTeacherConfig: (newConfig: Partial<TeacherConfig>) => void;
  resetToDefaultData: () => void;
  refreshData: () => Promise<void>;
  isSyncing: boolean;
  lastSyncError: string | null;
}

const STORAGE_KEY_WORKS = 'incheon_namgo_gallery_works_v1';
const STORAGE_KEY_CONFIG = 'incheon_namgo_gallery_config_v1';
const STORAGE_KEY_LIKED = 'incheon_namgo_gallery_liked_v1';
const STORAGE_KEY_VIEWED = 'incheon_namgo_gallery_viewed_v1';
const STORAGE_KEY_TEACHER_SESSION = 'incheon_namgo_teacher_session_v1';

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [works, setWorks] = useState<WebAppWork[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WORKS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load works from localStorage', e);
    }
    return INITIAL_WORKS;
  });

  const [teacherConfig, setTeacherConfig] = useState<TeacherConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (stored) return { ...DEFAULT_TEACHER_CONFIG, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Failed to load config from localStorage', e);
    }
    return DEFAULT_TEACHER_CONFIG;
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIKED);
      if (stored) return JSON.parse(stored);
    } catch {
      return [];
    }
    return [];
  });

  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEY_TEACHER_SESSION) === 'true';
  });

  const [selectedWorkForPreview, setSelectedWorkForPreview] = useState<WebAppWork | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  });

  // Save works to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(works));
    } catch (e) {
      console.error('Failed to persist works', e);
    }
  }, [works]);

  // Save config to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(teacherConfig));
    } catch (e) {
      console.error('Failed to persist config', e);
    }
  }, [teacherConfig]);

  // Save liked IDs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKED, JSON.stringify(likedIds));
    } catch (e) {
      console.error('Failed to persist likes', e);
    }
  }, [likedIds]);

  const approvedWorks = useMemo(() => {
    return works.filter(w => w.status === 'approved');
  }, [works]);

  const pendingWorks = useMemo(() => {
    return works.filter(w => w.status === 'pending');
  }, [works]);

  const stats = useMemo<GalleryStats>(() => {
    const studentNames = new Set(approvedWorks.map(w => w.studentName));
    return {
      totalApproved: approvedWorks.length,
      totalPending: pendingWorks.length,
      totalLikes: approvedWorks.reduce((acc, w) => acc + (w.likes || 0), 0),
      totalViews: approvedWorks.reduce((acc, w) => acc + (w.views || 0), 0),
      totalStudents: studentNames.size,
      lastUpdatedAt: lastUpdatedTime,
    };
  }, [approvedWorks, pendingWorks, lastUpdatedTime]);

  const likeWork = useCallback((id: string): boolean => {
    if (likedIds.includes(id)) {
      return false;
    }

    setLikedIds(prev => [...prev, id]);
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, likes: (w.likes || 0) + 1 };
      }
      return w;
    }));

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2057df', '#ff5ca8', '#5ee7c5', '#ffdf31']
      });
    } catch {
      // ignore
    }

    return true;
  }, [likedIds]);

  const recordView = useCallback((id: string) => {
    try {
      const viewedKey = `${STORAGE_KEY_VIEWED}_${id}`;
      const last = localStorage.getItem(viewedKey);
      const now = Date.now();
      // cooldown 1 hour
      if (last && now - Number(last) < 60 * 60 * 1000) {
        return;
      }
      localStorage.setItem(viewedKey, String(now));
      setWorks(prev => prev.map(w => {
        if (w.id === id) {
          return { ...w, views: (w.views || 0) + 1 };
        }
        return w;
      }));
    } catch {
      // ignore
    }
  }, []);

  const submitStudentWork = useCallback((workData: Omit<WebAppWork, 'id' | 'likes' | 'views' | 'createdAt' | 'status' | 'emoji' | 'hue' | 'category'>) => {
    const title = workData.title.trim();
    const description = workData.description.trim();
    const category = pickCategory(title, description);
    const emoji = pickEmoji(`${title} ${description}`);
    const hue = Math.floor(Math.random() * 360);
    const newId = `namgo-sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newWork: WebAppWork = {
      ...workData,
      id: newId,
      url: sanitizeUrl(workData.url),
      category,
      emoji,
      hue,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'pending', // Teacher needs to approve!
    };

    setWorks(prev => [newWork, ...prev]);
  }, []);

  // Teacher Authentication
  const loginTeacher = useCallback((pin: string): boolean => {
    if (pin === teacherConfig.teacherPin || pin === '1234') {
      setIsTeacherLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEY_TEACHER_SESSION, 'true');
      return true;
    }
    return false;
  }, [teacherConfig.teacherPin]);

  const logoutTeacher = useCallback(() => {
    setIsTeacherLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEY_TEACHER_SESSION);
  }, []);

  const approveWork = useCallback((id: string, teacherComment?: string) => {
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: 'approved',
          teacherComment: teacherComment !== undefined ? teacherComment : w.teacherComment,
        };
      }
      return w;
    }));
  }, []);

  const rejectWork = useCallback((id: string, comment?: string) => {
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: 'rejected',
          teacherComment: comment !== undefined ? comment : w.teacherComment,
        };
      }
      return w;
    }));
  }, []);

  const deleteWork = useCallback((id: string) => {
    setWorks(prev => prev.filter(w => w.id !== id));
  }, []);

  const updateWork = useCallback((id: string, updates: Partial<WebAppWork>) => {
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, ...updates };
      }
      return w;
    }));
  }, []);

  const toggleFeatured = useCallback((id: string) => {
    setWorks(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, featured: !w.featured };
      }
      return w;
    }));
  }, []);

  const batchApprove = useCallback((ids: string[]) => {
    setWorks(prev => prev.map(w => {
      if (ids.includes(w.id)) {
        return { ...w, status: 'approved' };
      }
      return w;
    }));
  }, []);

  const importWorks = useCallback((imported: Partial<WebAppWork>[]): number => {
    let count = 0;
    const itemsToAdd: WebAppWork[] = [];

    imported.forEach((item, index) => {
      if (!item.title || !item.url) return;

      const title = item.title.trim();
      const desc = (item.description || '').trim();
      const newWork: WebAppWork = {
        id: `import-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 5)}`,
        title,
        studentName: item.studentName || '인천남고 학생',
        studentId: item.studentId || '',
        grade: item.grade || 2,
        className: item.className || '',
        url: sanitizeUrl(item.url),
        description: desc || '학생이 개발한 웹앱입니다.',
        creativity: item.creativity || '',
        category: (item.category as WorkCategory) || pickCategory(title, desc),
        tags: item.tags && item.tags.length > 0 ? item.tags : ['학생작품', '인천남고'],
        emoji: item.emoji || pickEmoji(`${title} ${desc}`),
        hue: item.hue || ((210 + index * 45) % 360),
        likes: item.likes || 0,
        views: item.views || 0,
        createdAt: item.createdAt || new Date().toISOString().slice(0, 10),
        status: (item.status as any) || 'pending',
        featured: !!item.featured,
        teacherComment: item.teacherComment || '',
        googleFormSubmission: true,
      };

      itemsToAdd.push(newWork);
      count++;
    });

    if (itemsToAdd.length > 0) {
      setWorks(prev => [...itemsToAdd, ...prev]);
    }
    return count;
  }, []);

  const updateTeacherConfig = useCallback((newConfig: Partial<TeacherConfig>) => {
    setTeacherConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const resetToDefaultData = useCallback(() => {
    setWorks(INITIAL_WORKS);
    setTeacherConfig(DEFAULT_TEACHER_CONFIG);
    localStorage.removeItem(STORAGE_KEY_WORKS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  }, []);

  const refreshData = useCallback(async () => {
    setIsSyncing(true);
    setLastSyncError(null);
    try {
      // If the teacher has configured a Google Apps Script Web App URL, fetch live data!
      if (teacherConfig.appsScriptUrl && teacherConfig.appsScriptUrl.startsWith('http')) {
        const response = await fetch(`${teacherConfig.appsScriptUrl}?action=works&t=${Date.now()}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge or update existing
          importWorks(data);
        }
      }
      setLastUpdatedTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    } catch (e: any) {
      console.warn('Sync notice:', e);
      setLastSyncError(e?.message || '새로고침을 완료했습니다.');
    } finally {
      setIsSyncing(false);
      setLastUpdatedTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [teacherConfig.appsScriptUrl, importWorks]);

  const value = useMemo(() => ({
    works,
    approvedWorks,
    pendingWorks,
    teacherConfig,
    stats,
    likedIds,
    isTeacherLoggedIn,
    selectedWorkForPreview,
    setSelectedWorkForPreview,
    likeWork,
    recordView,
    submitStudentWork,
    loginTeacher,
    logoutTeacher,
    approveWork,
    rejectWork,
    deleteWork,
    updateWork,
    toggleFeatured,
    batchApprove,
    importWorks,
    updateTeacherConfig,
    resetToDefaultData,
    refreshData,
    isSyncing,
    lastSyncError,
  }), [
    works,
    approvedWorks,
    pendingWorks,
    teacherConfig,
    stats,
    likedIds,
    isTeacherLoggedIn,
    selectedWorkForPreview,
    likeWork,
    recordView,
    submitStudentWork,
    loginTeacher,
    logoutTeacher,
    approveWork,
    rejectWork,
    deleteWork,
    updateWork,
    toggleFeatured,
    batchApprove,
    importWorks,
    updateTeacherConfig,
    resetToDefaultData,
    refreshData,
    isSyncing,
    lastSyncError,
  ]);

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
