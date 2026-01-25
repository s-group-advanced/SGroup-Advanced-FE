import { UserProfileMenu, InfoWorkspace } from "@/widgets/SideBar/components/index";
import { Link } from "react-router-dom";
import { FiFolder, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useMemo, useState } from "react";
import { type Project } from "@/features/projects";
import { useBoardContext } from "@/features/providers"; 
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider";
import { useBoards } from "@/features/boards/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WorkspaceWithBoardCount extends Project {
    boardCount: number;
}

export function SideBar() {
    const { projects } = useWorkspaceContext(); 
    const { boards } = useBoardContext();  
    const [checkingAccess, setCheckingAccess] = useState(false);
    const [expandedWorkspaces, setExpandedWorkspaces] = useState<string[]>([]); 
    const { getBoardById } = useBoards();
    const navigate = useNavigate();

    // Compute workspaces với board count từ boards Context
    const workspacesWithCount = useMemo<WorkspaceWithBoardCount[]>(() => {
        return projects
            .filter(project => !project.archive)
            .map(project => ({
                ...project,
                boardCount: boards.filter(b => b.workspaceId === project.id).length
            }));
        }, [projects, boards]);

    const toggleWorkspace = (workspaceId: string) => {
        setExpandedWorkspaces(prev => 
            prev.includes(workspaceId) 
                ? prev.filter(id => id !== workspaceId)
                : [...prev, workspaceId]
        );
    };

    // Handler check access to board
    const handleBoardClick = async (e: React.MouseEvent, boardId: string, boardName: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (checkingAccess) return;
        setCheckingAccess(true);

        try {
            await getBoardById({ boardId });
            
            navigate(`/board/${boardId}`);
            
        } catch (err: any) {
            const status = err?.status || err?.statusCode || err?.response?.status;
            const message = err?.message || "Unknown error";

            if (status === 403 || status === 401) {
                toast.error("Access Denied", {
                    description: `You are not a member of "${boardName}". Please contact the workspace owner.`,
                });
            } else {
                toast.error("Error", {
                    description: `Failed to access board: ${message}`,
                });
            }
        } finally {
            setCheckingAccess(false);
        }
    };

    return (
        <div className="w-68 h-screen bg-gray-50 border-r border-gray-200 flex flex-col sticky top-0 left-0 z-50">
            <InfoWorkspace />
            
           {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
                {/* Navigation Section */}
                <div className="px-2 py-3">
                    <div className="text-xs font-medium text-gray-500 px-2 mb-1">Navigation</div>
                    <div className="flex items-center gap-2 px-2 mb-1 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg p-2">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM160 224L160 480L288 480L288 224L160 224zM480 224L352 224L352 480L480 480L480 224z"/>
                        </svg>
                        <Link to="/home" className="text-sm font-medium">Dashboard</Link>
                    </div>
                </div>

                {/* Workspaces Section */}
                <div className="px-2 py-3 border-gray-200">
                    <div className="text-xs font-medium text-gray-500 px-2 mb-1">Workspaces</div>

                    {/* Workspaces List */}
                    <div className="mb-1">
                        {workspacesWithCount.length === 0 ? (
                            <div className="text-xs text-gray-400 px-2 py-1">No workspaces</div>
                        ) : (
                            workspacesWithCount.map((workspace) => {
                                const isExpanded = expandedWorkspaces.includes(workspace.id);
                                const workspaceBoards = boards.filter(b => b.workspaceId === workspace.id);

                                return (
                                    <div key={workspace.id} className="mb-1">
                                        <div className="text-sm rounded-md hover:bg-gray-100 p-1 ml-2 w-full flex items-center gap-2 pr-3 transition-colors">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWorkspace(workspace.id);
                                                }}
                                                className="hover:bg-gray-200 rounded p-0.5 transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <FiChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <FiChevronRight className="w-4 h-4" />
                                                )}
                                            </button>
                                
                                            <Link
                                                to={`/workspaces/${workspace.id}`}
                                                className="flex items-center gap-2 flex-1 min-w-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FiFolder className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate flex-1">{workspace.name}</span>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    {workspace.boardCount}
                                                </span>
                                            </Link>
                                        </div>
                                
                                        {isExpanded && (
                                            <div className="ml-8 mt-1 space-y-1">
                                                {workspaceBoards.length === 0 ? (
                                                    <div className="text-xs text-gray-400 py-1">No boards</div>
                                                ) : (
                                                    workspaceBoards.map((board) => (
                                                        <div
                                                            key={board.id}
                                                            onClick={(e) => handleBoardClick(e, board.id, board.name)}
                                                            className={`text-sm rounded-md hover:bg-gray-100 cursor-pointer py-1.5 px-2 transition-colors flex items-center gap-2 ${
                                                                checkingAccess ? 'opacity-50 cursor-wait' : ''
                                                            }`}
                                                        >
                                                            <svg 
                                                                className="w-3 h-3 text-blue-600" 
                                                                xmlns="http://www.w3.org/2000/svg" 
                                                                viewBox="0 0 24 24" 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                strokeWidth="2"
                                                            >
                                                                <path d="M5 3v14"></path>
                                                                <path d="M12 3v8"></path>
                                                                <path d="M19 3v18"></path>
                                                            </svg>
                                                            <span className="truncate">{board.name}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <UserProfileMenu />
        </div>
    );
}