import { Diamond } from "lucide-react";
import example from "~/src/hero.jpeg";
import { type GalleryTranslations } from "~/routes/home";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export type GalleryItem = {
  id: number;
  gallery_id: number;
  file_name: string;
};

export type GalleryWithItems = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items: GalleryItem[];
};

const Gallery = ({
  translations,
  galleries,
}: {
  translations: GalleryTranslations;
  galleries: GalleryWithItems[];
}) => {
  const { lang } = useParams<{ lang: "et" | "en" | "ru" }>();
  const [currentGallery, setCurrentGallery] = useState(galleries[0].id ?? null);

  const activeGalleryButtonClasses =
    "cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm";

  return (
    <section className="border-[rgb(207,188,146)] border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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

        {/* Sections */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5 mt-10">
          {galleries?.map((gallery) => (
            <button
              key={gallery.id}
              onClick={() => setCurrentGallery(gallery.id)}
              className={`${currentGallery === gallery.id ? activeGalleryButtonClasses : "cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm break-all"}`}
            >
              {gallery[`title_${lang!}`]}
            </button>
          ))}
        </div>

        <div className="carousel rounded-box mt-8 space-x-4 p-4">
          {galleries.map((gallery) =>
            gallery.id === currentGallery
              ? gallery.items.map((image, i) => (
                  <div
                    id={`item${i + 1}`}
                    className="carousel-item"
                    key={`${gallery.id}-${image.id}`}
                  >
                    <img
                      src={`/resources/gallery-item-image/${image.file_name}`}
                      alt=""
                      className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
                    />
                  </div>
                ))
              : null,
          )}
        </div>
        <div className="w-full justify-center gap-2 py-2 hidden lg:flex mt-3">
          {galleries.map((gallery) =>
            gallery.id === currentGallery
              ? gallery.items.map((image, i) => (
                  <a
                    key={`linkToItem${i + 1}`}
                    href={`#item${i + 1}`}
                    className="btn btn-sm"
                  >
                    {i + 1}
                  </a>
                ))
              : null,
          )}
        </div>

        {/* <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleries.map((gallery) =>
            gallery.id === currentGallery
              ? gallery.items.map((image) => (
                  <li key={`${gallery.id}-${image.id}`}>
                    <button className="group block overflow-hidden cursor-pointer w-full">
                      <img
                        src={`/resources/gallery-item-image/${image.file_name}`}
                        alt=""
                        className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
                      />
                    </button>
                  </li>
                ))
              : null,
          )}
        </ul> */}
      </div>
    </section>
  );
};

export default Gallery;
