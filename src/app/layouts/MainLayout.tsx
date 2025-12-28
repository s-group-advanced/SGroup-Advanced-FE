import { SideBar } from "@/widgets/SideBar/index";
import type { ReactNode } from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}