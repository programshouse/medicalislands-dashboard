import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdWork,
  MdBusiness,
  MdArticle,
  MdDescription,
  MdReviews,
} from "react-icons/md";
import { ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

/** Use your existing items; they will be sorted A→Z by name */
const navItems = [
  { name: "Blogs",    icon: <MdArticle />,     path: "/blogs"   },
  { name: "Contact",  icon: <MdDescription />, path: "/form"    },
  { name: "Reviews",  icon: <MdReviews />,     path: "/reviews" },
  { name: "Services", icon: <MdBusiness />,    path: "/services"},
  { name: "Workshops",icon: <MdWork />,        path: "/workshop"},
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  // sort A→Z
  const getSortedNavItems = (items) =>
    [...items].sort((a, b) => (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }));

  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    setOpenSubmenu(null);
  }, [location]);

  const handleSubmenuToggle = (index) =>
    setOpenSubmenu((prev) => (prev && prev.index === index ? null : { index }));

  const wide = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-brand-800
        bg-brand-600 text-white transition-all duration-300 ease-in-out lg:mt-0
        dark:bg-[#0a2235] dark:border-[#0d2a42]
        ${wide ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex py-8 lg:justify-center">
        <Link to="/">
          {wide ? (
            <img
              className=" bg-white rounded-full"
              src="/images/logo/medicalLogo.webp"
              alt="Medical Islands"
              width={120}
              height={35}
            />
          ) : (
            <img
              src="/images/logo/medicalLogo.webp"
              alt="Medical Islands"
              width={52}
              height={52}
              className="rounded-full"
            />
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="no-scrollbar flex flex-col overflow-y-auto pb-6 duration-300 ease-linear">
        <ul className="flex flex-col gap-2">
          {getSortedNavItems(navItems).map((nav, index) => {
            const active = isActive(nav.path);
            return (
              <li key={nav.name}>
                <Link
                  to={nav.path}
                  className={[
                    // base
                    "group flex items-center gap-3 rounded-xl px-6 mx-4 py-2.5 transition-colors",
                    // width behavior
                    wide ? "" : "lg:justify-center",
                    // colors (white text; soft bg on hover; stronger bg when active)
                    active
                      ? "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  title={!wide ? nav.name : undefined}
                >
                  <span
                    className={[
                      "text-xl",
                      active ? "text-white" : "text-white/90 group-hover:text-white",
                    ].join(" ")}
                  >
                    {nav.icon}
                  </span>
                  {wide && <span className="text-sm font-medium">{nav.name}</span>}
                  {wide && nav.subItems && (
                    <ChevronDownIcon
                      className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                        openSubmenu?.index === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Example submenu container – keep if you plan to use submenus */}
                {nav.subItems && wide && (
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ display: openSubmenu?.index === index ? "block" : "none" }}
                  >
                    <ul className="mt-2 ml-9 space-y-1">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {wide ? <SidebarWidget /> : null}
      </nav>
    </aside>
  );
};

export default AppSidebar;
