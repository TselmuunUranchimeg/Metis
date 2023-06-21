import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

import prisma from "@/lib/prisma";
import initRedis from "@/lib/redis";

interface ParamsInterface {
    courseId: string;
}

const GET = async (_: NextRequest, { params }: { params: ParamsInterface }) => {
    try {
        const course = await prisma.course.findFirst({
            where: { id: params.courseId }
        });
        if (!course) {
            return NextResponse.json("Not found", { status: 404 });
        }
        let promiseArr: Array<Promise<string>> = [];
        const redis = await initRedis();
        course.visuals.forEach(val => {
            promiseArr.push(new Promise(async (resolve) => {
                let url = await redis.GET(val);
                if (!url) {
                    url = getSignedUrl({
                        dateLessThan: new Date(Date.now() + 1000 * 604800).toString(),
                        keyPairId: process.env.KEY_PAIR_ID!,
                        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
                        url: process.env.DISTRIBUTION! + val
                    });
                    await redis.SETEX(val, 604800, url);
                }
                resolve(url);
            }));
        });
        const urls = await Promise.all(promiseArr);
        return NextResponse.json({ ...course, visuals: urls });
    }
    catch (e) {
        console.log(e);
    }
}

export { GET };