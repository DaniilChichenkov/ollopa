import { Form, NavLink, Outlet, useLocation, useParams } from "react-router";
import type { Route } from "../+types/root";
import { Menu, LogOut } from "lucide-react";
import { useRef } from "react";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  return requireUser(request);
};

const Dashboard = () => {
  const { lang } = useParams();
  const { pathname } = useLocation();

  const menuRef = useRef<HTMLInputElement>(null);
  const handleMenuNavLinkClick = () => {
    if (menuRef.current) {
      menuRef.current.checked = false;
    }
  };

  const renderTitle = () => {
    if (pathname.includes("/dashboard/gallery")) {
      return "Galerii haldamine";
    } else if (pathname.includes("/dashboard/location")) {
      return "Müügikohtade haldamine";
    } else if (pathname.includes("/dashboard/change-password")) {
      return "Muuda Parooli";
    } else {
      return "Menüü haldamine";
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        ref={menuRef}
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col items-center justify-start">
        {/* Navigation bar */}
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">{renderTitle()}</a>
          </div>
          <div className="flex-none">
            <label
              htmlFor="my-drawer-3"
              className="btn drawer-button lg:hidden"
            >
              <Menu />
            </label>
          </div>
        </div>

        {/* Content */}
        <Outlet />
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="Sulge külgmenüü"
          className="drawer-overlay"
        ></label>

        <ul className="menu menu-lg bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <p>Ollopa halduspaneel</p>
          </li>

          <li className="mt-5">
            <NavLink
              end
              to={`/${lang}/dashboard`}
              className={({ isActive }) => `${isActive && "bg-primary"}`}
              onClick={handleMenuNavLinkClick}
            >
              Menüü
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) => `${isActive && "bg-primary"}`}
              to={`/${lang}/dashboard/gallery`}
              end
              onClick={handleMenuNavLinkClick}
            >
              Galerii
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) => `${isActive && "bg-primary"}`}
              to={`/${lang}/dashboard/location`}
              end
              onClick={handleMenuNavLinkClick}
            >
              Müügikohad
            </NavLink>
          </li>

          <li>
            <NavLink
              className={({ isActive }) => `${isActive && "bg-primary"}`}
              to={`/${lang}/dashboard/change-password`}
              end
              onClick={handleMenuNavLinkClick}
            >
              Muuda parooli
            </NavLink>
          </li>

          <li className="mt-10">
            <Form action="/logout" method="POST" className="w-full">
              <button
                className="btn btn-warning w-full btn-wide"
                onClick={handleMenuNavLinkClick}
              >
                <LogOut /> Logi välja
              </button>
            </Form>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
