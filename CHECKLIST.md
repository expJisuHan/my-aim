# 나만의 AIm — MVP 개발 진행 체크리스트

> PRD 및 Wireframe 기반 구현 체크리스트  
> P0 → P1 → P2 순서로 진행

---

## 진행 현황 요약

| 단계 | 항목 수 | 완료 | 진행률 |
|------|---------|------|--------|
| P0 기본 화면 | 4 | 0 | 0% |
| P0 AI 미션 생성 | 4 | 0 | 0% |
| P0 미션 맵 UI | 4 | 0 | 0% |
| P0 타이머 | 5 | 0 | 0% |
| P0 포인트 시스템 | 5 | 0 | 0% |
| P1 알림 | 4 | 0 | 0% |
| P1 AI 미션 재분해 | 3 | 0 | 0% |
| P1 하루 결과/피드백 | 4 | 0 | 0% |
| P1 진행도 화면 | 4 | 0 | 0% |
| P2 커뮤니티 목업 | 3 | 0 | 0% |
| P2 예외 처리 | 3 | 0 | 0% |
| 인프라/배포 | 5 | 0 | 0% |

---

## P0 — 반드시 구현

### 1단계. 기본 화면

- [ ] Home 화면 — 목표 입력창, 예시 버튼, CTA 버튼
- [ ] AI 미션 생성 로딩 화면 — 단계별 애니메이션 텍스트
- [ ] 미션 생성 완료 화면 — 챕터/미션 요약, 첫 미션 진입 버튼
- [ ] 하단 Tab Navigation — 홈 / 미션 / 진행도 / 커뮤니티

---

### 2단계. AI 미션 생성

- [ ] `POST /api/generate-plan` API Route 구현
- [ ] LLM 프롬프트 작성 및 JSON 응답 파싱
- [ ] API 실패 시 기본 미션 템플릿 제공 (AI 생성 실패 화면)
- [ ] 생성된 목표/챕터/미션 localStorage 저장

---

### 3단계. 듀오링고식 Mission Map UI

- [ ] 챕터 구분 표시 (Chapter 1, 2, ...)
- [ ] 미션 노드 세로형 단계 UI 구현
- [ ] 미션 상태 구분: `completed(✅)` / `available(●)` / `locked(🔒)` / `in_progress(⏱)`
- [ ] 이전 미션 완료 시 다음 미션 자동 해금 로직

---

### 4단계. 미션 시작 / 타이머

- [ ] Mission Detail 화면 — 제목, 예상 시간, 설명, 완료 기준, 포인트 표시
- [ ] 미션 시작 버튼 → `status: in_progress`, `startedAt` 저장
- [ ] 스톱워치 타이머 (초 단위 실시간 표시)
- [ ] 일시정지 / 재개 기능
- [ ] 완료 버튼 → `completedAt`, `durationSeconds` 저장

---

### 5단계. 포인트 시스템

- [ ] 미션 완료 시 기본 포인트 계산 로직 (`calculateMissionPoints`)
  - 하루 목표 미달: +5pt / 초과: +7pt
  - 하루 목표 달성 시 보너스: +30pt
  - 복귀 보너스: +3pt
- [ ] Mission Complete 화면 — 획득 포인트, 오늘 진행률, 보너스 표시
- [ ] `UserProgress` localStorage 저장 및 업데이트
- [ ] 총 포인트 Header에 실시간 반영
- [ ] 레벨 계산 로직 (총 포인트 기반)

---

## P1 — 가능하면 구현

### 6단계. 알림

- [ ] 미션 시작 후 30분 경과 시 모달 팝업 (`setTimeout` 기반)
- [ ] 목표 생성 후 30분 내 미시작 시 리마인드 토스트
- [ ] 브라우저 Notification API 권한 요청
- [ ] 알림 거부 시 내부 토스트로 폴백 처리

---

### 7단계. AI 미션 재분해

- [ ] `POST /api/split-mission` API Route 구현
- [ ] Mission Detail / 타이머 화면에서 "AI에게 더 작게 나눠달라고 하기" 버튼 연결
- [ ] 재분해 결과 화면 — 기존 미션 vs 새 하위 미션 비교 표시 및 교체 로직

---

### 8단계. 하루 결과 / AI 피드백

- [ ] Daily Result 화면 — 완료 미션 수, 획득 포인트, 총 포인트, 연속 일수
- [ ] `POST /api/feedback` API Route 구현
- [ ] AI 피드백 텍스트 표시 (완료 수, 평균 소요 시간, 목표 달성 여부 기반)
- [ ] 내일 미션 확인 / 미션 맵 이동 버튼

---

### 9단계. My Progress 화면

- [ ] 레벨 및 총 포인트 표시
- [ ] 다음 레벨까지 남은 포인트 및 진행 바
- [ ] 현재 목표 전체 진행률 (완료 미션 / 전체 미션)
- [ ] 연속 진행 일수 (streak) 및 오늘 목표 달성 현황

---

## P2 — 목업 처리

### 10단계. 커뮤니티 목업

- [ ] 커뮤니티 탭 화면 생성
- [ ] "준비 중" 안내 문구 및 예정 기능 카드 표시
  - 목표 유사도 기반 그룹 매칭
  - 미션 인증 피드
  - 함께 달성 챌린지

---

### 11단계. 예외 처리 / Empty State

- [ ] Empty State — 진행 중인 목표가 없을 때 안내 화면
- [ ] AI 생성 실패 화면 — 재시도 버튼 + 기본 템플릿 시작 버튼
- [ ] localStorage 데이터 손상/누락 시 초기화 처리

---

## 인프라 / 배포

- [ ] Next.js 프로젝트 초기 세팅 (App Router, TypeScript)
- [ ] Tailwind CSS + shadcn/ui 설치 및 설정
- [ ] OpenAI API Key 환경변수 설정 (`.env.local`)
- [ ] Vercel 배포 연결
- [ ] mock data 모드 구현 (API Key 없을 때 로컬 테스트용)

---

## 데이터 모델 구현 체크

- [ ] `Goal` 타입 정의 및 localStorage CRUD
- [ ] `Chapter` 타입 정의 및 localStorage CRUD
- [ ] `Mission` 타입 정의 및 localStorage CRUD
- [ ] `UserProgress` 타입 정의 및 localStorage CRUD

---

## API Route 구현 체크

- [ ] `POST /api/generate-plan` — 목표 → 챕터/미션 생성
- [ ] `POST /api/split-mission` — 미션 → 하위 미션 재분해
- [ ] `POST /api/feedback` — 하루 결과 → AI 피드백 생성

---

## 화면별 구현 체크

| 화면 | 우선순위 | 구현 완료 |
|------|---------|-----------|
| Home | P0 | [ ] |
| AI Plan Loading | P0 | [ ] |
| Mission Created | P0 | [ ] |
| Mission Map | P0 | [ ] |
| Mission Detail | P0 | [ ] |
| Running Timer | P0 | [ ] |
| Mission Complete | P0 | [ ] |
| 30분 초과 모달 | P1 | [ ] |
| 미시작 리마인드 토스트 | P1 | [ ] |
| AI 미션 재분해 | P1 | [ ] |
| Daily Result | P1 | [ ] |
| My Progress | P1 | [ ] |
| Community Mock | P2 | [ ] |
| Empty State | P2 | [ ] |
| AI 생성 실패 | P2 | [ ] |

---

## 메모

- 완료한 항목은 `- [x]` 로 변경
- API 없을 경우 mock data로 우선 동작하도록 구성
- localStorage → 추후 Supabase 마이그레이션 고려
