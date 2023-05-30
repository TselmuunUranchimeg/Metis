export const metadata = {
    title: "Pick your role at Metis!"
};

const RoleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className = "w-screen h-screen flex justify-center items-center">
            { children }
        </div>
    )
}

export default RoleLayout;