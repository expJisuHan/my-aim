# 나만의 AIm — MVP 개발 진행 체크리스트

> PRD 및 Wireframe 기반 구현 체크리스트  
> P0 → P1 → P2 순서로 진행  
> 마지막 업데이트: 2026-05-18

---

## 진행 현황 요약

| 단계 | 항목 수 | 완료 | 진행률 |
|------|---------|------|--------|
| P0 기본 화면 | 4 | 4 | 100% |
| P0 AI 미션 생성 | 4 | 4 | 100% |
| P0 미션 맵 UI | 4 | 4 | 100% |
| P0 타이머 | 5 | 5 | 100% |
| P0 포인트 시스템 | 5 | 5 | 100% |
| P1 알림 | 4 | 1 | 25% |
| P1 AI 미션 재분해 | 3 | 3 | 100% |
| P1 하루 결과/피드백 | 4 | 4 | 100% |
| P1 진행도 화면 | 4 | 4 | 100% |
| P2 커뮤니티 목업 | 3 | 3 | 100% |
| P2 예외 처리 | 3 | 3 | 100% |
| 인프라/배포 | 5 | 5 | 100% |
| 추가 구현 (PRD 외) | 3 | 3 | 100% |

---

## P0 — 반드시 구현 ✅ 전체 완료

### 1단계. 기본 화면

- [x] Home 화면 — 목표 입력창, 예시 버튼, CTA 버튼
- [x] AI 미션 생성 로딩 화면 — 단계별 애니메이션 텍스트
- [x] 미션 생성 완료 화면 — `?new=1` 파라미터 기반 축하 배너 (Mission Map 내 처리)
- [x] 하단 Tab Navigation — 홈 / 미션 / 진행도 / 커뮤니티

---

### 2단계. AI 미션 생성

- [x] `POST /api/generate-plan` API Route 구현
- [x] LLM 프롬프트 작성 및 JSON 응답 파싱 (`gpt-4o-mini`, `response_format: json_object`)
- [x] API 실패 시 기본 미션 템플릿 제공 (mock data 폴백)
- [x] 생성된 목표/챕터/미션 localStorage 저장

---

### 3단계. 듀오링고식 Mission Map UI

- [x] 챕터 구분 표시 (Chapter 1, 2, ...)
- [x] 미션 노드 세로형 단계 UI 구현
- [x] 미션 상태 구분: `completed(✅)` / `available(●)` / `locked(🔒)` / `in_progress(⏱)`
- [x] 이전 미션 완료 시 다음 미션 자동 해금 로직

---

### 4단계. 미션 시작 / 타이머

- [x] Mission Detail 화면 — 제목, 예상 시간, 설명, 완료 기준, 포인트 표시
- [x] 미션 시작 버튼 → `status: in_progress`, `startedAt` 저장
- [x] 스톱워치 타이머 (초 단위 실시간 표시, 새로고침 후 복원)
- [x] 일시정지 / 재개 기능
- [x] 완료 버튼 → `completedAt`, `durationSeconds` 저장

---

### 5단계. 포인트 시스템

- [x] 미션 완료 시 기본 포인트 계산 로직 (`calculateMissionPoints`)
  - 하루 목표 미달: +5pt / 초과: +7pt
  - 하루 목표 달성 시 보너스: +30pt
  - 복귀 보너스: +3pt
- [x] Mission Complete 화면 — 획득 포인트, 오늘 진행률, 보너스 표시
- [x] `UserProgress` localStorage 저장 및 업데이트
- [x] 총 포인트 Header에 실시간 반영 (`aim-points-updated` 커스텀 이벤트)
- [x] 레벨 계산 로직 (총 포인트 기반, 100pt당 1레벨)

---

## P1 — 가능하면 구현

### 6단계. 알림

- [x] 미션 시작 후 30분 경과 시 모달 팝업 (`setInterval` 기반)
- [ ] 목표 생성 후 30분 내 미시작 시 리마인드 토스트
- [ ] 브라우저 Notification API 권한 요청
- [ ] 알림 거부 시 내부 토스트로 폴백 처리

> ➕ **추가 구현:** 예상 소요 시간 경과 시 사운드(Web Audio API beep) + 앰버 토스트 알림 (5초 후 자동 닫힘)

---

### 7단계. AI 미션 재분해

- [x] `POST /api/split-mission` API Route 구현
- [x] Mission Detail 화면에서 "AI에게 더 작게 나눠달라고 하기" 버튼 연결
- [x] 재분해 결과 화면 — 기존 미션 vs 새 하위 미션 비교 표시 및 교체 로직

---

### 8단계. 하루 결과 / AI 피드백

