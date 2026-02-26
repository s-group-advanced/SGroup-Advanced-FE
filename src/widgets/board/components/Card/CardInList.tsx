import type { Card } from "@/features/cards/index";
import { useState } from "react";
import { DialogCardToList } from "../Dialog/DialogCardToList";
import { CardMemberAvatars } from "./CardMemberAvatars";
import { Draggable } from "@hello-pangea/dnd";
import { formatDDMMYYYY } from "@/shared/utils/formatDDMMYYYY";
import { FiFileText } from "react-icons/fi";

interface CardInListProps {
    card: Card;
    listName?: string;
    index: number;
}

export function CardInList({ card, listName, index }: CardInListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const statusColor = 
        card.status === 'complete' 
        ? "text-green-600" 
        : card.status === 'overdue' 
        ? "text-red-600" : card.is_completed 
        ? "text-green-600" 
        : card.status === "due soon" 
        ? "text-yellow-600"
        : "text-gray-500";

    return (
        <>
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <div 
                    className={`bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${
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
                    {/* label template */}
                    {card.is_template && (
                        <div className="flex items-center gap-1 absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-md border border-purple-200">
                                <FiFileText className="w-3 h-3" />
                                Template
                            </span>
                        </div>
                    )}
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

                    {card.end_date && (
                        <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs font-semibold ${statusColor}`}>
                            {formatDDMMYYYY(card.end_date)}
                            </span>
                            <span className={`text-[11px] font-semibold ${statusColor}`}>
                                {card.status
                                    ? card.status.charAt(0).toUpperCase() + card.status.slice(1)
                                    : ""}
                            </span>
                        </div>
                        )}
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