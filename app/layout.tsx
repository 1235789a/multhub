import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        url: "/og.png",
        width: 1720,
        height: 907,
        alt: "molthub — Web3 AI Search Visibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "molthub — Web3 AI Search Visibility",
    description:
      "Hands-on GEO audits and implementation for early-stage Web3 teams.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://molthub.click",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8f6",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "molthub",
  url: "https://molthub.click",
  email: "chengzhao640@gmail.com",
  telephone: "+86 158 6378 9235",
  description:
    "Web3 GEO audits, AI-search visibility reports, fact verification and implementation services.",
  areaServed: "Worldwide",
  serviceType: [
    "Web3 GEO",
    "AI search visibility audit",
    "Generative engine optimization",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Visibility Report Request",
      price: "9.99",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Verified GEO Baseline",
      price: "59",
      priceCurrency: "USD",
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
        {children}
      </body>
    </html>
  );
}
