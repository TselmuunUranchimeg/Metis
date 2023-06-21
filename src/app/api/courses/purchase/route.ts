import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

interface BodyInterface {
    courseId: string;
}

const POST = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session && session.user.role !== "student")) {
            return NextResponse.json("Not authorized", {
                status: 401
            });
        }
        const body = await req.json() as BodyInterface;
        await prisma.student.update({
            where: { userID: session.user!.id },
            data: {
                purchases: {
                    connect: { id: body.courseId }
                }
            }
        });
        return NextResponse.json("Success");
    }
    catch (e) {
        console.log(e);
    }
}

export { POST };