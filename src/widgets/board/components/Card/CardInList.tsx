import type { Card } from "@/features/cards/index";
import { useState } from "react";
import { DialogCardToList } from "../Dialog/DialogCardToList";

interface CardInListProps {
    card: Card;
    listName?: string;
}

export function CardInList({ card, listName }: CardInListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
        <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDialogOpen(true);
        }}>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
                {card.title}
            </h4>
            {card.description && (
                <p className="text-xs text-gray-600">
                    {card.description}
                </p>
            )}
        </div>

        <DialogCardToList 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            card={card}
            listName={listName}
        />
        </>
    )
}