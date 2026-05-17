"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, BarChart3, Users } from "lucide-react";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/mission", label: "미션", icon: Map },
  { href: "/progress", label: "진행도", icon: BarChart3 },
  { href: "/community", label: "커뮤니티", icon: Users },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 safe-area-pb z-20 shadow-[0_-1px_0_0_#f1f5f9]">
      <div className="flex">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                active ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
