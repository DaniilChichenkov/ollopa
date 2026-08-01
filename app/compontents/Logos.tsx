import Logo from "~/src/logo-transparent.png";
import InstaLogo from "~/src/insta-logo.png";

const Logos = () => {
  return (
    <div className="w-screen bg-[rgb(65,44,28)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px md:grid-cols-3 items-center">
          <div className="flex flex-col items-center p-4">
            <img src={Logo} alt="Logo" />
          </div>

          <div className="flex flex-col items-center p-4">
            <p className="uppercase text-[rgb(199,159,99)]">
              tanane menuu ja pakkumised
            </p>
            <div className="flex items-center">
              <img className="size-20" src={InstaLogo} alt="Insta Logo" />
              <p className="text-2xl text-[rgb(253,248,235)]">@ollopa_pasta</p>
            </div>
            <p className="text-[rgb(253,248,235)]">jalgi meid instagramis</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <button className="uppercase cursor-pointer inline-flex items-center justify-center rounded-full bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm transition-colors border-0">
              Ava instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logos;
