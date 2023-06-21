import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
    title: "Pick your role at Metis!"
};

const RoleLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth");
    }

    return (
        <div className = "w-screen h-screen flex justify-center items-center">
            { children }
        </div>
    )
}

export default RoleLayout;