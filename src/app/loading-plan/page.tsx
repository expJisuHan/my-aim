"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { savePlan } from "@/lib/storage";
import type { GeneratePlanResponse } from "@/lib/types";

const STEPS = ["목표 분석 중...", "챕터 나누는 중...", "오늘 할 미션 정리 중..."];

function LoadingPlanContent() {
  const router = useRouter();
  const params = useSearchParams();
  const goal = params.get("goal") ?? "";
  const called = useRef(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!goal || called.current) return;
    called.current = true;

    // Advance step indicator
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);

    const run = async () => {
      try {
        const res = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, dailyTargetCount: 3, difficulty: "normal" }),
        });
        if (!res.ok) throw new Error("API error");
        const data: GeneratePlanResponse = await res.json();
        savePlan(goal, data, 3);
        router.push("/mission?new=1");
      } catch {
        setError("미션 생성에 실패했어요. 다시 시도해주세요.");
      }
    };

    run();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [goal, router]);

  if (!goal) {
    router.replace("/");
    return null;
  }

  if (error) {
    return (
      <div className="px-4 py-10 flex flex-col items-center gap-6 text-center">
        <div className="bg-red-50 rounded-2xl p-6 w-full space-y-4">
          <p className="text-4xl">😥</p>
          <p className="font-bold text-gray-900">미션 생성에 실패했어요</p>
          <p className="text-sm text-gray-500">
            AI가 잠시 응답하지 못했어요.
            <br />
            대신 기본 미션 템플릿으로 시작할 수 있어요.
          </p>
        </div>

        <div className="w-full space-y-2">
          <p className="text-sm font-semibold text-gray-700 text-left">기본 시작 미션</p>
          {["목표를 한 문장으로 다시 적기", "가장 쉬운 첫 행동 정하기", "5분 동안만 시작하기"].map(
            (t, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 text-sm text-gray-700 text-left">
                {i + 1}. {t}
              </div>
            )
          )}
        </div>

        <div className="w-full space-y-2">
          <button
            onClick={() => {
              called.current = false;
              setError("");
              setStep(0);
            }}
            className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold"
          >
            다시 생성하기
          </button>
          <button
            onClick={() => {
              const mock = {
                goalTitle: goal,
                chapters: [
                  {
                    title: "시작하기",
                    missions: [
                      { title: "목표를 한 문장으로 다시 적기", description: "지금 해야 할 일을 한 문장으로 정리해보세요.", estimatedMinutes: 5, completionCriteria: "한 문장 완성" },
                      { title: "가장 쉬운 첫 행동 정하기", description: "지금 당장 할 수 있는 작은 행동 하나를 정해보세요.", estimatedMinutes: 3, completionCriteria: "첫 행동 1개 이상" },
                      { title: "5분 동안만 시작하기", description: "5분만 집중해서 시작해보세요.", estimatedMinutes: 5, completionCriteria: "5분 이상 시작" },
                    ],
                  },
                ],
              };
              savePlan(goal, mock, 3);
              router.push("/mission?new=1");
            }}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl py-4 font-bold"
          >
            기본 템플릿으로 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 flex flex-col items-center gap-8 text-center">
      {/* Spinner */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
          <Loader2 size={36} className="text-indigo-600 animate-spin" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <p className="text-lg font-bold text-gray-900">AI가 목표를 잘게 나누고 있어요.</p>
        <p className="text-sm text-gray-500 bg-gray-100 rounded-xl px-4 py-2 font-medium">
          &ldquo;{goal}&rdquo;
        </p>
        <p className="text-sm text-gray-400">첫 미션은 부담 없게 5분 안에 시작할 수 있도록 만들게요.</p>
      </div>

      {/* Steps */}
      <div className="w-full space-y-3">
        {STEPS.map((label, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              i < step
                ? "bg-emerald-50 text-emerald-700"
                : i === step
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-gray-50 text-gray-400"
            }`}
          >
            {i < step ? (
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
            ) : i === step ? (
              <Loader2 size={20} className="text-indigo-500 animate-spin flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-16 flex justify-center">
          <Loader2 size={32} className="text-indigo-600 animate-spin" />
        </div>
      }
    >
      <LoadingPlanContent />
    </Suspense>
  );
}
