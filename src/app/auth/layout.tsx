import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (session) {
        if (session.user!.role !== "") {
            redirect(`/${session.user!.role}/courses`);
        }
    }

    return (
        <div className = "w-screen h-screen flex justify-center items-center">
            {children}
        </div>
    )
}

export default AuthLayout;