"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getBrowserSupabase, isSupabaseConfigured } from "../lib/supabase-browser";
import { trackProductEvent } from "../lib/product-events";

const AUTH_REQUEST_TIMEOUT_MS = 12_000;
const GOOGLE_REDIRECT_GRACE_MS = 8_000;

function authErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

function withAuthTimeout<T>(promise: Promise<T>, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error(message)), AUTH_REQUEST_TIMEOUT_MS);
    promise.then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

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

  if (!open) return null;

  async function continueWithGoogle() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setLoading("google");
    setMessage("");
    void trackProductEvent("signup_started", { method: "google" });

    try {
      // OAuth providers append their response in the URL hash. Do not include
      // an existing fragment (for example `/#free-scan`) in the redirect URI,
      // otherwise the callback becomes `/#free-scan#access_token` and
      // Supabase cannot parse the returned session.
      const redirectPath = returnTo.split("#", 1)[0] || "/";
      const { error } = await withAuthTimeout(
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}${redirectPath}`,
          },
        }),
        "Google sign-in did not respond. Check the Google provider and redirect URL in Supabase, then try again.",
      );

      if (error) {
        setMessage(error.message);
        setLoading("");
        return;
      }

      window.setTimeout(() => {
        setLoading((current) => {
          if (current === "google") {
            setMessage("Google sign-in did not open. Check the Google provider and redirect URL in Supabase.");
            return "";
          }
          return current;
        });
      }, GOOGLE_REDIRECT_GRACE_MS);
    } catch (error) {
      setMessage(
        authErrorMessage(
          error,
          "Google sign-in could not start. Check the Google provider and redirect URL in Supabase.",
        ),
      );
      setLoading("");
    }
  }

  async function continueWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    setLoading("email");
    setMessage("");
    void trackProductEvent("signup_started", { method: "email" });

    try {
      const { error } = await withAuthTimeout(
        supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}${returnTo}`,
          },
        }),
        "Email sign-in did not respond. Check the Supabase email provider and redirect URL, then try again.",
      );

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email for a secure sign-in link.");
      }
    } catch (error) {
      setMessage(
        authErrorMessage(
          error,
          "Email sign-in could not start. Check the Supabase email provider and redirect URL.",
        ),
      );
    }
    setLoading("");
  }

  return (
    <div className="auth-overlay" role="presentation" onMouseDown={onClose}>
      <section
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
