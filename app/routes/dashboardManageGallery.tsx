import { useEffect, useRef, useState } from "react";
import { Form, NavLink, useNavigation, useParams } from "react-router";
import type { Route } from "./+types/dashboardManageGallery";
import { ArrowLeft, Pen, Plus, Images } from "lucide-react";

// Helper for form validation
function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

// Helper to display proper message of gallery creation errors
type GalleryTitleErrorKey =
  "newGalleryTitleEE" | "newGalleryTitleEN" | "newGalleryTitleRU" | string;

export function getGalleryErrorMessage(errorKey: GalleryTitleErrorKey): string {
  switch (errorKey) {
    case "newGalleryTitleEE":
      return "Palun sisestage galerii pealkiri eesti keeles.";

    case "newGalleryTitleEN":
      return "Palun sisestage galerii pealkiri inglise keeles.";

    case "newGalleryTitleRU":
      return "Palun sisestage galerii pealkiri vene keeles.";

    default:
      return "Galerii loomisel tekkis viga.";
  }
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  try {
    const { getAllGalleries } = await import("~/db/gallery.server");
    const galleries = getAllGalleries();

    return {
      galleries,
      success: true,
    };
  } catch (error) {
    return { success: false };
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  try {
    const formData = await request.formData();

    const newGalleryTitleEE = getRequiredString(formData, "newGalleryTitleEE");
    const newGalleryTitleEN = getRequiredString(formData, "newGalleryTitleEN");
    const newGalleryTitleRU = getRequiredString(formData, "newGalleryTitleRU");

    const { createNewGallery } = await import("~/db/gallery.server");

    createNewGallery({
      et: newGalleryTitleEE,
      en: newGalleryTitleEN,
      ru: newGalleryTitleRU,
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

const DashboardManageGallery = ({
  actionData,
  loaderData,
}: Route.ComponentProps) => {
  const { lang } = useParams();
  const { galleries } = loaderData;

  const [formLanguage, setFormLanguage] = useState("ee");
  const { state } = useNavigation();

  const newGalleryModalRef = useRef<HTMLDialogElement>(null);
  const openModal = () => {
    newGalleryModalRef.current?.showModal();
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
      newGalleryModalRef.current?.close();
    }
  }, [actionData]);

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center gap-x-3 border-2 border-base-300 p-4 rounded-xl">
        <p className="text-lg">Galeriid</p>
        <button onClick={openModal} className="btn btn-primary">
          <Plus /> Lisa galerii
        </button>
      </header>

      {/* Gallerys */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5 xl:grid-cols-3 mt-10">
        {galleries?.map((item) => (
          <NavLink
            key={item.id}
            to={`/${lang}/dashboard/gallery/${item.id}`}
            className={() =>
              `w-full flex justify-start items-center bg-base-200 rounded-xl p-4 gap-x-5`
            }
          >
            <Images />
            <div className="flex-1">
              <div className="w-full flex justify-between items-center">
                <p className="font-bold text-lg">{item.title_et}</p>
                <button className="btn">
                  <Pen />
                </button>
              </div>
              <p>{item.items_count ?? 0} fotot</p>
            </div>
          </NavLink>
        ))}
      </div>

      {/* New Gallery modal */}
      <dialog ref={newGalleryModalRef} className="modal">
        <div className="modal-box">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg">Sisesta uue galerii nimi</h3>
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
                name="newGalleryTitleEE"
                required={formLanguage === "ee"}
              />
              <input
                type="text"
                className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
                placeholder="Nimi vene keeles"
                name="newGalleryTitleRU"
                required={formLanguage === "ru"}
              />
              <input
                type="text"
                className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
                placeholder="Nimi inglise keeles"
                name="newGalleryTitleEN"
                required={formLanguage === "gb"}
              />
              {actionData && !actionData.success && (
                <p className="label text-error">
                  {getGalleryErrorMessage(actionData.errorMsg!)}
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

            <button
              disabled={state !== "idle"}
              form="new-menu-form"
              className="btn btn-primary"
            >
              Kinnita
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DashboardManageGallery;
