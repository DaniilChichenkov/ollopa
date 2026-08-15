import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/login";

export function getLoginErrorMessage(error?: string): string {
  switch (error) {
    case "noCredentialsProvided":
      return "Palun sisestage kasutajanimi ja parool.";

    case "wrongCredentials":
      return "Vale kasutajanimi või parool.";

    case "rateLimited":
      return "Liiga palju ebaõnnestunud sisselogimiskatseid. Palun proovige mõne aja pärast uuesti.";

    default:
      return "Sisselogimisel tekkis viga. Palun proovige uuesti.";
  }
}

export const action = async ({ request }: Route.ActionArgs) => {
  // Check if IP is rate limited
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { isLoginRateLimited, recordFailedLogin, clearLoginAttempts } =
    await import("~/utils/rateLimit");

  // If IP is rate limited
  if (isLoginRateLimited(ip)) {
    return Response.json(
      {
        success: false,
        error: "rateLimited",
      },
      { status: 429 },
    );
  }

  // Get credentials
  const formData = await request.formData();
  const login = formData.get("login");
  const password = formData.get("password");
  await import("dotenv/config");

  try {
    // Get admin from DB
    const { getAdminCredentials } = await import("~/db/admin.server");
    const adminCredentials = getAdminCredentials();

    if (!adminCredentials) {
      return { success: false, error: "noAdminCredentials" };
    }

    // If not all credentials were provided
    if (
      !login ||
      typeof login !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return { success: false, error: "noCredentialsProvided" };
    }

    // Compare login
    if (login !== adminCredentials.login) {
      return { success: false, error: "wrongCredentials" };
    }

    const bcrypt = await import("bcryptjs");

    const isPasswordMatches = await bcrypt.compare(
      password,
      adminCredentials.password_hash!,
    );

    if (!isPasswordMatches) {
      recordFailedLogin(ip);

      return Response.json(
        {
          success: false,
          error: "wrongCredentials",
        },
        { status: 401 },
      );
    }

    // Create session
    const { createUserSession } = await import("~/session.server");

    clearLoginAttempts(ip);

    return createUserSession({ redirectTo: "/dashboard" });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
};

export const Login = ({ actionData }: Route.ComponentProps) => {
  const { state } = useNavigation();

  return (
    <div className="w-dvw h-dvh flex justify-center items-center px-4">
      <div className="card w-full md:w-96 bg-base-100 card-md shadow-sm">
        <div className="card-body flex flex-col items-center">
          <h2 className="card-title">Logi sisse</h2>

          <Form
            action="."
            method="POST"
            className="w-full flex flex-col items-center"
          >
            <fieldset className="fieldset w-full">
              <label className="label" htmlFor="name">
                Kasutajanimi:
              </label>

              <input
                type="text"
                id="name"
                className="input input-md w-full"
                placeholder="Kasutajanimi"
                name="login"
                required
              />
            </fieldset>

            <fieldset className="fieldset w-full">
              <label className="label" htmlFor="name">
                Parool:
              </label>

              <input
                type="password"
                id="name"
                className="input input-md w-full"
                placeholder="****"
                name="password"
                required
              />
            </fieldset>

            {actionData && !actionData.success && (
              <div className="w-full flex justify-start items-center mt-3">
                <p className="text-error text-lg">
                  {getLoginErrorMessage(actionData.error)}
                </p>
              </div>
            )}

            <button
              disabled={state !== "idle"}
              className="btn btn-primary mt-5"
            >
              Jätka
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
