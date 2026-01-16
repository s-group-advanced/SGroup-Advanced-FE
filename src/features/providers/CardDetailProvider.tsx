import type { AssignedUserToCardRequest, AssignedUserToCardResponse, GetAllCommentsOfCardRequest, CreateCommentOnCardResponse, GetAllCommentsOfCardResponse, UnassignUserFromCardRequest, UpdateCardRequest, UpdateCardResponse, CreateCommentOnCardRequest, MoveCardToListRequest } from "@/features/cards/api/type";
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
    handleAssignUserToCard: (request: AssignedUserToCardRequest) => Promise<AssignedUserToCardResponse>;
    handleUnassignUserFromCard: (request: UnassignUserFromCardRequest) => Promise<void>;
    handleCreateCommentOnCard: (request: CreateCommentOnCardRequest) => Promise<CreateCommentOnCardResponse>;
    handleGetAllCommentsOfCard: (request: GetAllCommentsOfCardRequest) => Promise<GetAllCommentsOfCardResponse>;
    handleMoveCardToList: (request: MoveCardToListRequest) => Promise<void>;
}

const CardDetailContext = createContext<CardDetailContextType | undefined>(undefined);

export function CardDetailProvider({ children }: { children: React.ReactNode }) {
    const { boardId } = useParams<{ boardId: string }>();
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getAllCardsOfBoard, createCard, deleteCard, updateCard, assignUserToCard, unassignUserFromCard, createCommentOnCard, getAllCommentsOfCard, moveCardToList } = useCards();

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

    // assign user to card
    const handleAssignUserToCard = async (request: AssignedUserToCardRequest) : Promise<AssignedUserToCardResponse> => {
        try {
            const data = await assignUserToCard(request);
            if (!data) throw new Error("Failed to assign user to card");
            return data;
        } catch (err) {
            setError("Failed to assign user to card");
            console.error(`Failed to assign user to card: ${err}`);
            throw err;
        }
    }

    // unassign user from card
    const handleUnassignUserFromCard = async (request: UnassignUserFromCardRequest) : Promise<void> => {
        try {
            await unassignUserFromCard(request);
        } catch (err) {
            setError("Failed to unassign user from card");
            console.error(`Failed to unassign user from card: ${err}`);
            throw err;
        }
    }

    // create comment on card
    const handleCreateCommentOnCard = async (request: CreateCommentOnCardRequest) : Promise<CreateCommentOnCardResponse> => {
        try {
            const data = await createCommentOnCard(request);
            if (!data) throw new Error("Failed to create comment on card");
            return data;
        } catch (err) {
            setError("Failed to create comment on card");
            console.error(`Failed to create comment on card: ${err}`);
            throw err;
        }
    }

    // get all comments of card
    const handleGetAllCommentsOfCard = async (request: GetAllCommentsOfCardRequest) : Promise<GetAllCommentsOfCardResponse> => {
        try {
            const data = await getAllCommentsOfCard(request);
            if (!data) throw new Error("Failed to get all comments of card");
            return data;
        } catch (err) {
            setError("Failed to get all comments of card");
            console.error(`Failed to get all comments of card: ${err}`);
            throw err;
        }
    }

    // move card to list
const handleMoveCardToList = async (request: MoveCardToListRequest) => {
    const oldCards = [...cards];
    
    try {
        
        // Optimistic update
        setCards(prevCards => {
            const newCards = [...prevCards];
            
            // Find card to move
            const cardIndex = newCards.findIndex(c => c.id === request.cardId);
            if (cardIndex === -1) {
                return prevCards;
            }
            
            // Get card out
            const [movedCard] = newCards.splice(cardIndex, 1);
            
            // Get all cards in target list (sorted by position)
            const cardsInTargetList = newCards
                .filter(c => c.list_id === request.targetListId)
                .sort((a, b) => a.position - b.position);
            
            // Calculate new position for card 
            let newPosition: number;
            
            if (cardsInTargetList.length === 0) {
                // Empty list - position = 0
                newPosition = 0;
            } else if (request.newIndex === 0) {
                // Insert at the beginning - position smaller than first card
                newPosition = cardsInTargetList[0].position - 1;
            } else if (request.newIndex >= cardsInTargetList.length) {
                // Insert at the end - position greater than last card
                newPosition = cardsInTargetList[cardsInTargetList.length - 1].position + 1;
            } else {
                // Insert in the middle - position = average of 2 cards
                const prevCard = cardsInTargetList[request.newIndex - 1];
                const nextCard = cardsInTargetList[request.newIndex];
                newPosition = (prevCard.position + nextCard.position) / 2;
            }
            
            // Update card
            movedCard.list_id = request.targetListId;
            movedCard.position = newPosition;
            
            // Add card to array
            newCards.push(movedCard);
            
            return newCards;
        });
        
        await moveCardToList(request);
        
    } catch (err) {
        console.error("Failed:", err);
        setError("Failed to move card to list");
        
        // Rollback
        setCards(oldCards);
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
        updateCardInState,
        handleAssignUserToCard,
        handleUnassignUserFromCard,
        handleCreateCommentOnCard,
        handleGetAllCommentsOfCard,
        handleMoveCardToList,
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