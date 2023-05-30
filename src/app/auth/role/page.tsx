"use client";

import {
    useEffect,
    useState,
    useRef,
    Dispatch,
    SetStateAction,
    FormEvent,
} from "react";
import { getSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChalkboardUser,
    faGraduationCap,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./role.module.css";

interface RoleSelectionInterface {
    icon: JSX.Element;
    choice: string;
    setRole: Dispatch<SetStateAction<string>>;
    role: string;
}

const RoleSelection = ({
    icon,
    choice,
    setRole,
    role,
}: RoleSelectionInterface) => {
    return (
        <div
            className={`cursor-pointer box-border py-7 w-[calc(50%_-_5px)] flex justify-center items-center flex-col border-[1px] border-opacity-25 rounded-sm duration-100 ${
                role === choice
                    ? "bg-[#FF642D] text-white"
                    : "bg-white text-black hover:bg-black hover:text-white"
            }`}
            onClick={() => {
                setRole(choice);
            }}
        >
            {icon}
            <h1>{choice}</h1>
        </div>
    );
};

const RolePage = () => {
    const dialogRef = useRef<null | HTMLDialogElement>(null);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [scale, setScale] = useState("");
    const [organization, setOrganization] = useState("");

    useEffect(() => {
        getSession().then((session) => {
            setEmail(session!.user!.email as string);
        })
    });

    const assignRoleStudent = async () => {
        if (role === "") {
            alert("Please choose your role!");
            return;
        }
        if (role === "Teacher") {
            dialogRef.current?.showModal();
            return;
        }
        const res = await fetch("/api/role", {
            method: "POST",
            body: JSON.stringify({
                role, email
            })
        });
        alert(await res.json());
    };

    const assignRoleTeacher = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (role !== "" && scale !== "" && organization !== "") {
            const res = await fetch(
                "/api/role", {
                    method: "POST",
                    body: JSON.stringify({ email, role, scale, organization }),
                }
            );
            alert(await res.json());
            return;
        }
        alert("Please fill in the necessary details!");
    };

    return (
        <div className="w-[350px] flex flex-col justify-center items-center">
            <h1 className="text-2xl mb-4 font-semibold">Pick your role!</h1>
            <dialog ref={dialogRef}>
                <form
                    method="dialog"
                    onSubmit={async (e) => await assignRoleTeacher(e)}
                    className="flex flex-col"
                >
                    <div className="w-full mb-3 relative">
                        <h1 className="text-center font-semibold">
                            Organization
                        </h1>
                        <div
                            className="cursor-pointer absolute right-0 top-0"
                            onClick={() => {
                                dialogRef.current?.close();
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="text-2xl"
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Your organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.currentTarget.value)}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="The scale of your institution"
                        value={scale}
                        onChange={(e) => setScale(e.currentTarget.value)}
                        className={styles.input}
                    />
                    <button
                        type="submit"
                        className="bg-[#FF642D] text-white py-2 font-semibold"
                    >
                        Create account
                    </button>
                </form>
            </dialog>
            <div className="w-full flex justify-between mb-4">
                <RoleSelection
                    icon={
                        <FontAwesomeIcon
                            icon={faGraduationCap}
                            className="w-16 h-16"
                        />
                    }
                    choice="Student"
                    role={role}
                    setRole={setRole}
                />
                <RoleSelection
                    icon={
                        <FontAwesomeIcon
                            icon={faChalkboardUser}
                            className="w-16 h-16"
                        />
                    }
                    choice="Teacher"
                    role={role}
                    setRole={setRole}
                />
            </div>
            <div
                className="w-full bg-[#FF642D] text-center py-2 cursor-pointer"
                onClick={async () => await assignRoleStudent()}
            >
                <h1 className="text-white text-xl font-semibold">Proceed</h1>
            </div>
        </div>
    );
};

export default RolePage;
