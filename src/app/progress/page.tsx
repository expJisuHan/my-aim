"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Star, CheckCircle2, Target, Trophy } from "lucide-react";
import { getProgress, getGoal, getMissions, getTodayCompletedCount } from "@/lib/storage";
import { calcLevel, pointsToNextLevel, levelProgress } from "@/lib/points";
import type { UserProgress, Goal, Mission } from "@/lib/types";

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
    setGoal(getGoal());
    setMissions(getMissions());
    setTodayCount(getTodayCompletedCount());
  }, []);

  if (!progress) return null;

  const level = calcLevel(progress.totalPoints);
  const toNext = pointsToNextLevel(progress.totalPoints);
  const lvlProgress = levelProgress(progress.totalPoints);
  const completedMissions = missions.filter((m) => m.status === "completed").length;
  const totalMissions = missions.length;

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Level Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">현재 레벨</p>
            <p className="text-4xl font-black">Level {level}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Trophy size={32} className="text-yellow-300" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-indigo-200 font-medium">총 포인트: {progress.totalPoints}pt</span>
            <span className="text-indigo-200 font-medium">다음 레벨까지 {toNext}pt</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-300 rounded-full transition-all"
              style={{ width: `${lvlProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-orange-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">연속 진행</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{progress.streak}</p>
          <p className="text-xs text-gray-400 mt-0.5">일째</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-amber-500" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">총 포인트</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{progress.totalPoints}</p>
          <p className="text-xs text-gray-400 mt-0.5">pt 획득</p>
        </div>
      </div>

      {/* Today */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">오늘 목표</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-gray-900">
            {todayCount}
            <span className="text-base font-bold text-gray-400"> / {progress.dailyTargetCount}개</span>
          </span>
          {todayCount >= progress.dailyTargetCount && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full px-3 py-1">
              달성 🎉
            </span>
          )}
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${Math.min((todayCount / progress.dailyTargetCount) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Goal Progress */}
      {goal && totalMissions > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">현재 목표</p>
          </div>
          <p className="font-semibold text-gray-800 text-sm">{goal.title}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              <span className="font-black text-gray-900">{completedMissions}</span> / {totalMissions}개 완료
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {Math.round((completedMissions / totalMissions) * 100)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${(completedMissions / totalMissions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Completed Missions */}
      {completedMissions > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">완료한 미션</p>
          </div>
          <div className="space-y-2">
            {missions
              .filter((m) => m.status === "completed")
              .slice(-5)
              .reverse()
              .map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 flex-1 truncate">{m.title}</span>
                  {m.pointsEarned && (
                    <span className="text-amber-600 font-semibold flex-shrink-0">
                      +{m.pointsEarned}pt
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => router.push("/mission")}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl py-4 font-bold transition-all"
      >
        미션 계속하기
      </button>
    </div>
  );
}
