import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/components/dashboard";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth");
    }
    if (session.user!.role !== "teacher") {
        redirect("/auth/role");
    }
    const { image, name, id } = session.user;

    return (
        <div className = "w-screen h-screen">
            <Dashboard 
                role = "teacher"
                profileImg = {image as string}
                userID = {id as string}
                name = {name as string}
            >
                {children}
            </Dashboard>
        </div>
    )
}

export default TeacherLayout;

export const generateMetadata: () => Promise<Metadata> = async () => {
    const session = await getServerSession(authOptions);
    return {
        title: `${session?.user?.name} - Courses`
    };
};