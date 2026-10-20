import React, { useState } from 'react';
import { X, Send, Sparkles, FileText, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useGallery } from '../context/GalleryContext';

interface SubmitModalProps {
  onClose: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({ onClose }) => {
  const { submitStudentWork, teacherConfig } = useGallery();
  const [activeTab, setActiveTab] = useState<'google' | 'direct'>('google');

  // Direct form states
  const [grade, setGrade] = useState<number>(1);
  const [className, setClassName] = useState<string>('5반');
  const [studentNumber, setStudentNumber] = useState<string>('13번');
  const [studentName, setStudentName] = useState<string>('');
  const [category, setCategory] = useState<string>('Game');
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [copyrightChecked, setCopyrightChecked] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentName.trim()) {
      setError('제작자 학생 이름을 입력해 주세요.');
      return;
    }
    if (!title.trim()) {
      setError('작품명을 입력해 주세요.');
      return;
    }
    if (!url.trim()) {
      setError('작품 배포 URL을 입력해 주세요.');
      return;
    }
    if (!copyrightChecked) {
      setError('저작권 및 유의사항 확인에 동의해 주세요.');
      return;
    }

    const fullClassName = `${className.replace(/반$/, '')}반 ${studentNumber.replace(/번$/, '')}번`;
    const studentInfoText = `${grade}학년 ${fullClassName} ${studentName.trim()}`;

    submitStudentWork({
      title: title.trim(),
      studentName: studentName.trim(),
      studentId: `${grade}${className.replace(/[^0-9]/g, '').padStart(2, '0')}${studentNumber.replace(/[^0-9]/g, '').padStart(2, '0')}`,
      grade,
      className: fullClassName,
      url: url.trim(),
      description: description.trim() || '학생이 개발한 웹앱입니다.',
      creativity: `[${category}] ${studentInfoText} 학생 작품`,
      tags: ['인천남고', '시민개발자', category],
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">인천남고 시민개발자 코딩 페스타 작품 제출</h3>
              <p className="text-xs text-blue-100">구글 설문지 제출 및 갤러리 승인 등록</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 공식 구글 설문지로 제출 (권장)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'direct'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ✍️ 웹에서 간편 직접 제출
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  작품 신청이 완료되었습니다!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  담당 선생님의 안전성 및 저작권 승인 검토 후 인천남고 시민개발자 갤러리에 자동으로 공개됩니다.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setTitle('');
                    setUrl('');
                    setDescription('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  다른 작품 추가 등록
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  갤러리로 돌아가기
                </button>
              </div>
            </div>
          ) : activeTab === 'google' ? (
            <div className="py-2 space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>인천남고 시민개발자 코딩 페스타 작품 제출 폼</span>
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  선생님께서 개설하신 공식 구글 설문지에 접속하여 학번, 이름, 작품명, 배포 URL을 입력해 주세요.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">📋 설문지 작성 항목 안내</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-700">1. 제출자 정보:</span> 반, 번호, 이름 (예: 1학년 5반 13번 변제영)
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-700">2. 카테고리:</span> Game, Web App, Quiz, 기타
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-700">3. 작품명:</span> 예: 오이게임
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-blue-700">4. 한 줄 소개:</span> 갤러리 카드에 표시될 작품 설명
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 sm:col-span-2">
                    <span className="font-bold text-blue-700">5. 작품 배포 URL:</span> Netlify, GitHub Pages, Vercel, Surge 등
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={teacherConfig.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <span>공식 구글 설문지 바로가기 (새 창 열기)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Student info */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  제출자 정보 <span className="text-rose-500">*</span>
                  <span className="text-[11px] font-normal text-slate-500 ml-1">(예: 1학년 5반 13번 변제영)</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-medium"
                    >
                      <option value={1}>1학년</option>
                      <option value={2}>2학년</option>
                      <option value={3}>3학년</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="예: 5반"
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="예: 13번"
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="이름 (변제영)"
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-semibold text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  작품 카테고리 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Game', 'Web App', 'Quiz', '기타'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        category === cat
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  작품명 <span className="text-rose-500">*</span>
                  <span className="text-[11px] font-normal text-slate-500 ml-1">(예: 오이게임)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="작품의 제목을 입력해 주세요"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  작품 한 줄 소개 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="갤러리 카드에 표시될 작품 설명을 작성해 주세요."
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  작품 배포 URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... (Netlify, GitHub Pages, Vercel, Surge 등)"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs sm:text-sm font-mono text-blue-700"
                  required
                />
              </div>

              {/* Copyright Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={copyrightChecked}
                    onChange={(e) => setCopyrightChecked(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>
                    <strong className="text-rose-600">[필수]</strong> 본인이 직접 만든 이미지, AI 생성 이미지, 저작권 무료 이미지만 사용했음을 확인합니다.
                  </span>
                </label>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-tight">
                💡 제출된 작품은 담당 선생님의 승인 후 갤러리에 정식으로 노출됩니다.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>등록 신청하기</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
