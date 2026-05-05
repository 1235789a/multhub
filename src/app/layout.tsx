import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "独立架构 / 静默收割",
  description:
    "全自动静默收割漏斗 — 独立架构，无视风控。工具超市，零客服，测试可用再付费。",
  keywords: [
    "静默收割",
    "独立架构",
    "媒体提取引擎",
    "全自动打包",
    "黑猫工具",
    "Next.js发卡矩阵",
  ],
  openGraph: {
    title: "独立架构 / 静默收割",
    description:
      "全自动静默收割漏斗 — 独立架构，无视风控。工具超市，测试可用再付费。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-200`}
      >
        {/* NavLinks inlined — pure server component, no hooks needed */}
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-zinc-800 transition-colors hover:text-zinc-600"
            >
              独立架构
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/log"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
              >
                Log
              </Link>
              <Link
                href="/store"
                className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
              >
                Store
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}