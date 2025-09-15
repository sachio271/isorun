'use client';

import AOS from "aos";
import { LogIn, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "./profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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
    { title: "Manage Reference", link: "/admin/reference" },
    { title: "Manage Categories", link: "/admin/categories" },
  ];

  const userLinks = {
    user: [
      { title: "Registration", link: "/registration" },
      { title: "Profile", link: "/profile" },
    ],
    KABAG : [
      { title: "Registration", link: "/registration" },
      { title: "Profile", link: "/profile" },
    ]
  };

  const supportLinks = [
    { title: "Race Pack", link: "/support/race-pack" },
    { title: "Registration", link: "/support/registration" },
  ]

  const renderNavLinks = (role: string | undefined) => {
    const links = role === "admin" ? adminLinks : role === "support" ? supportLinks : userLinks[role as keyof typeof userLinks];
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
  
  if (loading) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4 ${
        scrolled
          ? "bg-white/20 backdrop-blur-md shadow-md text-[#1B3A1A]"
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
            width={scrolled ? 78 : 82}
            height={scrolled ? 78 : 82}
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
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[#263c7d]">
                <Menu className="w-6 h-6"  />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#263c7d] text-white border-none rounded-md shadow-lg w-56"
            >
              <DropdownMenuLabel className="text-white">Menu</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              {(role === "admin" ? adminLinks : role ==="support" ? supportLinks : userLinks[role as keyof typeof userLinks])?.map(
                (item) => (
                  <DropdownMenuItem key={item.link} asChild>
                    <Link
                      href={item.link}
                      className="w-full hover:bg-white/10 rounded px-2 py-1"
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuSeparator className="bg-white/20" />
              {session ? (
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full text-left hover:bg-white/10 px-2 py-1"
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href="/login"
                    className="w-full hover:bg-white/10 px-2 py-1"
                  >
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
