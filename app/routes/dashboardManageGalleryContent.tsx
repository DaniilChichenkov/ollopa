import { ArrowLeft, Ellipsis, Pen, Plus, Trash } from "lucide-react";
import type { Route } from "./+types/dashboardManageGalleryContent";
import { useEffect, useRef, useState } from "react";
import { Form, Link, redirect, useFetcher, useNavigation } from "react-router";

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(key);
  }

  return value.trim();
}

// Helper to display proper message of gallery errors
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

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { galleryId } = params;

  try {
    const { getGalleryContent } = await import("~/db/gallery.server");
    const galleryContent = getGalleryContent(+galleryId);

    return {
      success: true,
      galleryContent,
    };
  } catch (error) {
    return { success: false };
  }
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { galleryId, lang } = params;

  // Handle title change
  if (request.method === "PATCH") {
    try {
      const formData = await request.formData();

      const newGalleryTitleEE = getRequiredString(
        formData,
        "newGalleryTitleEE",
      );
      const newGalleryTitleEN = getRequiredString(
        formData,
        "newGalleryTitleEN",
      );
      const newGalleryTitleRU = getRequiredString(
        formData,
        "newGalleryTitleRU",
      );

      const { changeGalleryTitle } = await import("~/db/gallery.server");

      changeGalleryTitle(
        {
          et: newGalleryTitleEE,
          en: newGalleryTitleEN,
          ru: newGalleryTitleRU,
        },
        +galleryId,
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        errorMsg:
          error instanceof Error ? error.message : "Something went wrong.",
      };
    }
  } else if (request.method === "POST") {
    // Handle files upload
    const formData = await request.formData();
    const { getFiles } = await import("~/utils/getFiles");

    try {
      // Get files selected by user
      const files = getFiles(formData, "files", {
        maxSize: 5 * 1024 * 1024,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      // Upload files
      const { storeGalleryFiles } = await import("~/utils/storeGalleryFiles");

      await storeGalleryFiles(+galleryId, files);

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errorMsg: "invalidFiles",
      };
    }
  } else if (request.method === "DELETE") {
    const { getGalleryContent } = await import("~/db/gallery.server");
    const { deleteGallery } = await import("~/db/gallery.server");
    const { deleteGalleryItemImage } =
      await import("~/utils/delete-gallery-item-image.server");

    try {
      const { galleryItems } = getGalleryContent(+galleryId);

      deleteGallery(+galleryId);

      // Delete files (If item has one)
      await Promise.all(
        galleryItems
          .filter((item) => item.file_name)
          .map((item) => deleteGalleryItemImage(item.file_name!)),
      );

      return redirect(`/${lang}/dashboard/gallery`);
    } catch (error) {
      return { success: false };
    }
  }
};

