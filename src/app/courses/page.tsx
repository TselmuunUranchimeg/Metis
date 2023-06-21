"use client";

import { useEffect, useState } from "react";
import { CourseQueryResponse } from "@/types/others";
import Loading from "@/components/loading";
import CourseContent from "@/components/course";
import styles from "./courses.module.css";

const CoursesPage = () => {
    const [state, setState] = useState<null | Array<CourseQueryResponse>>(null);

    useEffect(() => {
        fetch("/api/courses", {
            method: "GET",
        })
            .then(async (res) => {
                const data = (await res.json()) as CourseQueryResponse[];
                setState(data);
            })
            .catch((e) => console.log(e));
    }, []);

    return (
        <div className="w-full box-border px-7">
            <div className="flex w-full mb-5">
                <input
                    type="text"
                    placeholder="Name"
                    className={`${styles.input}`}
                />
                <input
                    type="text"
                    placeholder="Instructor"
                    className={`${styles.input}`}
                />
                <button className="bg-[#FF642D] text-white py-1 px-6 text-xl font-semibold">
                    Search
                </button>
            </div>
            <div className="flex w-full">
                <div className="w-[30%]">
                    <h1>Categories are supposed to be here.</h1>
                </div>
                <div className="w-[70%]">
                    {!state ? <Loading /> : <CourseContent state={state} />}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
