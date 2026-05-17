# 나만의 AIm

> 큰 목표를 작게 쪼개고, 작은 실행을 점수로 쌓아주는 AI 목표 실행 파트너

해야 할 일 하나만 입력하면 AI가 짧은 미션으로 나누고,  
듀오링고처럼 단계별로 진행하며 포인트를 쌓아가는 목표 실행 웹앱입니다.

---

## 핵심 기능

- **AI 미션 생성** — 목표 한 문장을 입력하면 2~4개 챕터, 6~12개 미션으로 자동 분해
- **듀오링고식 미션 맵** — 완료/진행 가능/잠김 상태의 세로형 단계 노드 UI
- **타이머** — 미션 시작 버튼 클릭 시 스톱워치 작동, 진행 상태 유지
- **포인트 시스템** — 미션 완료 +5pt, 하루 목표 달성 보너스 +30pt, 초과 미션 +7pt
- **30분 알림** — 미션이 길어지면 재분해 제안 모달 팝업
- **AI 미션 재분해** — 부담스러운 미션을 더 작은 하위 미션으로 다시 쪼갬
- **하루 결과 & AI 피드백** — 오늘 성과 요약 및 내일을 위한 짧은 피드백
- **커뮤니티 목업** — 향후 그룹 매칭/인증 피드 기능 예정 (현재 준비 중 화면)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| UI Component | shadcn/ui |
| State | Zustand 또는 React state |
| 저장 | localStorage → 추후 Supabase |
| AI API | OpenAI API |
| 배포 | Vercel |
| 알림 | Toast + Notification API |
| 아이콘 | lucide-react |

---

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/my-aim.git
cd my-aim
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 OpenAI API Key를 입력합니다.

```
OPENAI_API_KEY=your_openai_api_key_here
```

> API Key가 없어도 mock data 모드로 로컬 테스트가 가능합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인할 수 있습니다.

---

## 화면 구성

```
Home → AI Plan Loading → Mission Created
  → Mission Map → Mission Detail → Running Timer
  → Mission Complete → Daily Result
```

| 화면 | 설명 |
|------|------|
| Home | 목표 입력 및 AI 미션 생성 시작 |
| AI Plan Loading | 미션 생성 중 로딩 화면 |
| Mission Map | 듀오링고식 단계 노드 미션 목록 |
| Mission Detail | 미션 설명, 완료 기준, 시작 버튼 |
| Running Timer | 스톱워치 및 미션 완료 처리 |
| Mission Complete | 획득 포인트 및 다음 미션 유도 |
| Daily Result | 하루 성과 요약 + AI 피드백 |
| My Progress | 레벨, 포인트, 연속 진행 현황 |
| Community | 향후 기능 준비 중 목업 |

---

## 데이터 모델

```typescript
type Goal = {
  id: string;
  title: string;
  createdAt: string;
  deadline?: string;
  status: "active" | "completed" | "paused";
  dailyTargetCount: number;
  totalPoints: number;
};

type Mission = {
  id: string;
  goalId: string;
  chapterId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completionCriteria: string;
  status: "locked" | "available" | "in_progress" | "completed";
  order: number;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  pointsEarned?: number;
};
```

---

## 포인트 규칙

| 조건 | 포인트 |
|------|--------|
| 미션 완료 (하루 목표 미달) | +5pt |
| 미션 완료 (하루 목표 초과) | +7pt |
| 하루 목표 달성 보너스 | +30pt |
| 중단 후 복귀 보너스 | +3pt |
| 실패/미완료 | 감점 없음 |

---

## 문서

- [PRD](./prd.md) — 서비스 기획 및 기능 요구사항
- [Wireframe](./Wireframe.md) — 화면별 텍스트 기반 와이어프레임
- [CHECKLIST](./CHECKLIST.md) — MVP 개발 진행 체크리스트

---

## 배포

[Vercel](https://vercel.com) 을 통해 배포합니다.

```bash
npm run build
```

---

## 라이선스

MIT
