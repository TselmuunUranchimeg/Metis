'use client'

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const TeacherCourses = () => {
    const { status, data: session } = useSession();

    useEffect(() => {
        if (session) {
            fetch(`/api/teacher/courses?id=${session.user?.id}`, {
                method: "GET"
            })
            .then(res => {
                
            })
            .catch(e => console.log(e));
        }
    }, [status]);

    return (
        <div className = "w-full h-full box-border py-5 px-7 flex flex-col">
            <div className = "flex w-full justify-between items-center">
                <h1 className = "font-semibold text-2xl">My courses</h1>
                <div className = "bg-[#FF642D] text-white px-3 py-2 cursor-pointer rounded-md">
                    <p>Create a course</p>
                </div>
            </div>
        </div>
    )
}

export default TeacherCourses;