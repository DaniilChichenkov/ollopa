import Logo from "~/src/Logo.png";
import LogoHeader from "~/src/logo-header.png";
import { Menu } from "lucide-react";

import { type NavigationTranslations } from "~/routes/home";
import { Link, useParams, useSearchParams } from "react-router";
import { useRef } from "react";

const flagsMap = {
  en: "gb",
  et: "ee",
  ru: "ru",
};

const Header = ({
  children,
  translations,
}: {
  children: React.ReactNode;
  translations: NavigationTranslations;
}) => {
  const { lang } = useParams<{ lang: "en" | "et" | "ru" }>();

  const langSelectorRegular = useRef<HTMLDetailsElement>(null);
  const langSelectorMobile = useRef<HTMLDetailsElement>(null);
  const drawerCheckbox = useRef<HTMLInputElement>(null);

  const handleLangBtnClick = () => {
    if (langSelectorRegular.current) {
      langSelectorRegular.current.open = false;
    }
    if (langSelectorMobile.current) {
      langSelectorMobile.current.open = false;
    }
    if (drawerCheckbox.current) {
      drawerCheckbox.current.checked = false;
    }
  };

  const handleNavSrollToSectionBtnClick = (section: string) => {
    if (drawerCheckbox.current) {
      drawerCheckbox.current.checked = false;
    }

    const elementToScrollTo = document.getElementById(section);
    if (elementToScrollTo) {
      elementToScrollTo.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle lg:hidden"
        ref={drawerCheckbox}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar xl:px-20 2xl:px-40 bg-[rgb(252,247,232)] w-full border-b-2 py-4 border-[rgb(207,188,146)]">
          <div className="mx-2 flex-1 px-2 flex justify-center md:block">
            {/* <p className="text-2xl font-lobster md:hidden"> Ollopa Pasta</p> */}
            <img
              src={Logo}
              alt="Ollopa Logo"
              className="w-40 object-contain aspect-video md:hidden"
            />
            <img src={Logo} alt="Logo" className="w-40 hidden md:block" />
          </div>
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-xl btn-square btn-ghost drawer-button"
            >
              <Menu size={40} />
            </label>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal items-center gap-x-3 text-lg xl:text-xl">
              {/* Navbar menu content here */}
              <li>
                <button
                  onClick={() => handleNavSrollToSectionBtnClick("header")}
                  className="uppercase text-[rgb(97,63,33)] font-semibold"
                >
                  {translations.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavSrollToSectionBtnClick("menu")}
                  className="uppercase text-[rgb(97,63,33)] font-semibold"
                >
                  {translations.menu}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavSrollToSectionBtnClick("about")}
                  className="uppercase text-[rgb(97,63,33)] font-semibold"
                >
                  {translations.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavSrollToSectionBtnClick("location")}
                  className="uppercase text-[rgb(97,63,33)] font-semibold"
                >
                  {translations.location}
                </button>
              </li>

              {/* Language selection */}
              <li>
                <details ref={langSelectorRegular} className="dropdown">
                  <summary className="uppercase text-[rgb(97,63,33)] font-semibold">
                    {lang}{" "}
                    <span
                      className={`fi fi-${flagsMap[lang ? lang : "et"]}`}
                    ></span>
                  </summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-auto p-2 shadow-sm">
                    <li>
                      <Link
                        to="/et"
                        onClick={handleLangBtnClick}
                        className="uppercase text-[rgb(97,63,33)] font-semibold"
                      >
                        ee <span className="fi fi-ee"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/en"
                        onClick={handleLangBtnClick}
                        className="uppercase text-[rgb(97,63,33)] font-semibold"
                      >
                        en <span className="fi fi-gb"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/ru"
                        onClick={handleLangBtnClick}
                        className="uppercase text-[rgb(97,63,33)] font-semibold"
                      >
                        ru <span className="fi fi-ru"></span>
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
              <li className="bg-[rgb(76,87,52)] rounded-3xl text-[rgb(253,248,235)] py-2">
                <button
                  onClick={() => handleNavSrollToSectionBtnClick("menu")}
                  className="uppercase"
                >
                  {translations.viewMenu}
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu menu-xl gap-y-5 min-h-full w-80 p-4 bg-[rgb(252,247,232)]">
          {/* Sidebar content here */}
          <li>
            <button
              onClick={() => handleNavSrollToSectionBtnClick("header")}
              className="uppercase"
            >
              {translations.home}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavSrollToSectionBtnClick("menu")}
              className="uppercase"
            >
              {translations.menu}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavSrollToSectionBtnClick("about")}
              className="uppercase"
            >
              {translations.about}
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavSrollToSectionBtnClick("location")}
              className="uppercase"
            >
              {translations.location}
            </button>
          </li>
          <li className="bg-[rgb(76,87,52)] rounded-xl text-[rgb(253,248,235)] py-2">
            <button
              onClick={() => handleNavSrollToSectionBtnClick("menu")}
              className="uppercase"
            >
              {translations.viewMenu}
            </button>
          </li>

          {/* Language selection */}
          <li className="mt-5">
            <details
              ref={langSelectorMobile}
              className="dropdown dropdown-center"
            >
              <summary className="uppercase text-[rgb(97,63,33)] font-semibold">
                {lang}{" "}
                <span
                  className={`fi fi-${flagsMap[lang ? lang : "et"]}`}
                ></span>
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
                <li>
                  <Link
                    to="/et"
                    onClick={handleLangBtnClick}
                    className="uppercase text-[rgb(97,63,33)] font-semibold"
                  >
                    et <span className="fi fi-ee"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/en"
                    onClick={handleLangBtnClick}
                    className="uppercase text-[rgb(97,63,33)] font-semibold"
                  >
                    en <span className="fi fi-gb"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ru"
                    onClick={handleLangBtnClick}
                    className="uppercase text-[rgb(97,63,33)] font-semibold"
                  >
                    ru <span className="fi fi-ru"></span>
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          <div className="mt-10">
            <img src={Logo} alt="Logo" />
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
