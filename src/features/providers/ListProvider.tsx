import { type GetAllListofBoardResponse, type GetAllListofBoardRequest, type List, useLists, type CreateListRequest, type CreateListResponse } from "@/features/lists/index";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createContext } from "react";
import type { DeleteListFromBoardRequest, UpdateNameListRequest } from "@/features/lists/api/type";
import { useBoardContext } from "./BoardProvider";

interface ListContextType {
    // State
    list: List[];
    isLoading: boolean;
    error: string | null;

    // Functions
    getAllListsOfBoard: (request: GetAllListofBoardRequest) => Promise<GetAllListofBoardResponse>;
    fetchCreateList: (request: CreateListRequest) => Promise<CreateListResponse>;
    addListToState: (list: List) => void;
    fetchUpdateNameList: (request: UpdateNameListRequest) => void;
    fetchDeleteListFromBoard: (request: DeleteListFromBoardRequest) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [list, setList] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshBoard } = useBoardContext();
    const { getAllListsOfBoard, createList, updateNameList, deleteListFromBoard } = useLists();

    // get data from api
    useEffect(() => {
        if (boardId) {
            fetchLists(boardId);
        }
    }, [boardId]);

    const fetchLists = async (boardId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getAllListsOfBoard({ boardId });
            setList(data as unknown as List[]);
        } catch (err) {
            setError("Failed to fetch lists");
            console.error(`Failed to fetch lists: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchCreateList = async (request: CreateListRequest) : Promise<CreateListResponse> => {
        try {
            const data = await createList(request);
            if (!data) throw new Error("Failed to create list");

            if (boardId) {
                await refreshBoard(boardId);
            }
            return data;
        }
        catch (err) {
            setError("Failed to create list");
            console.error(`Failed to create list: ${err}`);
            throw err;
        }
    }

    const addListToState = async (list: List) => {
        setList(prevList => [...prevList, list]);

        if (boardId) {
            await refreshBoard(boardId);
        }
    }

    const fetchUpdateNameList = async (request: UpdateNameListRequest) => {
        try {
            await updateNameList(request);
            setList(prevList => prevList.map(l => l.id === request.listId ? { ...l, name: request.name } : l));

            if (boardId) {
                await refreshBoard(boardId);
            }
        } catch (err) {
            setError("Failed to update name list");
            console.error(`Failed to update name list: ${err}`);
            throw err;
        }
    }

    // delete list archive
    const fetchDeleteListFromBoard = async (request: DeleteListFromBoardRequest) => {
        try {
            await deleteListFromBoard(request);
            setList(prevList => prevList.filter(l => l.id !== request.listId));

            if (boardId) {
                await refreshBoard(boardId);
            }
        } catch (err) {
            setError("Failed to delete list from board");
            console.error(`Failed to delete list from board: ${err}`);
            throw err;
        }
    }
    const value : ListContextType = {
        list, 
        isLoading,
        error,
        getAllListsOfBoard,
        fetchCreateList,
        addListToState,
        fetchUpdateNameList,
        fetchDeleteListFromBoard
    }

    return (
        <ListContext.Provider value={value}>
            {children}
        </ListContext.Provider>
    )
}

// custom hook
export function useListContext() {
    const context = useContext(ListContext);
    if (context === undefined) {
        throw new Error('useListContext must be used within a ListProvider');
    }
    return context;
}