import { type GetAllListofBoardResponse, type GetAllListofBoardRequest, type List, useLists } from "@/features/lists/index";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createContext } from "react";

interface ListContextType {
    // State
    list: List[];
    isLoading: boolean;
    error: string | null;

    // Functions
    getAllListsOfBoard: (request: GetAllListofBoardRequest) => Promise<GetAllListofBoardResponse>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [list, setList] = useState<List[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllListsOfBoard } = useLists();

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

    const value : ListContextType = {
        list, 
        isLoading,
        error,
        getAllListsOfBoard,
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