import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ session, user }) {
            if (session && session.user && user) {
                session.user.role = user.role.length > 0 ? user.role[0] : "";
                session.user.id = user.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET!
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }