// Sidebar.jsx
import { useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import dashboardlinks from "../../data/dashboardlinks";
import { SidebarLinks } from "./SidebarLinks";
import { IoFlashSharp } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-50 rounded-full bg-primary p-3 text-white shadow-lg shadow-black/20 md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation drawer"
      >
        <LuMenu size={24} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-indigo-950/50 bg-background transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0 w-72" : "-translate-x-full w-72"
        }`}
      >
        {/* Top Section */}

        <div className="flex flex-col gap-2 justify-center items-start p-4">
          <div className="flex items-center gap-x-3">
            <IoFlashSharp size={30} className="text-primary" />
            <h1 className="text-white font-semibold text-xl md:block">
              MathArena
            </h1>
          </div>

          <button
            className="text-white md:hidden"
            onClick={() => setOpen(false)}
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Links */}

        <div className="flex flex-col mt-4 w-full flex-1 px-4 md:px-6">
          {dashboardlinks.map((link, index) => (
            <SidebarLinks key={index} link={link} open={open} />
          ))}
        </div>

        {/* bottom section */}

        <div className="w-full mx-auto flex flex-col mt-auto px-4 pb-5 md:px-6">
          <div className="h-px bg-indigo-950 w-full mb-4"></div>
          <div
            className="hover:cursor-pointer hover:bg-tertiary p-3 rounded-lg flex items-center gap-x-3 w-full"
            onClick={handleLogout}
          >
            <CiLogout size={24} className="text-gray-50" />
            <span
              className={`text-gray-50 ${open ? "block" : "hidden"} md:block`}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
