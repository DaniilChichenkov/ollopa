import type { Route } from "../+types/root";

export const action = async ({ request }: Route.ActionArgs) => {
  const { logout } = await import("~/session.server");
  return logout(request);
};
