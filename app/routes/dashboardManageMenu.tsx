import { ArrowLeft, Pen, Plus, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Form, NavLink, useParams } from "react-router";
import type { Route } from "./+types/dashboardManageMenu";

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

export function getMenuErrorMessage(errorKey: string): string {
  switch (errorKey) {
    case "newMenuTitleEE":
      return "Palun sisestage menüü pealkiri eesti keeles.";

    case "newMenuTitleEN":
      return "Palun sisestage menüü pealkiri inglise keeles.";

    case "newMenuTitleRU":
      return "Palun sisestage menüü pealkiri vene keeles.";

    default:
      return "Menüü loomisel tekkis viga.";
  }
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { getAllMenus } = await import("~/db/menu.server");
  const menus = getAllMenus();
  return { menus };
};

export const action = async ({ request }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  try {
    const formData = await request.formData();

    const newMenuTitleEE = getRequiredString(formData, "newMenuTitleEE");
    const newMenuTitleEN = getRequiredString(formData, "newMenuTitleEN");
    const newMenuTitleRU = getRequiredString(formData, "newMenuTitleRU");

    const { createNewMenu } = await import("~/db/menu.server");

    createNewMenu({
      et: newMenuTitleEE,
      en: newMenuTitleEN,
      ru: newMenuTitleRU,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      errorMsg:
        error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

const DashboardManageMenu = ({
  loaderData,
  actionData,
}: Route.ComponentProps) => {
  const { lang } = useParams();
  const { menus } = loaderData;

  const [formLanguage, setFormLanguage] = useState("ee");

  const newMenuModalRef = useRef<HTMLDialogElement>(null);
  const openModal = () => {
    newMenuModalRef.current?.showModal();
  };

  const langDropdownRef = useRef<HTMLDetailsElement>(null);
  const handleFormLanguageChange = (lang: string) => {
    if (langDropdownRef.current) {
      langDropdownRef.current.open = false;
    }
    setFormLanguage(lang);
  };

  useEffect(() => {
    if (actionData?.success === true) {
      newMenuModalRef.current?.close();
    }
  }, [actionData]);

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center gap-x-3 border-2 border-base-300 p-4 rounded-xl">
        <p className="text-lg">Menüüd</p>

        <button onClick={openModal} className="btn btn-primary">
          <Plus /> Lisa menüü
        </button>
      </header>

      {/* Menus */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 xl:grid-cols-3 mt-10">
        {menus.map((item) => (
          <NavLink
            key={item.id}
            to={`/${lang}/dashboard/menu/${item.id}`}
            className={() =>
              `w-full flex justify-start items-center bg-base-200 rounded-xl p-4 gap-x-5`
            }
          >
            <Utensils />

            <div className="flex-1">
              <div className="w-full flex justify-between items-center">
                <p className="font-bold text-lg">{item.title_et}</p>

                <button className="btn">
                  <Pen />
                </button>
              </div>

              <p>{item.items_count ?? 0} rooga</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* New menu modal */}
      <dialog ref={newMenuModalRef} className="modal">
        <div className="modal-box">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg">Sisesta uue menüü nimi</h3>

            <details ref={langDropdownRef} className="dropdown dropdown-end">
              <summary className="btn m-1">
                <span className={`fi fi-${formLanguage}`}></span>
              </summary>

              <ul className="menu dropdown-content gap-y-2 bg-base-100 border border-base-300 rounded-box z-1 w-20 p-2 shadow-sm">
                <li>
                  <button
                    onClick={() => handleFormLanguageChange("ee")}
                    className={`btn ${formLanguage === "ee" && "btn-primary"}`}
                  >
                    <span className="fi fi-ee"></span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => handleFormLanguageChange("gb")}
                    className={`btn ${formLanguage === "gb" && "btn-primary"}`}
                  >
                    <span className="fi fi-gb"></span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => handleFormLanguageChange("ru")}
                    className={`btn ${formLanguage === "ru" && "btn-primary"}`}
                  >
                    <span className="fi fi-ru"></span>
                  </button>
                </li>
              </ul>
            </details>
          </div>

          <Form action="." method="POST" id="new-menu-form" className="w-full">
            <fieldset className="fieldset w-full mt-2">
              <input
                type="text"
                className={`input w-full ${formLanguage !== "ee" && "hidden"}`}
                placeholder="Nimi eesti keeles"
                name="newMenuTitleEE"
                required={formLanguage === "ee"}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
                placeholder="Nimi vene keeles"
                name="newMenuTitleRU"
                required={formLanguage === "ru"}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
                placeholder="Nimi inglise keeles"
                name="newMenuTitleEN"
                required={formLanguage === "gb"}
              />

              {actionData && !actionData.success && (
                <p className="label text-error">
                  {getMenuErrorMessage(actionData.errorMsg!)}
                </p>
              )}
            </fieldset>
          </Form>

          <div className="w-full flex justify-between items-center mt-10">
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn">
                  <ArrowLeft /> Tagasi
                </button>
              </form>
            </div>

            <button form="new-menu-form" className="btn btn-primary">
              Lisa
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DashboardManageMenu;
