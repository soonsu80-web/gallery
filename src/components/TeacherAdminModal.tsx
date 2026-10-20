import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Star,
  Trash2,
  Edit3,
  ExternalLink,
  Save,
  Download,
  Upload,
  RefreshCw,
  KeyRound,
  FileSpreadsheet,
  Link,
  Code2,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';
import { WebAppWork } from '../types/gallery';
import { useGallery } from '../context/GalleryContext';
import { parseGoogleSheetsImport } from '../utils/helpers';

interface TeacherAdminModalProps {
  onClose: () => void;
  onOpenPreview: (work: WebAppWork) => void;
}

export const TeacherAdminModal: React.FC<TeacherAdminModalProps> = ({
  onClose,
  onOpenPreview,
}) => {
  const {
    works,
    pendingWorks,
    approvedWorks,
    teacherConfig,
    isTeacherLoggedIn,
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
  } = useGallery();

  // Login states
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab states
  const [currentTab, setCurrentTab] = useState<'pending' | 'approved' | 'sync' | 'settings'>('pending');

  // Approve dialog state
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [teacherComment, setTeacherComment] = useState('');

  // Editing work state
  const [editingWork, setEditingWork] = useState<WebAppWork | null>(null);

  // CSV / Spreadsheet Paste state
  const [pasteData, setPasteData] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form config editing states
  const [formUrlInput, setFormUrlInput] = useState(teacherConfig.googleFormUrl || '');
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(teacherConfig.appsScriptUrl || '');
  const [newPinInput, setNewPinInput] = useState(teacherConfig.teacherPin || '1234');
  const [configSaved, setConfigSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginTeacher(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleApproveConfirm = (id: string) => {
    approveWork(id, teacherComment.trim() || undefined);
    setApprovingId(null);
    setTeacherComment('');
  };

  const handleBatchApproveAll = () => {
    if (confirm(`대기 중인 ${pendingWorks.length}개의 작품을 모두 승인하시겠습니까?`)) {
      batchApprove(pendingWorks.map(w => w.id));
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork) return;
    updateWork(editingWork.id, editingWork);
    setEditingWork(null);
  };

  const handleImportSpreadsheet = () => {
    if (!pasteData.trim()) return;
    try {
      const parsed = parseGoogleSheetsImport(pasteData);
      if (parsed.length === 0) {
        setImportStatus('유효한 데이터 열을 찾을 수 없습니다. 타임스탬프, 이름, 작품명, URL 열을 확인해 주세요.');
        return;
      }
      const count = importWorks(parsed);
      setImportStatus(`성공적으로 ${count}개의 학생 작품을 불러왔습니다! [승인 대기 목록]에서 확인하세요.`);
      setPasteData('');
      setCurrentTab('pending');
    } catch (err: any) {
      setImportStatus(`가져오기 실패: ${err?.message || '형식을 확인해 주세요'}`);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateTeacherConfig({
      googleFormUrl: formUrlInput.trim(),
      appsScriptUrl: appsScriptUrlInput.trim(),
      teacherPin: newPinInput.trim() || '1234',
    });
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const sampleAppsScriptCode = `/**
 * 인천남고 시민개발자 코딩 페스타 - Google Apps Script 연동 스크립트
 * [설문지: https://docs.google.com/forms/d/e/1FAIpQLSeKFOtxbJdeoq6LtOs2dy4uhMwwN_IJuTjgGXc3rqwRxvpX3g/viewform]
 *
 * 사용 방법:
 * 1. 설문지 응답 구글 스프레드시트의 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 아래 코드를 그대로 붙여넣습니다.
 * 3. 스프레드시트 H열(8번째 열) 헤더에 "승인여부" 라고 적고, 승인할 작품에 숫자 1 또는 "승인"을 적으세요!
 * 4. 오른쪽 위 [배포] -> [새 배포] -> 유형 [웹 앱] 선택
 * 5. 액세스 권한(Who has access): '모든 사용자(Anyone)' 선택 후 [배포] 클릭
 * 6. 생성된 '웹 앱 URL'을 갤러리 교사 관리창 [환경설정]에 등록하면 실시간 연동됩니다.
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "works";
  var callback = e && e.parameter && e.parameter.callback;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var results = [];
  // 0번째 행은 헤더이므로 i=1부터 시작
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var timestamp = row[0];
    var studentRaw = String(row[1] || ""); // 예: 1학년 5반 13번 변제영
    var categoryRaw = String(row[2] || "Web App"); // Game, Web App, Quiz, 기타
    var title = String(row[3] || ""); // 작품명
    var description = String(row[4] || ""); // 한 줄 소개
    var url = String(row[5] || ""); // 배포 URL
    var copyrightCheck = row[6];
    
    // H열 [7]: 선생님 승인 여부 (1, "1", "승인")
    var isApproved = row[7] === 1 || row[7] === "1" || row[7] === "승인" || row[7] === true;
    var teacherComment = String(row[8] || ""); // I열 [8]: 교사 한마디(선택)
    
    if (!title || !url) continue;

    // 학년, 반, 번호 파싱
    var grade = 1;
    var gMatch = studentRaw.match(/([1-3])\s*학년/);
    if (gMatch) grade = parseInt(gMatch[1]);
    
    var cat = "other";
    var cLower = categoryRaw.toLowerCase();
    if (cLower.includes("game")) cat = "game";
    else if (cLower.includes("quiz")) cat = "quiz";
    else if (cLower.includes("web app")) cat = "utility";

    if (action === "all" || isApproved) {
      results.push({
        id: "namgo-sheet-" + i,
        studentName: studentRaw,
        grade: grade,
        category: cat,
        title: title,
        description: description,
        url: url,
        status: isApproved ? "approved" : "pending",
        teacherComment: teacherComment,
        createdAt: timestamp ? Utilities.formatDate(new Date(timestamp), "Asia/Seoul", "yyyy-MM-dd") : ""
      });
    }
  }
  
  var json = JSON.stringify(results);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(sampleAppsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // If not logged in, show Teacher PIN entry
  if (!isTeacherLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              인천남고 교사 관리자
            </h3>
            <p className="text-xs text-slate-500">
              학생 설문 제출 검토 및 갤러리 승인 센터
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="교사 비밀번호 입력"
                maxLength={10}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border text-center text-sm font-bold tracking-widest focus:outline-none transition-colors ${
                  pinError
                    ? 'border-rose-500 bg-rose-50/50 text-rose-700'
                    : 'border-slate-200 focus:border-indigo-600'
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-600 font-semibold animate-shake">
                비밀번호가 올바르지 않습니다.
              </p>
            )}

            <div className="p-2.5 rounded-xl bg-blue-50 text-[11px] text-blue-800 font-medium">
              💡 초기 기본 비밀번호는 <strong className="font-extrabold text-blue-900 underline">1234</strong> 입니다.
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">인천남고 교사 승인 및 관리 센터</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  교사인증됨
                </span>
              </div>
              <p className="text-xs text-slate-400">설문조사로 제출된 웹앱을 검토하고 갤러리 공개를 승인합니다</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => logoutTeacher()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              로그아웃
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('pending')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'pending'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>승인 대기 목록</span>
            {pendingWorks.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {pendingWorks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('approved')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'approved'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>전시 중인 작품 관리 ({approvedWorks.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('sync')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'sync'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>구글 설문지/시트 일괄 연동</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'settings'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>환경설정 & 데이터 관리</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          {/* TAB 1: PENDING QUEUE */}
          {currentTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    학생 설문 제출 검토 대기 ({pendingWorks.length}건)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    안전성과 작동 여부를 확인한 후 승인하면 갤러리에 즉시 공개됩니다.
                  </p>
                </div>
                {pendingWorks.length > 0 && (
                  <button
                    onClick={handleBatchApproveAll}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>대기 목록 전체 일괄 승인</span>
                  </button>
                )}
              </div>

              {pendingWorks.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-700">대기 중인 제출 작품이 없습니다!</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    학생들이 구글 설문지나 직접 등록으로 웹앱을 접수하면 이곳에 나타납니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingWorks.map((work) => (
                    <div
                      key={work.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl">{work.emoji || '💻'}</span>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            승인 대기
                          </span>
                          <span className="text-xs font-bold text-indigo-700">
                            {work.grade}학년 {work.className || ''} {work.studentName}
                            {work.studentId && ` (${work.studentId})`}
                          </span>
                          <span className="text-[11px] text-slate-400">• 접수일: {work.createdAt}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {work.title}
                        </h4>

                        <div className="text-xs text-slate-600 line-clamp-2">
                          {work.description}
                        </div>

                        {work.creativity && (
                          <div className="text-xs text-amber-800 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                            <strong>창의 포인트:</strong> {work.creativity}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono break-all">
                          <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={work.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {work.url}
                          </a>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="flex items-center gap-1.5 w-full">
                          <button
                            onClick={() => onOpenPreview(work)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>작동 검증</span>
                          </button>

                          <button
                            onClick={() => setApprovingId(work.id)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>승인</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('이 작품을 반려(숨김) 처리하시겠습니까?')) {
                                rejectWork(work.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all cursor-pointer"
                            title="반려"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: APPROVED WORKS MANAGEMENT */}
          {currentTab === 'approved' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    전시 중인 승인 작품 ({approvedWorks.length}건)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    인기작 핀 고정, 작품 정보 수정 또는 비공개 처리를 할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {approvedWorks.map((work) => (
                    <div
                      key={work.id}
                      className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg">{work.emoji || '💻'}</span>
                          <span className="text-xs font-bold text-slate-800">
                            {work.title}
                          </span>
                          {work.featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              ⭐ 추천작
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{work.grade}학년 {work.studentName}</span>
                          <span>•</span>
                          <span>좋아요 {work.likes}</span>
                          <span>•</span>
                          <span>조회 {work.views}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleFeatured(work.id)}
                          className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            work.featured
                              ? 'bg-amber-50 text-amber-600 border-amber-300'
                              : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                          title="인기/추천작 고정"
                        >
                          <Star className={`w-4 h-4 ${work.featured ? 'fill-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => setEditingWork(work)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="수정"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenPreview(work)}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                          title="실행"
                        >
                          <Play className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`'${work.title}' 작품을 갤러리에서 삭제하시겠습니까?`)) {
                              deleteWork(work.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE FORM / SPREADSHEET SYNC */}
          {currentTab === 'sync' && (
            <div className="space-y-6">
              {/* Box 1: Quick Spreadsheet Copy-Paste Importer */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      구글 스프레드시트 응답 복사/붙여넣기 일괄 등록 (추천)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      구글 설문지에 쌓인 응답 스프레드시트의 셀을 드래그하여 복사(Ctrl+C)한 뒤 아래 상자에 붙여넣기(Ctrl+V)하면 여러 작품이 한 번에 자동 파싱됩니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    스프레드시트 내용 붙여넣기 (CSV 또는 탭 구분 텍스트)
                  </label>
                  <textarea
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    rows={5}
                    placeholder={`예시: 스프레드시트에서 복사한 내용 붙여넣기\n2026-04-20 14:10\t20412 김민재\t인천남고 급식 알리미\thttps://school-meal-demo.pages.dev/\t급식 메뉴와 알레르기 안내\t나이스 API 활용`}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-xs font-mono resize-none"
                  />
                </div>

                {importStatus && (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                    {importStatus}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleImportSpreadsheet}
                    disabled={!pasteData.trim()}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    일괄 데이터 등록하기
                  </button>
                </div>
              </div>

              {/* Box 2: Google Apps Script Template */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        실시간 자동 동기화용 Google Apps Script 코드
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        스프레드시트에서 웹 앱으로 배포하여 갤러리와 실시간 연동할 때 사용하는 공식 스크립트입니다.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={copyAppsScript}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? '복사 완료!' : '스크립트 복사'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-56">
                  <pre>{sampleAppsScriptCode}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & BACKUP */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900">
                  교사 설정 및 구글 설문 폼 주소
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      학생 배포용 구글 설문지 URL
                    </label>
                    <input
                      type="text"
                      value={formUrlInput}
                      onChange={(e) => setFormUrlInput(e.target.value)}
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-mono text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      설문지 주소를 입력하면 상단 배너와 등록 모달에서 학생들이 해당 구글 폼으로 바로 이동합니다.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Google Apps Script Web App 배포 URL (선택)
                    </label>
                    <input
                      type="text"
                      value={appsScriptUrlInput}
                      onChange={(e) => setAppsScriptUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-mono text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      교사 관리자 비밀번호 (PIN) 변경
                    </label>
                    <input
                      type="password"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="기본: 1234"
                      className="w-48 p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 text-xs sm:text-sm font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {configSaved ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> 설정이 저장되었습니다!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>설정 저장하기</span>
                  </button>
                </div>
              </form>

              {/* Data Reset & Danger Zone */}
              <div className="bg-rose-50/50 rounded-3xl p-5 sm:p-6 border border-rose-200/70 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>데이터 복구 및 초기화</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  테스트 중 수정된 모든 데이터를 초기 인천남고 샘플 갤러리 상태로 되돌립니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('정말로 모든 설정을 초기 인천남고 데모 데이터로 복원하시겠습니까?')) {
                      resetToDefaultData();
                      alert('초기 데이터로 복원되었습니다.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                >
                  기본 데모 데이터로 복원
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Dialog Modal */}
      {approvingId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-bold text-slate-900">
              작품 승인 및 칭찬 피드백
            </h4>
            <p className="text-xs text-slate-500">
              승인 시 갤러리에 정식 공개됩니다. 학생에게 전할 선생님의 칭찬 한마디를 적어보세요 (선택).
            </p>
            <textarea
              value={teacherComment}
              onChange={(e) => setTeacherComment(e.target.value)}
              rows={3}
              placeholder="예: 실생활 문제 해결과 창의적인 AI 프롬프트 구성이 매우 뛰어납니다!"
              className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setApprovingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleApproveConfirm(approvingId)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                승인 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Work Modal */}
      {editingWork && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">작품 정보 수정</h4>
              <button onClick={() => setEditingWork(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">작품명</label>
                <input
                  type="text"
                  value={editingWork.title}
                  onChange={(e) => setEditingWork({ ...editingWork, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">제작 학생</label>
                <input
                  type="text"
                  value={editingWork.studentName}
                  onChange={(e) => setEditingWork({ ...editingWork, studentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">웹앱 URL</label>
                <input
                  type="text"
                  value={editingWork.url}
                  onChange={(e) => setEditingWork({ ...editingWork, url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">작품 소개</label>
                <textarea
                  value={editingWork.description}
                  onChange={(e) => setEditingWork({ ...editingWork, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">선생님 칭찬 한마디</label>
                <textarea
                  value={editingWork.teacherComment || ''}
                  onChange={(e) => setEditingWork({ ...editingWork, teacherComment: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWork(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
