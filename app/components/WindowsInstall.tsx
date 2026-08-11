"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function WindowsInstall() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () => setInstalled(standalone.matches);
    const updateOnline = () => setOnline(navigator.onLine);
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    updateInstalled();
    updateOnline();
    standalone.addEventListener("change", updateInstalled);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      standalone.removeEventListener("change", updateInstalled);
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === "accepted") setInstallEvent(null);
  }

  return (
    <div className="windows-install-panel">
      <div className="windows-install-panel__status" aria-live="polite">
        <span className={online ? "is-online" : "is-offline"} aria-hidden="true" />
        {installed
          ? "molthub is installed on this device."
          : online
            ? "Your browser is ready to install molthub."
            : "You are offline. Reconnect once to finish installation."}
      </div>

      {installed ? (
        <a className="button button--gold" href="/app">
          Open workspace
        </a>
      ) : installEvent ? (
        <button className="button button--gold" type="button" onClick={install}>
          Install on Windows
        </button>
      ) : (
        <div className="windows-install-panel__fallback">
          <strong>Install from Microsoft Edge or Google Chrome</strong>
          <ol>
            <li>Open this page in Edge or Chrome on Windows.</li>
            <li>Open the browser menu and choose “Apps” or “Install molthub”.</li>
            <li>Confirm Install. molthub will appear in the Start menu.</li>
          </ol>
        </div>
      )}

      <p>
        Installation does not request a wallet, private key, or seed phrase. Sign-in and
        USDT-TRC20 verification continue to use the same secure website flows.
      </p>
    </div>
  );
}
