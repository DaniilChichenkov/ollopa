import { Diamond } from "lucide-react";
import { useEffect, useState } from "react";
import { type FindUsTranslations } from "~/routes/home";

const FindUs = ({ translations }: { translations: FindUsTranslations }) => {
  const [isMounted, setMountedState] = useState(false);
  useEffect(() => {
    setMountedState(true);
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:mt-10">
        {/* Header */}
        <header className="text-center w-full md:w-6/12 md:mx-auto">
          <h2 className="text-3xl font-bold sm:text-3xl uppercase text-[rgb(97,63,33)]">
            {translations.title}
          </h2>

          <p className="mx-auto mt-4 max-w-md  uppercase text-[rgb(177,102,55)]">
            {translations.address}
          </p>

          <div className="divider before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]">
            <Diamond size={50} fill="rgb(184,138,72)" color="rgb(184,138,72)" />
          </div>
        </header>

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8 md:mt-10">
          <div className="bg-[rgb(253,248,235)] p-4 rounded-2xl border border-[rgb(221,204,169)]">
            <p className="uppercase text-[rgb(177,102,55)] font-semibold">
              {translations.addressTitle}
            </p>
            <p className="text-[rgb(97,63,33)] text-2xl">
              {translations.address}
            </p>
            <div className="divider before:h-px after:h-px before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

            <p className="uppercase text-[rgb(177,102,55)] font-semibold">
              {translations.openingHoursTitle}
            </p>
            <p className="text-[rgb(58,49,38)] uppercase text-lg font-semibold">
              {translations.openingHours}
            </p>
            <p className="uppercase text-[rgb(177,102,55)] font-semibold mt-5">
              {translations.contactTitle}
            </p>
            <p className="text-[rgb(58,49,38)] uppercase text-lg font-semibold">
              {translations.contact}
            </p>
            <p className="mt-10 text-[rgb(114,101,79)]">
              {translations.description}
            </p>
            <button className="mt-10 uppercase cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(76,87,52)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm">
              {translations.mapsButton}
            </button>
          </div>

          <div className="bg-[rgb(253,248,235)] p-4 rounded-2xl border border-[rgb(221,204,169)]">
            {isMounted && (
              <iframe
                width="100%"
                height="400"
                allowFullScreen
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBVizdQeh3udy11xDc5Ao2YStR2gLc-rfc&amp;q=Aia%2010%2C%20Narva-J&amp;maptype=roadmap&amp;zoom=14"
              >
                <a href="https://www.maps.ie/create-google-map/">
                  Embed Google Streetview
                </a>
              </iframe>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindUs;
