// Main Container
import { useBoardDetail } from "@/features/providers/BoardDetailProvider";
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider"; 
import { BoardHeader } from "./BoardHeader";
import { BoardContent } from "./BoardContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function BoardWidget() {
    const { board, isLoading, error } = useBoardDetail();
    const { projects } = useWorkspaceContext();
    const navigate = useNavigate();

    // Check if board belongs to an archived workspace
    useEffect(() => {
        if (board && projects.length > 0) {
            const workspace = projects.find(p => p.id === board.workspace_id);
            
            if (workspace?.archive) {
                toast.error("Workspace Archived", {
                    description: "This board belongs to an archived workspace and is no longer accessible.",
                    position: "top-center",
                });
                navigate("/home", { replace: true });
            }
        }
    }, [board, projects, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg font-medium text-gray-700">
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg font-medium text-red-600">{error}</div>
            </div>
        );
    }

    // If board belongs to an archived workspace, do not render anything
    if (board && projects.length > 0) {
        const workspace = projects.find(p => p.id === board.workspace_id);
        if (workspace?.archive) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg font-medium text-gray-700">
                        Redirecting...
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="h-screen flex flex-col bg-white ">
            <BoardHeader />
                <div className="flex-1 p-4">
                    <BoardContent />
                </div>
        </div>
    );
}