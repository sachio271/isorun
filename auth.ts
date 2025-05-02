import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/zod";
const BACKEND_URL = 'http://localhost:8000/api'
export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedField = LoginSchema.safeParse(credentials);
        
        if(!validatedField.success) {
            return null
        }

        const { username, password } = validatedField.data;
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
        if (res.status == 401) {
          console.log(res.statusText);

          return null;
        }
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
        token.user = {
          id: user.id || "0",
          username: user.username,
          name: user.name || "",
          emailVerified: null,
          role: user.role || "user",
        };
        token.accessToken = user.accessToken;
        token.expiresIn = user.expiresIn;
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