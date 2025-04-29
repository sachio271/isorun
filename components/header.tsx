'use client';

import { LogIn, Menu, UserPlus, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "./profile";

function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const loading = status === "loading";

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [status, session]);

  if (loading) return null;

  const role = session?.user?.role;

  const adminLinks = [
    { title: "Dashboard", link: "/admin" },
    { title: "Manage Users", link: "/admin/users" },
    { title: "Manage Jobs", link: "/admin/jobs" },
    { title: "Manage Content", link: "#", isDropdown: true },
  ];

  const userLinks = {
    user: [
      { title: "Find Work", link: "/findwork" },
      { title: "My Jobs", link: "/myjobs" },
      { title: "Post a Job", link: "/post" },
    ],
  };

  const renderNavLinks = (role: string | undefined) => {
    if (role === "admin") {
      return (
        <ul className="hidden md:flex items-center gap-8">
          {adminLinks.map((item) => (
            <li key={item.link}>
                <Link
                  href={item.link}
                  className={`py-2 px-6 rounded-md ${
                    pathname === item.link
                      ? "text-[#1B3A1A] underline underline-offset-4 decoration-[#1B3A1A]"
                      : ""
                  }`}
                >
                  {item.title}
                </Link>
            </li>
          ))}
        </ul>
      );
    } else {
      const links = userLinks[role as keyof typeof userLinks];
      if (!links) return null;

      return (
        <ul className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <li key={item.link}>
              <Link
                href={item.link}
                className={`py-2 px-6 rounded-md ${
                  pathname === item.link
                    ? "text-[#1B3A1A] underline underline-offset-4 decoration-[#1B3A1A]"
                    : ""
                }`}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      );
    }
  };

  const renderMobileLinks = (role: string | undefined) => {
    if (role === "admin") {
      return (
        <>
          {adminLinks.map((item) => (
            <li key={item.link}>
                <Link
                  href={item.link}
                  className="text-[#1B3A1A] text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </Link>
            </li>
          ))}
        </>
      );
    } else {
      const links = userLinks[role as keyof typeof userLinks];
      if (!links) return null;

      return (
        <>
          {links.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="text-[#1B3A1A] text-lg"
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </>
      );
    }
  };

  return (
    <header className="px-6 md:px-10 py-6 bg-[#1300e8] text-[#ffff00] text-1xl flex justify-between items-center relative">
      {/* Logo */}
      <Link href={"/"} className="flex items-center gap-2">
        <Image src="/WINGS.png" alt="logo" width={45} height={45} />
      </Link>

      {/* Desktop Navigation */}
      {renderNavLinks(role)}

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {session ? (
          <Profile />
        ) : (
          <>
            <Link
              href={"/login"}
              className="py-2 px-6 rounded-md border bg-[#1B3A1A] text-white border-[#1B3A1A] hover:bg-[#1B3A1A]/90 transition-all duration-200 ease-in-out flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href={"/register"}
              className="py-2 px-6 rounded-md border border-[#1B3A1A] text-[#1B3A1A] hover:bg-[#1B3A1A]/10 transition-all duration-200 ease-in-out flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Burger */}
      <button
        className="md:hidden text-[#1B3A1A]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full bg-[#A8CBA0] shadow-md flex flex-col items-center gap-4 py-6 z-50 md:hidden">
          {renderMobileLinks(role)}

          <div className="flex flex-col gap-4 pt-4">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="py-2 px-6 rounded-md border border-[#1B3A1A] text-[#1B3A1A] hover:bg-[#1B3A1A]/10"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="py-2 px-6 rounded-md border bg-[#1B3A1A] text-white border-[#1B3A1A] hover:bg-[#1B3A1A]/90 transition-all duration-200 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  href={"/register"}
                  className="py-2 px-6 rounded-md border border-[#1B3A1A] text-[#1B3A1A] hover:bg-[#1B3A1A]/10 transition-all duration-200 ease-in-out"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
