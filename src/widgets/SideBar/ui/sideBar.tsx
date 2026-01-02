import { UserProfileMenu, InfoWorkspace } from "@/widgets/SideBar/components/index";
import { Link } from "react-router-dom";
import { FiFolder } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useProject, type Project } from "@/features/projects";
import { useBoards } from "@/features/boards";
import type { ApiError } from "@/features/auth/login/api/type";

interface WorkspaceWithBoardCount extends Project {
    boardCount: number;
}

export function SideBar() {
    const { getAllProjectsOfUser } = useProject();
    const { getAllBoardsOfWorkspace } = useBoards(); 
    const [workspaces, setWorkspaces] = useState<WorkspaceWithBoardCount[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        setIsLoading(true);
        try {
            const projects = await getAllProjectsOfUser();
            
            const workspacesWithCount = await Promise.all(
                projects.map(async (project) => {
                    try {
                        const boards = await getAllBoardsOfWorkspace(project.id);
                        return {
                            ...project,
                            boardCount: boards.length
                        };
                    } catch (err) {
                        console.error(`Failed to fetch boards for ${project.name}:`, err);
                        return {
                            ...project,
                            boardCount: 0
                        };
                    }
                })
            );
            
            setWorkspaces(workspacesWithCount);
        } catch (err) {
            const apiError = err as ApiError;
            console.error(`Failed to fetch workspaces: ${apiError.message}`);
            setWorkspaces([]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-68 h-screen bg-gray-50 border-r border-gray-200 flex flex-col sticky top-0 left-0">
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
                        {isLoading ? (
                            <div className="text-xs text-gray-400 px-2 py-1">Loading...</div>
                        ) : workspaces.length === 0 ? (
                            <div className="text-xs text-gray-400 px-2 py-1">No workspaces</div>
                        ) : (
                            workspaces.map((workspace) => (
                                <Link
                                    key={workspace.id}
                                    to="/home"
                                    className="text-sm rounded-md hover:bg-gray-100 cursor-pointer p-1 ml-2 w-full flex items-center gap-2 pr-3 transition-colors"
                                >
                                    <FiFolder className="w-4 h-4" />
                                    <span className="truncate flex-1">{workspace.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {workspace.boardCount}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <UserProfileMenu />
        </div>
    )
}