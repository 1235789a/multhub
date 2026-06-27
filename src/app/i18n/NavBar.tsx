"use client";

import Link from "next/link";
import { useLanguage } from "./index";

export default function NavBar() {
  const { t, lang, toggleLang } = useLanguage();

  const toggleLabel = lang === "en" ? t.langSwitchToZh : t.langSwitchToEn;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-white transition-colors hover:text-zinc-300"
        >
          Web3 Content Factory
        </Link>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLang}
            aria-label={t.langSwitchAria}
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {toggleLabel}
          </button>
          <Link
            href="/store"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Store
          </Link>
        </div>
      </div>
    </nav>
  );
}
