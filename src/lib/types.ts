export type GoalStatus = "active" | "completed" | "paused";
export type MissionStatus = "locked" | "available" | "in_progress" | "completed";
export type Difficulty = "easy" | "normal" | "hard";

export type Goal = {
  id: string;
  title: string;
  createdAt: string;
  deadline?: string;
  status: GoalStatus;
  dailyTargetCount: number;
  totalPoints: number;
};

export type Chapter = {
  id: string;
  goalId: string;
  title: string;
  order: number;
};

export type Mission = {
  id: string;
  goalId: string;
  chapterId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completionCriteria: string;
  status: MissionStatus;
  order: number;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  pointsEarned?: number;
};

export type UserProgress = {
  totalPoints: number;
  level: number;
  todayCompletedCount: number;
  dailyTargetCount: number;
  streak: number;
  lastActiveDate: string;
};

export type LastCompletion = {
  missionTitle: string;
  pointsEarned: number;
  bonusPoints: number;
  todayCount: number;
  dailyTarget: number;
  completedAt: string;
};

export type GeneratePlanResponse = {
  goalTitle: string;
  chapters: {
    title: string;
    missions: {
      title: string;
      description: string;
      estimatedMinutes: number;
      completionCriteria: string;
    }[];
  }[];
};
