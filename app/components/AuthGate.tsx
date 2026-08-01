"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabase, isSupabaseConfigured } from "../lib/supabase-browser";
import { trackProductEvent } from "../lib/product-events";

export function AuthGate({
  open,
  onClose,
  onSignedIn,
  returnTo = "/#free-scan",
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: (session: Session) => void;
  returnTo?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | "">("");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) onSignedIn(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        void trackProductEvent("signup_completed", {}, session);
        onSignedIn(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [onSignedIn]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeBtn = dialogRef.current?.querySelector<HTMLButtonElement>(
      ".auth-dialog__close",
    );
    closeBtn?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  async function continueWithGoogle() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setLoading("google");
    setMessage("");
    await trackProductEvent("signup_started", { method: "google" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${returnTo}`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading("");
    }
  }

  async function continueWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setLoading("email");
    setMessage("");
    await trackProductEvent("signup_started", { method: "email" });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${returnTo}`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a secure sign-in link.");
    }
    setLoading("");
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="auth-dialog__close"
          type="button"
          aria-label="Close sign-in"
          onClick={onClose}
        >
          ×
        </button>
        <p className="eyebrow">Free molthub account</p>
        <h2 id="auth-title">Reveal your complete scan</h2>
        <p>
          Sign in to see every detected gap, save the result, and compare future
          improvements.
        </p>

        {isSupabaseConfigured() ? (
          <>
            <button
              className="auth-google"
              type="button"
              disabled={Boolean(loading)}
              onClick={continueWithGoogle}
            >
              <span aria-hidden="true">G</span>
              {loading === "google" ? "Connecting…" : "Continue with Google"}
            </button>
            <div className="auth-divider">
              <span>or continue with email</span>
            </div>
            <form className="auth-email" onSubmit={continueWithEmail}>
              <label htmlFor="auth-email">Work email</label>
              <div>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@project.xyz"
                  required
                />
                <button type="submit" disabled={Boolean(loading)}>
                  {loading === "email" ? "Sending…" : "Email me a link"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="auth-setup-note">
            Account access is being connected. The public preview remains
            available in the meantime.
          </div>
        )}

        {message ? <p className="auth-message">{message}</p> : null}
        <p className="auth-legal">
          No password required. Two free scans per account each month.
        </p>
      </section>
    </div>
  );
}
