"use client";
import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme, mounted };
}

export const lightTheme = {
  warm: "#d48166",
  dark: "#373a36",
  light: "#e6e2dd",
};

export const darkTheme = {
  warm: "#d48166",
  dark: "#1a1a1a",
  light: "#2a2a2a",
};

export function getTheme(isDark) {
  return isDark ? darkTheme : lightTheme;
}
