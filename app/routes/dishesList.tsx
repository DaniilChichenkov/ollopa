import { ArrowLeft, Euro, Pen, Plus, Trash } from "lucide-react";
import { Form, Link, redirect, useParams } from "react-router";
import type { Route } from "./+types/dishesList";
import { useEffect, useRef, useState } from "react";
import type { NewMenuItem } from "~/db/menu.server";

type ChangeMenuItem = NewMenuItem & {
  id: string;
};

class FormValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "FormValidationError";
    this.field = field;
  }
}

function getRequiredString(
  formData: FormData,
  field: string,
  message: string,
): string {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new FormValidationError(field, message);
  }

  return value.trim();
}

function getOptionalString(formData: FormData, field: string): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

export function getMenuItemErrorMessage(errorKey: string): string {
  switch (errorKey) {
    case "newItemTitleEE":
      return "Palun sisestage roa nimi eesti keeles.";

    case "newItemTitleEN":
      return "Palun sisestage roa nimi inglise keeles.";

    case "newItemTitleRU":
      return "Palun sisestage roa nimi vene keeles.";

    case "newItemPrice":
      return "Palun sisestage roa hind.";

    default:
      return "Roa loomisel tekkis viga.";
  }
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const { menuId } = params;
  const { getFullMenuById } = await import("~/db/menu.server");

  try {
    const { menuItems } = getFullMenuById(+menuId!);
    return { menuItems, success: true };
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

  const formData = await request.formData();
  const file = formData.get("newItemImage");

  // Delete item
  if (request.method === "DELETE") {
    const id = formData.get("id");

    if (!id || typeof +id !== "number") {
      return { success: false };
    }

    const { getMenuItemImageMetadata, deleteMenuItem } =
      await import("~/db/menu.server");
    const { deleteMenuItemImage } =
      await import("~/utils/delete-menu-item-image.server");

    try {
      // Get metadata
      const { file_name } = getMenuItemImageMetadata(+id);

      // Remove file from disk
      await deleteMenuItemImage(file_name);

      // Delete db record
      deleteMenuItem(+id);

      return { success: true };
    } catch (error) {
      return { success: false };
    }

    // Change item
  } else if (request.method === "PATCH") {
    try {
      const newMenuData: ChangeMenuItem = {
        id: getRequiredString(
          formData,
          "idOfItemToChange",
          "No item id provided",
        ),

        title_et: getRequiredString(
          formData,
          "newItemTitleEE",
          "Please enter the Estonian dish title.",
        ),

        title_en: getRequiredString(
          formData,
          "newItemTitleEN",
          "Please enter the English dish title.",
        ),

        title_ru: getRequiredString(
          formData,
          "newItemTitleRU",
          "Please enter the Russian dish title.",
        ),

        description_et: getOptionalString(formData, "newItemDescriptionEE"),

        description_en: getOptionalString(formData, "newItemDescriptionEN"),

        description_ru: getOptionalString(formData, "newItemDescriptionRU"),

        price: getRequiredString(
          formData,
          "newItemPrice",
          "Please enter the dish price.",
        ),
      };

      const {
        updateMenuItem,
        getMenuItemImageMetadata,
        createMenuItemImageMetadata,
        updateMenuItemImageMetadata,
      } = await import("~/db/menu.server");

      updateMenuItem(+newMenuData.id, newMenuData);

      if (file instanceof File && file.size > 0) {
        const { storeMenuItemImage } =
          await import("~/utils/store-menu-item-image.server");

        const storedImage = await storeMenuItemImage(file, +newMenuData.id);

        // Create metadata if image was not provided earlier
        const imageMetadata = getMenuItemImageMetadata(+newMenuData.id);
        if (!imageMetadata) {
          createMenuItemImageMetadata({
            menuItemId: +newMenuData.id,
            fileName: storedImage.fileName,
          });
        } else {
          updateMenuItemImageMetadata({
            menuItemId: +newMenuData.id,
            fileName: storedImage.fileName,
          });
        }
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, field: error.field };
    }
  }
};

const DishesList = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { lang, menuId } = useParams();
  const { menuItems } = loaderData;

  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [deleteModalInnerHTML, setDeleteModalInnerHTML] =
    useState<React.ReactNode | null>(null);

  const changeModalRef = useRef<HTMLDialogElement>(null);
  const [elementToChange, setElementToChange] = useState<number | null>(null);

  const dataOfElementToChange = elementToChange
    ? menuItems?.find((item) => item.id === elementToChange)
    : null;

  const [formLanguage, setFormLanguage] = useState("ee");
  const langDropdownRef = useRef<HTMLDetailsElement>(null);

  const [imagePreview, setImagePreview] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const file = files[0];

      if (file) {
        const filePreviewUrl = URL.createObjectURL(file);
        setImagePreview(filePreviewUrl);
      }
    }
  };

  const handleFormLanguageChange = (lang: string) => {
    if (langDropdownRef.current) {
      langDropdownRef.current.open = false;
    }

    setFormLanguage(lang);
  };

  const handleDeleteBtnClick = (id: number) => {
    if (deleteModalRef.current) {
      setDeleteModalInnerHTML(
        <>
          {" "}
          <h3 className="font-bold text-lg">
            Kas soovite selle menüüpunkti kindlasti kustutada?
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

  const handleChangeBtnClick = (id: number) => {
    setElementToChange(id);
  };

  useEffect(() => {
    if (actionData?.success) {
      if (deleteModalRef.current) {
        deleteModalRef.current.close();
        setDeleteModalInnerHTML(null);
      }

      changeModalRef.current?.close();
      setElementToChange(null);
    }
  }, [actionData]);

  useEffect(() => {
    if (!changeModalRef.current) return;

    if (!elementToChange) {
      changeModalRef.current.close();
    } else {
      changeModalRef.current.showModal();
    }
  }, [elementToChange]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [menuId]);

  return (
    <ul className="list bg-base-100 rounded-box shadow-md mt-5">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Roogade nimekiri
      </li>

      {menuItems?.map((item) => (
        <li key={item.id} className="list-row">
          <div>
            {item.image_file_name && (
              <img
                src={`/resources/menu-item-image/${item.image_file_name}?v=${item.updated_at}`}
                alt={item.title_et}
                className="size-10 rounded-box"
              />
            )}
          </div>

          <div>
            <div>{item.title_et}</div>

            <div className="text-xs uppercase font-semibold opacity-60">
              {item.description_et}
            </div>
          </div>

          <button onClick={() => handleChangeBtnClick(item.id)} className="btn">
            <Pen />
          </button>

          <button
            onClick={() => handleDeleteBtnClick(item.id)}
            className="btn btn-warning"
          >
            <Trash />
          </button>
        </li>
      ))}

      {/* Delete dialog */}
      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">{deleteModalInnerHTML}</div>
      </dialog>

      {/* Change dish dialog */}
      <dialog
        onCancel={() => setElementToChange(null)}
        ref={changeModalRef}
        className="modal"
      >
        <div className="modal-box">
          <Form
            action="."
            method="PATCH"
            encType="multipart/form-data"
            className="mt-5 rounded-xl p-4 w-full border-2 border-base-300"
          >
            <input
              type="hidden"
              name="idOfItemToChange"
              value={dataOfElementToChange?.id}
            />

            <div className="flex justify-start items-center">
              <button
                type="button"
                onClick={() => setElementToChange(null)}
                className="btn"
              >
                <ArrowLeft />
              </button>

              <div className="w-full flex justify-between items-center">
                <p className="text-lg ml-4">Muuda rooga</p>

                <details
                  ref={langDropdownRef}
                  className="dropdown dropdown-end"
                >
                  <summary className="btn m-1">
                    <span className={`fi fi-${formLanguage}`}></span>
                  </summary>

                  <ul className="menu dropdown-content gap-y-2 bg-base-100 border border-base-300 rounded-box z-1 w-20 p-2 shadow-sm">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleFormLanguageChange("ee")}
                        className={`btn ${
                          formLanguage === "ee" && "btn-primary"
                        }`}
                      >
                        <span className="fi fi-ee"></span>
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={() => handleFormLanguageChange("gb")}
                        className={`btn ${
                          formLanguage === "gb" && "btn-primary"
                        }`}
                      >
                        <span className="fi fi-gb"></span>
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={() => handleFormLanguageChange("ru")}
                        className={`btn ${
                          formLanguage === "ru" && "btn-primary"
                        }`}
                      >
                        <span className="fi fi-ru"></span>
                      </button>
                    </li>
                  </ul>
                </details>
              </div>
            </div>

            <div className="w-full flex flex-col items-center justify-start">
              <fieldset className="fieldset w-full mt-5">
                <label className="label">Roa nimi</label>

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "ee" && "hidden"
                  }`}
                  placeholder="Nimi eesti keeles"
                  name="newItemTitleEE"
                  required={formLanguage === "ee"}
                  defaultValue={dataOfElementToChange?.title_et}
                />

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "ru" && "hidden"
                  }`}
                  placeholder="Nimi vene keeles"
                  name="newItemTitleRU"
                  required={formLanguage === "ru"}
                  defaultValue={dataOfElementToChange?.title_ru}
                />

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "gb" && "hidden"
                  }`}
                  placeholder="Nimi inglise keeles"
                  name="newItemTitleEN"
                  required={formLanguage === "gb"}
                  defaultValue={dataOfElementToChange?.title_en}
                />
              </fieldset>

              <fieldset className="fieldset w-full mt-5">
                <label className="label">Roa kirjeldus (valikuline)</label>

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "ee" && "hidden"
                  }`}
                  placeholder="Kirjeldus eesti keeles"
                  name="newItemDescriptionEE"
                  defaultValue={dataOfElementToChange?.description_et ?? ""}
                />

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "ru" && "hidden"
                  }`}
                  placeholder="Kirjeldus vene keeles"
                  name="newItemDescriptionRU"
                  defaultValue={dataOfElementToChange?.description_ru ?? ""}
                />

                <input
                  type="text"
                  className={`input w-full ${
                    formLanguage !== "gb" && "hidden"
                  }`}
                  placeholder="Kirjeldus inglise keeles"
                  name="newItemDescriptionEN"
                  defaultValue={dataOfElementToChange?.description_en ?? ""}
                />
              </fieldset>

              <fieldset className="fieldset w-full mt-5">
                <label
                  className="label flex items-center"
                  htmlFor="newItemPrice"
                >
                  Roa hind <Euro size={12} />
                </label>

                <input
                  type="text"
                  id="newItemPrice"
                  className="input w-full"
                  placeholder="Hind"
                  name="newItemPrice"
                  required
                  defaultValue={dataOfElementToChange?.price}
                />
              </fieldset>

              {/* Error message */}
              {actionData && !actionData.success && (
                <div className="w-full flex justify-start">
                  {" "}
                  <p className="text-error text-lg text-left mt-3">
                    {getMenuItemErrorMessage(actionData.field)}
                  </p>
                </div>
              )}

              <fieldset className="fieldset mt-5">
                <legend className="fieldset-legend">Vali uus pilt</legend>

                <input
                  onChange={handleFileSelect}
                  type="file"
                  className="file-input"
                  name="newItemImage"
                />
              </fieldset>

              <div className="w-full flex justify-center items-center mt-5">
                {imagePreview && (
                  <img src={imagePreview} alt="Roa eelvaade" className="w-20" />
                )}
              </div>

              <button className="btn btn-primary btn-wide mt-10">
                Salvesta
              </button>
            </div>
          </Form>
        </div>
      </dialog>
    </ul>
  );
};

export default DishesList;
