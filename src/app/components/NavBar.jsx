"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import { useThemeContext } from "../provider";
import { Sun, Moon, LogOut, ChevronDown, Search, Layout, Menu, X } from "lucide-react";
import SearchModal from "./SearchModal";

export default function NavBar() {
  const { isDark, toggleTheme, mounted } = useThemeContext();
  const { user, loading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <>
      <nav className="border-b-2 border-dashed border-[#d48166] theme-surface sticky top-0 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <a href="/boards" className="flex items-center gap-2 sm:gap-3 group">
              <div className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-dashed border-[#b86b52] bg-[#d48166] flex items-center justify-center text-xs sm:text-sm font-black text-[#e6e2dd] group-hover:scale-105 transition-transform">
                TF
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight theme-text heading-bold">
                TASKFLOW
              </span>
            </a>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {user && (
                <button
                  onClick={() => setShowSearch(true)}
                  className="btn-secondary p-2 flex items-center gap-2 text-sm"
                >
                  <Search size={16} />
                  <span className="hidden md:inline">Search</span>
                </button>
              )}

              <button
                onClick={toggleTheme}
                className="btn-primary p-2"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {!loading && (
                <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
                  {user ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 btn-secondary p-2"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-dashed border-[#d48166] bg-[#d48166] flex items-center justify-center font-bold text-[#e6e2dd] text-xs sm:text-sm">
                          {user.fullName?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="hidden md:block theme-text font-medium text-sm truncate max-w-[120px]">
                          {user.fullName}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`theme-text transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 leather-panel theme-surface animate-scale-in z-50">
                          <div className="p-3 border-b border-dashed border-[#d48166]">
                            <p className="font-bold theme-text text-sm truncate">
                              {user.fullName}
                            </p>
                            <p className="text-xs theme-text opacity-60 truncate">
                              {user.email}
                            </p>
                          </div>
                          <a
                            href="/boards"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full p-3 text-left flex items-center gap-2 theme-text hover:bg-[var(--surface-hover)] text-sm transition-colors block"
                          >
                            <Layout size={14} />
                            <span>My Boards</span>
                          </a>
                          <button
                            onClick={handleLogout}
                            className="w-full p-3 text-left flex items-center gap-2 text-red-500 hover:bg-[var(--surface-hover)] text-sm transition-colors"
                          >
                            <LogOut size={14} />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a href="/login" className="btn-primary text-sm">
                      Login
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="btn-primary p-2"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-secondary p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-dashed border-[#d48166] theme-surface animate-slide-down">
            <div className="px-4 py-3 space-y-3">
              {user && (
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary w-full p-3 flex items-center justify-center gap-2 text-sm"
                >
                  <Search size={16} />
                  Search
                </button>
              )}
              
              {!loading && user && (
                <div className="leather-card p-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 border-2 border-dashed border-[#d48166] bg-[#d48166] flex items-center justify-center font-bold text-[#e6e2dd]">
                      {user.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold theme-text text-sm truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs theme-text opacity-60 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-danger w-full p-2 flex items-center justify-center gap-2 text-sm"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}

              {!loading && !user && (
                <a href="/login" className="btn-primary w-full p-3 text-center block text-sm">
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </nav>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
