import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import TabNav from "@/components/TabNav";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "나만의 AIm",
  description: "큰 목표를 작게 쪼개고, 작은 실행을 점수로 쌓아주는 AI 목표 실행 파트너",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-slate-50">
          {/* 데스크탑 사이드바 */}
          <Sidebar />

          {/* 사이드바 너비만큼 밀기 (데스크탑만) */}
          <div className="md:pl-60 flex flex-col min-h-screen">
            {/* 모바일 전용 상단 헤더 */}
            <Header />

            {/* 메인 콘텐츠 */}
            <main className="flex-1 pb-24 md:pb-10">
              <div className="max-w-md mx-auto md:max-w-2xl md:px-2">
                {children}
              </div>
            </main>

            {/* 모바일 전용 하단 탭 */}
            <TabNav />
          </div>
        </div>
      </body>
    </html>
  );
}
