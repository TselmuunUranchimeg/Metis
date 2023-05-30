'use client'

import { signIn } from "next-auth/react";

interface AuthRowInterface {
    provider: string;
}

const AuthRow = ({ provider }: AuthRowInterface) => {
    return (
        <div
            onClick = {() => signIn(provider.toLowerCase(), { callbackUrl: "/auth/role" })}
            className = "w-[90%] text-center relative py-3 border-[0.5px] mb-5 rounded-3xl cursor-pointer hover:bg-[#FF642D] hover:text-white duration-100"
        >
            <img 
                alt = {provider} 
                src = {`${provider}.svg`}
                className = "w-8 h-8 mr-5 absolute left-5 top-1/2 -translate-y-1/2" 
            />
            <h1 className = "text-[17px]">Sign in with {provider}</h1>
        </div>
    )
}

const AuthPage = () => {
    return (
        <div className = "w-1/4 min-w-[350px] flex flex-col items-center justify-center">
            <h1 
                className = "text-2xl font-medium py-5"
            >
                Sign in
            </h1>
            <AuthRow provider = "Google" />
            <AuthRow provider = "Facebook" />
            <AuthRow provider = "GitHub" />
        </div>
    )
}

export default AuthPage;