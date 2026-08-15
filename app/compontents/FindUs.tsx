import { Diamond } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { type FindUsTranslations } from "~/routes/home";

export type Location = {
  id: number;
  address: string;
  phone: string;
  weekHoursFrom: string;
  weekHoursTo: string;
  weekendHoursFrom: string;
  weekendHoursTo: string;
};

const FindUs = ({
  translations,
  locations,
}: {
  translations: FindUsTranslations;
  locations: Location[];
}) => {
  const [isMounted, setMountedState] = useState(false);
  useEffect(() => {
    setMountedState(true);
  }, []);

  const { lang } = useParams<{ lang: "et" | "en" | "ru" }>();
  const [currentLocation, setCurrentLocation] = useState(locations[0].id);
  const locationToRender = locations.find(
    (item) => item.id === currentLocation,
  );
  const locationEncodedAddress = locationToRender
    ? encodeURIComponent(locationToRender.address)
    : null;

  console.log(locationEncodedAddress);

  const activeLocationButtonClasses =
    "cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm";

  return (
    <section id="location">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:mt-10">
        {/* Header */}
        <header className="text-center w-full md:w-6/12 md:mx-auto">
          <h2 className="text-3xl font-bold sm:text-3xl uppercase text-[rgb(97,63,33)]">
            {translations.title}
          </h2>

          {/* <p className="mx-auto mt-4 max-w-md  uppercase text-[rgb(177,102,55)]">
            {translations.address}
          </p> */}

          <div className="divider before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]">
            <Diamond size={50} fill="rgb(184,138,72)" color="rgb(184,138,72)" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-5 mt-10">
          {locations?.map((location) => (
            <button
              key={location.id}
              onClick={() => setCurrentLocation(location.id)}
              className={`${currentLocation === location.id ? activeLocationButtonClasses : "cursor-pointer inline-flex items-center justify-center rounded-full border border-[rgb(184,138,72)] bg-[rgb(253,248,235)] px-6 py-4 text-lg font-semibold text-[rgb(97,63,33)] shadow-sm"}`}
            >
              {location.address}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8 mt-10">
          {locationToRender ? (
            <>
              <div className="bg-[rgb(253,248,235)] p-4 rounded-2xl border border-[rgb(221,204,169)]">
                <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                  {translations.addressTitle}
                </p>
                <p className="text-[rgb(97,63,33)] text-2xl">
                  {locationToRender.address}
                </p>
                <div className="divider before:h-px after:h-px before:bg-[rgb(184,138,72)] after:bg-[rgb(184,138,72)]"></div>

                <p className="uppercase text-[rgb(177,102,55)] font-semibold">
                  {translations.openingHoursTitle}
                </p>
                {/* Working hours week */}
                <div className="w-full flex justify-start items-center">
                  <p className="text-[rgb(58,49,38)] uppercase text-lg font-semibold">
                    {translations.openingHours}{" "}
                    <span className="ml-3">
                      {locationToRender.weekHoursFrom}-
                      {locationToRender.weekHoursTo}
                    </span>
                  </p>
                </div>

                {/* Working hours weekend */}
                <div className="w-full flex justify-start items-center">
                  <p className="text-[rgb(58,49,38)] uppercase text-lg font-semibold">
                    {translations.openingHoursWeekend}{" "}
                    <span className="ml-3">
                      {locationToRender.weekendHoursFrom}-
                      {locationToRender.weekendHoursTo}
                    </span>
                  </p>
                </div>
                <p className="uppercase text-[rgb(177,102,55)] font-semibold mt-5">
                  {translations.contactTitle}
                </p>
                <p className="text-[rgb(58,49,38)] uppercase text-lg font-semibold">
                  {locationToRender.phone}
                </p>
                <p className="text-[rgb(58,49,38)] lowercase text-lg font-semibold">
                  info@ollopa.ee
                </p>
                {/* <p className="mt-10 text-[rgb(114,101,79)]">
                  {translations.description}
                </p> */}
                <Link
                  to={`https://www.google.com/maps/search/?api=1&query=${locationEncodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-10 uppercase cursor-pointer inline-flex items-center justify-center rounded-full border bg-[rgb(76,87,52)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm"
                >
                  {translations.mapsButton}
                </Link>
              </div>

              <div className="bg-[rgb(253,248,235)] p-4 rounded-2xl border border-[rgb(221,204,169)]">
                {isMounted && (
                  <iframe
                    width="100%"
                    height="400"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBVizdQeh3udy11xDc5Ao2YStR2gLc-rfc&q=${locationEncodedAddress}&maptype=roadmap&zoom=14`}
                  />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FindUs;
