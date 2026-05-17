"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trophy, Sparkles } from "lucide-react";
import { getLastCompletion, getMissions } from "@/lib/storage";
import type { LastCompletion } from "@/lib/types";

export default function CompletePage() {
  const router = useRouter();
  const [data, setData] = useState<LastCompletion | null>(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const c = getLastCompletion();
    if (!c) {
      router.replace("/mission");
      return;
    }
    setData(c);
    const missions = getMissions();
    setHasNext(missions.some((m) => m.status === "available"));
  }, [router]);

  if (!data) return null;

  const totalEarned = data.pointsEarned + data.bonusPoints;
  const reachedTarget = data.todayCount >= data.dailyTarget;

  return (
    <div className="px-4 py-8 flex flex-col items-center gap-6 text-center">
      {/* Celebration */}
      <div className="space-y-3">
        <div className="text-7xl">{reachedTarget ? "🎉" : "✅"}</div>
        <h1 className="text-3xl font-black text-gray-900">미션 완료!</h1>
        <p className="text-gray-500 text-sm truncate max-w-xs">{data.missionTitle}</p>
      </div>

      {/* Points Earned */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        {/* Base points */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">미션 완료 포인트</span>
          <span className="text-xl font-black text-indigo-600">+{data.pointsEarned}pt</span>
        </div>

        {/* Bonus */}
        {data.bonusPoints > 0 && (
          <>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-500" />
                <span className="text-amber-700 font-semibold">하루 목표 달성 보너스!</span>
              </div>
              <span className="text-xl font-black text-amber-600">+{data.bonusPoints}pt</span>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Total */}
        <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
          <span className="font-bold text-indigo-800">이번에 획득한 포인트</span>
          <span className="text-2xl font-black text-indigo-700">+{totalEarned}pt</span>
        </div>
      </div>

      {/* Today's progress */}
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">오늘 진행률</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-gray-900">
            {data.todayCount}
            <span className="text-lg font-bold text-gray-400"> / {data.dailyTarget}개</span>
          </span>
          {reachedTarget && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full px-3 py-1">
              목표 달성 🎉
            </span>
          )}
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${Math.min((data.todayCount / data.dailyTarget) * 100, 100)}%` }}
          />
        </div>
        {!reachedTarget && (
          <p className="text-sm text-indigo-600 font-semibold mt-2">
            {data.dailyTarget - data.todayCount}개만 더 하면 +30pt 보너스!
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="w-full space-y-2">
        {hasNext && (
          <button
            onClick={() => router.push("/mission")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles size={18} />
            다음 미션 하기
            <ArrowRight size={18} />
          </button>
        )}
        <button
          onClick={() => router.push("/result")}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl py-3.5 font-semibold hover:border-gray-300 transition-colors"
        >
          오늘 결과 보기
        </button>
        <button
          onClick={() => router.push("/mission")}
          className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
        >
          미션 맵으로 돌아가기
        </button>
      </div>
    </div>
  );
}
