import type React from "react";
import { useBoards, type Board } from "@/features/boards/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GetAllMemberOfWorkspaceButNotInBoardResponse, GetBoardByIdRequest, GetBoardByIdResponse } from "@/features/boards/api/type";

interface BoardDetailContextType {
    // State
    board: Board | null;
    isLoading: boolean;
    error: string | null;

    // Functions
    getBoardById: (request: GetBoardByIdRequest) => Promise<GetBoardByIdResponse>;
    updateBoardName: (name: string) => Promise<void>;
    fetchAllMemberOfWorkspaceButNotInBoard: (boardId: string) => Promise<GetAllMemberOfWorkspaceButNotInBoardResponse[]>;
}

const BoardDetailContext = createContext<BoardDetailContextType | undefined>(undefined);

export function BoardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { getBoardById, editBoardToWorkspace, getAllMemberOfWorkspaceButNotInBoard } = useBoards();

    // fetch board data
    useEffect(() => {
        if (boardId) {
            fetchBoard(boardId);
        }
    }, [boardId]);

    const fetchBoard = async (boardId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getBoardById({ boardId });

            setBoard(data as unknown as Board);
        } catch (err) {
            setError("Failed to fetch board data");
            console.error(`Failed to fetch board data: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    const updateBoardName = async (name: string) => {
        try {

            // if nothing changed, return
            if (!name.trim() || name.trim() === board?.name) {
                return;
            }
            console.log("hehe");
            await editBoardToWorkspace({
                boardId: board?.id || "",
                name: name.trim(),
            });
            setBoard({ ...board, name } as Board);
        } catch (err) {
            console.error(`Failed to update board name: ${err}`);
            throw err;
        }
    }

    const fetchAllMemberOfWorkspaceButNotInBoard = async (boardId: string) => {
        try {
            const data = await getAllMemberOfWorkspaceButNotInBoard({ boardId });
            return data as unknown as GetAllMemberOfWorkspaceButNotInBoardResponse[];
        } catch (err) {
            setError("Failed to fetch all member of workspace but not in board");
            console.error(`Failed to fetch all member of workspace but not in board: ${err}`);
            throw err;
        }
    }

    const value : BoardDetailContextType = {
        board,
        isLoading,
        error,
        getBoardById,
        updateBoardName,
        fetchAllMemberOfWorkspaceButNotInBoard,
        
    }

    return (
        <BoardDetailContext.Provider value={value}>
            {children}
        </BoardDetailContext.Provider>
    )
}

// custom hook 
export function useBoardDetail() {
    const context = useContext(BoardDetailContext);

    if (context === undefined) {
        throw new Error('useBoardDetail must be used within a BoardDetailProvider');
    }

    return context;
}