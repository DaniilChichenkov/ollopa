import { createCookieSessionStorage, redirect } from "react-router";
import "dotenv/config";

type SessionData = {
  isAuthenticated: boolean;
};

type SessionFlashData = {
  error: string;
};

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    secrets: [sessionSecret],
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function requireUser(request: Request): Promise<void> {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.get("isAuthenticated") !== true) {
    throw redirect("/login");
  }
}

export async function createUserSession({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string;
}) {
  const session = await getSession();

  session.set("isAuthenticated", true);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
