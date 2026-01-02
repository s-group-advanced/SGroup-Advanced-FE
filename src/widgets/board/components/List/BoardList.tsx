import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { useMemo, useState } from "react";
import type { List } from "@/features/lists/api/type";
import { useCardDetailContext } from "@/app/providers/CardDetailProvider";
import { CardInList } from "../Card/CardInList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu/dropdown-menu";

interface BoardListProps {
    list: List;
}

export function BoardList({ list }: BoardListProps) {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [itemTitle, setItemTitle] = useState("");

    // get cards from CardDetailProvider
    const { cards } = useCardDetailContext();

    const cardsInList = useMemo(() => {
        return cards.filter(card => card.list_id === list.id);
    }, [cards, list.id]);

    const handleAddItem = () => {   
        if (itemTitle.trim()) {
            console.log("Add item:", itemTitle);
            setItemTitle("");
            setIsAddingItem(false);
        }
    };

    const handleRename = () => {
        console.log("Rename list:", list.id);
    }

    const handleDelete = () => {
        console.log("Delete list:", list.id);
    }

    return (
        <div className="flex flex-col w-72 bg-gray-100 rounded-lg flex-shrink-0 shadow-md cursor-pointer">
            {/* List Header */}
            <div className="flex items-center justify-between p-3 m-4">
                <h3 className="font-semibold text-sm text-gray-900">
                    {list.name || list.title}
                </h3>
                {/* Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <FiMoreHorizontal className="w-4 h-4 text-gray-600 rotate-90" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="w-48">
                        <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={handleRename}
                        >
                            <FiEdit className="w-4 h-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-red-600"
                            onClick={handleDelete}
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Card Items Container */}
            <div className="overflow-y-auto px-3 pb-2 space-y-3 max-h-[calc(100vh-200px)] ml-4 mr-4">
                {cardsInList.length > 0 ? (
                    cardsInList.map((card) => (
                        <CardInList
                            key={card.id}
                            card={card}
                        />
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-400 text-xs">
                        No cards yet
                    </div>
                )}
            </div>

            {/* Add Item Section */}
            <div className="p-2 ml-4 mr-4">
                {isAddingItem ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={itemTitle}
                            onChange={(e) => setItemTitle(e.target.value)}
                            placeholder="Enter card title..."
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 shadow-sm hover:shadow-md transition-shadow"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddItem();
                                if (e.key === "Escape") setIsAddingItem(false);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddItem}
                                className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors cursor-pointer font-semibold"
                            >
                                Add Card
                            </button>
                            <button
                                onClick={() => {
                                    setItemTitle("");
                                    setIsAddingItem(false);
                                }}
                                className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingItem(true)}
                        className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors cursor-pointer font-semibold mb-3"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add a card
                    </button>
                )}
            </div>
        </div>
    );
}