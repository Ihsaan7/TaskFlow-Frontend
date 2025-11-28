// src/app/boards/page.jsx
"use client";
import useAuthStore from "@/store/authStore";

export default function BoardsPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Your Boards</h1>
      <p>
        Welcome back, <strong>{user?.name}</strong>!
      </p>
      <p className="mt-8 text-gray-500">Your boards will appear here soon...</p>
    </div>
  );
}
