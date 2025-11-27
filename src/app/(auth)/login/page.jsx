"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { email, set } from "zod";
import { Flashlight } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const colors = {
    warm: "#d48166",
    dark: "#373a36",
    light: "#e6e2dd",
  };

  return (
    <div className="border h-screen w-full flex items-center justify-center">
      <div className="border h-2/3 w-2/3 flex">
        <div className="border w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-4xl">Welcome</h1>
          <h1 className="text-4xl">Back</h1>
        </div>
        <div className="border w-full">
          <form onSubmit={submitHandler}>
            <div className="flex flex-col ">
              <label htmlFor="identifier">Username or Email</label>
              <input
                type="text"
                id="identifier"
                placeholder="Enter Username or Email"
                value={form.identifier}
                onChange={(e) => {
                  setForm({ ...form, identifier: e.target.value });
                }}
                className="border p-4 rounded-lg w-1/3"
              />
            </div>
            <div className="flex flex-col ">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                id="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
                className="border p-4 rounded-lg w-1/3"
              />
            </div>
            <div className="border mt-4 h-fit">
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: colors.warm,
                  borderColor: colors.warm,
                  color: colors.light,
                }}
                className="border w-1/4 p-4 rounded-lg"
              >
                {loading ? <span>Logging In...</span> : "LOG IN"}
              </button>

              {message && (
                <div
                  className={`p-4 text-center text-xs font-semibold uppercase tracking-wide animate-[fadeIn_0.3s_ease-out] border-2`}
                  style={{
                    backgroundColor: message.includes("Logged In")
                      ? `${colors.warm}15`
                      : "#FEE2E215",
                    color: message.includes("Logged In")
                      ? colors.warm
                      : "#DC2626",
                    borderColor: message.includes("Logged In")
                      ? colors.warm
                      : "#FCA5A5",
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
