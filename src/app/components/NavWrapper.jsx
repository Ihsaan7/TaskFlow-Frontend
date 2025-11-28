"use client";
import NavBar from "./NavBar";
import { usePathname } from "next/navigation";

export default function NavBarWrapper() {
  const pathName = usePathname();
  const hideNav = pathName === "/signup" || pathName === "/login";

  return !hideNav ? <NavBar /> : null;
}
