import { CourseQueryResponse } from "@/types/others";
import CourseContent from "@/components/course";

interface ResponseInterface {
    data: CourseQueryResponse[];
}

const StudentCourses = async () => {
    let state: null | ResponseInterface = null;

    const res = await fetch(process.env.URL! + "/api/courses/purchased");
    if (res.status < 300) {
        state = await res.json() as ResponseInterface;
    }

    if (!state) {
        return (
            <div 
                className = "w-full h-full flex items-center justify-center flex-col"
            >
                <h1
                    className = "mb-3"
                >
                    You haven't purchased any course, yet.
                </h1>
                <a 
                    href = "/courses"
                    className = "opacity-75 italic underline"
                >
                    Go purchase one now
                </a>
            </div>
        )
    }

    return (
        <div className="w-full h-full">
            <CourseContent state = {state.data} />
        </div>
    );
};

export default StudentCourses;
