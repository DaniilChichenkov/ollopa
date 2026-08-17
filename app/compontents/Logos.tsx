import Logo from "~/src/logo-transparent.png";
import InstaLogo from "~/src/insta-logo.png";
import { type LogosTranslations } from "~/routes/home";

const Logos = ({ translations }: { translations: LogosTranslations }) => {
  return (
    <div className="w-screen bg-[rgb(65,44,28)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-px md:grid-cols-2 items-center">
          <div className="flex flex-col items-center p-4">
            <img src={Logo} alt="Logo" />
          </div>

          <div className="flex flex-col items-center p-4">
            <p className="uppercase text-[rgb(199,159,99)]">
              {translations.eyebrow}
            </p>
            <div className="flex items-center">
              <img className="size-20" src={InstaLogo} alt="Insta Logo" />
              <p className="text-2xl text-[rgb(253,248,235)]">@ollopa_pasta</p>
            </div>
            <p className="text-[rgb(253,248,235)]">{translations.followText}</p>
          </div>

          {/* <div className="flex flex-col items-center p-4">
            <a
              href="https://www.instagram.com/ollopa_pasta/"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase cursor-pointer inline-flex items-center justify-center rounded-full bg-[rgb(177,102,55)] px-6 py-4 text-lg font-semibold text-[rgb(253,248,235)] shadow-sm transition-colors border-0"
            >
              {translations.followText}
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Logos;
