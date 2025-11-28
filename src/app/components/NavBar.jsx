"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore.js";
import { useTheme, getTheme } from "../useTheme";

export default function NavBar() {
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, loading, checkAuth } = useAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const colors = getTheme(isDark);

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <nav
      className="border-b-2 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300"
      style={{
        borderBottomColor: colors.warm,
        backgroundColor: colors.light,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a
            href="/boards"
            className="flex items-center gap-3 group transition-all duration-300"
          >
            <div
              className="h-8 w-8 border-2 flex items-center justify-center text-sm font-black"
              style={{
                borderColor: colors.warm,
                backgroundColor: colors.warm,
                color: colors.light,
              }}
            >
              TF
            </div>
            <span
              className="text-xl font-black tracking-tight transition-colors duration-300"
              style={{ color: colors.dark }}
            >
              TaskFlow
            </span>
          </a>

          {/* Right Side - Theme Toggle & Auth */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border-2 font-bold transition-all duration-300 hover:opacity-80 active:scale-95"
              style={{
                borderColor: colors.warm,
                backgroundColor: colors.warm,
                color: colors.light,
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* Auth Section */}
            {!loading && (
              <div className="relative">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div
                      className="text-sm font-semibold transition-colors duration-300"
                      style={{ color: colors.dark }}
                    >
                      Welcome,{" "}
                      <span style={{ color: colors.warm }}>
                        {user.username || user.fullName}
                      </span>
                    </div>

                    {/* User Dropdown */}
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-4 py-2 border-2 font-bold transition-all duration-300 hover:opacity-80 active:scale-95"
                      style={{
                        borderColor: colors.warm,
                        backgroundColor: isDark ? "#1a1a1a" : "#FFFFFF",
                        color: colors.dark,
                      }}
                    >
                      {user.username || user.fullName}
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div
                        className="absolute top-full right-0 mt-2 w-48 border-2 shadow-lg animate-[slideUp_0.2s_ease-out] transition-colors duration-300"
                        style={{
                          borderColor: colors.warm,
                          backgroundColor: colors.light,
                        }}
                      >
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left font-semibold transition-all duration-300 hover:opacity-70 border-t-2"
                          style={{
                            color: "#DC2626",
                            borderTopColor: `${colors.warm}20`,
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="px-6 py-2 border-2 font-bold transition-all duration-300 hover:opacity-80 active:scale-95"
                    style={{
                      borderColor: colors.warm,
                      backgroundColor: colors.warm,
                      color: colors.light,
                    }}
                  >
                    Login
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
