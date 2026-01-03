import { FiEdit, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import type { List } from "@/features/lists/api/type";
import { useCardDetailContext } from "@/app/providers/CardDetailProvider";
import { CardInList } from "../Card/CardInList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu/dropdown-menu";
import { useListContext } from "@/app/providers/ListProvider";

interface BoardListProps {
    list: List;
}

export function BoardList({ list }: BoardListProps) {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [itemTitle, setItemTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [listName, setListName] = useState(list.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const { fetchUpdateNameList, fetchDeleteListFromBoard } = useListContext();
    useEffect(() => {
        if (list?.name) {
            setListName(list.name);
        }
    }, [list?.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleEditName = () => {
        setIsEditing(true);
        setListName(list.name);
    }

    const handleSaveName = async () => {
        const trimmedName = listName.trim();

        // if nothing changed, return
        if (!trimmedName || trimmedName === list.name) {
            setListName(list.name);
            setIsEditing(false);
            return;
        }

        // update list name
        try {
            await fetchUpdateNameList({ boardId: list.board_id, listId: list.id, name: trimmedName });
            setListName(trimmedName);
            setIsEditing(false);
        } catch (err) {
            console.error(`Failed to update list name: ${err}`);
            setListName(list.name);
            setIsEditing(false);
            throw err;
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSaveName();
        } else if (e.key === "Escape") {
            setListName(list.name);
            setIsEditing(false);
        }
    }

    // get cards from CardDetailProvider
    const { cards, fetchCreateCard, addCardToState } = useCardDetailContext();

    const cardsInList = useMemo(() => {
        return cards.filter(card => card && card.list_id === list.id);
    }, [cards, list.id]);

    const handleAddCard = async () => {   
        if (!itemTitle.trim() || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const newCard = await fetchCreateCard({ title: itemTitle, list_id: list.id });
            if (!newCard) throw new Error("Failed to create card");
            setItemTitle("");
            setIsAddingItem(false);
            addCardToState(newCard.card || newCard);
        } catch (err) {
            console.error(`Failed to create card: ${err}`);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this list?")) {
            setIsDeleting(true);
            
            try {
                await fetchDeleteListFromBoard({ boardId: list.board_id, listId: list.id, archived: true });
            } catch (err) {
                console.error(`Failed to delete list: ${err}`);
                throw err;
            } finally {
                setIsDeleting(false);
            }
        }
    }

    return (
        <div className="flex flex-col w-72 bg-gray-100 rounded-lg flex-shrink-0 shadow-md cursor-pointer">
            {/* List Header */}
            <div className="flex items-center justify-between p-3 m-4">
                <h3 className="font-semibold text-sm text-gray-900">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={handleKeyDown}
                            className="text-sm font-semibold text-gray-900 border px-2 py-1 focus:outline-none bg-white rounded-md"
                            placeholder="Enter list name..."
                        />
                    ) : (
                        <span onClick={handleEditName} className="text-sm font-semibold text-gray-900 cursor-pointer">{list.name}</span>
                    )} 
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
                            onClick={handleEditName}
                        >
                            <FiEdit className="w-4 h-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer text-red-600"
                            onClick={handleDelete}
                            disabled={isDeleting}
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
                            listName={listName}
                        />
                    ))
                ) : null}
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
                                if (e.key === "Enter") handleAddCard();
                                if (e.key === "Escape") setIsAddingItem(false);
                            }}
                        />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddCard}
                                className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors cursor-pointer font-semibold"
                            >
                                Add Card
                            </button>
                            <button
                                onClick={() => {
                                    setItemTitle("");
                                    setIsAddingItem(false);
                                }}
                                className="px-3 py-1.5 text-black text-sm hover:bg-gray-200 rounded-md transition-colors cursor-pointer font-semibold"
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