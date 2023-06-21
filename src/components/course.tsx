"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "./loading";
import { CourseQueryResponse } from "@/types/others";

interface CourseComponent {
    data: CourseQueryResponse;
}
interface CourseContentInterface {
    state: CourseQueryResponse[];
}
interface CourseVisualInterface {
    name: string;
    isImg: boolean;
}

const CourseVisual = ({ name, isImg }: CourseVisualInterface) => {
    const [img, setImg] = useState("");

    useEffect(() => {
        fetch(`/api/courses/visual/${name}`)
            .then(async (res) => {
                const url = await res.json();
                setImg(url);
            })
            .catch((e) => console.log(e));
    }, []);

    if (img === "") {
        return (
            <Loading />
        )
    }

    if (!isImg) {
        return (
            <video></video>
        )
    }

    return (
        <img 
            alt = "Image"
            src = {img}
            className = "w-full h-full object-cover"
        />
    )
}

const CourseComponent = ({ data }: CourseComponent) => {
    return (
        <Link
            href = {`/courses/${data.courseId}`} 
            className="relative w-[300px] shadow-xl h-[200px]"
        >
            <CourseVisual 
                isImg = {true}
                name = {data.cover}
            />
            <div className = "w-full absolute bottom-0 text-white bg-[#FF642D] box-border px-3 py-1">
                <h1>{data.name}</h1>
                <div className = "flex justify-between w-full">
                    <p>{data.rating}</p>
                    <p>${data.price}</p>
                </div>
            </div>
        </Link>
    );
};

const CourseContent = ({ state }: CourseContentInterface) => {
    return (
        <div className="w-full h-full box-border pt-5">
            {state.length === 0 ? (
                <div className="w-full h-full flex justify-center items-center">
                    <h1>You haven't purchased any course yet.</h1>
                </div>
            ) : (
                <div className="w-full h-full grid grid-cols-custom overflow-y-auto">
                    {state.map((val, ind) => {
                        return <CourseComponent key={ind} data={val} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseContent;
export { CourseComponent, CourseVisual };