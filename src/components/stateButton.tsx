'use client'

import Link from "next/link";

interface StateButtonInterface {
    role: null | string;
}

const StateButton = ({ role }: StateButtonInterface) => {
    if (!role) {
        return (
            <Link
                className = "text-white font-semibold box-border px-4 py-2 rounded-sm bg-[#FF642D] cursor-pointer"
                href = "/auth"
            >
                <h1>Sign in</h1>
            </Link>
        )
    }
    
    return (
        <Link
            href = {`/${role}/courses`} 
            className = "box-border px-4 py-2 rounded-full bg-[#FF642D] text-white"
        >
            <h1>Dashboard</h1>
        </Link>
    )
}

export default StateButton;