import { Diamond } from "lucide-react";
import example from "~/src/hero.jpeg";
import { type GalleryTranslations } from "~/routes/home";

const Gallery = ({ translations }: { translations: GalleryTranslations }) => {
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
          <button className="cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm">
            Pasta
          </button>
          <button className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm">
            Pasta
          </button>
          <button className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm">
            Pasta
          </button>
          <button className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm">
            Pasta
          </button>
        </div>
        <div></div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <a href="#" className="group block overflow-hidden">
              <img
                src={example}
                alt=""
                className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
              />
            </a>
          </li>

          <li>
            <a href="#" className="group block overflow-hidden">
              <img
                src={example}
                alt=""
                className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
              />
            </a>
          </li>

          <li>
            <a href="#" className="group block overflow-hidden">
              <img
                src={example}
                alt=""
                className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
              />
            </a>
          </li>

          <li>
            <a href="#" className="group block overflow-hidden">
              <img
                src={example}
                alt=""
                className="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5 rounded-2xl"
              />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Gallery;
