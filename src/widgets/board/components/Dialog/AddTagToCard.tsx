import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui/popover";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { FiTag, FiX } from "react-icons/fi";
import { TAG_COLORS, type TagColorId } from "@/shared/constants/tagColors";
import { useLabels } from "@/features/labels/index";
import { useLabelContext } from "@/features/providers/LabelProvider";

interface AddTagToCardProps {   
    cardId: string;
    boardId: string;
    onTagAdded?: () => void;
}

export function AddTagToCard({ cardId, boardId, onTagAdded }: AddTagToCardProps) {
    const [tagName, setTagName] = useState("");
    const [selectedColor, setSelectedColor] = useState<TagColorId>("blue");
    const [isOpen, setIsOpen] = useState(false);

    const { handleAddLabelOnBoard, labelsOfBoard, handleAddLabelToCard, handleRemoveLabelFromCard } = useLabelContext();

    const { getLabelsOfCard, getAvailableLabelsOfBoard } = useLabels();
    const [cardLabels, setCardLabels] = useState<any[]>([]);
    const [availableLabels, setAvailableLabels] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && cardId) {
            fetchCardData();
        }
    }, [cardId, isOpen]);

    // Fetch both card labels and available labels
    const fetchCardData = async () => {
        try {
            // lấy labels của card
            const cardLabelsData = await getLabelsOfCard({ cardId });
            const cardLabelsArray = Array.isArray(cardLabelsData) ? cardLabelsData : [cardLabelsData];
            setCardLabels(cardLabelsArray.filter(Boolean));

            // lấy labels có sẵn của board
            const availableData = await getAvailableLabelsOfBoard({ cardId });
            const availableArray = Array.isArray(availableData) ? availableData : [availableData];
            setAvailableLabels(availableArray.filter(Boolean));
        } catch (err) {
            console.error(`Failed to fetch card data: ${err}`);
        }
    }

    // lấy labels đã được thêm vào card
    const addedLabels = cardLabels
        .map(cardLabel => {
            const boardLabel = labelsOfBoard.find(bl => bl.id === cardLabel.label_id);
            return boardLabel || cardLabel;
        })
        .filter(Boolean);

    // tạo label mới
    const handleCreateNewLabel = async () => {
        if (!tagName.trim()) return;
    
        const selectedColorConfig = TAG_COLORS.find(c => c.id === selectedColor);
        if (!selectedColorConfig) return;
    
        try {
            const labelNameToCreate = tagName.trim();
            const labelColorToCreate = selectedColorConfig.hex;
    
            // tạo label trên board
            await handleAddLabelOnBoard({
                boardId: boardId,
                name: labelNameToCreate,
                color: labelColorToCreate,
            });
        
            // fetch lại available labels để lấy label vừa tạo
            const availableData = await getAvailableLabelsOfBoard({ cardId });
            const availableArray = Array.isArray(availableData) ? availableData : [availableData];
            
            // tìm label vừa tạo theo name và color
            const newLabel = availableArray.find(
                label => label.name === labelNameToCreate && 
                        label.color === labelColorToCreate
            );

            // tự động add label vào card
            if (newLabel?.id) {
                await handleAddLabelToCard({
                    cardId: cardId,
                    label_id: newLabel.id,
                });
            } 
            // refresh UI
            await fetchCardData();
            onTagAdded?.(); // update DialogCardToList
    
            // reset form
            setTagName("");
            setSelectedColor("blue");
        } catch (err) {
            console.error(`Failed to create new label: ${err}`);
        }
    }

    // add label to card
    const handleAddLabeltoCardClick = async (label_id: string) => {
        try {
            await handleAddLabelToCard({
                cardId: cardId,
                label_id: label_id,
            });
            
            // refresh
            await fetchCardData();
            onTagAdded?.();
        } catch (err) {
            console.error(`Failed to add label to card: ${err}`);
        }
    }

    // Remove label from card
    const handleRemoveLabelFromCardClick = async (labelId: string) => {
        try {
            await handleRemoveLabelFromCard({
                cardId: cardId,
                labelId: labelId,
            });
            await fetchCardData();
            onTagAdded?.();
        } catch (err) {
            console.error(`Failed to remove label from card: ${err}`);
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-sm">
                    <FiTag className="w-4 h-4" />
                    Add tags
                </button>
            </PopoverTrigger>
            
            <PopoverContent className="w-[420px] p-0" align="start" side="bottom">
                <div className="p-5 space-y-4">
                    {/* Header + Tags của card */}
                    <div className="space-y-3">
                        <div className="pb-2 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Tags</h3>
                        </div>
                        
                        {/* Labels đã được thêm vào card */}
                        {addedLabels && addedLabels.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {addedLabels.map((label) => {
                                    const colorConfig = TAG_COLORS.find(c => c.hex === label.color);
                                    return (
                                        <div
                                            key={label.id}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-medium
                                                ${colorConfig?.bgClass || 'bg-gray-500'}
                                            `}
                                        >
                                            <span className="truncate">{label.name}</span>
                                            <button
                                                onClick={() => handleRemoveLabelFromCardClick(label.id)}
                                                className="hover:bg-white/30 rounded-full p-0.5 transition-colors flex-shrink-0"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) }
                    </div>

                    {/* Available Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-normal text-gray-700">
                            Available tags:
                        </label>
                        {availableLabels && availableLabels.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {availableLabels.map((label) => {
                                    return (
                                        <button
                                            key={label.id}
                                            onClick={() => handleAddLabeltoCardClick(label.id)}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-white border-2 cursor-pointer hover:opacity-70 transition-opacity"
                                            style={{ 
                                                borderColor: label.color,
                                                color: label.color 
                                            }}
                                        >
                                            {label.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Create New Tag Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-normal text-gray-700">
                            Create new tag:
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="text"
                                placeholder="Tag name"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                className="text-sm h-9 border-gray-300 flex-shrink-0"
                                style={{ width: '180px' }}
                                maxLength={30}
                            />

                            <div className="flex items-center gap-1.5">
                                {TAG_COLORS.map((color) => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setSelectedColor(color.id)}
                                        className={`
                                            w-4.5 h-4.5 rounded-full transition-all flex-shrink-0
                                            ${color.bgClass}
                                            ${selectedColor === color.id 
                                                ? 'ring-2 ring-offset-1 ring-gray-800' 
                                                : 'hover:opacity-80'
                                            }
                                        `}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleCreateNewLabel}
                            disabled={!tagName.trim()}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white h-9 text-sm font-medium rounded"
                        >
                            Create Tag
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}