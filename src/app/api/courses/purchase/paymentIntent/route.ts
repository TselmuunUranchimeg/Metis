import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

interface BodyInterface {
    /* Course ids  */
    courses: string[];
    sum: number;
}

const calculateAmount = async (courses: string[]) => {
    const arr: Array<Promise<number>> = [];
    courses.forEach(v => {
        arr.push((async () => {
            const course = await prisma.course.findFirst({
                where: {
                    id: v
                }
            });
            if (!course) {
                throw new Error("Course not found");
            }
            return course.price;
        })());
    });
    let initialValue = 0;
    return (await Promise.all(arr)).reduce((acc, curr) => {
        return acc + curr;
    }, initialValue);
};

const POST = async (req: NextResponse) => {
    const session = await getServerSession(authOptions);
    if (!session || (session && session.user!.role !== "student")) {
        return NextResponse.json("Not authorized", {
            status: 401
        });
    }
    const body = await req.json() as BodyInterface;
    const calculatedAmount = await calculateAmount(body.courses)
        .catch(e => {
            return NextResponse.json("Invalid course id", {
                status: 401
            });
        }
    );
    if (body.sum !== calculatedAmount) {
        return NextResponse.json("Invalid value", {
            status: 401
        });
    }
    const stripe = new Stripe("secret key", {
        apiVersion: "2022-11-15"
    });
    const intent = await stripe.paymentIntents.create({
        amount: calculatedAmount,
        currency: "usd"
    });
    return NextResponse.json({
        clientSecret: intent.client_secret
    });
}

export { POST };