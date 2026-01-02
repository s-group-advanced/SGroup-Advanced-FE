import { SideBar } from "@/widgets/SideBar/index";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}