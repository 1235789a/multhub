"use client";

import { useCallback, useEffect, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-browser";

type Registration = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  providers: string[];
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminRegistrations() {
  const [users, setUsers] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Account access is not configured on this deployment.");
      setLoading(false);
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setError("请先登录管理员账号。");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/registrations", {
        headers: { authorization: `Bearer ${data.session.access_token}` },
      });
      const payload = (await response.json()) as {
        error?: string;
        users?: Registration[];
      };

      if (!response.ok) {
        throw new Error(payload.error || "注册用户暂时无法加载。");
      }

      setUsers(payload.users ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "注册用户暂时无法加载。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect starts the initial authenticated request for the admin page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRegistrations();
  }, [loadRegistrations]);

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="admin-page__heading">
          <div>
            <p className="eyebrow">Private admin view</p>
            <h1>Registered users</h1>
            <p>Only the configured administrator can access this list.</p>
          </div>
          <button className="button button--secondary" type="button" onClick={() => void loadRegistrations()}>
            Refresh
          </button>
        </div>

        <div className="admin-panel">
          {loading ? <p>Loading registered users…</p> : null}
          {!loading && error ? <p className="admin-error">{error}</p> : null}
          {!loading && !error && users.length === 0 ? <p>No registered users yet.</p> : null}
          {!loading && !error && users.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Provider</th>
                    <th>Registered</th>
                    <th>Last sign-in</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((registeredUser) => (
                    <tr key={registeredUser.id}>
                      <td>{registeredUser.email || "—"}</td>
                      <td>{registeredUser.providers.join(", ") || "—"}</td>
                      <td>{formatDate(registeredUser.createdAt)}</td>
                      <td>{formatDate(registeredUser.lastSignInAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
