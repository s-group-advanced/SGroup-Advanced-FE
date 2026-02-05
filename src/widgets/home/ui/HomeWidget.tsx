import { FaBriefcase } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { DialogNewWorkspace, DialogNewBoard } from "../components/dialog/index";
import { useEffect, useState } from "react";
import { BoardOptionsMenu } from "../components/BoardOptionsMenu";
import { useBoardContext } from "@/features/providers/index"; 
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider"; // ✅ Add this
import { Link } from "react-router-dom";
import { useBoards } from "@/features/boards/index";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { ContextMenu, ContextMenuContent, ContextMenuItem } from "@/shared/ui/context-menu";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import { Badge } from "@/shared/ui/badge";
import { FiArchive, FiEdit, FiRefreshCcw } from "react-icons/fi";

interface WorkspaceBoards {
    [workspaceId: string]: {
        id: string;
        name: string;
        description: string;
        listsCount?: number;
        membersCount?: number;
    }[];
}

export function HomeWidget() {
    const { projects, getAllProjectsOfUser, isLoading: isLoadingWorkspaces, handleToggleArchiveWorkspace, openEditDialog } = useWorkspaceContext();
    const { boards, isLoading: isLoadingBoards } = useBoardContext();  
    const { getBoardById } = useBoards();
    const [workspaceBoards, setWorkspaceBoards] = useState<WorkspaceBoards>({});
    const [checkingAccess, setCheckingAccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProjectsOfUser();
    }, []);
    
    useEffect(() => {
        if (boards.length > 0 && projects.length > 0) {
            const newWorkspaceBoards: WorkspaceBoards = {};

            projects.forEach(project => {
                newWorkspaceBoards[project.id] = boards.filter(
                    (board: any) => board.workspaceId === project.id
                );
            });

            setWorkspaceBoards(newWorkspaceBoards);
        } else {
            setWorkspaceBoards({});
        }
    }, [boards, projects]);

    const handleWorkspaceCreated = () => {
        getAllProjectsOfUser();
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
            console.error(`Failed to check access to board: ${err.message}`);

            const status = err.status || err.statusCode;

            if (status === 403 || status === 401) {
                toast.error("Access denied", {
                    description: `You are not a member of "${boardName}". Please contact the workspace owner to be invited.`,
                    className: "bg-white border-gray-200",
                    descriptionClassName: "text-black",
                })
            } else {
                toast.error("Failed to check access to board", {
                    description: `An error occurred while checking access to board. Please try again later. Error: ${err.message}`,
                    className: "bg-white border-gray-200",
                    descriptionClassName: "text-black",
                })
            }
        } finally {
            setCheckingAccess(false);
        }
    }

    const isLoading = isLoadingWorkspaces || isLoadingBoards;

    const handleToggleArchiveWorkspaceClick = async (workspaceId: string, workspaceName: string, isCurrentlyArchived: boolean) => {
        try {
            await handleToggleArchiveWorkspace({ workspaceId });
            const action = isCurrentlyArchived ? "restored" : "archived";
            toast.success(`Workspace "${workspaceName}" has been ${action}`, {
                position: 'top-center'
            })
        } catch (err) {
            toast.error("Failed to toggle archive workspace", {
                description: `An error occurred. Please try again later.`,
                position: 'top-center'
            })
        }
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <DialogNewBoard mode="edit" />
            <DialogNewWorkspace mode="edit" headerTitle="Edit Workspace" headerDescription="Update your workspace information" />
            {/* Header */}
            <div className="p-4 border-gray-200">
                <div className="border-gray-200 flex">
                    <h1 className="text-lg font-medium mx-4">Dashboard</h1>
                </div>
            </div>
            <div className="w-full h-px bg-gray-200 my-2"></div>

            {/* Main Content */}
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-500">Manage your workspaces and boards</p>
                    </div>
                    <DialogNewWorkspace
                        mode="create"
                        headerTitle="Create New Workspace"
                        headerDescription="Create a new workspace to organize your boards and collaborate with your team."
                        onWorkspaceCreated={handleWorkspaceCreated}
                        />
                </div>
            </div>


            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-gray-500">Loading workspaces and boards...</div>
                </div>
            ) : projects.length > 0 ? (
                projects.map((project) => {
                    const projectBoards = workspaceBoards[project.id] || [];
                    const isArchived = project.archive || false;

                    return (
                        <div key={project.id} className="px-8 mb-8">
                            <div className="flex items-center justify-between py-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center">
                                        <FaBriefcase className="mr-2 w-6 h-6" />

                                        <ContextMenu>
                                            <ContextMenuTrigger asChild>
                                                {isArchived ? (
                                                    <span className="text-lg font-semibold text-gray-400 cursor-not-allowed">
                                                        {project.name}
                                                    </span>
                                                ) : (
                                                    <Link 
                                                        key={project.id}
                                                        to={`/workspaces/${project.id}`}
                                                        className="text-lg font-semibold"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                )}
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                {/* Rename Workspace */}
                                                {!isArchived && (
                                                    <ContextMenuItem onClick={() => openEditDialog(project.id)}>
                                                        <FiEdit className="w-4 h-4 mr-2" />
                                                        Edit Workspace
                                                    </ContextMenuItem>
                                                )}

                                                <ContextMenuItem onClick={() => handleToggleArchiveWorkspaceClick(project.id, project.name, isArchived)}>
                                                    {isArchived ? <FiRefreshCcw className="w-4 h-4 mr-2" /> : <FiArchive className="w-4 h-4 mr-2" />}
                                                    {isArchived ? "Restore Workspace" : "Archive Workspace"}
                                                </ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>

                                        {/* Badge for archived workspace */}
                                        {isArchived && (
                                            <Badge variant="secondary" className="text-xs">
                                                Archived
                                            </Badge>
                                        )}
                                        
                                        {!isArchived && (
                                            <span className="ml-2 text-xs text-gray-500">
                                                ({projectBoards.length} {projectBoards.length === 1 ? 'board' : 'boards'})
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">{project.description}</div>
                                </div>

                                {!isArchived && (
                                    <DialogNewBoard 
                                        headerTitle="Create New Board" 
                                        headerDescription="Create a new board to organize your project tasks and collaborate with your team."
                                        workspaceId={project.id}
                                        onBoardCreated={handleWorkspaceCreated}
                                    />
                                )}
                            </div>

                                    {!isArchived && (
                                        <div className="flex flex-wrap gap-4">
                                            {projectBoards.length === 0 ? (
                                                <div className="text-sm text-gray-500 py-2">
                                                    No boards yet. Create a new board to get started!
                                                </div>
                                            ) : (
                                                projectBoards.map((board) => (
                                                <div
                                                    key={board.id}
                                                    onClick={(e) => handleBoardClick(e, board.id, board.name)}
                                                    className={`group flex flex-col gap-2 border border-gray-200 shadow-sm rounded-lg p-5 w-[calc(25%-12px)] hover:shadow-md transition-all duration-300 ${
                                                        checkingAccess ? 'cursor-wait opacity-50' : 'cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <svg 
                                                            className="w-4 h-4 text-blue-600" 
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            width="24" 
                                                            height="24" 
                                                            viewBox="0 0 24 24" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            strokeWidth="2" 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M5 3v14"></path>
                                                            <path d="M12 3v8"></path>
                                                            <path d="M19 3v18"></path>
                                                        </svg>
                                                        <div className="text-md font-semibold text-gray-900">{board.name}</div>
                                                        <BoardOptionsMenu boardId={board.id} />
                                                    </div>
                                                    <div className="text-sm text-gray-500 min-h-[2.5rem]">{board.description}</div>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="text-sm text-gray-500">
                                                            {board.listsCount || 0} {board.listsCount === 1 ? 'list' : 'lists'}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <BsPeople className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm">{board.membersCount || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                        </div>
                    );
                })
            ) : (
                <div className="text-sm text-gray-500 py-2 flex justify-center items-center">
                    No projects yet. Create a new project to get started!
                </div>
            )}
        </div>
    );
}