'use client'

import { useState, useEffect, FormEvent } from "react";
import axios, { isAxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";

interface SublessonInterface {
    title: string;
    file: File | null;
}
interface LessonInterface {
    title: string;
    desc: string;
    sublessons: Array<SublessonInterface>
}
interface LessonComponentInterface {
    lessonObj: LessonInterface;
    updateObj: (obj: LessonInterface, ind: number) => Promise<void>;
    ind: number;
}
interface SublessonComponentInterface {
    sublessonObj: SublessonInterface;
    updateWhole: ( newObj: SublessonInterface, ind: number ) => void;
    ind: number;
}
interface ValueInterface {
    mime: string;
    title: string;
}
interface ResponseInterface {
    urls: string[][];
}

const Sublesson = ({ sublessonObj, updateWhole, ind }: SublessonComponentInterface) => {
    const [sublesson, setSublesson] = useState(sublessonObj);

    useEffect(() => {
        updateWhole(sublesson, ind);
    }, [sublesson]);

    return (
        <div className = "w-full flex justify-between">
            <input
                required 
                type = "text"
                placeholder = "Lesson name"
                value = {sublesson.title}
                onChange = {e => {
                    setSublesson(prev => {
                        return { ...prev, title: e.currentTarget.value };
                    });
                }}
            />
            <input
                required 
                type = "file"
                onChange = {(e) => {
                    const filelist = e.currentTarget.files;
                    if (filelist) {
                        setSublesson(prev => {
                            return { ...prev, file: filelist[0] };
                        })
                    }
                }}
            />
        </div>
    )
}

const Lesson = ({ lessonObj, ind, updateObj }: LessonComponentInterface) => {
    const [state, setState] = useState(false);
    const [lesson, setLesson] = useState(lessonObj);

    const updateWhole = (newObj: SublessonInterface, subInd: number) => {
        const newLesson = { ...lesson };
        newLesson.sublessons[subInd] = newObj;
        setLesson(newLesson);
        updateObj(newLesson, ind);
    };

    useEffect(() => {
        updateObj(lesson, ind);
    }, [lesson]);

    return (
        <div className = "w-full flex flex-col my-3">
            <div className = "w-full flex justify-between mb-3">
                <input
                    required 
                    type = "text"
                    placeholder = "Chapter title"
                    value = {lesson.title}
                    onChange = {e => {
                        const newObj = { ...lesson, title: e.currentTarget.value };
                        setLesson(newObj);
                    }}
                />
                <FontAwesomeIcon 
                    icon = { faAngleUp }
                    className = {`cursor-pointer text-xl ${
                        state ? "rotate-180" : ""
                    } duration-100`} 
                    onClick = {() => setState(prev => !prev)}
                />
            </div>
            <div className = {`w-full ${
                state ? "h-0 hidden opacity-0" : "h-auto block opacity-100"
            } duration-100`}>
                <textarea
                    required 
                    placeholder = "Chapter description"
                    rows = {7}
                    className = "w-full mb-3"
                    value = {lesson.desc}
                    onChange = {e => {
                        const newObj = { ...lesson, desc: e.currentTarget.value };
                        setLesson(newObj);
                    }}
                />
                {lesson.sublessons.map((val, ind) => {
                    return (
                        <div key = {ind}>
                            <Sublesson 
                                updateWhole = {updateWhole}
                                sublessonObj = {val}
                                ind = {ind} 
                            />
                        </div>
                    )
                })}
                <div
                    onClick = {() => {
                        setLesson(prev => {
                            const newObj = { ...prev };
                            newObj.sublessons.push({
                                title: "",
                                file: null
                            });
                            return newObj;
                        });
                    }}
                >
                    <p>Create new lesson</p>
                </div>
            </div>
        </div>
    )
}

const CreateCourse = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [lessons, setLessons] = useState<Array<LessonInterface>>([{
        title: "",
        desc: "",
        sublessons: [{
            title: "",
            file: null
        }]
    }]);
    const [visual, setVisual] = useState<FileList | null>(null);

    const createCourse = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!visual) {
                alert("Please select images for presentation!");
                return;
            }
            const files = lessons.map(val => {
                const sublessons: Array<ValueInterface> =  [];
                val.sublessons.forEach(v => {
                    if (!v.file) {
                        alert("One file is empty, idiot");
                        return;
                    }
                    if (!v.file.type.includes("video/")) {
                        alert("Please upload a video!")
                        return;
                    }
                    sublessons.push({
                        mime: v.file.type,
                        title: v.title
                    });
                });
                const { title, desc } = val;
                return {
                    title, desc, sublessons
                };
            });
            let visuals = [];
            for (let i = 0; i < visual.length; i++) {
                visuals.push(visual[i].type);
            }
            const { urls } = await (await fetch("/api/courses/create", {
                body: JSON.stringify({
                    name, description, visuals, lessons: files, price: 0
                }),
                method: "POST"
            })).json() as ResponseInterface;
            urls.forEach((val, ind) => {
                val.forEach(async (v, i) => {
                    const file = ind === 0 ? visual[i] : lessons[ind - 1].sublessons[i].file;
                    const res = await fetch(v, {
                        body: file,
                        method: "PUT",
                        headers: {
                            "Content-Type": file!.type
                        }
                    });
                    if (res.status < 300) {
                        if (ind === 0) {
                            console.log(`Visual ${i + 1} has been uploaded!`);
                        } else {
                            console.log(`File ${i + 1} of ${files.length} have been uploaded!`);
                        }
                    }
                });
            });
        }
        catch (e) {
            if (isAxiosError(e)) {
                console.log(e.message);
            }
        }
    }

    const updateObj = async (obj: LessonInterface, ind: number) => {
        setLessons(prev => {
            prev[ind] = obj;
            return prev;
        });
    }

    return (
        <form 
            className = "w-full h-full flex flex-col box-border py-5 px-7 items-start overflow-y-auto"
            onSubmit = {async e => await createCourse(e)}
        >
            <div className = "flex justify-between mb-3 w-full">
                <h1 
                    className = "font-semibold text-2xl"
                >
                    New course
                </h1>
                <input
                    required 
                    type = "text"
                    placeholder = "Course name"
                    className = "p-2 italic border-[1px] border-black" 
                    value = {name}
                    onChange = {e => setName(e.currentTarget.value)}
                />
            </div>
            <div className = "w-full">
                <h1 className = "text-2xl font-semibold mb-3">Description</h1>
                <textarea
                    required 
                    value = {description}
                    onChange = {e => setDescription(e.currentTarget.value)}
                    rows = {7}
                    className = "w-full border-[1px] border-black resize-none border-box py-2 px-3"
                />
            </div>
            <div className = "w-full flex justify-between">
                <h1>Please select a cover page:</h1>
                <input
                    required 
                    type = "file"
                    onChange = {e => {
                        const fileList = e.currentTarget.files;
                        if (fileList) {
                            setVisual(fileList);
                        }
                    }} 
                />
            </div>
            <div className = "w-full flex flex-col">
                {lessons.map((val, ind) => {
                    return (
                        <Lesson 
                            key = {ind}
                            updateObj = {updateObj}
                            ind = {ind}
                            lessonObj = {val}
                        />
                    )
                })}
            </div>
            <div className = "flex">
                <button 
                    type="button"
                    onClick = {() => {
                        setLessons(prev => {
                            const newObj = prev.slice(0);
                            newObj.push({
                                title: "",
                                desc: "",
                                sublessons: [{
                                    title: "",
                                    file: null
                                }]
                            });
                            return newObj;
                        });
                    }}
                    className = "bg-white text-black mt-5 py-2 px-4 font-bold mr-5 border-[1px] border-black hover:bg-[#FF642D] hover:border-[#FF642D] hover:text-white"
                >
                    Create new chapter
                </button>
                <button 
                    type = "submit"
                    className = "bg-[#FF642D] text-white mt-5 py-2 px-4 font-bold"
                >
                    Create course
                </button>
            </div>
        </form>
    )
}

export default CreateCourse;