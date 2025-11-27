"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { useTheme, getTheme } from "../../useTheme";

export default function Login() {
  const { isDark, toggleTheme, mounted } = useTheme();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const colors = getTheme(isDark);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiConfig.post("/api/v1/users/login", form);
      setMessage("Login Successful! Redirecting...");

      setTimeout(() => router.push("/boards"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: colors.light }}
    >
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 p-2 mr-4 lg:mr-0 border-2 font-bold transition-all duration-300"
        style={{
          borderColor: colors.warm,
          backgroundColor: colors.warm,
          color: colors.light,
        }}
      >
        {isDark ? "☀️ Light" : "🌙 Dark"}
      </button>

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
          className="border-2 backdrop-blur-xl overflow-hidden transition-colors duration-300"
          style={{
            borderColor: colors.warm,
            backgroundColor: colors.light,
          }}
        >
          <div className="flex flex-col lg:flex-row">
            <div
              className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 transition-colors duration-300"
              style={{
                borderColor: colors.warm,
                backgroundColor: colors.dark,
              }}
            >
              <div className="space-y-4 animate-[slideUp_0.5s_ease-out]">
                <div
                  className="inline-block px-4 py-2 border text-xs font-bold tracking-widest uppercase transition-colors duration-300"
                  style={{
                    borderColor: colors.warm,
                    backgroundColor: `${colors.warm}20`,
                    color: colors.warm,
                  }}
                >
                  👋 Welcome Back
                </div>
                <div>
                  <h1
                    className="text-5xl lg:text-6xl font-black tracking-tight mb-2 transition-colors duration-300"
                    style={{ color: isDark ? "#e6e2dd" : colors.light }}
                  >
                    SIGN
                  </h1>
                  <div
                    className="h-1.5 w-40 transition-all duration-300"
                    style={{
                      background: `linear-gradient(to right, ${colors.warm}, ${colors.warm}80)`,
                    }}
                  ></div>
                  <h2
                    className="text-5xl lg:text-6xl font-black tracking-tight mt-2 transition-colors duration-300"
                    style={{
                      color: colors.warm,
                    }}
                  >
                    IN
                  </h2>
                </div>
              </div>

              <div className="space-y-6 animate-[slideUp_0.6s_ease-out]">
                <p
                  className="leading-relaxed text-sm transition-colors duration-300"
                  style={{ color: isDark ? "#e6e2dd" : colors.light }}
                >
                  Access your account and continue where you left off. Secure
                  login in seconds.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6 transition-colors duration-300"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span
                      className="text-sm transition-colors duration-300"
                      style={{ color: isDark ? "#e6e2dd" : colors.light }}
                    >
                      Fast & secure
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6 transition-colors duration-300"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span
                      className="text-sm transition-colors duration-300"
                      style={{ color: isDark ? "#e6e2dd" : colors.light }}
                    >
                      Encrypted connection
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-6 transition-colors duration-300"
                      style={{ backgroundColor: colors.warm }}
                    ></div>
                    <span
                      className="text-sm transition-colors duration-300"
                      style={{ color: isDark ? "#e6e2dd" : colors.light }}
                    >
                      Instant access
                    </span>
                  </div>
                </div>

                <p
                  className="text-sm pt-4 border-t transition-colors duration-300"
                  style={{
                    borderTopColor: `${colors.warm}30`,
                    color: isDark ? "#e6e2dd" : colors.light,
                  }}
                >
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-bold transition-colors duration-300"
                    style={{
                      color: colors.warm,
                    }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >
                    Create one →
                  </a>
                </p>
              </div>
            </div>

            <div
              className="lg:w-3/5 p-8 lg:p-12 transition-colors duration-300"
              style={{ backgroundColor: colors.light }}
            >
              <h3
                className="text-2xl font-bold mb-8 tracking-tight transition-colors duration-300"
                style={{
                  color: colors.dark,
                }}
              >
                Sign In
              </h3>

              <form onSubmit={submitHandler} className="space-y-6">
                {/* Username or Email */}
                <div className="animate-[slideUp_0.4s_ease-out]">
                  <label
                    className="block text-xs font-semibold mb-3 uppercase tracking-wide transition-colors duration-300"
                    style={{ color: colors.dark }}
                  >
                    Username or Email
                  </label>
                  <input
                    type="text"
                    id="identifier"
                    value={form.identifier}
                    onChange={(e) => {
                      setForm({ ...form, identifier: e.target.value });
                    }}
                    onFocus={() => setFocusedField("identifier")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your username or email"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor:
                        focusedField === "identifier"
                          ? colors.warm
                          : isDark
                          ? "#404040"
                          : "#D0CCC8",
                      color: isDark ? "#e6e2dd" : colors.dark,
                    }}
                    className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Password */}
                <div className="animate-[slideUp_0.45s_ease-out]">
                  <label
                    className="block text-xs font-semibold mb-3 uppercase tracking-wide transition-colors duration-300"
                    style={{ color: colors.dark }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor:
                        focusedField === "password"
                          ? colors.warm
                          : isDark
                          ? "#404040"
                          : "#D0CCC8",
                      color: isDark ? "#e6e2dd" : colors.dark,
                    }}
                    className="w-full px-4 py-3 border-2 placeholder-gray-400 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Divider */}
                <div
                  className="h-px my-8 transition-all duration-300"
                  style={{
                    background: `linear-gradient(to right, transparent, ${colors.warm}30, transparent)`,
                  }}
                ></div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: colors.warm,
                    borderColor: colors.warm,
                    color: colors.light,
                  }}
                  className="w-full border-2 font-bold py-4 px-8 uppercase tracking-wide transition-all duration-300 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed animate-[slideUp_0.5s_ease-out]"
                >
                  {loading ? (
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
                      Signing In...
                    </span>
                  ) : (
                    "SIGN IN"
                  )}
                </button>

                {message && (
                  <div
                    className={`p-4 text-center text-xs font-semibold uppercase tracking-wide animate-[fadeIn_0.3s_ease-out] border-2 transition-colors duration-300`}
                    style={{
                      backgroundColor: message.includes("Successful")
                        ? `${colors.warm}15`
                        : "#FEE2E215",
                      color: message.includes("Successful")
                        ? colors.warm
                        : "#DC2626",
                      borderColor: message.includes("Successful")
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
