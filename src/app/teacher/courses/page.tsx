"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CourseQueryResponse } from "@/types/others";
import CourseContent from "@/components/course";
import Loading from "@/components/loading";

const TeacherCourses = () => {
    const { status, data: session } = useSession();
    const [state, setState] = useState<null | CourseQueryResponse[]>(null);

    useEffect(() => {
        if (session) {
            fetch(`/api/courses?id=${session.user?.id}`, {
                method: "GET",
            })
                .then(async (res) => {
                    if (res.status < 300) {
                        setState((await res.json()).data);
                    }
                })
                .catch((e) => console.log(e));
        }
    }, [status]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex w-full justify-between items-center">
                <h1 className="font-semibold text-2xl">My courses</h1>
                <Link
                    href="/teacher/courses/create"
                    className="bg-[#FF642D] text-white px-3 py-2 cursor-pointer rounded-md"
                >
                    <p>Create a course</p>
                </Link>
            </div>
            <div className="w-full overflow-y-auto h-full">
                {
                    state === null
                    ? <Loading />
                    : <CourseContent state = {state}  />
                }
            </div>
        </div>
    );
};

export default TeacherCourses;
