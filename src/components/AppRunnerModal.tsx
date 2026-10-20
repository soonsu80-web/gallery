import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  RotateCw,
  Copy,
  Check,
  Smartphone,
  Monitor,
  QrCode,
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { WebAppWork } from '../types/gallery';
import { useGallery } from '../context/GalleryContext';

interface AppRunnerModalProps {
  work: WebAppWork;
  onClose: () => void;
}

export const AppRunnerModal: React.FC<AppRunnerModalProps> = ({ work, onClose }) => {
  const { likeWork, likedIds } = useGallery();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'qr'>('desktop');
  const [iframeKey, setIframeKey] = useState(1);
  const [copied, setCopied] = useState(false);
  const isLiked = likedIds.includes(work.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(work.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(work.url)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Top Control Bar */}
        <div className="bg-slate-850 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* App Info */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl">{work.emoji || '💻'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {work.title}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  교사 승인 완료
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                제작자: <span className="text-slate-200 font-semibold">{work.grade}학년 {work.className || ''} {work.studentName}</span>
                {work.studentId && ` (${work.studentId})`}
              </p>
            </div>
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PC 화면</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">스마트폰 뷰</span>
            </button>
            <button
              onClick={() => setViewMode('qr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'qr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">모바일 QR</span>
            </button>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => likeWork(work.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700'
              }`}
              title="좋아요 응원하기"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{work.likes || 0}</span>
            </button>

            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="새로고침"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="웹앱 주소 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              title="새 창에서 전체화면으로 실행"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">새 창 열기</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer ml-1"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-3">
          {viewMode === 'desktop' && (
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner relative flex flex-col">
              <iframe
                key={iframeKey}
                src={work.url}
                title={work.title}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          )}

          {viewMode === 'mobile' && (
            <div className="h-[95%] w-[380px] max-w-full bg-slate-900 rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl flex flex-col items-center relative">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-5 bg-slate-800 rounded-b-xl mb-1 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-600 rounded-full" />
              </div>
              <div className="w-full flex-1 bg-white rounded-[32px] overflow-hidden shadow-inner">
                <iframe
                  key={iframeKey}
                  src={work.url}
                  title={work.title}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
              <div className="w-32 h-1 bg-slate-700 rounded-full mt-2" />
            </div>
          )}

          {viewMode === 'qr' && (
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">
                  내 스마트폰으로 즉시 실행하기
                </h4>
                <p className="text-xs text-slate-400">
                  스마트폰 기본 카메라 또는 QR 스캐너로 아래 코드를 스캔하세요.
                </p>
              </div>

              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
                <img
                  src={qrUrl}
                  alt={`QR Code for ${work.title}`}
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 break-all font-mono">
                {work.url}
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사 완료' : '주소 복사'}</span>
                </button>
                <button
                  onClick={() => setViewMode('desktop')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  화면으로 돌아가기
                </button>
              </div>
            </div>
          )}

          {/* Fallback Warning Notice */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-center pointer-events-none">
            <div className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] text-slate-300 backdrop-blur-md shadow-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>화면이 하얗게 나오거나 차단되는 경우 외부 보안 정책 때문일 수 있습니다.</span>
              <a
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-400 hover:underline flex items-center gap-0.5 ml-1"
              >
                <span>[새 창에서 열기]</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
