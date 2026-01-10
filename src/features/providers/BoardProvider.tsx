// src/features/providers/BoardProvider.tsx
import { useBoards, type AddBoardToWorkspaceRequest } from "@/features/boards";
import type { DeleteBoardRequest, EditBoardRequest } from "@/features/boards/api/type";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useWorkspaceContext } from "./WorkspaceProvider";
import { useLists } from "../lists/index";

interface Board {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
    tasksCount?: number;
    membersCount?: number;
    listsCount?: number;
}

interface BoardContextType {
    boards: Board[];
    selectedBoard: Board | null;
    isEditDialogOpen: boolean;
    isLoading: boolean;
    setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
    selectBoard: (board: Board | null) => void;
    openEditDialog: (boardId: string) => void;
    deleteBoard: (request: DeleteBoardRequest) => Promise<void>;
    updateBoard: (request: EditBoardRequest) => Promise<void>; 
    createBoard: (request: AddBoardToWorkspaceRequest) => Promise<void>;
    closeEditDialog: () => void;
    fetchBoardsByWorkspace: (workspaceId: string) => Promise<void>;
    refreshBoard: (boardId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [boards, setBoards] = useState<Board[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { projects } = useWorkspaceContext();
    const { getAllListsOfBoard } = useLists();
    const { getAllMemberOfBoard } = useBoards();

    const { getAllBoardsOfWorkspace, addBoardToWorkspace, deleteBoardToWorkspace, editBoardToWorkspace } = useBoards();

    const fetchBoardMetadata = async (boardId: string) => {
        try {
            const [listsResponse, membersResponse] = await Promise.all([
                getAllListsOfBoard({ boardId }),
                getAllMemberOfBoard({ boardId })
            ]);

            const lists = listsResponse as unknown as any[];
            const members = membersResponse as unknown as any[];
            return {
                listsCount: lists.length || 0,
                membersCount: members.length || 0
            }
        } catch (err) {
            console.error(`Failed to fetch board metadata: ${err}`);
            return { listsCount: 0, membersCount: 0 }
        }
    }

    // refresh boards
    const refreshBoard = async (boardId: string) => {
        try {
            const metadata = await fetchBoardMetadata(boardId);

            setBoards(prevBoards => prevBoards.map(board => board.id === boardId ? { ...board, ...metadata } : board));
        } catch (err) {
            console.error(`Failed to refresh board: ${err}`);
        }
    }
    
    // fetch all boards when projects change
    useEffect(() => {
        const fetchAllBoards = async () => {
            if (projects.length === 0) return;
            
            setIsLoading(true);
            let allBoards: Board[] = [];
            
            try {
                await Promise.all(
                    projects.map(async (project) => {
                        try {
                            const data = await getAllBoardsOfWorkspace(project.id);
                            // ✨ QUAN TRỌNG: Gán workspaceId vào mỗi board
                            const boardsWithWorkspaceId = (data as unknown as Board[]).map(board => ({
                                ...board,
                                workspaceId: project.id
                            }));
                            allBoards = [...allBoards, ...boardsWithWorkspaceId];
                        } catch (err) {
                            console.error(`Failed to fetch boards for workspace ${project.id}:`, err);
                        }
                    })
                );

                const boardsWithMetadata = await Promise.all(
                    allBoards.map(async (board) => {
                        const metadata = await fetchBoardMetadata(board.id);
                        return {
                            ...board,
                            ...metadata
                        }
                    })
                )
                
                setBoards(boardsWithMetadata);
            } catch (err) {
                console.error("Error fetching all boards:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBoards();
    }, [projects]);
    
    // Lấy tất cả board của 1 workspace cụ thể
    const fetchBoardsByWorkspace = async (workspaceId: string) => {
        try {
            const data = await getAllBoardsOfWorkspace(workspaceId);
            setBoards(prevBoards => {
                // Lọc bỏ boards cũ của workspace này
                const otherBoards = prevBoards.filter(b => b.workspaceId !== workspaceId);
                // Thêm boards mới vào với workspaceId
                const newBoards = (data as unknown as Board[]).map(board => ({
                    ...board,
                    workspaceId: workspaceId
                }));
                return [...otherBoards, ...newBoards];
            });
        } catch (err) {
            console.error(`Failed to fetch boards for workspace ${workspaceId}:`, err);
        }
    }
    
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const selectBoard = (board: Board | null) => {
        setSelectedBoard(board);
    };

    const openEditDialog = async (boardId: string) => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setSelectedBoard(board);
            setIsEditDialogOpen(true);
        }
    };

    const deleteBoard = async (request: DeleteBoardRequest) => {
        const board = boards.find(b => b.id === request.boardId);

        if (!board || !confirm(`Are you sure you want to permanently delete "${board.name}"?`)) {
            return;
        }

        try {
            await deleteBoardToWorkspace(request);
            setBoards(prevBoards => prevBoards.filter(b => b.id !== request.boardId));
        } catch (err) {
            console.error(`Failed to delete board: ${err}`);
            alert(`Failed to delete board: ${err}`);
            throw err;
        }
    }

    const updateBoard = async (request: EditBoardRequest) => {
        const board = boards.find(b => b.id === request.boardId);

        if (!board) {
            console.error(`Board not found: ${request.boardId}`);
            throw new Error(`Board not found: ${request.boardId}`);
        }

        try {
            const nameUnchanged = !request.name || request.name.trim() === board.name.trim();
            const descriptionUnchanged = request.description === undefined || request.description?.trim() === board.description?.trim();
            
            if (nameUnchanged && descriptionUnchanged) {
                setIsEditDialogOpen(false);
                setSelectedBoard(null);
                return;
            }
            
            await editBoardToWorkspace(request);
            setBoards(prevBoards => prevBoards.map(b => b.id === request.boardId ? { ...b, ...request } : b));
            setIsEditDialogOpen(false);
            setSelectedBoard(null);
        } catch (err) {
            console.error(`Failed to update board: ${err}`);
            alert(`Failed to update board: ${err}`);
            throw err;
        }
    };

    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedBoard(null);
    };

    const createBoard = async (request: AddBoardToWorkspaceRequest): Promise<void> => {
        try {
            const newBoard = await addBoardToWorkspace(request);
            // Gán workspaceId vào board mới
            const boardWithWorkspaceId = {
                ...(newBoard as unknown as Board),
                workspaceId: request.workspaceId
            };
            setBoards(prevBoards => [...prevBoards, boardWithWorkspaceId]);
        } catch (err) {
            console.error(`Failed to create board: ${err}`);
            throw err;
        }
    }

    return (
        <BoardContext.Provider
            value={{
                boards,
                selectedBoard,
                isEditDialogOpen,
                isLoading,
                setBoards,
                selectBoard,
                openEditDialog,
                deleteBoard,
                updateBoard,    
                createBoard,
                closeEditDialog,
                fetchBoardsByWorkspace,
                refreshBoard
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoardContext must be used within BoardProvider');
    }
    return context;
}