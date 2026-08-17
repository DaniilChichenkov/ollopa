import { Diamond, Euro, Camera } from "lucide-react";
import example from "~/src/hero.jpeg";
import { type MenuTranslations } from "~/routes/home";
import { useParams } from "react-router";

export type MenuWithItems = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items: {
    id: number;
    menu_id: number;

    title_et: string;
    title_en: string;
    title_ru: string;

    description_et: string | null;
    description_en: string | null;
    description_ru: string | null;
    updated_at: string | null;

    price: string;

    image_file_name: string | null;
  }[];
};

const Menu = ({
  translations,
  menus,
}: {
  translations: MenuTranslations;
  menus: MenuWithItems[];
}) => {
  const { lang } = useParams<{ lang: "et" | "en" | "ru" }>();

  return (
    <section className="bg-[rgb(238,225,197)] pb-10" id="menu">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 rounded-2xl">
        <header className="text-center w-full md:w-6/12 md:mx-auto">
          <h2 className="text-3xl font-bold sm:text-3xl uppercase text-[rgb(97,63,33)]">
            {translations.title}
          </h2>

          <p className="mx-auto mt-4 max-w-md  uppercase text-[rgb(177,102,55)]">
            {translations.subtitle}
          </p>

          <div className="divider before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]">
            <Diamond size={50} fill="rgb(184,138,72)" color="rgb(184,138,72)" />
          </div>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {menus?.map((menu, menuIndex, menuArr) => (
            <li
              key={menu.id}
              className="bg-[rgb(253,248,235)] rounded-3xl border border-[rgb(202,181,135)] p-4"
            >
              <div className="w-full flex flex-col items-start">
                {/* Header */}
                <p className="uppercase text-[rgb(177,102,55)] font-semibold break-all">
                  {menu[`title_${lang!}`]}
                </p>
                <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

                {/* Content */}
                {menu.items.map((menuRow) => (
                  <div key={`menu-row-${menuRow.id}`} className="w-full">
                    <div className="w-full py-4">
                      <div className="w-full flex justify-between items-center text-xl">
                        <div className="flex justify-start items-center flex-wrap">
                          <p className="text-[rgb(97,63,33)] wrap-break-words break-all">
                            {menuRow[`title_${lang!}`]}
                          </p>
                        </div>
                        <div className="flex items-center font-bold">
                          <p>{menuRow.price}</p>
                          <Euro strokeWidth={2.5} size={15} />
                        </div>
                      </div>
                      <p className="text-[rgb(114,101,79)] mt-2 break-all">
                        {menuRow[`description_${lang!}`]}
                      </p>

                      {/* Image */}
                      {menuRow.image_file_name && (
                        <div className="w-full flex justify-center items-center mt-5">
                          <div className="size-40 overflow-hidden rounded-xl">
                            <img
                              src={`/resources/menu-item-image/${menuRow.image_file_name}?v=${menuRow.updated_at}`}
                              alt="Menu image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full flex justify-center">
        <a
          href="https://www.instagram.com/ollopa_pasta/"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(97,63,33)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm transition-colors focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none"
        >
          {translations.fullMenuInstagramButton}
        </a>
      </div>
    </section>
  );
};

export default Menu;
