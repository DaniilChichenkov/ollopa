import DecorHero from "~/src/decor-hero.png";
import MainImg from "~/src/hero.jpeg";
import { type HeroTranslations } from "~/routes/home";

const Hero = ({ translations }: { translations: HeroTranslations }) => {
  return (
    <section className="lg:grid lg:place-content-center bg-[rgb(244,233,207)]">
      <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
        <div className="max-w-prose text-left">
          <div className="relative flex justify-start items-center gap-x-2">
            <img src={DecorHero} className="h-10 z-0" />
            <p className="uppercase text-[rgb(177,102,55)] font-semibold text-sm z-10 relative">
              {translations.eyebrow}
            </p>
          </div>

          <h1 className="text-5xl font-bold text-[rgb(97,63,33)] sm:text-6xl">
            {translations.title}
          </h1>

          <div className="inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm mt-4">
            {translations.address}
          </div>

          <p className="mt-4 text-base text-pretty text-[rgb(58,49,38)] sm:text-lg/relaxed">
            {translations.description}
          </p>

          <div className="mt-8 flex gap-4 sm:mt-6">
            <button className="cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm">
              {translations.viewMenuButton}
            </button>

            <button className="cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm">
              {translations.findUsButton}
            </button>
          </div>
        </div>

        <div className="mx-auto hidden max-w-xl text-gray-900 md:block overflow-hidden rounded-full border-2 border-[rgb(207,188,146)]">
          <img src={MainImg} className="scale-125" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
