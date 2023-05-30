import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ParamsInterface {
    creatorId?: string;
}

export const GET = async (_: NextRequest, { params }: { params: ParamsInterface }) => {
    const result = await prisma.course.findMany({
        where: params
    });
    const data = result.map(val => {
        const { name, price, rating } = val;
        return { name, price, rating, img: val.visuals[0] };
    });
    return NextResponse.json({ data });
}