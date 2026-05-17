"use client";

import { Users, Rss, Zap, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "목표 유사도 기반 그룹 매칭",
    desc: "비슷한 목표를 가진 사람들과 자동으로 연결돼요.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    icon: Rss,
    title: "미션 인증 피드",
    desc: "오늘 완료한 미션을 공유하고 서로 응원할 수 있어요.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Zap,
    title: "함께 달성 챌린지",
    desc: "같은 목표를 가진 사람들과 작은 챌린지를 진행해요.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function CommunityPage() {
  return (
    <div className="px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock size={32} className="text-gray-400" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900">커뮤니티</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          비슷한 목표를 가진 사람들과
          <br />
          함께 달성하는 기능은 준비 중이에요.
        </p>
        <div className="inline-block bg-gray-100 text-gray-500 text-xs font-bold rounded-full px-4 py-1.5 uppercase tracking-wider">
          준비 중
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">곧 추가될 기능</p>
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <div
            key={title}
            className={`border rounded-2xl p-4 flex items-start gap-4 opacity-80 ${color}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              <Icon size={22} />
            </div>
            <div>
              <p className="font-bold text-sm">{title}</p>
              <p className="text-xs mt-0.5 opacity-70">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Illustration */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center border border-indigo-100">
        <p className="text-4xl mb-3">🌱</p>
        <p className="text-sm font-semibold text-indigo-800">
          혼자서도 충분히 잘 하고 있어요.
        </p>
        <p className="text-xs text-indigo-600 mt-1">
          커뮤니티가 열리면 함께 더 멀리 갈 수 있어요.
        </p>
      </div>
    </div>
  );
}
