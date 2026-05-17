"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, CheckSquare, Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { getMission, updateMission, replaceMissionWithSplits } from "@/lib/storage";
import type { Mission } from "@/lib/types";

export default function MissionDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [mission, setMission] = useState<Mission | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitResult, setSplitResult] = useState<
    { title: string; description: string; estimatedMinutes: number; completionCriteria: string }[] | null
  >(null);

  useEffect(() => {
    const m = getMission(id);
    setMission(m);
    if (!m) router.replace("/mission");
  }, [id, router]);

  if (!mission) return null;

  const handleStart = () => {
    const updated: Mission = {
      ...mission,
      status: "in_progress",
      startedAt: new Date().toISOString(),
    };
    updateMission(updated);
    router.push(`/timer/${mission.id}`);
  };

  const handleSplit = async () => {
    setSplitLoading(true);
    try {
      const res = await fetch("/api/split-mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionTitle: mission.title,
          missionDescription: mission.description,
        }),
      });
      const data = await res.json();
      setSplitResult(data.missions);
    } catch {
      alert("분해에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSplitLoading(false);
    }
  };

  const handleConfirmSplit = () => {
    if (!splitResult) return;
    replaceMissionWithSplits(mission.id, splitResult);
    router.push("/mission");
  };

  const isAvailable = mission.status === "available" || mission.status === "in_progress";

  return (
    <div className="px-4 py-4 space-y-5">
      {/* Back */}
      <button
        onClick={() => router.push("/mission")}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">미션으로 돌아가기</span>
      </button>

      {/* Mission Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Status badge */}
        <div
          className={`px-4 py-2 text-xs font-bold ${
            mission.status === "completed"
              ? "bg-emerald-500 text-white"
              : mission.status === "in_progress"
                ? "bg-amber-500 text-white"
                : mission.status === "available"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
          }`}
        >
          {mission.status === "completed"
            ? "완료된 미션"
            : mission.status === "in_progress"
              ? "진행 중인 미션"
              : mission.status === "available"
                ? "지금 시작할 수 있어요!"
                : "아직 잠긴 미션"}
        </div>

        <div className="p-5 space-y-4">
          <h1 className="text-xl font-black text-gray-900 leading-snug">{mission.title}</h1>

          {/* Meta */}
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">예상 {mission.estimatedMinutes}분</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 rounded-xl px-3 py-2">
              <Star size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-amber-700">+5pt 이상</span>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">해야 할 일</p>
            <p className="text-base text-gray-700 leading-relaxed">{mission.description}</p>
          </div>

          {/* Completion Criteria */}
          <div className="bg-emerald-50 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5">
              <CheckSquare size={16} className="text-emerald-600" />
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">완료 기준</p>
            </div>
            <p className="text-sm text-emerald-800 font-medium">{mission.completionCriteria}</p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <button
        onClick={() => setShowTip((v) => !v)}
        className="w-full flex items-center justify-between bg-indigo-50 rounded-2xl px-4 py-3 text-sm font-semibold text-indigo-700"
      >
        <span>💡 작게 시작하기 팁</span>
        {showTip ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {showTip && (
        <div className="bg-indigo-50 rounded-2xl px-4 pb-4 text-sm text-indigo-700 leading-relaxed -mt-3">
          완벽하게 쓰려고 하지 말고, 일단 생각나는 문장 하나부터 적어보세요. 시작만 해도 이미 절반은 한 거예요.
        </div>
      )}

      {/* CTA */}
      {isAvailable && !splitResult && (
        <div className="space-y-2">
          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-2xl py-4 font-bold text-lg transition-all"
          >
            미션 시작하기
          </button>
          <button
            onClick={handleSplit}
            disabled={splitLoading}
            className="w-full bg-white border-2 border-gray-200 text-gray-600 rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-600 transition-colors disabled:opacity-50"
          >
            {splitLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                AI가 쪼개는 중...
              </>
            ) : (
              "AI에게 더 작게 나눠달라고 하기"
            )}
          </button>
        </div>
      )}

      {/* Split Result */}
      {splitResult && (
        <div className="space-y-3">
          <div className="bg-indigo-50 rounded-2xl p-4">
            <p className="font-bold text-indigo-800 mb-1">AI가 미션을 더 작게 나눴어요</p>
            <p className="text-xs text-indigo-600">기존: {mission.title}</p>
          </div>

          <div className="space-y-2">
            {splitResult.map((s, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-1">
                <p className="font-semibold text-gray-900">{i + 1}. {s.title}</p>
                <p className="text-xs text-gray-400">예상 시간: {s.estimatedMinutes}분</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleConfirmSplit}
            className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold"
          >
            이 미션들로 바꾸기
          </button>
          <button
            onClick={() => setSplitResult(null)}
            className="w-full bg-white border-2 border-gray-200 text-gray-600 rounded-2xl py-3.5 font-semibold"
          >
            기존 미션 유지하기
          </button>
        </div>
      )}

      {mission.status === "completed" && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">✅</p>
          <p className="font-bold text-emerald-800">이미 완료한 미션이에요!</p>
          {mission.pointsEarned && (
            <p className="text-sm text-emerald-600 mt-1">+{mission.pointsEarned}pt 획득했어요</p>
          )}
        </div>
      )}

      {mission.status === "locked" && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🔒</p>
          <p className="font-semibold text-gray-600">이전 미션을 완료하면 해금돼요</p>
        </div>
      )}
    </div>
  );
}
