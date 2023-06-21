import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ParamsInterface {
    courseId: string;
}

const GET = async (_: NextRequest, { params }: { params: ParamsInterface }) => {
    const { courseId } = params;
    const course = await prisma.course.findFirst({
        where: { id: courseId }
    });
    if (!course) {
        return NextResponse.json("Not found", { status: 404 });
    }
    return NextResponse.json(course.name);
}

export { GET };