const DashboardManageGalleryContent = ({
  loaderData,
  actionData,
  params,
}: Route.ComponentProps) => {
  const { galleryContent } = loaderData;
  const { lang, galleryId } = params;
  const fetcher = useFetcher();
  const { state } = useNavigation();

  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.open = false;
    }
  };

  // Change title of a Gallery
  const changeGalleryTitleModal = useRef<HTMLDialogElement>(null);
  const [formLanguage, setFormLanguage] = useState("ee");
  const langDropdownRef = useRef<HTMLDetailsElement>(null);

  const handleFormLanguageChange = (lang: string) => {
    if (langDropdownRef.current) {
      langDropdownRef.current.open = false;
    }
    setFormLanguage(lang);
  };

  // Upload photos modal
  const uploadPhotosModal = useRef<HTMLDialogElement>(null);
  const openUploadsModal = () => {
    uploadPhotosModal.current?.showModal();
  };

  // Delete modal
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [deleteModalInnerHTML, setDeleteModalInnerHTML] =
    useState<React.ReactNode | null>(null);

  // Delete entire gallery
  const handleDeleteBtnClick = (id: number) => {
    if (deleteModalRef.current) {
      setDeleteModalInnerHTML(
        <>
          {" "}
          <h3 className="font-bold text-lg">
            Kas soovite kogu galerii kindlasti kustutada?
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

  // Delete only one item
  const handleDeleteOneItemBtnClick = (id: number) => {
    if (deleteModalRef.current) {
      setDeleteModalInnerHTML(
        <>
          {" "}
          <h3 className="font-bold text-lg">
            Kas soovite selle pildi kindlasti kustutada?
          </h3>
          <div className="w-full flex justify-between items-center mt-10">
            <div className="modal-action mt-0">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Ei</button>
              </form>
            </div>

            <fetcher.Form
              action={`/${lang}/dashboard/gallery/${galleryId}/${id}`}
              method="POST"
            >
              <input type="hidden" name="id" value={id} />
              <button className="btn btn-primary">Jah</button>
            </fetcher.Form>
          </div>
        </>,
      );

      deleteModalRef.current.showModal();
    }
  };

  useEffect(() => {
    if (actionData?.success) {
      changeGalleryTitleModal?.current?.close();
      uploadPhotosModal?.current?.close();
      deleteModalRef?.current?.close();
      setDeleteModalInnerHTML(null);
    }
  }, [actionData]);

  useEffect(() => {
    if (fetcher.data?.success) {
      deleteModalRef.current?.close();
      setDeleteModalInnerHTML(null);
    }
  }, [fetcher]);

  return (
    <div className="w-full min-h-screen p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center border-b-2 border-base-300 py-5">
        <div className="flex justify-start items-center gap-x-3">
          <Link to={`/${lang}/dashboard/gallery`} className="btn btn-ghost">
            <ArrowLeft />
          </Link>

          <p className="text-xl font-semibold">
            {loaderData.success && loaderData.galleryContent?.gallery?.title_et}
          </p>
        </div>

        <details ref={dropdownRef} className="dropdown dropdown-end">
          <summary className="btn m-1">
            <Ellipsis />
          </summary>

          <ul className="menu gap-y-3 dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <button
                className="btn btn-primary w-full justify-between"
                onClick={() => {
                  closeDropdown();
                  openUploadsModal();
                }}
              >
                <Plus /> Lisa fotosid
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  closeDropdown();
                  changeGalleryTitleModal.current?.showModal();
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
                  handleDeleteBtnClick(+galleryId!);
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

      {/* Content */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-y-5 gap-x-5 mt-10">
        {loaderData.galleryContent?.galleryItems?.map((item) => (
          <div
            className="card border border-base-300 bg-base-100 w-full shadow-sm"
            key={item.id}
          >
            <figure>
              <img
                src={`/resources/gallery-item-image/${item.file_name}`}
                className="w-20 mt-5"
                alt="Galerii foto"
              />
            </figure>

            <div className="card-body">
              <div className="card-actions justify-end">
                <button
                  onClick={() => handleDeleteOneItemBtnClick(item.id)}
                  className="btn btn-warning"
                >
                  <Trash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Change title modal */}
      <dialog ref={changeGalleryTitleModal} className="modal">
        <div className="modal-box">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-bold text-lg">Sisesta galerii uus nimi</h3>

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

          <Form action="." method="PATCH" id="new-menu-form" className="w-full">
            <fieldset className="fieldset w-full mt-2">
              <input
                type="text"
                className={`input w-full ${formLanguage !== "ee" && "hidden"}`}
                placeholder="Nimi eesti keeles"
                name="newGalleryTitleEE"
                required={formLanguage === "ee"}
                defaultValue={galleryContent?.gallery.title_et}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
                placeholder="Nimi vene keeles"
                name="newGalleryTitleRU"
                required={formLanguage === "ru"}
                defaultValue={galleryContent?.gallery.title_ru}
              />

              <input
                type="text"
                className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
                placeholder="Nimi inglise keeles"
                name="newGalleryTitleEN"
                required={formLanguage === "gb"}
                defaultValue={galleryContent?.gallery.title_en}
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

            <button form="new-menu-form" className="btn btn-primary">
              Kinnita
            </button>
          </div>
        </div>
      </dialog>

      {/* Upload files modal */}
      <dialog ref={uploadPhotosModal} className="modal">
        <div className="modal-box">
          <div className="w-full flex flex-col items-start">
            <h3 className="text-lg font-bold">Fotode üleslaadimine</h3>

            <p className="py-4">Vali üleslaadimiseks fotod.</p>

            <Form
              id="uploadFilesForm"
              action="."
              method="POST"
              className="w-full"
              encType="multipart/form-data"
            >
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend">Vali fotod</legend>

                <input
                  required
                  multiple
                  type="file"
                  name="files"
                  className="file-input w-full"
                />

                <label className="label">Maksimaalne faili suurus: 10 MB</label>
              </fieldset>
            </Form>

            <div className="w-full flex justify-between items-center mt-10">
              <div className="modal-action mt-0">
                <form method="dialog">
                  <button className="btn">Sulge</button>
                </form>
              </div>

              <button
                disabled={state !== "idle"}
                form="uploadFilesForm"
                className="btn btn-primary"
              >
                Laadi üles
              </button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Delete modal */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">{deleteModalInnerHTML}</div>
      </dialog>
    </div>
  );
};

export default DashboardManageGalleryContent;
