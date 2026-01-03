import type { UpdateCardRequest, UpdateCardResponse } from "@/features/cards/api/type";
import { type Card, type GetAllCardsOfBoardResponse, type GetAllCardsOfBoardRequest, useCards, type CreateCardRequest, type CreateCardResponse, type DeleteCardResponse, type DeleteCardRequest } from "@/features/cards/index";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface CardDetailContextType {
    // State
    cards: Card[];
    isLoading: boolean;
    error: string | null;

    // Functions
    getAllCardsOfBoard: (request: GetAllCardsOfBoardRequest) => Promise<GetAllCardsOfBoardResponse>;
    fetchCreateCard: (request: CreateCardRequest) => Promise<CreateCardResponse>;
    addCardToState: (card: Card) => void;
    fetchDeleteCard: (request: DeleteCardRequest) => Promise<DeleteCardResponse>;
    removeCardFromState: (cardId: string) => void;
    fetchUpdateCard: (request: UpdateCardRequest) => Promise<UpdateCardResponse>;
    updateCardInState: (cardId: string, updates: Partial<Card>) => void;
}

const CardDetailContext = createContext<CardDetailContextType | undefined>(undefined);

export function CardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllCardsOfBoard, createCard, deleteCard, updateCard } = useCards();

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

    // create card
    const fetchCreateCard = async (request: CreateCardRequest) : Promise<CreateCardResponse> => {
        try {
            const data = await createCard(request);
            if (!data) throw new Error("Failed to create card");
            return data;
        } catch (err) {
            setError("Failed to create card");
            console.error(`Failed to create card: ${err}`);
            throw err;
        }
    }

    const addCardToState = (card: Card) => {
        setCards(prevCards => [...prevCards, card]);
    }

    // delete card (archive)
    const fetchDeleteCard = async (request: DeleteCardRequest) : Promise<DeleteCardResponse> => {
        try {
            const data = await deleteCard(request);
            if (!data) throw new Error("Failed to delete card");
            return data;
        } catch (err) {
            setError("Failed to delete card");
            console.error(`Failed to delete card: ${err}`);
            throw err;
        }
    }

    const removeCardFromState = (cardId: string) => {
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    }

    const updateCardInState = (cardId: string, updates: Partial<Card>) => {
        setCards(prevCards => prevCards.map(card => card.id === cardId ? { ...card, ...updates } : card));
    }

    // update card
    const fetchUpdateCard = async (request: UpdateCardRequest) : Promise<UpdateCardResponse> => {
        try {
            const data = await updateCard(request);
            if (!data) throw new Error("Failed to update card");
            return data;
        } catch (err) {
            setError("Failed to update card");
            console.error(`Failed to update card: ${err}`);
            throw err;
        }
    }

    const value: CardDetailContextType = {
        cards,
        isLoading,
        error,
        getAllCardsOfBoard,
        fetchCreateCard,
        addCardToState,
        fetchDeleteCard,
        removeCardFromState,
        fetchUpdateCard,
        updateCardInState
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