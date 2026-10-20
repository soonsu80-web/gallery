export type WorkCategory = 
  | 'all'
  | 'ai'
  | 'school'
  | 'utility'
  | 'game'
  | 'quiz'
  | 'science'
  | 'other';

export type WorkStatus = 'approved' | 'pending' | 'rejected';

export interface WebAppWork {
  id: string;
  title: string;
  studentName: string;
  studentId?: string; // 학번 e.g. "20412"
  grade: number; // 1, 2, 3
  className?: string; // e.g. "4반"
  url: string;
  description: string;
  creativity?: string; // 창의 포인트 및 AI 프롬프트 활용 내용
  category: WorkCategory;
  tags: string[];
  emoji: string;
  hue: number;
  likes: number;
  views: number;
  createdAt: string;
  status: WorkStatus;
  featured?: boolean;
  teacherComment?: string;
  googleFormSubmission?: boolean;
}

export interface GalleryStats {
  totalApproved: number;
  totalPending: number;
  totalLikes: number;
  totalViews: number;
  totalStudents: number;
  lastUpdatedAt: string;
}

export interface TeacherConfig {
  teacherPin: string;
  googleFormUrl: string;
  appsScriptUrl: string;
  schoolName: string;
  eventName: string;
}
