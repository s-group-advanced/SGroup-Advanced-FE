import type React from "react";
import { useBoards, type Board } from "@/features/boards/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GetAllMemberOfBoardResponse, GetAllMemberOfWorkspaceButNotInBoardResponse, GetBoardByIdRequest, GetBoardByIdResponse } from "@/features/boards/api/type";
import { useBoardContext } from "./BoardProvider";

interface BoardDetailContextType {
    // State
    board: Board | null;
    membersOfBoard: GetAllMemberOfBoardResponse[];
    isLoading: boolean;
    error: string | null;

    // Functions
    getBoardById: (request: GetBoardByIdRequest) => Promise<GetBoardByIdResponse>;
    updateBoardName: (name: string) => Promise<void>;
    fetchAllMemberOfWorkspaceButNotInBoard: (boardId: string) => Promise<GetAllMemberOfWorkspaceButNotInBoardResponse[]>;
    fetchAllMemberOfBoard: (boardId: string) => Promise<void>;
    refreshMembersOfBoard: () => void;
}

const BoardDetailContext = createContext<BoardDetailContextType | undefined>(undefined);

export function BoardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [board, setBoard] = useState<Board | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [membersOfBoard, setMembersOfBoard] = useState<GetAllMemberOfBoardResponse[]>([]);
    const { refreshBoard, setBoards } = useBoardContext();
    const { getBoardById, editBoardToWorkspace, getAllMemberOfWorkspaceButNotInBoard, getAllMemberOfBoard } = useBoards();

    // fetch board data
    useEffect(() => {
        if (boardId) {
            fetchBoard(boardId);
            fetchAllMemberOfBoard(boardId);
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
            await editBoardToWorkspace({
                boardId: board?.id || "",
                name: name.trim(),
            });
            setBoard({ ...board, name } as Board);

            if (boardId) {
                    setBoards(prevBoards => 
                    prevBoards.map(b => 
                        b.id === boardId 
                            ? { ...b, name: name.trim() }
                        : b
                    )
                );
            }
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

    // fetch all member of board
    const fetchAllMemberOfBoard = async (boardId: string) => {
        try {
            const data = await getAllMemberOfBoard({ boardId });
            setMembersOfBoard(data as unknown as GetAllMemberOfBoardResponse[]);

            await refreshBoard(boardId);
        } catch (err) {
            setError("Failed to fetch all member of board");
            console.error(`Failed to fetch all member of board: ${err}`);
            throw err;
        }
    }

    // refresh members of board
    const refreshMembersOfBoard = async () => {
        if (boardId) {
            await fetchAllMemberOfBoard(boardId);
            await refreshBoard(boardId);
        }
    }

    const value : BoardDetailContextType = {
        board,
        membersOfBoard,
        isLoading,
        error,
        getBoardById,
        updateBoardName,
        fetchAllMemberOfWorkspaceButNotInBoard,
        fetchAllMemberOfBoard,
        refreshMembersOfBoard,
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