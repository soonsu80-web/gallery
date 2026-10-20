import { WebAppWork, WorkCategory } from '../types/gallery';

export function pickCategory(title: string, description: string): WorkCategory {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('게임') || text.includes('플레이') || text.includes('축구') || text.includes('체육') || text.includes('토너먼트')) {
    return 'game';
  }
  if (text.includes('퀴즈') || text.includes('단어') || text.includes('공부') || text.includes('시험') || text.includes('문제')) {
    return 'quiz';
  }
  if (text.includes('급식') || text.includes('학교') || text.includes('캠퍼스') || text.includes('교실') || text.includes('인천남고') || text.includes('도장')) {
    return 'school';
  }
  if (text.includes('화학') || text.includes('물리') || text.includes('과학') || text.includes('실험') || text.includes('수학') || text.includes('계산')) {
    return 'science';
  }
  if (text.includes('ai') || text.includes('인공지능') || text.includes('모델') || text.includes('챗봇') || text.includes('추천') || text.includes('생성형')) {
    return 'ai';
  }
  if (text.includes('도구') || text.includes('플래너') || text.includes('타이머') || text.includes('유틸') || text.includes('계산기') || text.includes('도서관')) {
    return 'utility';
  }
  return 'other';
}

export function pickEmoji(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('급식') || t.includes('음식') || t.includes('식단') || t.includes('맛집')) return '🍱';
  if (t.includes('게임') || t.includes('플레이') || t.includes('아케이드')) return '🎮';
  if (t.includes('축구') || t.includes('체육') || t.includes('운동')) return '⚽';
  if (t.includes('농구')) return '🏀';
  if (t.includes('퀴즈') || t.includes('스피드') || t.includes('정답')) return '🎯';
  if (t.includes('화학') || t.includes('물리') || t.includes('실험') || t.includes('과학')) return '🧪';
  if (t.includes('3d') || t.includes('가상') || t.includes('메타')) return '🌐';
  if (t.includes('학교') || t.includes('교실') || t.includes('캠퍼스') || t.includes('남고')) return '🏫';
  if (t.includes('책') || t.includes('도서관') || t.includes('독서')) return '📚';
  if (t.includes('시간') || t.includes('타이머') || t.includes('플래너') || t.includes('시계')) return '⏱️';
  if (t.includes('ai') || t.includes('인공지능') || t.includes('로봇')) return '🤖';
  if (t.includes('지도') || t.includes('길찾기') || t.includes('내비')) return '🗺️';
  if (t.includes('진로') || t.includes('탐색') || t.includes('적성')) return '🧭';
  if (t.includes('음악') || t.includes('노래') || t.includes('악기')) return '🎵';
  if (t.includes('그림') || t.includes('아트') || t.includes('디자인')) return '🎨';
  if (t.includes('영어') || t.includes('단어') || t.includes('언어')) return '🔤';
  if (t.includes('계산') || t.includes('수학') || t.includes('알고리즘')) return '🧮';
  return '💻';
}

