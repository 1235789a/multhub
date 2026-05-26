import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./i18n/index";
import NavBar from "./i18n/NavBar";
import OrganizationJsonLd from "./components/seo/OrganizationJsonLd";
import WebsiteJsonLd from "./components/seo/WebsiteJsonLd";

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
  metadataBase: new URL("https://multhub.top"),
  title: {
    default: "蜕羽 / Silent Harvest",
    template: "%s | 蜕羽 / Silent Harvest",
  },
  description:
    "Fully automated monetization funnel — Independent architecture, silent harvest. Tool store, zero customer service, pay after trial.",
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
  authors: [{ name: "蜕羽" }],
  creator: "蜕羽",
  publisher: "蜕羽",
  alternates: {
    languages: {
      en: "https://multhub.top",
      zh: "https://multhub.top?lang=zh",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_CN",
    siteName: "蜕羽 / Silent Harvest",
    title: "蜕羽 / Silent Harvest",
    description:
      "Fully automated monetization funnel — Independent architecture, silent harvest. Tool store, zero customer service, pay after trial.",
    url: "https://multhub.top",
    images: [{ url: "https://multhub.top/favicon.ico" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "蜕羽 / Silent Harvest",
    description:
      "Fully automated monetization funnel — Independent architecture, silent harvest.",
    creator: "@silentharvest",
    images: ["https://multhub.top/favicon.ico"],
  },
  verification: {
    google: "google-site-verification",
    yandex: "yandex-verification",
    other: {
      "msvalidate.01": "msvalidate-token",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <LanguageProvider>
          <NavBar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
