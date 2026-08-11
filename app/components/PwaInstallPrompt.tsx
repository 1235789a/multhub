"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/install") return;

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  if (!installEvent || hidden) return null;

  async function install() {
    await installEvent?.prompt();
    const result = await installEvent?.userChoice;
    if (result?.outcome === "accepted") setInstallEvent(null);
  }

  return (
    <aside className="pwa-install" aria-label="Install molthub">
      <div>
        <strong>Install molthub</strong>
        <span>Keep scans, orders and Web3 insights one tap away.</span>
      </div>
      <button className="button button--gold button--small" type="button" onClick={install}>
        Install
      </button>
      <button className="pwa-install__close" type="button" aria-label="Dismiss install prompt" onClick={() => setHidden(true)}>
        ×
      </button>
    </aside>
  );
}
