"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pause, Play, CheckCircle, X, Loader2, Bell } from "lucide-react";
import { getMission, completeMission } from "@/lib/storage";
import type { Mission } from "@/lib/types";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch {
    // AudioContext not available
  }
}

export default function TimerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [mission, setMission] = useState<Mission | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [show30Modal, setShow30Modal] = useState(false);
  const [showEstimatedToast, setShowEstimatedToast] = useState(false);
  const [completing, setCompleting] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const shown30Ref = useRef(false);
  const shownEstimatedRef = useRef(false);
  const estimatedSecondsRef = useRef(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load mission and restore elapsed time
  useEffect(() => {
    const m = getMission(id);
    if (!m) {
      router.replace("/mission");
      return;
    }
    setMission(m);
    estimatedSecondsRef.current = m.estimatedMinutes * 60;

    if (m.startedAt) {
      const initial = Math.floor(
        (Date.now() - new Date(m.startedAt).getTime()) / 1000
      );
      const safeInitial = Math.max(0, initial);
      elapsedRef.current = safeInitial;
      setElapsed(safeInitial);

      // 이미 예상 시간이 지났으면 토스트 표시 안 함
      if (safeInitial >= estimatedSecondsRef.current) {
        shownEstimatedRef.current = true;
      }
      if (safeInitial >= 30 * 60) {
        setShow30Modal(true);
        shown30Ref.current = true;
      }
    }
  }, [id, router]);

  // Ticker
  useEffect(() => {
    if (!mission || paused) return;

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const next = elapsedRef.current;
      setElapsed(next);

      // 예상 시간 경과 알림
      if (next === estimatedSecondsRef.current && !shownEstimatedRef.current) {
        shownEstimatedRef.current = true;
        setShowEstimatedToast(true);
        playBeep();
        // 5초 후 자동 닫기
        toastTimerRef.current = setTimeout(() => setShowEstimatedToast(false), 5000);
      }

      // 30분 모달
      if (next === 30 * 60 && !shown30Ref.current) {
        shown30Ref.current = true;
        setShow30Modal(true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mission, paused]);

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const dismissToast = () => {
    setShowEstimatedToast(false);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  };

  const handleComplete = () => {
    if (!mission) return;
    setCompleting(true);
    completeMission(mission.id);
    router.push("/complete");
  };

  const handleSplitFromModal = () => {
    setShow30Modal(false);
    router.push(`/mission/${id}`);
  };

  if (!mission) return null;

  const percent = Math.min((elapsed / (mission.estimatedMinutes * 60)) * 100, 100);
  const overtime = elapsed > mission.estimatedMinutes * 60;

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        {/* Mission title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 rounded-full px-3 py-1 text-xs font-bold text-amber-700 uppercase tracking-wider">
            진행 중인 미션
          </div>
          <h1 className="text-xl font-black text-gray-900 leading-snug px-2">
            {mission.title}
          </h1>
          <p className="text-sm text-gray-400">지금은 시작한 것만으로도 성공이에요.</p>
        </div>

        {/* Estimated time toast */}
        {showEstimatedToast && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 animate-pulse-once">
            <Bell size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">
                예상 시간 {mission.estimatedMinutes}분이 지났어요!
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                거의 다 왔어요. 완료 기준을 확인하고 마무리해보세요.
              </p>
            </div>
            <button onClick={dismissToast} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Timer Display */}
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-48 h-48 rounded-full border-8 flex items-center justify-center transition-colors ${
              overtime
                ? "border-red-200 bg-red-50"
                : elapsed > 0
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="text-center">
              <p
                className={`text-4xl font-black tabular-nums ${
                  overtime ? "text-red-600" : "text-indigo-600"
                }`}
              >
                {formatTime(elapsed)}
              </p>
              {overtime && (
                <p className="text-xs text-red-400 font-semibold mt-1">예상 시간 초과</p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${overtime ? "bg-red-400" : "bg-indigo-500"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">예상 시간: {mission.estimatedMinutes}분</p>
        </div>

        {/* Completion Criteria reminder */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">완료 기준</p>
          <p className="text-sm text-gray-700 font-medium">{mission.completionCriteria}</p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-60 text-white rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all"
          >
            {completing ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
            완료했어요
          </button>

          <button
            onClick={() => setPaused((v) => !v)}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
            {paused ? "재개하기" : "일시정지"}
          </button>

          <button
            onClick={() => router.push("/mission")}
            className="w-full flex items-center justify-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
          >
            <X size={16} />
            포기하지 않고 나가기
          </button>
        </div>
      </div>

      {/* 30-min Modal */}
      {show30Modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="text-center">
              <p className="text-4xl mb-2">⏰</p>
              <h2 className="text-xl font-black text-gray-900">30분이 지났어요</h2>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                이 미션이 생각보다 크거나 막히는 지점이 있을 수 있어요.
                <br />
                계속 진행할까요, 아니면 더 작게 나눠볼까요?
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShow30Modal(false)}
                className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-bold"
              >
                계속 진행하기
              </button>
              <button
                onClick={handleSplitFromModal}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl py-3.5 font-semibold"
              >
                AI에게 더 작게 나눠달라고 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
