"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Target } from "lucide-react";
import { getGoal, getMissions, getTodayCompletedCount } from "@/lib/storage";
import type { Goal } from "@/lib/types";

const EXAMPLES = ["과제 시작하기", "시험 공부하기", "발표 준비하기", "포트폴리오 만들기"];

export default function HomePage() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const g = getGoal();
    setActiveGoal(g);
    if (g) setTodayCount(getTodayCompletedCount());
  }, []);

  const handleSubmit = () => {
    if (goal.trim().length < 3) {
      setError("목표를 3자 이상 입력해주세요.");
      return;
    }
    router.push(`/loading-plan?goal=${encodeURIComponent(goal.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2 pt-2">
        <div className="flex justify-center mb-3">
          <div className="bg-indigo-100 rounded-full p-3">
            <Target size={32} className="text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 leading-snug">
          큰 목표를 작게 쪼개고,
          <br />
          <span className="text-indigo-600">작은 실행</span>을 점수로 쌓아보세요.
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          해야 할 일 하나만 적어보세요.
          <br />
          AI가 바로 시작 가능한 미션으로 나눠드려요.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={goal}
          onChange={(e) => {
            setGoal(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="예: 내일까지 창업 발표자료 만들기"
          rows={3}
          className="w-full rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none px-4 py-3 text-base resize-none transition-colors bg-white"
        />
        {error && <p className="text-red-500 text-sm px-1">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={goal.trim().length < 3}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles size={20} />
          AI로 미션 만들기
        </button>
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">추천 예시</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setGoal(ex);
                setError("");
              }}
              className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Today Status */}
      {activeGoal && (
        <div className="space-y-3">
          <div className="h-px bg-gray-100" />
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">오늘의 상태</p>
          <button
            onClick={() => router.push("/mission")}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left hover:border-indigo-200 transition-colors"
          >
            <p className="text-xs text-gray-400 mb-1 truncate">{activeGoal.title}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">오늘 완료 미션</p>
                <p className="text-3xl font-black text-gray-900">
                  {todayCount}
                  <span className="text-lg font-bold text-gray-400"> / {activeGoal.dailyTargetCount}개</span>
                </p>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
            {todayCount < activeGoal.dailyTargetCount ? (
              <p className="text-sm text-indigo-600 font-semibold mt-2">
                {activeGoal.dailyTargetCount - todayCount}개만 더 하면 +30pt 보너스!
              </p>
            ) : (
              <p className="text-sm text-emerald-600 font-semibold mt-2">오늘 목표 달성! 🎉</p>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
