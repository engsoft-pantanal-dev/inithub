import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserDropdown from "@/components/layout/UserDropdown";
import { useAuth } from "@/hooks/useAuth";
import type { NavLink } from "@/types/index";

const navLinks: NavLink[] = [
  { label: "Home", path: "/home" },
  { label: "Minhas Iniciativas", path: "/my-initiatives" },
  { label: "Triagem", path: "/screening", onlySpecific: true }
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const visibleNavLinks = navLinks.filter(link => {
    if (link.onlySpecific) {
      return user?.isAdmin === true;
    }
    return true;
  });

  const goToCreateInitiative = () => {
    navigate("/create-initiative");
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2" onClick={() => navigate("/home")}>
          <img src="/images/logo-inithub.svg" alt="Innovation Hub Logo" className="h-10" />
        </div>

        <nav className="hidden md:flex space-x-6">
          {visibleNavLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors duration-200
                ${isActive ? "font-bold text-gray-800" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button
            className="text-white text-sm px-6 py-2 rounded-lg font-medium flex items-center space-x-2 shadow-sm bg-[var(--green-primary)] hover:bg-green-700 transition-colors duration-200"
            onClick={goToCreateInitiative}
          >
            + Nova Iniciativa
          </button>
          <UserDropdown />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {menuOpen && <UserDropdown />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4">
          <div className="flex flex-col space-y-3 mt-3">
            {visibleNavLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors
                  ${isActive ? "font-bold text-gray-800" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              className="mt-3 text-white text-sm px-4 py-2 rounded-lg font-medium shadow-sm bg-[var(--green-primary)] hover:bg-green-700"
              onClick={goToCreateInitiative}
            >
              + Nova Iniciativa
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
