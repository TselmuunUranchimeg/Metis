import { Course } from "@prisma/client";

interface ParamsInterface {
    courseId: string;
}
interface UpperSectionInterface {
    name: string;
    visualUrl: string;
    price: number;
}

const UpperSection = ({ name, visualUrl, price }: UpperSectionInterface) => {
    return (
        <div className = "relative box-border p-10 w-full flex">
            <div className = "bg-[#1c1d1f] h-1/2 absolute left-0 top-0"></div>
            <div className = "min-w-[240px] min-h-[280px] w-[25%] h-[h-25%]">
                <img 
                    src = {visualUrl}
                    alt = {name}
                    className = "w-full h-full object-cover"
                />
            </div>
            <div className = "w-[75%] min-w-[calc(100%_-_120px)] text-white flex flex-col h-full justify-between">
                <h1>{name}</h1>
                <p>{price}</p>
            </div>
        </div>
    )
}

const CoursePage = async ({ params }: { params: ParamsInterface }) => {
    const res = await fetch(`${process.env.URL}/api/courses/${params.courseId}`, {
        method: "GET"
    });
    if (!res.ok) {
        return (
            <div>
                <h1>Not found</h1>
            </div>
        )
    }

    const data = await res.json() as Course;

    return (
        <div className = "w-full">
            <UpperSection
                name = {data.name}
                price = {data.price}
                visualUrl = {data.visuals[0]}
            />
            <p>{data.description}</p>
        </div>
    )
}

export const generateMetadata = async ({ params }: { params: ParamsInterface }) => {
    const title = await (await fetch(`${process.env.URL}/api/courses/name/${params.courseId}`, {
        method: "GET"
    })).json() as string;
    return { title }
}

export default CoursePage;