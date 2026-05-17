export function calculateMissionPoints({
  completedTodayCount,
  dailyTargetCount,
  isReturnBonus = false,
}: {
  completedTodayCount: number;
  dailyTargetCount: number;
  isReturnBonus?: boolean;
}): { base: number; bonus: number; total: number } {
  const base = completedTodayCount < dailyTargetCount ? 5 : 7;
  let bonus = 0;

  if (completedTodayCount + 1 === dailyTargetCount) {
    bonus += 30;
  }
  if (isReturnBonus) {
    bonus += 3;
  }

  return { base, bonus, total: base + bonus };
}

export function calcLevel(totalPoints: number): number {
  return Math.floor(totalPoints / 100) + 1;
}

export function pointsToNextLevel(totalPoints: number): number {
  const level = calcLevel(totalPoints);
  return level * 100 - totalPoints;
}

export function levelProgress(totalPoints: number): number {
  return totalPoints % 100;
}
