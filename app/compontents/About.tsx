import image from "~/src/about.png";
import { Quote } from "lucide-react";
import { type AboutTranslations } from "~/routes/home";

const About = ({ translations }: { translations: AboutTranslations }) => {
  return (
    <section id="about">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-8">
          <div className="md:order-2">
            <div className="max-w-prose md:max-w-none">
              <p className="text-[rgb(177,102,55)] uppercase font-semibold">
                {translations.eyebrow}
              </p>
              <h2 className="text-3xl font-semibold text-[rgb(97,63,33)] sm:text-4xl mt-4">
                {translations.title}
              </h2>

              <p className="mt-4 text-pretty text-lg text-[rgb(58,49,38)] whitespace-pre-line">
                {translations.description}
              </p>

              <div className="mt-10 divider before:h-px after:h-px before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <p className="text-[rgb(76,87,52)] text-4xl mt-5">
                "{translations.quote}"
              </p>

              <a
                href="https://www.instagram.com/ollopa_pasta/"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase mt-10 cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-200 focus-visible:outline-none"
              >
                {translations.instagramButton}
              </a>
            </div>
          </div>

          <div className="md:order-1">
            <img src={image} className="rounded-2xl mt-10" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
