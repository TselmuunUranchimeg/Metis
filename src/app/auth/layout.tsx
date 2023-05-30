const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className = "w-screen h-screen flex justify-center items-center">
            {children}
        </div>
    )
}

export default AuthLayout;