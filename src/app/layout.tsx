import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./i18n";
import NavBar from "./i18n/NavBar";
import OrganizationJsonLd from "./components/seo/OrganizationJsonLd";
import WebsiteJsonLd from "./components/seo/WebsiteJsonLd";
import AIMetaTags from "./components/seo/AIMetaTags";

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
    "AI tools",
    "SaaS automation",
    "automation software",
  ],
  authors: [{ name: "蜕羽", url: "https://multhub.top" }],
  creator: "蜕羽",
  publisher: "蜕羽",
  category: "Software",
  classification: "Business Tools",
  referrer: "no-referrer-when-downgrade",
  alternates: {
    canonical: "https://multhub.top",
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
    images: [
      {
        url: "https://multhub.top/favicon.ico",
        width: 512,
        height: 512,
        alt: "蜕羽 / Silent Harvest",
      },
    ],
    emails: ["contact@multhub.top"],
  },
  twitter: {
    card: "summary_large_image",
    title: "蜕羽 / Silent Harvest",
    description:
      "Fully automated monetization funnel — Independent architecture, silent harvest.",
    creator: "@silentharvest",
    images: ["https://multhub.top/favicon.ico"],
    site: "@silentharvest",
  },
  appleWebApp: {
    capable: true,
    title: "蜕羽 / Silent Harvest",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    telephone: false,
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
      <head>
        <AIMetaTags />
      </head>
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
