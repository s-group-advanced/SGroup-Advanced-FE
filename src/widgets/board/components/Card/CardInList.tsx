import type { Card } from "@/features/cards/index";

interface CardInListProps {
    card: Card;
}

export function CardInList({ card }: CardInListProps) {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
                {card.title}
            </h4>
            {card.description && (
                <p className="text-xs text-gray-600">
                    {card.description}
                </p>
            )}
        </div>
    )
}