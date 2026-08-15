import { Form, Link, Outlet, redirect, useParams } from "react-router";
import type { Route } from "./+types/dashboardManageMenuContent";
import { ArrowLeft, Ellipsis, Pen, Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { menuId } = params;
  const { getFullMenuById } = await import("~/db/menu.server");

  try {
    const { menu } = getFullMenuById(+menuId!);
    return { menu, success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { menuId, lang } = params;

  // Change menu title
  if (request.method === "POST") {
    try {
      const formData = await request.formData();

      const newMenuTitleEE = getRequiredString(formData, "newMenuTitleEE");
      const newMenuTitleEN = getRequiredString(formData, "newMenuTitleEN");
      const newMenuTitleRU = getRequiredString(formData, "newMenuTitleRU");

      const { changeMenuTitle } = await import("~/db/menu.server");

      changeMenuTitle(
        { et: newMenuTitleEE, en: newMenuTitleEN, ru: newMenuTitleRU },
        +menuId,
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errorMsg:
          error instanceof Error ? error.message : "Something went wrong.",
      };
    }
  } else if (request.method === "DELETE") {
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id || typeof +id !== "number") {
      return { success: false };
    }

    const { getFullMenuById, deleteMenuById } =
      await import("~/db/menu.server");
    const { deleteMenuItemImage } =
      await import("~/utils/delete-menu-item-image.server");

    try {
      const { menuItems } = getFullMenuById(+id);

      // Delete DB record
      deleteMenuById(+id);

      // Delete files (If provided)
      await Promise.all(
        menuItems
          .filter((item) => item.image_file_name)
          .map((item) => deleteMenuItemImage(item.image_file_name!)),
      );

      return redirect(`/${lang}/dashboard`);
    } catch (error) {
      return {
        success: false,
      };
    }
  }
};

const DashboardManageMenuContent = ({
  loaderData,
  actionData,
}: Route.ComponentProps) => {
  const { lang, menuId } = useParams();
  const { menu } = loaderData;

  // Change title of a Menu
  const changeMenuTitleModal = useRef<HTMLDialogElement>(null);
  const [formLanguage, setFormLanguage] = useState("ee");
  const langDropdownRef = useRef<HTMLDetailsElement>(null);

  const handleFormLanguageChange = (lang: string) => {
    if (langDropdownRef.current) {
      langDropdownRef.current.open = false;
    }
    setFormLanguage(lang);
  };

  // Delete entire menu
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [deleteModalInnerHTML, setDeleteModalInnerHTML] =
    useState<React.ReactNode | null>(null);

  const handleDeleteBtnClick = (id: number) => {
    if (deleteModalRef.current) {
      setDeleteModalInnerHTML(
        <>
          {" "}
          <h3 className="font-bold text-lg">
            Kas soovite kogu menüü kindlasti kustutada?
          </h3>
          <div className="w-full flex justify-between items-center mt-10">
            <div className="modal-action mt-0">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Ei</button>
              </form>
            </div>

            <Form action="." method="DELETE">
              <input type="hidden" name="id" value={id} />
              <button className="btn btn-primary">Jah</button>
            </Form>
          </div>
        </>,
      );

      deleteModalRef.current.showModal();
    }
  };

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  useEffect(() => {
    if (actionData?.success) {
      changeMenuTitleModal?.current?.close();
    }
  }, [actionData]);

  return (
    <div className="w-full min-h-screen p-4">
      <header className="w-full flex justify-between items-center border-b-2 border-base-300 py-5">
        <div className="flex justify-start items-center gap-x-3">
          <Link to={`/${lang}/dashboard`} className="btn btn-ghost">
            <ArrowLeft />
          </Link>

          <p className="text-xl font-semibold">
            {loaderData.success && loaderData.menu?.title_et}
          </p>
        </div>

        <details ref={dropdownRef} className="dropdown dropdown-end">
          <summary className="btn m-1">
            <Ellipsis />
          </summary>

          <ul className="menu gap-y-3 dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <Link
                to={`/${lang}/dashboard/menu/${menuId}/new-dish`}
                className="btn btn-primary w-full justify-between"
                onClick={closeDropdown}
              >
                <Plus /> Lisa roog
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  closeDropdown();
                  changeMenuTitleModal.current?.showModal();
                }}
                className="btn btn-ghost w-full justify-between"
              >
                <Pen />
                Muuda nime
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  closeDropdown();
                  handleDeleteBtnClick(+menuId!);
                }}
                className="btn btn-warning w-full justify-between"
              >
                <Trash />
                Kustuta
              </button>
            </li>
          </ul>
        </details>
      </header>

      <Outlet />

      {/* Change title modal */}
      <dialog ref={changeMenuTitleModal} className="modal">
        <div className="modal-box">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg">Sisesta menüü uus nimi</h3>

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
                defaultValue={menu?.title_et}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
                placeholder="Nimi vene keeles"
                name="newMenuTitleRU"
                required={formLanguage === "ru"}
                defaultValue={menu?.title_ru}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
                placeholder="Nimi inglise keeles"
                name="newMenuTitleEN"
                required={formLanguage === "gb"}
                defaultValue={menu?.title_en}
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
              Salvesta
            </button>
          </div>
        </div>
      </dialog>

      {/* Delete menu modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">{deleteModalInnerHTML}</div>
      </dialog>
    </div>
  );
};

export default DashboardManageMenuContent;
