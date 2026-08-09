"use client";

import { useRouter } from "next/navigation";
import { AuthGate } from "./AuthGate";

export function SignInPage() {
  const router = useRouter();

  return (
    <>
      <div className="auth-page-intro">
        <p className="eyebrow">molthub account</p>
        <h1>Sign in to save scans and track orders.</h1>
        <p>
          Use Google or a secure email link. Your scans and USDT-TRC20 order
          status stay attached to the same account.
        </p>
      </div>
      <AuthGate
        open
        onClose={() => router.push("/")}
        onSignedIn={() => router.push("/account")}
      />
    </>
  );
}
