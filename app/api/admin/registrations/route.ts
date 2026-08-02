import { getRequestUser, getSupabaseAdmin, isAdminUser } from "../../../lib/supabase-server";

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  if (!user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!(await isAdminUser(user))) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  const admin = await getSupabaseAdmin();
  if (!admin) {
    return Response.json(
      { error: "Account storage is not configured yet." },
      { status: 503 },
    );
  }

  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    console.error("Admin registrations query failed", error.message);
    return Response.json({ error: "Registered users could not be loaded." }, { status: 500 });
  }

  const users = (data.users ?? []).map((registeredUser) => {
    const providers = Array.isArray(registeredUser.app_metadata?.providers)
      ? registeredUser.app_metadata.providers.filter(
          (provider): provider is string => typeof provider === "string",
        )
      : [];

    return {
      id: registeredUser.id,
      email: registeredUser.email ?? null,
      createdAt: registeredUser.created_at,
      lastSignInAt: registeredUser.last_sign_in_at ?? null,
      emailConfirmedAt: registeredUser.email_confirmed_at ?? null,
      providers,
    };
  });

  return Response.json({ users, total: users.length });
}
