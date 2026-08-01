import Logo from "~/src/logo.png";
import { Menu } from "lucide-react";

const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="drawer">
      <input
        id="my-drawer-2"
        type="checkbox"
        className="drawer-toggle lg:hidden"
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar xl:px-20 2xl:px-40 bg-[rgb(252,247,232)] w-full border-b-2 py-4 border-[rgb(207,188,146)]">
          <div className="mx-2 flex-1 px-2">
            <p className="text-2xl font-lobster md:hidden"> Ollopa Pasta</p>
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
            <ul className="menu menu-horizontal gap-x-10 text-xl">
              {/* Navbar menu content here */}
              <li>
                <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                  Avaleht
                </a>
              </li>
              <li>
                <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                  Menuu
                </a>
              </li>
              <li>
                <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                  Meist
                </a>
              </li>
              <li>
                <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                  Asukoht
                </a>
              </li>

              {/* Language selection */}
              <li>
                <details className="dropdown">
                  <summary className="uppercase text-[rgb(97,63,33)] font-semibold">
                    est <span className="fi fi-ee"></span>
                  </summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-auto p-2 shadow-sm">
                    <li>
                      <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                        est <span className="fi fi-ee"></span>
                      </a>
                    </li>
                    <li>
                      <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                        eng <span className="fi fi-gb"></span>
                      </a>
                    </li>
                    <li>
                      <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                        rus <span className="fi fi-ru"></span>
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
              <li className="bg-[rgb(76,87,52)] rounded-3xl text-[rgb(253,248,235)] py-2">
                <a className="uppercase">Vaata Menuud</a>
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
            <a className="uppercase">Avaleht</a>
          </li>
          <li>
            <a className="uppercase">Menuu</a>
          </li>
          <li>
            <a className="uppercase">Meist</a>
          </li>
          <li>
            <a className="uppercase">Asukoht</a>
          </li>
          <li className="bg-[rgb(76,87,52)] rounded-xl text-[rgb(253,248,235)] py-2">
            <a className="uppercase">Vaata Menuud</a>
          </li>

          {/* Language selection */}
          <li className="mt-5">
            <details className="dropdown dropdown-center">
              <summary className="uppercase text-[rgb(97,63,33)] font-semibold">
                est <span className="fi fi-ee"></span>
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
                <li>
                  <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                    est <span className="fi fi-ee"></span>
                  </a>
                </li>
                <li>
                  <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                    eng <span className="fi fi-gb"></span>
                  </a>
                </li>
                <li>
                  <a className="uppercase text-[rgb(97,63,33)] font-semibold">
                    rus <span className="fi fi-ru"></span>
                  </a>
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
