"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Flame, Star, CheckCircle2, Loader2 } from "lucide-react";
import { getProgress, getGoal, getTodayCompletedCount } from "@/lib/storage";
import type { UserProgress, Goal } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const called = useRef(false);

  useEffect(() => {
    const p = getProgress();
    const g = getGoal();
    const count = getTodayCompletedCount();
    setProgress(p);
    setGoal(g);
    setTodayCount(count);

    if (called.current) return;
    called.current = true;

    // Fetch AI feedback
    (async () => {
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completedCount: count,
            dailyTargetCount: g?.dailyTargetCount ?? 3,
            totalPoints: p.totalPoints,
            streak: p.streak,
          }),
        });
        const data = await res.json();
        setFeedback(data.feedback);
      } catch {
        setFeedback("오늘도 잘 해냈어요. 매일 조금씩 이어나가는 게 가장 큰 힘이에요!");
      } finally {
        setFeedbackLoading(false);
      }
    })();
  }, []);

  if (!progress || !goal) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-gray-400">진행 중인 목표가 없어요.</p>
        <button onClick={() => router.push("/")} className="mt-4 text-indigo-600 font-semibold">
          목표 만들기
        </button>
      </div>
    );
  }

  const dailyTarget = goal.dailyTargetCount;
  const reached = todayCount >= dailyTarget;
  const todayPoints = Math.min(todayCount, dailyTarget) * 5 + (reached ? 30 : 0);

  return (
    <div className="px-4 py-6 space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-4xl">{reached ? "🏆" : "📊"}</p>
        <h1 className="text-2xl font-black text-gray-900">
          {reached ? "오늘의 목표 달성!" : "오늘의 결과"}
        </h1>
        {reached && (
          <p className="text-indigo-600 font-semibold text-sm">정말 대단해요! 오늘 목표를 모두 완료했어요.</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-3xl font-black text-gray-900">{todayCount}</p>
          <p className="text-xs text-gray-400 font-medium">오늘 완료 미션</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <Star size={24} className="text-amber-500 mx-auto mb-1" />
          <p className="text-3xl font-black text-gray-900">{todayPoints}</p>
          <p className="text-xs text-gray-400 font-medium">오늘 획득 포인트</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl mb-1">🎯</p>
          <p className="text-3xl font-black text-gray-900">{progress.totalPoints}</p>
          <p className="text-xs text-gray-400 font-medium">총 포인트</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <Flame size={24} className="text-orange-500 mx-auto mb-1" />
          <p className="text-3xl font-black text-gray-900">{progress.streak}</p>
          <p className="text-xs text-gray-400 font-medium">연속 진행일</p>
        </div>
      </div>

      {/* AI Feedback */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <p className="text-sm font-bold text-indigo-800">오늘의 AI 피드백</p>
        </div>
        {feedbackLoading ? (
          <div className="flex items-center gap-2 text-indigo-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">피드백 생성 중...</span>
          </div>
        ) : (
          <p className="text-sm text-indigo-700 leading-relaxed">{feedback}</p>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => router.push("/mission")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl py-4 font-bold transition-all"
        >
          미션 맵으로 돌아가기
        </button>
        <button
          onClick={() => router.push("/progress")}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl py-3.5 font-semibold hover:border-gray-300 transition-colors"
        >
          나의 진행도 보기
        </button>
      </div>
    </div>
  );
}
