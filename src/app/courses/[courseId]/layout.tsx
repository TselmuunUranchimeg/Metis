import { Suspense } from "react";
import Loading from "./loading";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className = "w-full h-full">
            <Suspense fallback = {<Loading />}>
                {children}
            </Suspense>
        </div>
    )
}

export default PageLayout;