import { Diamond, Euro, Camera } from "lucide-react";
import example from "~/src/hero.jpeg";
import { type MenuTranslations } from "~/routes/home";

const Menu = ({ translations }: { translations: MenuTranslations }) => {
  return (
    <section className="bg-[rgb(238,225,197)] pb-10">
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

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li className="bg-[rgb(253,248,235)] rounded-3xl border border-[rgb(202,181,135)] p-4">
            <div className="w-full flex flex-col items-start">
              {/* Header */}
              <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                klassikud
              </p>
              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              {/* Content */}
              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="bg-[rgb(253,248,235)] rounded-3xl border border-[rgb(202,181,135)] p-4">
            <div className="w-full flex flex-col items-start">
              {/* Header */}
              <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                klassikud
              </p>
              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              {/* Content */}
              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="bg-[rgb(253,248,235)] rounded-3xl border border-[rgb(202,181,135)] p-4">
            <div className="w-full flex flex-col items-start">
              {/* Header */}
              <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                klassikud
              </p>
              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              {/* Content */}
              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li className="bg-[rgb(253,248,235)] rounded-3xl border border-[rgb(202,181,135)] p-4">
            <div className="w-full flex flex-col items-start">
              {/* Header */}
              <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                klassikud
              </p>
              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              {/* Content */}
              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>

              <div className="divider before:h-px after:h-px py-0 my-0 before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

              <div className="w-full py-4">
                <div className="w-full flex justify-between items-center text-xl">
                  <div className="flex justify-start items-center flex-wrap">
                    <p className="text-[rgb(97,63,33)] wrap-break-words">
                      Pasta nimetus
                    </p>
                  </div>
                  <div className="flex items-center font-bold">
                    <p>00</p>
                    <Euro strokeWidth={2.5} size={15} />
                  </div>
                </div>
                <p className="text-[rgb(114,101,79)] mt-2">
                  Luhike kirjeldus, kaste ja peamised koostiosad
                </p>

                {/* Image */}
                <div className="w-full flex justify-center items-center mt-5">
                  <div className="size-40 overflow-hidden rounded-xl">
                    <img src={example} alt="Menu image" className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className="w-full flex justify-center">
        <button className="uppercase cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(97,63,33)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm transition-colors focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none">
          {translations.fullMenuInstagramButton}
        </button>
      </div>
    </section>
  );
};

export default Menu;
