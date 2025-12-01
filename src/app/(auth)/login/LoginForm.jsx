"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { useThemeContext } from "../../provider";
import useAuthStore from "@/store/authStore";
import { Sun, Moon } from "lucide-react";

export default function LoginForm() {
  const { isDark, toggleTheme, mounted } = useThemeContext();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiConfig.post("/api/v1/users/login", form);
      const { user, accessToken } = res.data.data;
      
      localStorage.setItem("accessToken", accessToken);
      useAuthStore.getState().setUser(user);
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
                  Welcome Back
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-2 text-[#e6e2dd]">
                    SIGN
                  </h1>
                  <div className="h-1.5 w-32 sm:w-40 bg-gradient-to-r from-[#d48166] to-[#d48166]/60" />
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-2 text-[#d48166]">
                    IN
                  </h2>
                </div>
              </div>

              <div className="space-y-6 mt-8 lg:mt-0 animate-slide-left stagger-2">
                <p className="leading-relaxed text-sm text-[#e6e2dd]/90">
                  Access your account and continue where you left off. Secure
                  login in seconds.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Fast & secure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Encrypted connection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-[#d48166]" />
                    <span className="text-sm text-[#e6e2dd]">Instant access</span>
                  </div>
                </div>

                <p className="text-sm pt-4 border-t border-dashed border-[#d48166]/30 text-[#e6e2dd]">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="font-bold text-[#d48166] hover:opacity-80 transition-opacity"
                  >
                    Create one
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:w-3/5 p-6 sm:p-8 lg:p-12 theme-surface">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 tracking-tight theme-text animate-slide-right">
                Sign In
              </h3>

              <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">
                <div className="animate-slide-right stagger-1">
                  <label className="label-text">
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
                    className={`input-field ${focusedField === "identifier" ? "border-[#b86b52]" : ""}`}
                  />
                </div>

                <div className="animate-slide-right stagger-2">
                  <label className="label-text">
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
                    className={`input-field ${focusedField === "password" ? "border-[#b86b52]" : ""}`}
                  />
                </div>

                <div className="h-px my-6 sm:my-8 bg-gradient-to-r from-transparent via-[#d48166]/30 to-transparent" />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 sm:py-4 animate-slide-right stagger-3"
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
                    className={`p-4 text-center text-xs font-semibold uppercase tracking-wide animate-scale-in border-2 border-dashed ${
                      message.includes("Successful")
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
