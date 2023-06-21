import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface StudentInterface {
    email: string;
    role: string;
}
interface TeacherInterface extends StudentInterface {
    scale: string;
    organization: string;
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json() as StudentInterface | TeacherInterface;
        const { email, role } = body;
        const user = await prisma.user.findFirst({
            where: { email }
        });
        if (!user) {
            return NextResponse.json("User does not exist", {
                status: 404
            });
        }
        user.role.push(role === "Student" ? "student" : "teacher");
        const updateStudentPromise = prisma.user.update({
            where: { email },
            data: {
                role: user.role
            }
        });
        const allPromises: Array<Promise<any>> = [updateStudentPromise];
        if (role === "Student") {
            allPromises.push((async () => {
                await prisma.student.create({
                    data: {
                        userID: user.id
                    }
                });
            })());
        } else {
            const { scale, organization } = body as TeacherInterface;
            allPromises.push((async () => {
                await prisma.teacher.create({
                    data: {
                        userID: user.id,
                        scale, organization
                    }
                });
            })());
        }
        await Promise.all(allPromises);
        return NextResponse.json("Successfully created account!");
    }
    catch (e) {
        console.log(e);
        return NextResponse.json("Something went wrong, please try again later!");
    }
}