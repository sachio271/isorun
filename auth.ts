import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/zod";
const BACKEND_URL = 'http://172.24.21.45:8000/api'
// const BACKEND_URL = 'http://localhost:8000/api'
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedField = LoginSchema.safeParse(credentials);
        
        if(!validatedField.success) {
            return null
        }

        const { username, password } = validatedField.data;
        try {
          const res = await fetch(BACKEND_URL + "/auth/login", {
            method: "POST",
            body: JSON.stringify({
              username,
              password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("backend response : " + res.status);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name,
            emailVerified: null, // not available in backend
            role: data.user.role,
            accessToken: data.accessToken,
            expiresIn: data.expiresIn,
          };
        } catch (error) {
          console.error("Error during login:", error);
          return null;
          
        }
      },
    }),
  ],
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    
    //   if (!isLoggedIn) {
    //     return Response.redirect(new URL("/login", nextUrl));
    //   }
    
    //   if (isLoggedIn && isAdminRoute && auth.user?.role !== "admin") {
    //     return Response.redirect(new URL("/unauthorized", nextUrl)); // or home page
    //   }
    
    //   if (isLoggedIn && nextUrl.pathname === "/login") {
    //     return Response.redirect(new URL("/findwork", nextUrl));
    //   }
    
    //   return true;
    // },    

    async jwt({ token, user }) {
      if (user) {
        const u = user as typeof user & {
          username?: string;
          role?: string;
          name?: string;
        };
    
        token.user = {
          id: u.id || "0",
          username: u.username || "",
          name: u.name || "",
          emailVerified: null,
          role: u.role || "user",
        };
        token.accessToken = u.accessToken;
        token.expiresIn = u.expiresIn;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.expiresIn = token.expiresIn;
      return session;
    },
  },
})