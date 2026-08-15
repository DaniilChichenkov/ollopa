import { redirect } from "react-router";
import type { Route } from "./+types/singleLocation";

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { id } = params;

  try {
    const { getLocationById } = await import("~/db/location.server");
    const location = getLocationById(+id);

    return {
      success: true,
      location,
    };
  } catch (error) {
    return { success: false };
  }
};
