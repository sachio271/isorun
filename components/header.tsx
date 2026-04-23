'use client';

import AOS from "aos";
import { LogIn, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Profile from "./profile";

const adminLinks = [
  { title: "Registration", link: "/admin" },
  { title: "Manage Users", link: "/admin/users" },
  { title: "Manage Reference", link: "/admin/reference" },
  { title: "Manage Categories", link: "/admin/categories" },
];

const userLinks: Record<string, { title: string; link: string }[]> = {
  user: [
    { title: "Registrasi", link: "/registration" },
    { title: "Profil", link: "/profile" },
  ],
  KABAG: [
    { title: "Registrasi", link: "/registration" },
    { title: "Profil", link: "/profile" },
  ],
};

const supportLinks = [
  { title: "Race Pack", link: "/support/race-pack" },
  { title: "Registration", link: "/support/registration" },
];

function getLinks(role: string | undefined) {
  if (role === "admin") return adminLinks;
  if (role === "support") return supportLinks;
  return userLinks[role as string] ?? [];
}

function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loading = status === "loading";
  const role = session?.user?.role;
  const links = getLinks(role);

  useEffect(() => {
    AOS.init({ duration: 800 });
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (loading) return null;

  const scrolledNav = scrolled || mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolledNav
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
      data-aos="fade-down"
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Isoplus"
            width={scrolledNav ? 56 : 64}
            height={scrolledNav ? 56 : 64}
            className="transition-all duration-300"
          />
        </Link>

        {/* Desktop nav */}
        {links.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {links.map((item) => {
              const active = pathname === item.link;
              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? scrolledNav
                        ? "bg-[#263C7D]/10 text-[#263C7D]"
                        : "bg-white/20 text-white"
                      : scrolledNav
                      ? "text-gray-600 hover:bg-gray-100 hover:text-[#263C7D]"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Profile />
          ) : (
            <Link
              href="/login"
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                scrolledNav
                  ? "bg-[#263C7D] text-white hover:bg-[#1e2f61]"
                  : "bg-white text-[#263C7D] hover:bg-white/90"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolledNav ? "text-[#263C7D] hover:bg-gray-100" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-1 shadow-lg">
          {links.map((item) => {
            const active = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#263C7D]/10 text-[#263C7D]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#263C7D]"
                }`}
              >
                {item.title}
              </Link>
            );
          })}

          <div className="border-t border-gray-100 mt-2 pt-3">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#263C7D] text-white hover:bg-[#1e2f61] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
