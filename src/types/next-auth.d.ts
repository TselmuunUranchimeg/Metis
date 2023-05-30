import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        role: string[];
    }
    interface Session {
        user: {
            role: string;
            id: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role?: string;
        id: string;
    }
}