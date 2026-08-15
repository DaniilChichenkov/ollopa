const loginAttempts = new Map<
  string,
  {
    attempts: number;
    resetAt: number;
  }
>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function isLoginRateLimited(key: string) {
  const entry = loginAttempts.get(key);

  if (!entry) return false;

  if (Date.now() > entry.resetAt) {
    loginAttempts.delete(key);
    return false;
  }

  return entry.attempts >= MAX_ATTEMPTS;
}

export function recordFailedLogin(key: string) {
  const now = Date.now();
  const entry = loginAttempts.get(key);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, {
      attempts: 1,
      resetAt: now + WINDOW_MS,
    });

    return;
  }

  entry.attempts++;
}

export function clearLoginAttempts(key: string) {
  loginAttempts.delete(key);
}
