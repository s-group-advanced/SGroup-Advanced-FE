import type { Card } from "@/features/cards/index";
import { useState } from "react";
import { DialogCardToList } from "../Dialog/DialogCardToList";
import { CardMemberAvatars } from "./CardMemberAvatars";
import { Draggable } from "@hello-pangea/dnd";

interface CardInListProps {
    card: Card;
    listName?: string;
    index: number;
}

export function CardInList({ card, listName, index }: CardInListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <div 
                    className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                        snapshot.isDragging ? 'rotate-3 shadow-xl' : ''
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDialogOpen(true);
                    }}
                >
                    <h4 className="text-sm font-medium text-gray-900 mb-3 mt-6">
                        {card.title}
                    </h4>
                    {card.description && (
                        <p className="text-xs text-gray-600 mb-3">
                            {card.description}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                        <CardMemberAvatars card={card} maxDisplay={2} />
                    </div>
                </div>
            )}
        </Draggable>

        <DialogCardToList 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            card={card}
            listName={listName}
        />
        </>
    )
}