"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGraduationCap,
    faCartShopping,
    faSchool,
    faClipboardList,
    faRightFromBracket,
    IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

interface DashboardInterface {
    children: React.ReactNode;
    role: string;
    profileImg: string;
    name: string;
    userID: string;
}
interface TabInterface {
    role: string;
    link: string;
    icon: IconDefinition;
    pathname: string;
}

const Tab = ({ role, link, icon, pathname }: TabInterface) => {
    const url = `/${role}/${link.toLowerCase()}`;
    const [state, setState] = useState(pathname.includes(url));

    useEffect(() => {
        setState(pathname.includes(url));
    }, [pathname]);

    return (
        <Link
            href={url}
            className={`w-full flex py-3 my-1 ${
                state ? "bg-[#FF642D] text-white" : "bg-white text-black"
            } rounded-full`}
        >
            <div className="w-1/4 flex text-left">
                <FontAwesomeIcon icon={icon} className={`text-2xl w-full`} />
            </div>
            <h2>{link}</h2>
        </Link>
    );
};

const Dashboard = ({ children, role, profileImg, name, userID }: DashboardInterface) => {
    const pathname = usePathname();
    const dialogRef = useRef<null | HTMLDialogElement>(null);

    return (
        <div className="w-full h-full flex">
            <dialog ref = {dialogRef}>
                <div></div>
            </dialog>
            <div className="relative w-[calc(30%_-_1px)] min-w-[300px] flex flex-col items-center h-full border-r-[1px] border-black">
                <div className="w-full box-border px-8">
                    <div className="pt-6 pb-4 border-opacity-40 border-b-[1px]">
                        <h1 className="font-bold text-xl">Metis</h1>
                    </div>
                </div>
                <div className="w-full flex flex-col mt-9 box-border px-8">
                    <Tab
                        pathname={pathname}
                        role={role}
                        link="Courses"
                        icon={faGraduationCap}
                    />
                    <Tab
                        pathname={pathname}
                        role={role}
                        link="Classes"
                        icon={faSchool}
                    />
                    <Tab
                        pathname={pathname}
                        role={role}
                        link="Cart"
                        icon={faCartShopping}
                    />
                    <Tab
                        pathname={pathname}
                        role={role}
                        link="Wishlist"
                        icon={faClipboardList}
                    />
                </div>
                <div className = "text-white bg-[#FF642D] w-44 h-44 rounded-md absolute bottom-20 flex flex-col justify-center items-center">
                    <img 
                        src = {profileImg}
                        alt = "Profile picture"
                        className = "w-16 h-16 rounded-[50%] mb-2"
                        referrerPolicy = "no-referrer"
                    />
                    <h1 className = "text-sm">{name}</h1>
                    <Link 
                        href = {`/profile/${userID}`}
                        className = "underline opacity-70 hover:opacity-100 duration-100"
                    >
                        Edit your profile
                    </Link>
                </div>
                <div 
                    onClick = {() => {
                        dialogRef.current?.showModal();
                    }}
                    className = "flex absolute bottom-5 left-8 items-center underline opacity-75 hover:opacity-100 duration-100 cursor-pointer"
                >
                    <FontAwesomeIcon 
                        icon = { faRightFromBracket }
                        className = "mr-2 text-xl"
                    />
                    <p>Log out</p>
                </div>
            </div>
            <div className="w-[calc(70%_+_1px)] min-w-[calc(100%_-_301px)] h-full">
                {children}
            </div>
        </div>
    );
};

export default Dashboard;
