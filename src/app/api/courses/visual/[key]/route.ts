import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import initRedis from "@/lib/redis";

interface ParamsInterface {
    key: string;
}

const GET = async (_: NextRequest, { params }: { params: ParamsInterface }) => {
    try {
        const { key } = params;
        const redis = await initRedis();
        let url = await redis.GET(key);
        if (!url) {
            url = getSignedUrl({
                dateLessThan: new Date(Date.now() + 1000 * 604800).toString(),
                keyPairId: process.env.KEY_PAIR_ID!,
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
                url: process.env.DISTRIBUTION! + key
            });
            await redis.SETEX(key, 604800, url);
        }
        return NextResponse.json(url);
    }
    catch (e) {
        console.log(e);
    }
}

export { GET };