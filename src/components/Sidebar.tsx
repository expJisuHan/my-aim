"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Map, BarChart3, Users } from "lucide-react";
import { getProgress } from "@/lib/storage";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/mission", label: "미션", icon: Map },
  { href: "/progress", label: "진행도", icon: BarChart3 },
  { href: "/community", label: "커뮤니티", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [points, setPoints] = useState(0);

  const refresh = () => setPoints(getProgress().totalPoints);

  useEffect(() => {
    refresh();
    window.addEventListener("aim-points-updated", refresh);
    return () => window.removeEventListener("aim-points-updated", refresh);
  }, []);

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-100 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-indigo-600 tracking-tight">나만의 AIm</span>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">AI 목표 실행 파트너</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Points badge */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⭐</span>
          <div>
            <p className="text-xs text-amber-600 font-medium">총 포인트</p>
            <p className="text-lg font-black text-amber-700">{points}pt</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
