import { useBoards, type AddBoardToWorkspaceRequest } from "@/features/boards";
import type { DeleteBoardRequest, EditBoardRequest } from "@/features/boards/api/type";
import { createContext, useContext, useState, type ReactNode } from "react";

interface Board {
    id: string;
    name: string;
    description: string;
    workspaceId: string;
    tasksCount?: number;
    membersCount?: number;
}

interface BoardContextType {
    boards: Board[];
    selectedBoard: Board | null;
    isEditDialogOpen: boolean;
    setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
    selectBoard: (board: Board | null) => void;
    openEditDialog: (boardId: string) => void;
    deleteBoard: (request: DeleteBoardRequest) => Promise<void>;
    updateBoard: (request: EditBoardRequest) => Promise<void>; 
    createBoard: (request: AddBoardToWorkspaceRequest) => Promise<void>;
    closeEditDialog: () => void;
    fetchBoardsByWorkspace: (workspaceId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [boards, setBoards] = useState<Board[]>([]);

    const { getAllBoardsOfWorkspace, addBoardToWorkspace, deleteBoardToWorkspace, editBoardToWorkspace } = useBoards();
    
    // Lấy tất cả board của workspace
    const fetchBoardsByWorkspace = async (workspaceId: string) => {
        try {
            const data = await getAllBoardsOfWorkspace(workspaceId);
            setBoards(prevBoards => {
                // Lọc bỏ boards cũ của workspace này
                const otherBoards = prevBoards.filter(b => b.workspaceId !== workspaceId);
                // Thêm boards mới vào
                return [...otherBoards, ...(data as unknown as Board[])];
            });
        } catch (err) {
            setBoards([]);
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
            // Check if nothing changed
            const nameUnchanged = !request.name || request.name.trim() === board.name.trim();
            const descriptionUnchanged = request.description === undefined || request.description?.trim() === board.description?.trim();
            
            if (nameUnchanged && descriptionUnchanged) {
                // No changes, just close dialog
                setIsEditDialogOpen(false);
                setSelectedBoard(null);
                return;
            }
            console.log("hihi");
            await editBoardToWorkspace(request);
            console.log("hehe");
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
            setBoards(prevBoards => [...prevBoards, newBoard as unknown as Board]);

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
                setBoards,
                selectBoard,
                openEditDialog,
                deleteBoard,
                updateBoard,    
                createBoard,
                closeEditDialog,
                fetchBoardsByWorkspace
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoardContext must be used within a BoardProvider');
    }
    return context;
}