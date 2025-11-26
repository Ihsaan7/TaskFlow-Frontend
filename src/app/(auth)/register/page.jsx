"use client";
import React, { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { useRouter } from "next/navigation";

export default function Register() {
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
      setTimeout(() => router.push("/api/v1/users/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    warm: "#d48166",
    dark: "#373a36",
    light: "#e6e2dd",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
      style={{ backgroundColor: colors.light }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 blur-3xl animate-pulse"
          style={{ backgroundColor: `${colors.warm}10` }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 blur-3xl animate-pulse"
          style={{ backgroundColor: `${colors.dark}10` }}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,129,102,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,129,102,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 w-full max-w-6xl mx-4 animate-[fadeIn_0.6s_ease-out]">
        <div
          className="border-2 backdrop-blur-xl overflow-hidden"
          style={{
            borderColor: colors.warm,
            backgroundColor: colors.light,
          }}
        >
          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2"
              style={{
                borderColor: colors.warm,
                backgroundColor: colors.dark,
              }}
            >
              <div className="space-y-4 animate-[slideUp_0.5s_ease-out]">
                <div
                  className="inline-block px-4 py-2 border text-xs font-bold tracking-widest uppercase"
                  style={{
                    borderColor: colors.warm,
                    backgroundColor: `${colors.warm}20`,
                    color: colors.warm,
                  }}
                >
                  ✨ Get Started
                </div>
                <div>
                  <h1
                    className="text-5xl lg:text-6xl font-black tracking-tight mb-2"
                    style={{ color: colors.light }}
                  >
                    CREATE
                  </h1>
                  <div
                    className="h-1.5 w-40"
                    style={{
                      background: `linear-gradient(to right, ${colors.warm}, ${colors.warm}80)`,
                    }}
                  ></div>
                  <h2
                    className="text-5xl lg:text-6xl font-black tracking-tight mt-2"
                    style={{
                      color: colors.warm,
                    }}
                  >
                    ACCOUNT
                  </h2>
                </div>
              </div>

              <div className="space-y-6 animate-[slideUp_0.6s_ease-out]">
                <p
                  className="leading-relaxed text-sm"
                  style={{ color: colors.light }}
                >
                  Create your account and join our community. Simple, secure,
                  and fast.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span className="text-sm" style={{ color: colors.light }}>
                      Quick registration
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span className="text-sm" style={{ color: colors.light }}>
                      Fully secure
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span className="text-sm" style={{ color: colors.light }}>
                      Ready to go
                    </span>
                  </div>
                </div>

                <p
                  className="text-sm pt-4 border-t"
                  style={{
                    borderTopColor: `${colors.warm}30`,
                    color: colors.light,
                  }}
                >
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold transition-colors duration-300"
                    style={{
                      color: colors.warm,
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    Sign in →
                  </a>
                </p>
              </div>
            </div>

            <div
              className="lg:w-3/5 p-8 lg:p-12"
              style={{ backgroundColor: colors.light }}
            >
              <h3
                className="text-2xl font-bold mb-8 tracking-tight"
                style={{
                  color: colors.dark,
                }}
              >
                Sign Up
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="animate-[slideUp_0.4s_ease-out]">
                    <label
                      className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                      style={{ color: colors.dark }}
                    >
                      Full Name
                    </label>
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
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor:
                          focusedField === "fullName" ? colors.warm : "#D0CCC8",
                        color: colors.dark,
                      }}
                      className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Username */}
                  <div className="animate-[slideUp_0.45s_ease-out]">
                    <label
                      className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                      style={{ color: colors.dark }}
                    >
                      Username
                    </label>
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
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor:
                          focusedField === "username" ? colors.warm : "#D0CCC8",
                        color: colors.dark,
                      }}
                      className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="animate-[slideUp_0.5s_ease-out]">
                  <label
                    className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: colors.dark }}
                  >
                    Email Address
                  </label>
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
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor:
                        focusedField === "email" ? colors.warm : "#D0CCC8",
                      color: colors.dark,
                    }}
                    className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Password */}
                <div className="animate-[slideUp_0.55s_ease-out]">
                  <label
                    className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: colors.dark }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="••••••••"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor:
                        focusedField === "password" ? colors.warm : "#D0CCC8",
                      color: colors.dark,
                    }}
                    className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 animate-[slideUp_0.6s_ease-out]">
                  <div>
                    <label
                      className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                      style={{ color: colors.dark }}
                    >
                      Avatar
                    </label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D0CCC8",
                        color: colors.dark,
                      }}
                      className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:border-2 file:font-semibold file:cursor-pointer file:transition-all file:duration-300 file:uppercase file:text-xs file:tracking-wide cursor-pointer border-2 p-3 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-3 uppercase tracking-wide"
                      style={{ color: colors.dark }}
                    >
                      Cover Image
                    </label>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#D0CCC8",
                        color: colors.dark,
                      }}
                      className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:border-2 file:font-semibold file:cursor-pointer file:transition-all file:duration-300 file:uppercase file:text-xs file:tracking-wide cursor-pointer border-2 p-3 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="h-px my-8"
                  style={{
                    background: `linear-gradient(to right, transparent, ${colors.warm}30, transparent)`,
                  }}
                ></div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: colors.warm,
                    borderColor: colors.warm,
                    color: colors.light,
                  }}
                  className="w-full border-2 font-bold py-4 px-8 uppercase tracking-wide transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`p-4 text-center text-xs font-semibold uppercase tracking-wide animate-[fadeIn_0.3s_ease-out] border-2`}
                    style={{
                      backgroundColor: message.includes("Registered")
                        ? `${colors.warm}15`
                        : "#FEE2E215",
                      color: message.includes("Registered")
                        ? colors.warm
                        : "#DC2626",
                      borderColor: message.includes("Registered")
                        ? colors.warm
                        : "#FCA5A5",
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
