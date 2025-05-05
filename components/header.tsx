'use client';

import AOS from "aos";
import { LogIn, Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const loading = status === "loading";
  const role = session?.user?.role;

  useEffect(() => {
    AOS.init({ duration: 800 });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const adminLinks = [
    { title: "Registration", link: "/admin" },
    { title: "Manage Users", link: "/admin/users" },
    { title: "Manage Prices", link: "/admin/prices" },
  ];

  const userLinks = {
    user: [
      { title: "Registration", link: "/registration" },
      { title: "Profile", link: "/profile" },
    ],
  };

  const renderNavLinks = (role: string | undefined) => {
    const links = role === "admin" ? adminLinks : userLinks[role as keyof typeof userLinks];
    if (!links) return null;

    return (
      <ul className="hidden md:flex items-center gap-8">
        {links.map((item) => (
          <li key={item.link}>
            <Link
              href={item.link}
              className={`py-2 px-6 rounded-md transition-all ${
                pathname === item.link
                  ? "text-blue-800 bg-white/20 backdrop-blur-md"
                  : " hover:bg-white/5"
              }`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderMobileLinks = (role: string | undefined) => {
    const links = role === "admin" ? adminLinks : userLinks[role as keyof typeof userLinks];
    if (!links) return null;

    return links.map((item) => (
      <li key={item.link}>
        <Link
          href={item.link}
          className="text-[#1B3A1A] text-lg"
          onClick={() => setIsOpen(false)}
        >
          {item.title}
        </Link>
      </li>
    ));
  };

  if (loading) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md text-[#1B3A1A]"
          : "bg-transparent text-white"
      }`}
      data-aos="fade-down"
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2 transition-all duration-300">
          <Image
            src="/logo.png"
            alt="logo"
            width={scrolled ? 36 : 48}
            height={scrolled ? 36 : 48}
            className="transition-all duration-300"
          />
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
                className="py-2 px-6 rounded-md border bg-[#1B3A1A] text-white border-[#1B3A1A] hover:bg-[#1B3A1A]/90 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden text-inherit"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white text-[#1B3A1A] shadow-md flex flex-col items-center gap-4 py-6 z-50 md:hidden">
          <ul>{renderMobileLinks(role)}</ul>
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
                  className="py-2 px-6 rounded-md border bg-[#1B3A1A] text-white border-[#1B3A1A]"
                >
                  Login
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
