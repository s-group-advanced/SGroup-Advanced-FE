import { useBoardContext } from "@/features/providers";
import { DialogNewBoard } from "@/widgets/home/components/dialog/dialogNewBoard";
import { useMemo } from "react";
import { BsPeople } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { BoardOptionsMenu } from "@/widgets/home/components/BoardOptionsMenu";

interface WorkspaceBoardProps {
    viewType?: 'grid' | 'list';
    searchTerm?: string;
    sortBy?: string;
}

export function WorkspaceBoard({ viewType = 'grid', searchTerm = '', sortBy = '' }: WorkspaceBoardProps) {
    const navigate = useNavigate();

    const { boards } = useBoardContext();
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const workspaceBoards = useMemo(() => {
        return boards.filter(board => board.workspaceId === workspaceId && board.name.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => {
            if (sortBy === 'A-Z') {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'Z-A') {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });
    }, [boards, workspaceId, searchTerm, sortBy]);


    const handleBoardClick = (boardId: string) => {
        navigate(`/board/${boardId}`);
    }

    // List View
    if (viewType === 'list') {
        return (
            <>
                <div className="flex flex-col gap-4 px-8 py-4">
                    {/* Existing Boards - List View */}
                    {workspaceBoards.map((board) => (
                        <div
                            key={board.id}
                            onClick={() => handleBoardClick(board.id)}
                            className="group flex items-center gap-4 border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer bg-white"
                        >
                            {/* Icon */}
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg 
                                    className="w-6 h-6 text-white" 
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
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-semibold text-gray-900 mb-1">
                                        {board.name}
                                    </h3>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <BoardOptionsMenu boardId={board.id} />
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-500">
                                    {board.description}
                                </p>
                                {/* Meta Info */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                                    <span>{board.listsCount || 0} lists</span>
                                    <div className="flex items-center gap-1">
                                        <span>{board.membersCount || 0} members</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Create New Board - List View */}
                    <DialogNewBoard
                        headerTitle="Create New Board"
                        headerDescription="Create a new board to organize your project tasks and collaborate with your team."
                        workspaceId={workspaceId}
                        triggerButton={
                            <button className="flex items-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer w-full">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <FiPlus className="w-6 h-6 text-gray-500" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-gray-900">Create new board</div>
                                    <div className="text-sm text-gray-500">Add a new board to this workspace</div>
                                </div>
                            </button>
                        }
                    />
                </div>
                
                {/* Edit Dialog */}
                <DialogNewBoard mode="edit" />
            </>
        );
    }

    // Grid View (default)
    return (
        <>
            <div className="flex flex-wrap gap-4 px-8 py-4">
                {/* Existing Boards - Grid View */}
                {workspaceBoards.map((board) => (
                    <div
                        key={board.id}
                        onClick={() => handleBoardClick(board.id)}
                        className="group flex flex-col gap-2 border border-gray-200 shadow-sm rounded-lg p-5 w-[calc(25%-12px)] hover:shadow-md transition-all duration-300 cursor-pointer"
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
                            >
                                <path d="M5 3v14"></path>
                                <path d="M12 3v8"></path>
                                <path d="M19 3v18"></path>
                            </svg>
                            <div className="text-md font-semibold text-gray-900">
                                {board.name}
                            </div>
                            <BoardOptionsMenu boardId={board.id} />
                        </div>

                        <div className="text-sm text-gray-500 min-h-[2.5rem]">
                            {board.description}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="text-sm text-gray-500">
                                {board.listsCount || 0} {board.listsCount === 1 ? 'list' : 'lists'}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                                <BsPeople className="w-4 h-4" />
                                <span className="text-sm">{board.membersCount || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Create New Board - Grid View */}
                <DialogNewBoard
                    headerTitle="Create New Board"
                    headerDescription="Create a new board to organize your project tasks and collaborate with your team."
                    workspaceId={workspaceId}
                    triggerButton={
                        <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-5 w-[calc(25%-12px)] hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 cursor-pointer">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FiPlus className="w-6 h-6 text-gray-500" />
                            </div>
                            <span className="text-gray-600 font-medium">Create new board</span>
                        </div>
                    }
                />
            </div>
            
            {/* Edit Dialog */}
            <DialogNewBoard mode="edit" />
        </>
    );
}