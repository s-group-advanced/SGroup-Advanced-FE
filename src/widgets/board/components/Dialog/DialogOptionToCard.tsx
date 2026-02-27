import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useMemo } from "react";
import { FiMoreHorizontal, FiFileText } from "react-icons/fi";
import { toast } from "sonner";
import { MoveCardToAnotherList } from "../Card/components/MoveCardToAnotherList";
import { CopyCardToAnotherList } from "../Card/components/CopyCardToAnotherList";

interface DialogOptionToCardProps {
    cardId: string;
}

export function DialogOptionToCard({ cardId }: DialogOptionToCardProps) {
    const { handleToggleTemplateCard, cards } = useCardDetailContext();

    const card = useMemo(() => cards.find(c => c.id === cardId), [cards, cardId]);
    const isTemplate = card?.is_template ?? false;
    const currentIsTemplate = isTemplate;

    const toggleTemplateCard = async () => {
        try {
            await handleToggleTemplateCard(cardId);
            toast.success(currentIsTemplate ? "Removed from templates" : "Card saved as template", {
                position: "top-center",
            });
        } catch (err) {
            toast.error("Failed to toggle template card", {
                position: "top-center",
            });
        }
    }
        

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button 
                    className="absolute top-4 right-12 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Card options"
                >
                    <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
                <div className="space-y-1">
                    
                    <CopyCardToAnotherList cardId={cardId} />

                    <MoveCardToAnotherList cardId={cardId} />
                    
                    <button className="w-full flex justify-between items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-left" onClick={toggleTemplateCard}>
                        <div className="flex items-center gap-2">
                            <FiFileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{currentIsTemplate ? "Remove from templates" : "Save as template"}</span>
                        </div>
                    </button>
                    
                </div>
            </PopoverContent>
        </Popover>
    )
}