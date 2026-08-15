import { Form, Link, redirect, useNavigate } from "react-router";
import { ArrowLeft, Euro } from "lucide-react";
import type { Route } from "./+types/newDish";
import { useEffect, useRef, useState } from "react";
import type { NewMenuItem } from "~/db/menu.server";

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

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  return requireUser(request);
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  const menuId = Number(params.menuId);
  const lang = params.lang;

  if (!Number.isInteger(menuId)) {
    return {
      success: false,
      badRequest: true,
      message: "Invalid menu ID.",
    };
  }

  const formData = await request.formData();
  const file = formData.get("newItemImage");

  try {
    const newMenuData: NewMenuItem = {
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

    const { createMenuItem, createMenuItemImageMetadata } =
      await import("~/db/menu.server");

    const createdItemId = createMenuItem(menuId, newMenuData);

    if (file instanceof File && file.size > 0) {
      const { storeMenuItemImage } =
        await import("~/utils/store-menu-item-image.server");

      const storedImage = await storeMenuItemImage(file, createdItemId);

      createMenuItemImageMetadata({
        menuItemId: createdItemId,
        fileName: storedImage.fileName,
      });
    }

    return redirect(`/${lang}/dashboard/menu/${menuId}`);
  } catch (error) {
    if (error instanceof FormValidationError) {
      return {
        success: false,
        badRequest: true,
        field: error.field,
        message: error.message,
      };
    }

    console.error("Failed to create menu item:", error);

    return {
      success: false,
      message: "Failed to create the dish. Please try again.",
    };
  }
};

const NewDish = ({ actionData, params }: Route.ComponentProps) => {
  const { lang, menuId } = params;
  const [imagePreview, setImagePreview] = useState("");
  const nav = useNavigate();

  const [formLanguage, setFormLanguage] = useState("ee");
  const langDropdownRef = useRef<HTMLDetailsElement>(null);

  const handleFormLanguageChange = (lang: string) => {
    if (langDropdownRef.current) {
      langDropdownRef.current.open = false;
    }

    setFormLanguage(lang);
  };

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

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Form
      action="."
      method="POST"
      encType="multipart/form-data"
      className="mt-5 rounded-xl p-4 w-full md:w-8/12 lg:w-8/12 border-2 border-base-300"
    >
      <div className="flex justify-start items-center">
        <Link to={`/${lang}/dashboard/menu/${menuId}`} className="btn">
          <ArrowLeft />
        </Link>

        <div className="w-full flex justify-between items-center">
          <p className="text-lg ml-4">Lisa uus roog</p>

          <details ref={langDropdownRef} className="dropdown dropdown-end">
            <summary className="btn m-1">
              <span className={`fi fi-${formLanguage}`}></span>
            </summary>

            <ul className="menu dropdown-content gap-y-2 bg-base-100 border border-base-300 rounded-box z-1 w-20 p-2 shadow-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleFormLanguageChange("ee")}
                  className={`btn ${formLanguage === "ee" && "btn-primary"}`}
                >
                  <span className="fi fi-ee"></span>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleFormLanguageChange("gb")}
                  className={`btn ${formLanguage === "gb" && "btn-primary"}`}
                >
                  <span className="fi fi-gb"></span>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => handleFormLanguageChange("ru")}
                  className={`btn ${formLanguage === "ru" && "btn-primary"}`}
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
            className={`input w-full ${formLanguage !== "ee" && "hidden"}`}
            placeholder="Nimi eesti keeles"
            name="newItemTitleEE"
            required={formLanguage === "ee"}
          />

          <input
            type="text"
            className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
            placeholder="Nimi vene keeles"
            name="newItemTitleRU"
            required={formLanguage === "ru"}
          />

          <input
            type="text"
            className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
            placeholder="Nimi inglise keeles"
            name="newItemTitleEN"
            required={formLanguage === "gb"}
          />
        </fieldset>

        <fieldset className="fieldset w-full mt-5">
          <label className="label">Roa kirjeldus (valikuline)</label>

          <input
            type="text"
            className={`input w-full ${formLanguage !== "ee" && "hidden"}`}
            placeholder="Kirjeldus eesti keeles"
            name="newItemDescriptionEE"
          />

          <input
            type="text"
            className={`input w-full ${formLanguage !== "ru" && "hidden"}`}
            placeholder="Kirjeldus vene keeles"
            name="newItemDescriptionRU"
          />

          <input
            type="text"
            className={`input w-full ${formLanguage !== "gb" && "hidden"}`}
            placeholder="Kirjeldus inglise keeles"
            name="newItemDescriptionEN"
          />
        </fieldset>

        <fieldset className="fieldset w-full mt-5">
          <label className="label flex items-center" htmlFor="newItemPrice">
            Roa hind <Euro size={12} />
          </label>

          <input
            type="text"
            id="newItemPrice"
            className="input w-full"
            placeholder="Hind"
            name="newItemPrice"
            required
          />
        </fieldset>

        {/* Error message */}
        {actionData && !actionData.success && (
          <div className="w-full flex justify-start">
            {" "}
            <p className="text-error text-lg text-left mt-3">
              {getMenuItemErrorMessage(actionData.field!)}
            </p>
          </div>
        )}

        <fieldset className="fieldset mt-5">
          <legend className="fieldset-legend">Roa pilt</legend>

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

        <button className="btn btn-primary btn-wide mt-10">Lisa roog</button>
      </div>
    </Form>
  );
};

export default NewDish;
