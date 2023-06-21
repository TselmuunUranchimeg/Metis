import { parse } from "querystring";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CourseQueryResponse } from "@/types/others";

export const GET = async (req: NextRequest) => {
    try {
        const params = parse(req.url.split("?")[1]);
        const result = await prisma.course.findMany({
            where: params
        });
        const dataArr: Array<Promise<CourseQueryResponse>> = [];
        result.forEach(val => {
            dataArr.push(new Promise(async (resolve) => {
                const { name, price, rating } = val;
                resolve({ name, price, rating, courseId: val.id, cover: val.visuals[0] });
            }));
        });
        const data = await Promise.all(dataArr);
        return NextResponse.json(data);
    }
    catch (e) {
        return NextResponse.json("Invalid parameters", {
            status: 403
        });
    }
}