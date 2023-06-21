import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import StateButton from "@/components/stateButton";

const CourseIdLayout = async ({ children }: { children: React.ReactNode }) => {
    let role: null | string = null
    const session = await getServerSession(authOptions);
    if (session) {
        role = session.user!.role;
    }

    return (
        <div className = "w-screen h-screen">
            <div className = "sticky flex justify-between items-center box-border px-7 py-3 w-full">
                <Link 
                    href = "/"
                    className = "text-2xl font-semibold"
                >
                    <h1>Metis</h1>
                </Link>
                <StateButton role = {role} />
            </div>
            <div className = "w-full">
                { children }
            </div>
        </div>
    )
}

export default CourseIdLayout;