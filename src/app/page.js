"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/boards");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center theme-bg">
      <div className="text-center animate-slide-up">
        <Loader2 className="w-12 h-12 animate-spin text-[#d48166] mx-auto mb-4" />
        <p className="theme-text font-semibold uppercase tracking-wide">
          Loading TaskFlow...
        </p>
      </div>
    </div>
  );
}
