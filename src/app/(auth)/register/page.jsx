"use client";
import React, { useState } from "react";
import apiConfig from "../../../../api/axios.config";
import { useRouter } from "next/navigation";

export default function Register() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
    }
  };

  return (
    <div className="border h-screen w-full flex items-center justify-center">
      <div className="border h-[80%] w-[50%] flex justify-center items-center">
        <div className=" h-[98%] w-[98%] flex">
          <div className="w-1/2  flex flex-col justify-center items-center ">
            <div className=" flex flex-col justify-center items-center h-40 w-full">
              <h1 className="text-4xl ">CREATE</h1>
              <h1 className="text-5xl ">ACCOUNT</h1>
            </div>
            <p className="text-lg hover:text-violet-300 hover:cursor-pointer">
              Have account? <a href="/login"></a>
            </p>
          </div>
          <div className="w-full ">
            <div className=" w-full h-full  px-4 flex justify-center items-center">
              <form onSubmit={handleSubmit} className="space-y-4 ">
                <div className="flex flex-col ">
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    id="fullName"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="w-1/2 p-3 border rounded-lg"
                  />
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    placeholder="Username"
                    id="username"
                    value={form.username}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                    }}
                    className="w-1/2 p-3 border rounded-lg"
                  />
                </div>
                <div className=" flex flex-col ">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    placeholder="Email"
                    id="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                    }}
                    className="w-1/2 p-3 border rounded-lg"
                  />
                </div>
                <div className=" flex flex-col ">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                    }}
                    className="w-1/2 p-3 border rounded-lg"
                  />
                </div>
                <div className=" flex w-full">
                  <div className="w-1/2 flex flex-col ">
                    <label>Avatar:</label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="w-[90%]  p-2  border rounded-lg"
                    />
                  </div>
                  <div className="w-1/2 ">
                    <div className="w-full flex flex-col ">
                      <label>cover Image:</label>
                      <input
                        type="file"
                        id="coverImage"
                        accept="image/*"
                        className="w-[90%]  p-2  border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-black"
                >
                  Register
                </button>
              </form>
              {message && <p className="mt-4 text-center text-sm">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
