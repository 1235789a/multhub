import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "./i18n/index";
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
    default: "Web3 Content Factory — AI Content Tools for Web3 Projects",
    template: "%s | Web3 Content Factory",
  },
  description:
    "AI content tools for small Web3 projects. Generate X posts, Telegram announcements, launch threads, meme prompts, pinned messages, and community engagement posts in minutes. Pay with USDT.",
  keywords: [
    "Web3 content generator",
    "AI marketing tools",
    "crypto content creator",
    "meme coin marketing",
    "Telegram announcement generator",
    "X post generator",
    "launch thread template",
    "USDT payment",
    "Web3 tools",
    "AI content factory",
  ],
  authors: [{ name: "Web3 Content Factory", url: "https://multhub.top" }],
  creator: "Web3 Content Factory",
  publisher: "Web3 Content Factory",
  category: "Software",
  classification: "Marketing Tools",
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
    siteName: "Web3 Content Factory",
    title: "Web3 Content Factory — AI Content Tools for Web3 Projects",
    description:
      "Generate ready-to-post X content, Telegram announcements, launch threads, meme prompts, and community updates in minutes. Built for meme coins, NFT projects, AI agents, and crypto communities.",
    url: "https://multhub.top",
    images: [
      {
        url: "https://multhub.top/favicon.ico",
        width: 512,
        height: 512,
        alt: "Web3 Content Factory",
      },
    ],
    emails: ["contact@multhub.top"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 Content Factory — AI Content Tools for Web3 Projects",
    description:
      "AI content tools for small Web3 projects. Create X posts, Telegram announcements, launch threads, and meme prompts in minutes.",
    creator: "@web3contentf",
    images: ["https://multhub.top/favicon.ico"],
    site: "@web3contentf",
  },
  appleWebApp: {
    capable: true,
    title: "Web3 Content Factory",
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
