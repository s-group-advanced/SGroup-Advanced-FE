import { type Card, type GetAllCardsOfBoardResponse, type GetAllCardsOfBoardRequest, useCards } from "@/features/cards/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface CardDetailContextType {
    // State
    cards: Card[];
    isLoading: boolean;
    error: string | null;

    // Functions
    getAllCardsOfBoard: (request: GetAllCardsOfBoardRequest) => Promise<GetAllCardsOfBoardResponse>;
}

const CardDetailContext = createContext<CardDetailContextType | undefined>(undefined);

export function CardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllCardsOfBoard } = useCards();

    // get data from api
    useEffect(() => {
        if (boardId) {
            fetchCards(boardId);
        }
    }, [boardId]);

    const fetchCards = async (boardId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getAllCardsOfBoard({ boardId });
            
            let cardsData: Card[] = [];
            
            if (Array.isArray(data)) {
                cardsData = data;
            } else if (data && typeof data === 'object' && 'cards' in data) {
                cardsData = data.cards || [];
            }

            // Lưu trực tiếp cards
            setCards(cardsData);
        } catch (err) {
            setError("Failed to fetch cards");
            console.error(`Failed to fetch cards:`, err);
            setCards([]);
        } finally {
            setIsLoading(false);
        }
    }

    const value: CardDetailContextType = {
        cards,
        isLoading,
        error,
        getAllCardsOfBoard,
    }

    return (
        <CardDetailContext.Provider value={value}>
            {children}
        </CardDetailContext.Provider>
    )
}

// custom hook 
export function useCardDetailContext() {
    const context = useContext(CardDetailContext);
    if (context === undefined) {
        throw new Error('useCardDetail must be used within a CardDetailProvider');
    }
    return context;
}