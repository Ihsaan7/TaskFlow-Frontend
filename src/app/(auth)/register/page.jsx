"use client";
import React, { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { useRouter } from "next/navigation";
import { useThemeContext } from "../../provider";
import { Sun, Moon } from "lucide-react";

export default function Register() {
  const { isDark, toggleTheme, mounted } = useThemeContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("avatar", document.getElementById("avatar").files[0]);
    formData.append(
      "coverImage",
      document.getElementById("coverImage").files[0]
    );

    try {
      const res = await apiConfig.post("/api/v1/users/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Registered! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden relative theme-bg p-4">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-3 btn-primary"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 blur-3xl animate-pulse opacity-20"
          style={{ backgroundColor: "#d48166" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 blur-3xl animate-pulse opacity-10"
          style={{ backgroundColor: isDark ? "#e6e2dd" : "#373a36" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto animate-slide-up">
        <div className="leather-panel overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-[#d48166]"
              style={{
                backgroundColor: isDark ? "#2a2520" : "#373a36",
              }}
            >
              <div className="space-y-4 animate-slide-left">
                <div className="inline-block px-4 py-2 border-2 border-dashed border-[#d48166] text-xs font-bold tracking-widest uppercase bg-[#d48166]/20 text-[#d48166]">
                  Get Started
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2 text-[#e6e2dd]">
                    CREATE
                  </h1>
                  <div className="h-1.5 w-28 sm:w-36 bg-gradient-to-r from-[#d48166] to-[#d48166]/60" />
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2 text-[#d48166]">
                    ACCOUNT
                  </h2>
                </div>
              </div>

              <div className="space-y-6 mt-8 lg:mt-0 animate-slide-left stagger-2">
                <p className="leading-relaxed text-sm text-[#e6e2dd]/90">
                  Create your account and join our community. Simple, secure,
                  and fast.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Quick registration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Fully secure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Ready to go</span>
                  </div>
                </div>

                <p className="text-sm pt-4 border-t border-dashed border-[#d48166]/30 text-[#e6e2dd]">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold text-[#d48166] hover:opacity-80 transition-opacity"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12 theme-surface">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 tracking-tight theme-text animate-slide-right">
                Sign Up
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="animate-slide-right stagger-1">
                    <label className="label-text">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      onFocus={() => setFocusedField("fullName")}
                      onBlur={() => setFocusedField("")}
                      placeholder="John Doe"
                      className={`input-field ${focusedField === "fullName" ? "border-[#b86b52]" : ""}`}
                    />
                  </div>

                  <div className="animate-slide-right stagger-2">
                    <label className="label-text">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField("")}
                      placeholder="johndoe123"
                      className={`input-field ${focusedField === "username" ? "border-[#b86b52]" : ""}`}
                    />
                  </div>
                </div>

                <div className="animate-slide-right stagger-3">
                  <label className="label-text">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    placeholder="john@example.com"
                    className={`input-field ${focusedField === "email" ? "border-[#b86b52]" : ""}`}
                  />
                </div>

                <div className="animate-slide-right stagger-4">
                  <label className="label-text">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Create a strong password"
                    className={`input-field ${focusedField === "password" ? "border-[#b86b52]" : ""}`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2 animate-slide-right stagger-5">
                  <div>
                    <label className="label-text">Avatar (Optional)</label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="w-full text-xs theme-text file:mr-3 file:py-2 file:px-3 file:border-2 file:border-dashed file:border-[#d48166] file:font-semibold file:cursor-pointer file:bg-[#d48166] file:text-[#e6e2dd] file:uppercase file:text-xs file:tracking-wide cursor-pointer border-2 border-dashed border-[#d48166] p-2 focus:outline-none theme-surface"
                    />
                  </div>

                  <div>
                    <label className="label-text">Cover Image (Optional)</label>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      className="w-full text-xs theme-text file:mr-3 file:py-2 file:px-3 file:border-2 file:border-dashed file:border-[#d48166] file:font-semibold file:cursor-pointer file:bg-[#d48166] file:text-[#e6e2dd] file:uppercase file:text-xs file:tracking-wide cursor-pointer border-2 border-dashed border-[#d48166] p-2 focus:outline-none theme-surface"
                    />
                  </div>
                </div>

                <div className="h-px my-5 sm:my-6 bg-gradient-to-r from-transparent via-[#d48166]/30 to-transparent" />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 sm:py-4 animate-slide-right stagger-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>

                {message && (
                  <div
                    className={`p-4 text-center text-xs font-semibold uppercase tracking-wide animate-scale-in border-2 border-dashed ${
                      message.includes("Registered")
                        ? "bg-[#d48166]/15 text-[#d48166] border-[#d48166]"
                        : "bg-red-100 text-red-600 border-red-400 dark:bg-red-900/20"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
