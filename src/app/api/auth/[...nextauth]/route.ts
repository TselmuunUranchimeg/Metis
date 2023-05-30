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
        async jwt({ token, user }) {
            if (user) {
                const { role } = user;
                token.role = role.length > 0 ? role[0] : "";
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session && session.user && token) {
                session.user.role = token.role!;
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET!,
    session: {
        strategy: "jwt"
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }