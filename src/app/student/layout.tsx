import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/components/dashboard";
import Loading from "@/components/loading";
const StudentLayout = async ({ children } : { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth");
    }
    if (session.user!.role !== "student") {
        redirect("/auth/role");
    }

    const { image, id, name } = session.user;

    return (
        <div className = "w-screen h-screen">
            <Dashboard
                role = "student"
                profileImg = {image as string}
                userID = {id as string}
                name = {name as string}
            >
                <Suspense fallback = {<Loading />}>
                    {children}
                </Suspense>
            </Dashboard>
        </div>
    )
}

export default StudentLayout;