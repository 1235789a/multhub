"use client";

import Link from "next/link";
import { useLanguage } from "./index";

export default function NavBar() {
  const { t, lang, toggleLang } = useLanguage();

  // Display label on the toggle button: shows the OTHER language
  const toggleLabel = lang === "en" ? t.langSwitchToZh : t.langSwitchToEn;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-800 transition-colors hover:text-zinc-600"
        >
          {t.brand}
        </Link>
        <div className="flex items-center gap-6">
          {/* Language toggle — placed left of Mult/Log per spec */}
          <button
            onClick={toggleLang}
            aria-label={t.langSwitchAria}
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            {toggleLabel}
          </button>
          <Link
            href="/log"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            {t.navLog}
          </Link>
          <Link
            href="/store"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
          >
            {t.navStore}
          </Link>
        </div>
      </div>
    </nav>
  );
}