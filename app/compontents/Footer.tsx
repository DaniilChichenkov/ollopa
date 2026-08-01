import logo from "~/src/logo-transparent.png";
import insta from "~/src/insta-footer.png";

const Footer = () => {
  return (
    <footer className="bg-[rgb(76,88,52)]">
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <img src={logo} className="w-5/12" />
        </div>
        <div className="divider before:h-px after:h-px before:bg-[rgb(152,158,119)] after:bg-[rgb(152,158,119)]"></div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px md:grid-cols-3 items-center">
          <div className="flex flex-col items-center p-4">
            <p className="text-[rgb(253,248,235)] uppercase font-semibold">
              Aia 10, Narva Joesuu
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <p className="text-[rgb(253,248,235)] uppercase font-semibold">
              Varske kasitoo pasta
            </p>
          </div>

          <div className="flex justify-center items-center p-4 gap-x-3">
            <img src={insta} className="size-10" alt="Insta logo" />
            <p className="text-[rgb(253,248,235)] uppercase font-semibold">
              @ollopa_pasta
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
