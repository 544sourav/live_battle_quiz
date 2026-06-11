// SidebarLinks.jsx
import { NavLink, matchPath, useLocation } from "react-router-dom";
import * as Icons from "react-icons/lu";

export const SidebarLinks = ({ link, open }) => {
  const Icon = Icons[link.icon];
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <NavLink
      to={link.link}
      className={`relative flex items-center px-3 rounded-lg py-3 my-1 text-sm font-medium transition-all duration-200 text-gray-50 
      ${
        matchRoute(link.link)
          ? "bg-secondary bg-opacity-70 md:bg-opacity-100 "
          : "hover:bg-tertiary"
      }`}
    >
      {/* Active Left Border */}

      {/* <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50
        ${matchRoute(link.link) ? "opacity-100" : "opacity-0"}`}
      ></span> */}

      <div className="flex items-center  gap-x-3">
        {Icon && <Icon className="text-lg" />}

        {/* Mobile */}
        <span className="truncate text-sm md:text-base">{link.name}</span>
      </div>
    </NavLink>
  );
};
