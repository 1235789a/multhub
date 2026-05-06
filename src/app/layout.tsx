import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./i18n/index";
import NavBar from "./i18n/NavBar";

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
  title: "蜕羽 / Silent Harvest",
  description:
    "Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",
  keywords: [
    "silent harvest",
    "independent architecture",
    "media extraction",
    "automation tools",
    "fingerprint",
    "Next.js carding matrix",
    "静默收割",
    "独立架构",
    "媒体提取引擎",
    "全自动打包",
    "发卡矩阵",
  ],
  openGraph: {
    title: "蜕羽 / Silent Harvest",
    description:
      "Fully automated monetization funnel — Independent architecture, silient harvest. Tool store, zero customer service, pay after trial.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-200`}
      >
        <LanguageProvider>
          <NavBar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
