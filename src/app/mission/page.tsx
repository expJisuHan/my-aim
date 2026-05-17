"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Lock, Timer, Circle, ChevronRight, Sparkles } from "lucide-react";
import { getGoal, getChapters, getMissions, getTodayCompletedCount } from "@/lib/storage";
import type { Goal, Chapter, Mission } from "@/lib/types";

function MissionNode({
  mission,
  onClick,
}: {
  mission: Mission;
  onClick: () => void;
}) {
  const isClickable = mission.status === "available" || mission.status === "in_progress";

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
        mission.status === "completed"
          ? "bg-emerald-50 border-emerald-100"
          : mission.status === "available"
            ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200 active:scale-[0.98]"
            : mission.status === "in_progress"
              ? "bg-amber-50 border-amber-200 active:scale-[0.98]"
              : "bg-gray-50 border-gray-100 opacity-60"
      }`}
    >
      {/* Status Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          mission.status === "completed"
            ? "bg-emerald-500"
            : mission.status === "available"
              ? "bg-white/20"
              : mission.status === "in_progress"
                ? "bg-amber-500"
                : "bg-gray-200"
        }`}
      >
        {mission.status === "completed" && <CheckCircle2 size={22} className="text-white" />}
        {mission.status === "available" && <Circle size={22} className="text-white" />}
        {mission.status === "in_progress" && <Timer size={22} className="text-white" />}
        {mission.status === "locked" && <Lock size={18} className="text-gray-400" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold mb-0.5 ${
            mission.status === "available"
              ? "text-indigo-200"
              : mission.status === "in_progress"
                ? "text-amber-600"
                : "text-gray-400"
          }`}
        >
          {mission.status === "completed"
            ? "완료"
            : mission.status === "in_progress"
              ? "진행 중"
              : mission.status === "available"
                ? "지금 할 수 있어요"
                : "잠김"}
        </p>
        <p
          className={`font-bold truncate ${
            mission.status === "available"
              ? "text-white"
              : mission.status === "in_progress"
                ? "text-amber-800"
                : mission.status === "completed"
                  ? "text-emerald-800"
                  : "text-gray-500"
          }`}
        >
          {mission.title}
        </p>
        <p
          className={`text-xs mt-0.5 ${
            mission.status === "available"
              ? "text-indigo-200"
              : "text-gray-400"
          }`}
        >
          예상 {mission.estimatedMinutes}분
        </p>
      </div>

      {isClickable && (
        <ChevronRight
          size={20}
          className={mission.status === "available" ? "text-white/70" : "text-amber-400"}
        />
      )}
    </button>
  );
}

function MissionMapContent() {
  const router = useRouter();
  const params = useSearchParams();
  const isNew = params.get("new") === "1";

  const [goal, setGoal] = useState<Goal | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const g = getGoal();
    const ch = getChapters();
    const ms = getMissions();
    setGoal(g);
    setChapters(ch.sort((a, b) => a.order - b.order));
    setMissions(ms.sort((a, b) => a.order - b.order));
    setTodayCount(getTodayCompletedCount());
  }, []);

  if (!goal || missions.length === 0) {
    return (
      <div className="px-4 py-10 flex flex-col items-center gap-6 text-center">
        <div className="text-5xl">🎯</div>
        <div className="space-y-2">
          <p className="font-bold text-gray-900 text-lg">아직 진행 중인 목표가 없어요</p>
          <p className="text-sm text-gray-500">
            해야 할 일을 하나만 적어보세요.
            <br />
            AI가 바로 시작 가능한 미션으로 나눠드려요.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 text-white rounded-2xl px-8 py-4 font-bold flex items-center gap-2"
        >
          <Sparkles size={18} />
          목표 만들기
        </button>
      </div>
    );
  }

  const dailyTarget = goal.dailyTargetCount;

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Goal Header */}
      {isNew && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-indigo-800">미션 생성 완료!</p>
          <p className="text-sm text-indigo-600 mt-1">{missions.length}개 미션이 준비됐어요. 첫 미션부터 시작해보세요.</p>
        </div>
      )}

      {/* Today Progress */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">오늘의 미션</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-black text-gray-900">
              {todayCount}
              <span className="text-lg font-bold text-gray-400"> / {dailyTarget}개 완료</span>
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              todayCount >= dailyTarget
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {todayCount >= dailyTarget ? "목표 달성 🎉" : `+30pt 달성까지 ${dailyTarget - todayCount}개`}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${Math.min((todayCount / dailyTarget) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Mission Map */}
      <div className="space-y-6">
        {chapters.map((chapter) => {
          const chapterMissions = missions.filter((m) => m.chapterId === chapter.id);
          return (
            <div key={chapter.id} className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
                {chapter.title}
              </p>
              <div className="space-y-2">
                {chapterMissions.map((m, i) => (
                  <div key={m.id} className="relative">
                    {/* Connector line */}
                    {i < chapterMissions.length - 1 && (
                      <div className="absolute left-9 top-full h-2 w-0.5 bg-gray-200 z-10" />
                    )}
                    <MissionNode
                      mission={m}
                      onClick={() => router.push(`/mission/${m.id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* All Complete */}
      {missions.every((m) => m.status === "completed") && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3">
          <p className="text-4xl">🏆</p>
          <p className="font-black text-emerald-800 text-xl">모든 미션 완료!</p>
          <p className="text-sm text-emerald-600">정말 대단해요. 목표를 끝까지 해냈어요!</p>
          <button
            onClick={() => router.push("/result")}
            className="w-full bg-emerald-500 text-white rounded-2xl py-3 font-bold"
          >
            오늘 결과 보기
          </button>
        </div>
      )}
    </div>
  );
}

export default function MissionMapPage() {
  return (
    <Suspense fallback={null}>
      <MissionMapContent />
    </Suspense>
  );
}
