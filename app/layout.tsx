import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { PwaRegister } from "./components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://molthub.click"),
  title: {
    default: "molthub — Web3 AI Search Visibility",
    template: "%s",
  },
  description:
    "A focused, hands-on Web3 GEO studio offering AI search visibility reviews and implementation support.",
  keywords: [
    "Web3 GEO",
    "AI search visibility",
    "Web3 marketing",
    "generative engine optimization",
    "crypto AI visibility",
  ],
  openGraph: {
    type: "website",
    url: "https://molthub.click",
    siteName: "molthub",
    title: "molthub — Web3 AI Search Visibility",
    description:
      "Hands-on GEO audits and implementation for early-stage Web3 teams.",
    images: [
      {
        url: "/og-geo-foundation.png",
        width: 1774,
        height: 887,
        alt: "molthub — Web3 AI Search Visibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "molthub — Web3 AI Search Visibility",
    description:
      "Hands-on GEO audits and implementation for early-stage Web3 teams.",
    images: ["/og-geo-foundation.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/app-icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "molthub",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8f6",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://molthub.click/#organization",
      name: "molthub",
      url: "https://molthub.click",
      logo: "https://molthub.click/app-icon-512.png",
      email: "chengzhao640@gmail.com",
      telephone: "+86 158 6378 9235",
      description:
        "A hands-on Web3 GEO studio providing AI-search visibility audits, fact verification and implementation support.",
      areaServed: "Worldwide",
      knowsAbout: [
        "Generative Engine Optimization",
        "AI search visibility",
        "Web3 documentation",
        "Web3 entity verification",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://molthub.click/#website",
      name: "molthub",
      url: "https://molthub.click",
      publisher: { "@id": "https://molthub.click/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://molthub.click/#service",
      name: "molthub Web3 GEO services",
      url: "https://molthub.click/#services",
      provider: { "@id": "https://molthub.click/#organization" },
      areaServed: "Worldwide",
      serviceType: [
        "Web3 GEO audit",
        "AI-search visibility review",
        "Web3 fact verification",
        "Website and documentation implementation",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PwaRegister />
        <PwaInstallPrompt />
        {children}
      </body>
    </html>
  );
}
