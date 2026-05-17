import type { Goal, Chapter, Mission, UserProgress, LastCompletion, GeneratePlanResponse } from "./types";
import { calculateMissionPoints, calcLevel } from "./points";

const KEYS = {
  GOAL: "aim_goal",
  CHAPTERS: "aim_chapters",
  MISSIONS: "aim_missions",
  PROGRESS: "aim_progress",
  LAST_COMPLETION: "aim_last_completion",
  GOAL_CREATED_AT: "aim_goal_created_at",
} as const;

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Goal ────────────────────────────────────────────────────────────────────

export function getGoal(): Goal | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.GOAL);
  return raw ? JSON.parse(raw) : null;
}

export function saveGoal(goal: Goal): void {
  localStorage.setItem(KEYS.GOAL, JSON.stringify(goal));
}

// ─── Chapters ────────────────────────────────────────────────────────────────

export function getChapters(): Chapter[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.CHAPTERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveChapters(chapters: Chapter[]): void {
  localStorage.setItem(KEYS.CHAPTERS, JSON.stringify(chapters));
}

// ─── Missions ────────────────────────────────────────────────────────────────

export function getMissions(): Mission[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.MISSIONS);
  return raw ? JSON.parse(raw) : [];
}

export function saveMissions(missions: Mission[]): void {
  localStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
}

export function getMission(id: string): Mission | null {
  return getMissions().find((m) => m.id === id) ?? null;
}

export function updateMission(updated: Mission): void {
  const missions = getMissions().map((m) => (m.id === updated.id ? updated : m));
  saveMissions(missions);
}

// ─── UserProgress ─────────────────────────────────────────────────────────────

const defaultProgress = (): UserProgress => ({
  totalPoints: 0,
  level: 1,
  todayCompletedCount: 0,
  dailyTargetCount: 3,
  streak: 0,
  lastActiveDate: "",
});

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  const raw = localStorage.getItem(KEYS.PROGRESS);
  return raw ? JSON.parse(raw) : defaultProgress();
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

// ─── Last Completion ──────────────────────────────────────────────────────────

export function getLastCompletion(): LastCompletion | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.LAST_COMPLETION);
  return raw ? JSON.parse(raw) : null;
}

export function saveLastCompletion(data: LastCompletion): void {
  localStorage.setItem(KEYS.LAST_COMPLETION, JSON.stringify(data));
}

// ─── Daily Reset ──────────────────────────────────────────────────────────────

