// middleware.ts
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname === "/register") {
    return NextResponse.next();
  }

  if (!session && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in but trying to access admin without role
  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Prevent access to /login if already authenticated
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/findwork", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.webp|.*\\.svg|.*\\.gif).*)",
  ],
};
