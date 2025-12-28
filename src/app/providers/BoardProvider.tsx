import { useBoards, type AddBoardToWorkspaceRequest } from "@/features/boards";
import { createContext, useContext, useState, type ReactNode } from "react";

interface Board {
    id: string;
    name: string;
    description: string;
    tasksCount?: number;
    membersCount?: number;
}

interface BoardContextType {
    boards: Board[];
    selectedBoard: Board | null;
    isEditDialogOpen: boolean;
    setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
    selectBoard: (board: Board | null) => void;
    editBoard: (boardId: string) => void;
    deleteBoard: (boardId: string) => void;
    updateBoard: (boardId: string, name: string, description: string) => void; 
    createBoard: (request: AddBoardToWorkspaceRequest) => Promise<void>;
    closeEditDialog: () => void;
    fetchBoardsByWorkspace: (workspaceId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [boards, setBoards] = useState<Board[]>([]);

    const { getAllBoardsOfWorkspace, addBoardToWorkspace } = useBoards();
    
    // Lấy tất cả board của workspace
    const fetchBoardsByWorkspace = async (workspaceId: string) => {
        try {
            const data = await getAllBoardsOfWorkspace(workspaceId);
            setBoards(data as unknown as Board[]);
        } catch (err) {
            setBoards([]);
        }
    }
    
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const selectBoard = (board: Board | null) => {
        setSelectedBoard(board);
    };

    const editBoard = (boardId: string) => {
        const board = boards.find(b => b.id === boardId);
        if (board) {
            setSelectedBoard(board);
            setIsEditDialogOpen(true);
        }
    };

    const deleteBoard = (boardId: string) => {
        const board = boards.find(b => b.id === boardId);
        if (board && confirm(`Delete "${board.name}"?`)) {
            setBoards(prevBoards => prevBoards.filter(b => b.id !== boardId));
            console.log('Deleted board:', boardId);
        }
    };

    const updateBoard = (boardId: string, name: string, description: string) => {
        setBoards(prevBoards =>
            prevBoards.map(board =>
                board.id === boardId
                    ? { ...board, name, description }
                    : board
            )
        );
        setIsEditDialogOpen(false);
        setSelectedBoard(null);
        console.log('Updated board:', boardId, name, description);
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
                editBoard,
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