function ensureDailyReset(progress: UserProgress): UserProgress {
  const today = new Date().toDateString();
  if (progress.lastActiveDate === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const newStreak =
    progress.lastActiveDate === yesterday.toDateString()
      ? progress.streak + 1
      : progress.lastActiveDate === ""
        ? 1
        : 1;

  return {
    ...progress,
    todayCompletedCount: 0,
    streak: newStreak,
    lastActiveDate: today,
  };
}

// ─── Plan from AI response ────────────────────────────────────────────────────

export function savePlan(goalTitle: string, data: GeneratePlanResponse, dailyTargetCount = 3): void {
  const goalId = genId();
  const now = new Date().toISOString();

  const goal: Goal = {
    id: goalId,
    title: goalTitle,
    createdAt: now,
    status: "active",
    dailyTargetCount,
    totalPoints: 0,
  };

  let missionOrder = 0;
  const chapters: Chapter[] = [];
  const missions: Mission[] = [];

  data.chapters.forEach((ch, chIdx) => {
    const chapterId = genId();
    chapters.push({ id: chapterId, goalId, title: ch.title, order: chIdx });

    ch.missions.forEach((m) => {
      missions.push({
        id: genId(),
        goalId,
        chapterId,
        title: m.title,
        description: m.description,
        estimatedMinutes: m.estimatedMinutes,
        completionCriteria: m.completionCriteria,
        status: missionOrder === 0 ? "available" : "locked",
        order: missionOrder++,
      });
    });
  });

  saveGoal(goal);
  saveChapters(chapters);
  saveMissions(missions);

  // Reset progress daily target to match goal
  const progress = getProgress();
  progress.dailyTargetCount = dailyTargetCount;
  saveProgress(progress);

  // Record goal creation time for reminder timer
  localStorage.setItem(KEYS.GOAL_CREATED_AT, now);
}

// ─── Complete Mission ─────────────────────────────────────────────────────────

export function completeMission(missionId: string): {
  pointsEarned: number;
  bonusPoints: number;
  todayCount: number;
  dailyTarget: number;
} {
  const missions = getMissions();
  const goal = getGoal();
  let progress = getProgress();

  progress = ensureDailyReset(progress);

  const dailyTargetCount = goal?.dailyTargetCount ?? 3;
  const { base, bonus } = calculateMissionPoints({
    completedTodayCount: progress.todayCompletedCount,
    dailyTargetCount,
  });
  const totalNewPoints = base + bonus;

  // Update mission
  const sorted = [...missions].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((m) => m.id === missionId);

  missions.forEach((m) => {
    if (m.id === missionId) {
      m.status = "completed";
      m.completedAt = new Date().toISOString();
      if (m.startedAt) {
        m.durationSeconds = Math.round(
          (Date.now() - new Date(m.startedAt).getTime()) / 1000
        );
      }
      m.pointsEarned = totalNewPoints;
    }
  });

  // Unlock next mission
  if (idx >= 0 && idx + 1 < sorted.length) {
    const nextId = sorted[idx + 1].id;
    missions.forEach((m) => {
      if (m.id === nextId && m.status === "locked") {
        m.status = "available";
      }
    });
  }

  saveMissions(missions);

  // Update progress
  progress.totalPoints += totalNewPoints;
  progress.todayCompletedCount += 1;
  progress.level = calcLevel(progress.totalPoints);
  saveProgress(progress);

  // Save last completion for complete screen
  const mission = missions.find((m) => m.id === missionId);
  saveLastCompletion({
    missionTitle: mission?.title ?? "",
    pointsEarned: base,
    bonusPoints: bonus,
    todayCount: progress.todayCompletedCount,
    dailyTarget: dailyTargetCount,
    completedAt: new Date().toISOString(),
  });

  // Notify header
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aim-points-updated"));
  }

  return {
    pointsEarned: base,
    bonusPoints: bonus,
    todayCount: progress.todayCompletedCount,
    dailyTarget: dailyTargetCount,
  };
}

// ─── Split Mission ────────────────────────────────────────────────────────────

export function replaceMissionWithSplits(
  originalId: string,
  splits: { title: string; description: string; estimatedMinutes: number; completionCriteria: string }[]
): void {
  const missions = getMissions();
  const original = missions.find((m) => m.id === originalId);
  if (!original) return;

  const remaining = missions.filter((m) => m.id !== originalId);

  const newMissions: Mission[] = splits.map((s, i) => ({
    id: genId(),
    goalId: original.goalId,
    chapterId: original.chapterId,
    title: s.title,
    description: s.description,
    estimatedMinutes: s.estimatedMinutes,
    completionCriteria: s.completionCriteria,
    status: i === 0 ? "available" : "locked",
    order: original.order + i * 0.1,
  }));

  const combined = [...remaining, ...newMissions].sort((a, b) => a.order - b.order);

  // Re-number orders sequentially
  combined.forEach((m, i) => {
    m.order = i;
  });

  saveMissions(combined);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTodayCompletedCount(): number {
  const missions = getMissions();
  const today = new Date().toDateString();
  return missions.filter(
    (m) =>
      m.status === "completed" &&
      m.completedAt &&
      new Date(m.completedAt).toDateString() === today
  ).length;
}

export function getGoalCreatedAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.GOAL_CREATED_AT);
}

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
