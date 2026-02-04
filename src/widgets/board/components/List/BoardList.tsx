import { FiChevronLeft, FiCopy, FiEdit, FiMoreHorizontal, FiMove, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { useEffect, useMemo, useRef, useState } from "react";
import type { List } from "@/features/lists/api/type";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { CardInList } from "../Card/CardInList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu/dropdown-menu";
import { useListContext } from "@/features/providers/ListProvider";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { AlertDialog, AlertDialogCancel, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogContent, AlertDialogTrigger, AlertDialogFooter, AlertDialogAction } from "@/shared/ui/aleart-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { useBoardContext } from "@/features/providers";
import { toast } from "sonner";

interface BoardListProps {
    list: List;
    index: number;
    isDraggingList: boolean;
}

export function BoardList({ list, index, isDraggingList }: BoardListProps) {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [itemTitle, setItemTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [listName, setListName] = useState(list.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const { fetchUpdateNameList, fetchDeleteListFromBoard, list: allListsInBoard, handleMoveListToAnotherBoard, handleCopyListToBoard } = useListContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoveListPopoverOpen, setIsMoveListPopoverOpen] = useState(false);
    const [isCopyListPopoverOpen, setIsCopyListPopoverOpen] = useState(false);
    const [copyListName, setCopyListName] = useState(list.name);

    const [targetBoardId, setTargetBoardId] = useState<string>(list.board_id);
    const [targetPosition, setTargetPosition] = useState<string>("0");
    const { boards } = useBoardContext();
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

    useEffect(() => {
        setTargetBoardId(list.board_id);
        setTargetPosition("0");
    }, [list.board_id]);

    const selectedBoard = useMemo(() => boards.find((b) => b.id === targetBoardId) ?? boards.find((b) => b.id === list.board_id),
    [boards, targetBoardId, list.board_id]);

    const totalPositions = selectedBoard?.listsCount ?? 0;

    // current position of list in board
    const currentListIndexInBoard = useMemo(() => {
        const listsOfThisBoard = allListsInBoard
            .filter((l) => l.board_id === list.board_id)
            .sort((a, b) => a.position - b.position);
        return listsOfThisBoard.findIndex((l) => l.id === list.id);
    }, [allListsInBoard, list.board_id, list.id]);

    useEffect(() => {
        if (targetBoardId === list.board_id && currentListIndexInBoard >= 0) {
          setTargetPosition(currentListIndexInBoard.toString());
        }
      }, [targetBoardId, list.board_id, currentListIndexInBoard]);

      useEffect(() => {
        const maxIndex = Math.max(0, Number(totalPositions ?? 0));
        const current = Number(targetPosition);
      
        if (!Number.isFinite(current) || current < 0) {
          setTargetPosition("0");
          return;
        }
      
        if (current > maxIndex) {
          setTargetPosition(maxIndex.toString());
        }
      }, [totalPositions, targetPosition]);

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
    const { cards, fetchCreateCard, addCardToState, refreshCards } = useCardDetailContext();

    const cardsInList = useMemo(() => {
        const filtered = cards.filter(card => card && card.list_id === list.id);
        
        // Sort by position
        const sorted = filtered.sort((a, b) => {
            // If position field, sort by position
            if (a.position !== undefined && b.position !== undefined) {
                return a.position - b.position;
            }
            return 0;
        });
        
        return sorted;
    }, [cards, list.id, list.name]);

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

    // move list to another board
    const moveListToAnotherBoard = async (targetBoardId: string, targetPosition: string) => {
        try {
            await handleMoveListToAnotherBoard({
                listId: list.id,
                targetBoardId: targetBoardId,
                position: targetPosition ? parseInt(targetPosition) : undefined,
            })

            toast.success(`List moved to ${selectedBoard?.name} successfully`, {
                position: "top-center",
            })
        } catch (err) {
            console.error(`Failed to move list to another board: ${err}`);
        }
    }

    // copy list to board
    const copyListToBoard = async (targetBoardId: string, newName?: string) => {
        try {
            await handleCopyListToBoard({
                listId: list.id,
                targetBoardId: targetBoardId,
                newName: newName ?? undefined,
            });

            if (targetBoardId === list.board_id) {
                await refreshCards(targetBoardId);
            }

            toast.success(`List copied to ${selectedBoard?.name} successfully`, {
                position: "top-center",
            })
        } catch (err) {
            console.error(`Failed to copy list to board: ${err}`);
        }
    }

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided, snapshot) => (
                <div 
                    className={`flex flex-col w-72 bg-gray-100 rounded-lg flex-shrink-0 shadow-md ${
                        snapshot.isDragging ? 'rotate-2 shadow-2xl' : ''
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    {/* List Header - Drag handle */}
                    <div
                        className="flex items-center justify-between p-3 m-4 relative"
                        {...provided.dragHandleProps}
                    >
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
                                <span onClick={handleEditName} className="text-sm font-semibold text-gray-900 cursor-pointer">
                                    {list.name}
                                </span>
                            )} 
                        </h3>
                        <AlertDialog>
                            <DropdownMenu 
                                open={isMenuOpen} 
                                onOpenChange={(open) => {
                                    setIsMenuOpen(open);
                                    if (open) {
                                        setIsMoveListPopoverOpen(false);
                                        setIsCopyListPopoverOpen(false);
                                    }
                                }}
                                >
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-gray-200 rounded transition-colors"  
                                    onClick={() => {
                                        setIsMenuOpen(true);
                                        setIsMoveListPopoverOpen(false);
                                        setIsCopyListPopoverOpen(false);
                                    }}
                                    >
                                        <FiMoreHorizontal className="w-4 h-4 text-gray-600 rotate-90" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" sideOffset={8} className="w-[200px]">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={handleEditName}
                                >
                                    <FiEdit className="w-4 h-4" />
                                    Rename
                                </DropdownMenuItem>

                                {/* Trigger cho AlertDialog */}
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                    className="flex items-center gap-2 cursor-pointer text-red-600"
                                    disabled={isDeleting}
                                    >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>

                                    {/* Move List to another board */}
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsMoveListPopoverOpen(true);
                                            setIsCopyListPopoverOpen(false);
                                        }}
                                        >
                                        <FiMove className="w-4 h-4" />
                                        Move to another board
                                    </DropdownMenuItem>

                                    {/* Copy list to another board */}
                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsCopyListPopoverOpen(true);
                                            setIsMoveListPopoverOpen(false);
                                            setCopyListName(list.name);
                                        }}
                                    >
                                        <FiCopy className="w-4 h-4" />
                                        Copy to another board
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Nội dung AlertDialog để outside DropdownMenuContent */}
                            <AlertDialogContent size="sm">
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete this list?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. All cards in this list will also be deleted.
                                </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>

                            <Popover open={isMoveListPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="absolute top-2 right-2 w-1 h-1 pointer-events-none" />
                            </PopoverTrigger>
                                <PopoverContent
                                        side="right"
                                        align="start"
                                        className="w-72 p-4 space-y-4"
                                    >
                                    <div className="flex items-center justify-between gap-2">
                                        <button className="text-sm items-center justify-center flex gap-2 cursor-pointer"
                                        onClick={() => {
                                            setIsMoveListPopoverOpen(false);
                                            setIsMenuOpen(true);
                                        }}
                                        >   
                                            <FiChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-semibold">Move to another board</span>
                                        <button className="cursor-pointer"
                                            onClick={() => {
                                                setIsMoveListPopoverOpen(false);
                                                setIsMenuOpen(false);
                                            }}    
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="board-select" className="text-sm font-semibold">Board Infomation</label>
                                        <Select value={targetBoardId} onValueChange={(value) => {
                                            setTargetBoardId(value);

                                            if (value === list.board_id && currentListIndexInBoard >= 0) {
                                                setTargetPosition(currentListIndexInBoard.toString());
                                            } else {
                                                setTargetPosition("0");
                                            }
                                            }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a board" />
                                            </SelectTrigger>    
                                            <SelectContent position="popper">
                                            {boards.map((board) => (
                                                <SelectItem key={board.id} value={board.id}>
                                                {board.name}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="position-select" className="text-sm font-semibold">Position</label>
                                        <Select
                                            value={targetPosition}
                                            onValueChange={(value) => {
                                                setTargetPosition(value);
                                            }}
                                            >
                                            <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a position" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                            {Array.from({ length: (totalPositions ?? 0) + 1 }, (_, index) => (
                                                <SelectItem key={index} value={index.toString()}>
                                                {index + 1}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button onClick={() => moveListToAnotherBoard(targetBoardId, targetPosition)} className="w-full cursor-pointer">Move List</Button>
                                </PopoverContent>
                            </Popover>

                            <Popover open={isCopyListPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="absolute top-2 right-2 w-1 h-1 pointer-events-none" />
                            </PopoverTrigger>
                            <PopoverContent
                                        side="right"
                                        align="start"
                                        className="w-72 p-4 space-y-4"
                                    >
                                    <div className="flex items-center justify-between gap-2">
                                        <button className="text-sm items-center justify-center flex gap-2 cursor-pointer"
                                        onClick={() => {
                                            setIsCopyListPopoverOpen(false);
                                            setIsMenuOpen(true);
                                        }}
                                        >   
                                            <FiChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-semibold">Copy list to another board</span>
                                        <button className="cursor-pointer"
                                            onClick={() => {
                                                setIsCopyListPopoverOpen(false);
                                                setIsMenuOpen(false);
                                            }}    
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div>
                                    <textarea
                                        value={copyListName}
                                        onChange={(e) => setCopyListName(e.target.value)}
                                        name="copy-list-name"
                                        id="copy-list-name"
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 shadow-sm hover:shadow-md transition-shadow"
                                        placeholder="Enter list name..."
                                        onBlur={handleSaveName}
                                        ></textarea>
                                        <Button
                                        className="w-full cursor-pointer"
                                        onClick={() => copyListToBoard(targetBoardId, copyListName)}
                                        >
                                        Create list
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                    </div>

                    {/* Card Items Container - Droppable zone for cards */}
                    <Droppable droppableId={list.id} type="card" isDropDisabled={isDraggingList}>
                        {(provided, snapshot) => (
                            <div 
                                className={`overflow-y-auto px-3 pb-2 space-y-3 max-h-[calc(100vh-200px)] ml-4 mr-4 ${
                                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                                }`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {cardsInList.length > 0 ? (
                                    cardsInList.map((card, index) => (
                                        <CardInList
                                            key={card.id}
                                            card={card}
                                            listName={listName}
                                            index={index}
                                        />
                                    ))
                                ) : null}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

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
            )}
        </Draggable>
    );
}