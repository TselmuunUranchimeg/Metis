import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";
import client from "@/lib/client";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

interface SublessonInterface {
    title: string;
    mime: string;
}
interface LessonInterface {
    title: string;
    desc: string;
    sublessons: Array<SublessonInterface>;
}
interface RequestBodyInterface {
    name: string;
    description: string;
    lessons: Array<LessonInterface>;
    price: number;
    visuals: string[];
}

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (session) {
        const teacher = await prisma.teacher.findFirst({
            where: {
                userID: session.user!.id
            }
        });
        if (!teacher) {
            return NextResponse.json("Invalid account", {
                status: 403
            });
        }
        const { name, description, lessons: reqLessons, price, visuals: reqVisuals } = await req.json() as RequestBodyInterface;
        let urls: string[][] = Array.from(Array(reqLessons.length + 1), y => Array.from(Array(), _ => ""));
        const v = Promise.all(reqVisuals.map(val => {
            return new Promise<string>(async resolve => {
                const key = v4();
                const link = await getSignedUrl(client, new PutObjectCommand({
                    Key: key,
                    Bucket: process.env.S3_BUCKET,
                    ContentType: val
                }), { expiresIn: 600 });
                urls[0].push(link);
                resolve(key);
            })
        }));
        const l = Promise.all<any[]>(reqLessons.map((val, ind) => {
            return new Promise(async resolve => {
                const resultPromise = val.sublessons.map(v => {
                    return new Promise(async res => {
                        const key = v4();
                        const signedUrl = await getSignedUrl(client, new PutObjectCommand({
                            Key: key,
                            Bucket: process.env.S3_BUCKET!,
                            ContentType: v.mime
                        }), { expiresIn: 600 });
                        urls[ind + 1].push(signedUrl);
                        res({key, title: v.title});
                    });
                });
                const result = await Promise.all(resultPromise) as Array<{ 
                    key: string;
                    title: string;
                }>;
                resolve({
                    title: val.title,
                    description: val.desc,
                    sublessons: result
                });
            });
        }));
        const [visuals, lessons] = await Promise.all([v, l]);
        await prisma.course.create({
            data: {
                name, description, price, visuals,
                creatorId: teacher.userID,
                lessons: {
                    create: lessons
                }
            }
        });
        return NextResponse.json({ urls });
    }
    return NextResponse.json("Not authorized", {
        status: 401
    });
}