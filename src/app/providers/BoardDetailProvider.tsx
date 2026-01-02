import type React from "react";
import { useBoards, type Board } from "@/features/boards/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GetBoardByIdRequest, GetBoardByIdResponse } from "@/features/boards/api/type";

interface BoardDetailContextType {
    // State
    board: Board | null;
    isLoading: boolean;
    error: string | null;

    // Functions
    getBoardById: (request: GetBoardByIdRequest) => Promise<GetBoardByIdResponse>;
}

const BoardDetailContext = createContext<BoardDetailContextType | undefined>(undefined);


export function BoardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getBoardById } = useBoards();

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

    const value : BoardDetailContextType = {
        board,
        isLoading,
        error,
        getBoardById,
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