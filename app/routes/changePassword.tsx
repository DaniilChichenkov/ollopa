import { Form, redirect } from "react-router";
import type { Route } from "./+types/changePassword";

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

export function getChangePasswordErrorMessage(error?: string) {
  switch (error) {
    case "passwordsDontMatch":
      return "Uued paroolid ei ühti.";

    case "wrongPassword":
      return "Praegune parool on vale.";

    case "serverSideError":
      return "Parooli muutmisel tekkis viga. Palun proovige uuesti.";

    default:
      return null;
  }
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { lang } = params;

  try {
    // Get form data
    const formData = await request.formData();

    const oldPassword = getRequiredString(formData, "oldPassword");
    const newPassword = getRequiredString(formData, "newPassword");
    const newPasswordConfirm = getRequiredString(
      formData,
      "newPasswordConfirm",
    );

    if (newPassword !== newPasswordConfirm) {
      return { success: false, error: "passwordsDontMatch" };
    }

    // Check if old password is correct
    const bcrypt = await import("bcryptjs");
    const { getAdminCredentials, changeAdminCredenials } =
      await import("~/db/admin.server");

    const adminCredentials = getAdminCredentials();

    const isPasswordMatches = await bcrypt.compare(
      oldPassword,
      adminCredentials.password_hash!,
    );

    if (!isPasswordMatches) {
      return { success: false, error: "wrongPassword" };
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 12);

    // Store it in DB
    changeAdminCredenials(hash);

    return redirect(`/${lang}/dashboard`);
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "serverSideError",
    };
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  return requireUser(request);
};

const ChangePassword = ({ actionData }: Route.ComponentProps) => {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="w-full flex justify-center md:justify-start items-start mt-10">
        <Form
          action="."
          method="POST"
          className="w-full gap-y-5 bg-base-200 rounded-xl p-4 md:w-6/12"
        >
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Praegune parool</legend>
            <input
              type="password"
              name="oldPassword"
              className="input w-full"
              placeholder="Sisestage praegune parool"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Uus parool</legend>
            <input
              type="password"
              className="input w-full"
              name="newPassword"
              placeholder="Sisestage uus parool"
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Kinnitage uus parool</legend>
            <input
              type="password"
              className="input w-full"
              name="newPasswordConfirm"
              placeholder="Sisestage uus parool uuesti"
              required
            />
          </fieldset>

          <div className="w-full flex justify-start text-left">
            {actionData && !actionData.success && (
              <p className="text-error text-lg">
                {getChangePasswordErrorMessage(actionData.error)}
              </p>
            )}
          </div>

          <button className="btn btn-primary mt-5">Kinnita</button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
