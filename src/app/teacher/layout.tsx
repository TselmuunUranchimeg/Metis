import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Dashboard from "@/components/dashboard";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
    const { image, name, id } = (await getServerSession())!.user;

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
    const session = await getServerSession();
    return {
        title: `${session?.user?.name} - Courses`
    };
};