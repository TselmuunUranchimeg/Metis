import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    if (token) {
        if (token.role && token.role !== "") {
            return NextResponse.rewrite(new URL(`/${token.role}`, req.url));
        }
        return NextResponse.rewrite(new URL("/auth/role", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/auth/:path"
};