"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProgress } from "@/lib/storage";

export default function Header() {
  const [points, setPoints] = useState(0);

  const refresh = () => {
    const p = getProgress();
    setPoints(p.totalPoints);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("aim-points-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aim-points-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/" className="flex items-center gap-1.5">
        <span className="text-xl font-black text-indigo-600 tracking-tight">나만의 AIm</span>
      </Link>
      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-full px-3 py-1.5">
        <span className="text-base">⭐</span>
        <span className="text-amber-600 font-bold text-sm">{points}pt</span>
      </div>
    </header>
  );
}
