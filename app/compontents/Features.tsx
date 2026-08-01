// rgb(214,197,162)
import clock from "~/src/features-clock.png";
import circle from "~/src/features-circle.png";
import wheat from "~/src/features-wheat.png";

const Features = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 bg-[rgb(247,240,226)] rounded-3xl border-2 border-[rgb(207,188,146)]">
        <div
          className="relative rounded-lg p-6
            after:absolute
            after:bottom-0
            after:left-1/2
            after:h-1
            after:w-4/5
            after:-translate-x-1/2
            after:rounded-2xl
            after:bg-[rgb(214,197,162)]
            after:content-['']
            md:after:bottom-auto
            md:after:left-auto
            md:after:right-0
            md:after:top-1/2
            md:after:h-4/5
            md:after:w-1
            md:after:translate-x-0
            md:after:-translate-y-1/2
            flex
            flex-col
            items-center text-center"
        >
          <div className="inline-flex rounded-lg p-3 ">
            <img src={circle} className="size-20" />
          </div>

          <h3 className="uppercase mt-4 text-lg font-semibold text-[rgb(76,87,52)]">
            kohapeal valmistatud
          </h3>

          <p className="mt-2 text-pretty text-gray-700">
            Varske pasta ja hoolikalt valitud lisandid.
          </p>
        </div>

        <div
          className="relative rounded-lg p-6
            after:absolute
            after:bottom-0
            after:left-1/2
            after:h-1
            after:w-4/5
            after:-translate-x-1/2
            after:rounded-2xl
            after:bg-[rgb(214,197,162)]
            after:content-['']
            md:after:bottom-auto
            md:after:left-auto
            md:after:right-0
            md:after:top-1/2
            md:after:h-4/5
            md:after:w-1
            md:after:translate-x-0
            md:after:-translate-y-1/2
            flex
            flex-col
            items-center text-center"
        >
          <div className="inline-flex rounded-lg p-3 ">
            <img src={wheat} className="size-20" />
          </div>

          <h3 className="uppercase mt-4 text-lg font-semibold text-[rgb(76,87,52)]">
            kvaliteetne tooraine
          </h3>

          <p className="mt-2 text-pretty text-gray-700">
            Selge maitse, aus koostis ja hooajaline valik.
          </p>
        </div>

        <div
          className="rounded-lg p-6 flex
            flex-col
            items-center text-center"
        >
          <div className="inline-flex rounded-lg p-3 ">
            <img src={clock} className="size-20" />
          </div>

          <h3 className="uppercase mt-4 text-lg font-semibold text-[rgb(76,87,52)]">
            Kiire teenindus
          </h3>

          <p className="mt-2 text-pretty text-[rgb(114,101,79)]">
            Restorani tunne mugavas tanavatoidu vormis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