export function getCategoryLabel(category: WorkCategory): string {
  switch (category) {
    case 'all': return '전체';
    case 'ai': return 'AI · 인공지능';
    case 'school': return '학교생활 · 편의';
    case 'quiz': return '학습 · 퀴즈';
    case 'game': return '게임 · 스포츠';
    case 'science': return '융합과학 · 시뮬레이션';
    case 'utility': return '유틸리티 · 도구';
    case 'other': return '웹 서비스 · 기타';
  }
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Parses CSV or tab-separated text copied directly from Google Sheets
 * Columns usually exported from Google Forms:
 * 타임스탬프 | 학번 | 이름 | 작품명 | 웹앱 주소 | 작품 소개 | 창의 포인트 / 사용 AI 도구
 */
export function parseGoogleSheetsImport(text: string): Partial<WebAppWork>[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const parsedItems: Partial<WebAppWork>[] = [];

  // Detect header row
  let startIndex = 0;
  const firstLine = lines[0].toLowerCase();
  if (
    firstLine.includes('타임스탬프') ||
    firstLine.includes('timestamp') ||
    firstLine.includes('제출자') ||
    firstLine.includes('카테고리') ||
    firstLine.includes('작품명') ||
    firstLine.includes('url')
  ) {
    startIndex = 1;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (rawCols.length < 3) continue;

    let studentName = '';
    let studentId = '';
    let grade = 1;
    let className = '';
    let category: WorkCategory = 'other';
    let title = '';
    let description = '';
    let url = '';
    let status: 'approved' | 'pending' = 'pending';

    // Check if matching exact Google Form response columns:
    // [0]: 타임스탬프
    // [1]: 제출자 정보 (예: 1학년 5반 13번 변제영)
    // [2]: 작품 카테고리 (Game, Web App, Quiz, 기타)
    // [3]: 작품명
    // [4]: 작품 한 줄 소개
    // [5]: 작품 배포 URL
    // [6]: 저작권 확인
    // [7]: (선생님 추가 열) 승인 여부 (1, 0, 승인)
    if (rawCols.length >= 6) {
      // 1. 제출자 정보 파싱
      const studentRaw = rawCols[1] || '';
      const gradeMatch = studentRaw.match(/([1-3])\s*학년/);
      const classMatch = studentRaw.match(/([0-9]{1,2})\s*반/);
      const numMatch = studentRaw.match(/([0-9]{1,2})\s*번/);
      const fiveDigitMatch = studentRaw.match(/\b([1-3])([0-9]{2})([0-9]{2})\b/);

      if (gradeMatch) grade = parseInt(gradeMatch[1], 10);
      if (classMatch) className = `${classMatch[1]}반`;
      if (fiveDigitMatch) {
        grade = parseInt(fiveDigitMatch[1], 10);
        className = `${parseInt(fiveDigitMatch[2], 10)}반`;
        studentId = fiveDigitMatch[0];
      } else if (gradeMatch && classMatch && numMatch) {
        studentId = `${gradeMatch[1]}${classMatch[1].padStart(2, '0')}${numMatch[1].padStart(2, '0')}`;
      }

      // Name extraction
      let cleanedName = studentRaw
        .replace(/([1-3])\s*학년/, '')
        .replace(/([0-9]{1,2})\s*반/, '')
        .replace(/([0-9]{1,2})\s*번/, '')
        .replace(/\b[1-3][0-9]{4}\b/, '')
        .trim();
      studentName = cleanedName || '인천남고 학생';

      // 2. 카테고리
      const catRaw = (rawCols[2] || '').toLowerCase();
      if (catRaw.includes('game') || catRaw.includes('게임')) category = 'game';
      else if (catRaw.includes('quiz') || catRaw.includes('퀴즈')) category = 'quiz';
      else if (catRaw.includes('web app') || catRaw.includes('웹앱')) category = 'utility';
      else category = pickCategory(rawCols[3] || '', rawCols[4] || '');

      // 3. 작품명
      title = rawCols[3] || '제목 없음';

      // 4. 소개
      description = rawCols[4] || '';

      // 5. URL
      url = sanitizeUrl(rawCols[5] || '');

      // 6. 승인 상태 (Col 7이 '1' 또는 '승인'이면 바로 승인)
      if (rawCols.length >= 8) {
        const approvalCol = rawCols[7].trim().toLowerCase();
        if (approvalCol === '1' || approvalCol === '승인' || approvalCol === 'true') {
          status = 'approved';
        }
      }
    } else {
      // Fallback for custom formatted rows
      const urlIdx = rawCols.findIndex(c => c.startsWith('http://') || c.startsWith('https://') || c.includes('.com') || c.includes('.io') || c.includes('.app') || c.includes('.dev') || c.includes('.sh'));
      if (urlIdx !== -1) {
        url = sanitizeUrl(rawCols[urlIdx]);
      }
      studentName = rawCols[1] || '인천남고 학생';
      title = rawCols[2] || rawCols[0] || '학생 작품';
      description = rawCols[3] || '';
      category = pickCategory(title, description);
    }

    if (!url || !title) continue;

    parsedItems.push({
      title,
      studentName,
      studentId: studentId || undefined,
      grade: [1, 2, 3].includes(grade) ? grade : 1,
      className: className || undefined,
      url,
      description: description || '인천남고 학생이 개발한 웹앱입니다.',
      creativity: category === 'game' ? '오락성과 인터랙티브 게임 알고리즘 적용' : '실생활 편의 및 학생 맞춤형 기능 구현',
      category,
      tags: ['인천남고', '시민개발자', category],
      emoji: pickEmoji(`${title} ${description}`),
      hue: Math.floor(Math.random() * 360),
      likes: 0,
      views: 0,
      status,
      googleFormSubmission: true,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  return parsedItems;
}
