import type { Checklist, CreateChecklistItemOnChecklistRequest, CreateChecklistOnCardRequest, CreateChecklistOnCardResponse, RemoveChecklistFromCardRequest } from "@/features/checklists/index";
import type { ChecklistItem, RemoveChecklistItemOnChecklistRequest, UpdateChecklistItemOnChecklistRequest, UpdateChecklistItemOnChecklistResponse } from "@/features/checklists/api/type";
import { createContext, useContext, useState } from "react";
import { useChecklist } from "@/features/checklists/index";

interface ChecklistContextType {
    // State
    checklistsOfCard: Checklist[];
    itemsOfChecklist: ChecklistItem[];
    isLoading: boolean;
    error: string | null;

    // Functions
    handleCreateChecklistOnCard: (request: CreateChecklistOnCardRequest) => Promise<CreateChecklistOnCardResponse>;
    handleRemoveChecklistFromCard: (request: RemoveChecklistFromCardRequest) => Promise<void>;
    handleCreateChecklistItemOnChecklist: (request: CreateChecklistItemOnChecklistRequest) => Promise<void>;
    handleUpdateChecklistItemOnChecklist: (request: UpdateChecklistItemOnChecklistRequest) => Promise<UpdateChecklistItemOnChecklistResponse>;
    handleRemoveChecklistItemOnChecklist: (request: RemoveChecklistItemOnChecklistRequest) => Promise<void>;
}

const checklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: React.ReactNode }) {
    const [checklistsOfCard, setChecklistsOfCard] = useState<Checklist[]>([]);
    const [itemsOfChecklist, setItemsOfChecklist] = useState<ChecklistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { createChecklistOnCard, removeChecklistFromCard, createChecklistItemOnChecklist, updateChecklistItemOnChecklist, removeChecklistItemOnChecklist } = useChecklist();

    // add checklist to card
    const handleCreateChecklistOnCard = async (request: CreateChecklistOnCardRequest): Promise<CreateChecklistOnCardResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await createChecklistOnCard(request);
            if (!data) throw new Error("Failed to create checklist on card");
            setChecklistsOfCard(prevChecklists => [...prevChecklists, data.checklist]);
            return data;
        } catch (err) {
            setError("Failed to create checklist on card");
            console.error(`Failed to create checklist on card: ${err}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    // remove checklist from card
    const handleRemoveChecklistFromCard = async (request: RemoveChecklistFromCardRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await removeChecklistFromCard({
                cardId: request.cardId,
                checklistId: request.checklistId,
            });
            setChecklistsOfCard(prevChecklists =>
                (prevChecklists || []).filter(c => c && c.id !== request.checklistId)
              );
        } catch (err) {
            setError("Failed to remove checklist from card");
            console.error(`Failed to remove checklist from card: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    // create checklist item on checklist
    const handleCreateChecklistItemOnChecklist = async (request: CreateChecklistItemOnChecklistRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await createChecklistItemOnChecklist(request);
            if (!data) throw new Error("Failed to create checklist item on checklist");
            setItemsOfChecklist(prevItems => [...prevItems, data.item]);
        } catch (err) {
            setError("Failed to create checklist item on checklist");
            console.error(`Failed to create checklist item on checklist: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    // update checklist item on checklist
    const handleUpdateChecklistItemOnChecklist = async (
        request: UpdateChecklistItemOnChecklistRequest
      ): Promise<UpdateChecklistItemOnChecklistResponse> => {
        setIsLoading(true);
        setError(null);
      
        try {
          const data = await updateChecklistItemOnChecklist(request);
          if (!data) throw new Error("Failed to update checklist item on checklist");
      
          // cập nhật items
        setItemsOfChecklist(prev =>
            (prev || [])
            .filter(Boolean)
            .map(item => (item!.id === request.itemId ? data.item : item!))
        );
        
        // update progress for checklist
        if (data.checklist?.id) {
            setChecklistsOfCard(prev =>
            (prev || [])
                .filter(Boolean)
                .map(cl =>
                cl!.id === data.checklist.id
                    ? { ...cl!, progress: data.checklist.progress }
                    : cl!
                )
            );
        }
      
          return data;
        } catch (err) {
          setError("Failed to update checklist item on checklist");
          console.error(`Failed to update checklist item on checklist: ${err}`);
          throw err;
        } finally {
          setIsLoading(false);
        }
      };

    // remove checklist item on checklist
    const handleRemoveChecklistItemOnChecklist = async (request: RemoveChecklistItemOnChecklistRequest): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            await removeChecklistItemOnChecklist(request);
            setItemsOfChecklist(prevItems =>
                (prevItems || [])
                .filter(Boolean)
                .map(item => (item!.id === request.itemId ? undefined : item!))
                .filter(Boolean) as ChecklistItem[]
            );
        } catch (err) {
            setError("Failed to remove checklist item on checklist");
            console.error(`Failed to remove checklist item on checklist: ${err}`);
        } finally {
            setIsLoading(false);
        }
    }

    const value : ChecklistContextType = {
        checklistsOfCard,
        itemsOfChecklist,
        isLoading,
        error,
        handleCreateChecklistOnCard,
        handleRemoveChecklistFromCard,
        handleCreateChecklistItemOnChecklist,
        handleUpdateChecklistItemOnChecklist,
        handleRemoveChecklistItemOnChecklist,
    }

    return (
        <checklistContext.Provider value={value}>
            {children}
        </checklistContext.Provider>
    )
}

// custom hook
export function useChecklistContext() {
    const context = useContext(checklistContext);
    if (context === undefined) {
        throw new Error('useChecklistContext must be used within a ChecklistProvider');
    }
    return context;
}