import { useLabels, type AddLabelOnBoardRequest, type AddLabelToCardRequest, type RemoveLabelFromCardRequest } from "@/features/labels/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface LabelContextType {
    // State
    labelsOfBoard: any[];
    isLoading: boolean;
    error: string | null;

    // Functions
    fetchAllLabelsOfBoard: (boardId: string) => Promise<void>;
    handleAddLabelOnBoard: (request: AddLabelOnBoardRequest) => Promise<void>;
    handleAddLabelToCard: (request: AddLabelToCardRequest) => Promise<void>;
    handleRemoveLabelFromCard: (request: RemoveLabelFromCardRequest) => Promise<void>;
}

const  LabelContext = createContext<LabelContextType | undefined>(undefined);

export function LabelProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [labelsOfBoard, setLabelsOfBoard] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllLabelsOfBoard, addLabelOnBoard, addLabelToCard, removeLabelFromCard } = useLabels();

    // get data from api
    useEffect(() => {
        if (boardId) {
            fetchAllLabelsOfBoard(boardId);
        }
    }, [boardId]);

    // fetch all labels of board
    const fetchAllLabelsOfBoard = async (boardId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getAllLabelsOfBoard({ boardId });
            if (!data) throw new Error("Failed to fetch all labels of board");
            const labelsData = Array.isArray(data) ? data : [data];
            setLabelsOfBoard(labelsData);
        } catch (err) {
            setError("Failed to fetch all labels of board");
            console.error(`Failed to fetch all labels of board: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    // add label on board
    const handleAddLabelOnBoard = async (request: AddLabelOnBoardRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await addLabelOnBoard({
                boardId: request.boardId,
                name: request.name,
                color: request.color,
            });
            fetchAllLabelsOfBoard(boardId as string);
        } catch (err) {
            setError("Failed to add label on board");
            console.error(`Failed to add label on board: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    // add label to card
    const handleAddLabelToCard = async (request: AddLabelToCardRequest) => {
        try {
            await addLabelToCard({
                cardId: request.cardId,
                label_id: request.label_id,
            });
        } catch (err) {
            setError("Failed to add label to card");
            console.error(`Failed to add label to card: ${err}`);
        }
    } 

    // remove label from card
    const handleRemoveLabelFromCard = async (request: RemoveLabelFromCardRequest) => {
        try {
            await removeLabelFromCard(request);
            fetchAllLabelsOfBoard(boardId as string);
        } catch (err) {
            setError("Failed to remove label from card");
            console.error(`Failed to remove label from card: ${err}`);
        }
    }

    const value : LabelContextType = {
        labelsOfBoard,
        isLoading,
        error,
        fetchAllLabelsOfBoard,
        handleAddLabelOnBoard,
        handleAddLabelToCard,
        handleRemoveLabelFromCard,
    }

    return (
        <LabelContext.Provider value={value}>
            {children}
        </LabelContext.Provider>
    )
}

// custom hook
export function useLabelContext() {
    const context = useContext(LabelContext);
    if (context === undefined) {
        throw new Error('useLabelContext must be used within a LabelProvider');
    }
    return context;
}