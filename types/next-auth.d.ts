import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      emailVerified: Date | null;
      role: string;
    };
    accessToken: string;
    expiresIn: string;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      username: string;
      name: string;
      emailVerified: Date | null;
      role: string;
    };
    accessToken: string;
    expiresIn: string;
  }
}