- [x] Daily Result 화면 — 완료 미션 수, 획득 포인트, 총 포인트, 연속 일수
- [x] `POST /api/feedback` API Route 구현
- [x] AI 피드백 텍스트 표시 (완료 수, 평균 소요 시간, 목표 달성 여부 기반)
- [x] 미션 맵 이동 버튼

---

### 9단계. My Progress 화면

- [x] 레벨 및 총 포인트 표시
- [x] 다음 레벨까지 남은 포인트 및 진행 바
- [x] 현재 목표 전체 진행률 (완료 미션 / 전체 미션)
- [x] 연속 진행 일수 (streak) 및 오늘 목표 달성 현황

---

## P2 — 목업 처리 ✅ 전체 완료

### 10단계. 커뮤니티 목업

- [x] 커뮤니티 탭 화면 생성
- [x] "준비 중" 안내 문구 및 예정 기능 카드 표시
  - 목표 유사도 기반 그룹 매칭
  - 미션 인증 피드
  - 함께 달성 챌린지

---

### 11단계. 예외 처리 / Empty State

- [x] Empty State — 진행 중인 목표가 없을 때 Home 화면에서 안내
- [x] AI 생성 실패 화면 — 재시도 버튼 + mock data 기본 템플릿 자동 적용
- [x] localStorage 데이터 누락 시 기본값 반환 (`getProgress` 기본값 처리)

---

## 인프라 / 배포 ✅ 전체 완료

- [x] Next.js 프로젝트 초기 세팅 (App Router, TypeScript)
- [x] Tailwind CSS 설치 및 설정 (shadcn/ui 미사용, lucide-react 사용)
- [x] OpenAI API Key 환경변수 설정 (`.env.local`, `.gitignore` 처리)
- [x] Vercel 배포 연결 (`eslint.ignoreDuringBuilds: true` 설정)
- [x] mock data 모드 구현 (API Key 없을 때 `getMockPlan` 등 자동 폴백)

---

## 추가 구현 (PRD 외)

- [x] 데스크탑 반응형 레이아웃 — `Sidebar` 컴포넌트 (`md:flex`), `md:pl-60` 레이아웃
- [x] 예상 시간 경과 알림 — Web Audio API beep + 앰버 토스트 (타이머 화면)
- [x] Next.js 보안 업그레이드 — 15.3.2 → 15.5.18 (CVE-2025-66478 패치)

---

## 데이터 모델 구현 체크 ✅

- [x] `Goal` 타입 정의 및 localStorage CRUD (`src/lib/types.ts`, `src/lib/storage.ts`)
- [x] `Chapter` 타입 정의 및 localStorage CRUD
- [x] `Mission` 타입 정의 및 localStorage CRUD
- [x] `UserProgress` 타입 정의 및 localStorage CRUD
- [x] `LastCompletion` 타입 정의 (미션 완료 정보 임시 저장용)

---

## API Route 구현 체크 ✅

- [x] `POST /api/generate-plan` — 목표 → 챕터/미션 생성
- [x] `POST /api/split-mission` — 미션 → 하위 미션 재분해
- [x] `POST /api/feedback` — 하루 결과 → AI 피드백 생성

---

## 화면별 구현 체크

| 화면 | 우선순위 | 구현 완료 |
|------|---------|-----------|
| Home | P0 | [x] |
| AI Plan Loading | P0 | [x] |
| Mission Created (축하 배너) | P0 | [x] |
| Mission Map | P0 | [x] |
| Mission Detail | P0 | [x] |
| Running Timer | P0 | [x] |
| Mission Complete | P0 | [x] |
| 30분 초과 모달 | P1 | [x] |
| 예상 시간 경과 알림 | P1+ | [x] |
| 미시작 리마인드 토스트 | P1 | [ ] |
| AI 미션 재분해 | P1 | [x] |
| Daily Result | P1 | [x] |
| My Progress | P1 | [x] |
| Community Mock | P2 | [x] |
| Empty State | P2 | [x] |
| AI 생성 실패 | P2 | [x] |
| 데스크탑 Sidebar | 추가 | [x] |

---

## 남은 작업 (미구현)

- [ ] 목표 생성 후 30분 내 미시작 시 리마인드 토스트
- [ ] 브라우저 Notification API 권한 요청
- [ ] 알림 거부 시 내부 토스트로 폴백 처리
- [ ] PWA 지원 (오프라인 캐시, 앱 설치 프롬프트)
- [ ] Supabase 마이그레이션 (localStorage → 클라우드 저장)

---

## 메모

- 완료한 항목은 `- [x]` 로 변경됨
- API 없을 경우 mock data로 우선 동작 (OpenAI API Key 없어도 테스트 가능)
- shadcn/ui는 미사용 → lucide-react + Tailwind 직접 구성
- localStorage → 추후 Supabase 마이그레이션 고려
