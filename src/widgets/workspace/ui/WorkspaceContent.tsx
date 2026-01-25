import { useNavigate, useParams } from "react-router-dom"
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider";
import { useBoardContext } from "@/features/providers/BoardProvider";
import { useEffect, useMemo, useState } from "react";
import { BoardFilter } from "../components/BoardFilter";
import { WorkspaceBoard } from "../components/WorkspaceBoard";
import { toast } from "sonner";

export function WorkspaceContent() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const { projects } = useWorkspaceContext();
    const { boards } = useBoardContext();
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('most-recent');
    const navigate = useNavigate();
    
    // Find current workspace
    const currentWorkspace = projects.find(project => project.id === workspaceId);
    
    // Check if workspace is archived
    useEffect(() => {
        if (currentWorkspace && currentWorkspace.archive) {
            toast.error("Workspace Archived", {
                description: "This workspace has been archived and is no longer accessible.",
                position: "top-center",
            });
            navigate("/home", { replace: true });
        }
    }, [currentWorkspace, navigate]);

    // If workspace does not exist or is archived, do not render anything
    if (!currentWorkspace || currentWorkspace.archive) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Loading workspace...</div>
            </div>
        );
    }
    // Filter boards của workspace này
    const workspaceBoards = useMemo(() => {
        return boards.filter(board => board.workspaceId === workspaceId);
    }, [boards, workspaceId]);
    
    const boardCount = workspaceBoards.length;

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mt-2">{currentWorkspace?.name}</h1>
                        <p className="text-gray-500 mt-2">{currentWorkspace?.description}</p>
                        <p className="text-gray-500 text-sm mt-2">{boardCount} boards total</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <BoardFilter 
                onSearchChange={setSearchTerm}
                onSortChange={setSortBy}
                onViewChange={setViewType}
            />
            <WorkspaceBoard viewType={viewType} searchTerm={searchTerm} sortBy={sortBy} />
        </div>
    )
}