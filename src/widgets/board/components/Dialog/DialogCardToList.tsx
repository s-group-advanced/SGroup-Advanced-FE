import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FiX, FiTrash2, FiArrowRight, FiChevronDown, FiArrowLeft } from "react-icons/fi";
import { useCards, type Card } from "@/features/cards/index";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";
import { useBoardDetail } from "@/features/providers/BoardDetailProvider";
import { CardComments } from "../Card/CardComments";
import { AddTagToCard } from "./AddTagToCard";
import { useLabels } from "@/features/labels/index";
import { TAG_COLORS } from "@/shared/constants/tagColors";
import { DialogChecklist } from "./DialogChecklist";
import { DueDateToCard } from "./DueDateToCard";
import { formatDDMMYYYY } from "@/shared/utils/formatDDMMYYYY";
import { Checkbox } from "@/shared/ui/checkbox/index";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/aleart-dialog/index";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { useBoardContext } from "@/features/providers";
import { useLists } from "@/features/lists/index";
import { toast } from "sonner";

interface DialogCardToListProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    card: Card;
    listName?: string;
}

export function DialogCardToList({ isOpen, onOpenChange, card, listName }: DialogCardToListProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { membersOfBoard } = useBoardDetail();
    const [dueTime, setDueTime] = useState<string>("00:00");

    const { getLabelsOfCard } = useLabels();
    const [cardLabels, setCardLabels] = useState<any[]>([]);

    const [isMovePopoverOpen, setIsMovePopoverOpen] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState<string>(card.board_id);
    const [selectedListId, setSelectedListId] = useState<string>(card.list_id);
    const [selectedPosition, setSelectedPosition] = useState<number>(0);
    const [listsOfSelectedBoard, setListsOfSelectedBoard] = useState<any[]>([]);
    const [cardsInSelectedList, setCardsInSelectedList] = useState<any[]>([]);
    const [suggestedList, setSuggestedList] = useState<any[]>([]);

    const { boards } = useBoardContext();
    const { getAllListsOfBoard } = useLists();
    const { getAllCardsOfBoard } = useCards();

    const { 
        fetchDeleteCard, 
        removeCardFromState, 
        fetchUpdateCard, 
        updateCardInState, 
        handleAssignUserToCard, 
        handleUnassignUserFromCard ,
        handleUpdateDueDateOfCard,
        handleMoveCardToList
    } = useCardDetailContext();

    useEffect(() => {
        if (card.id) {
            fetchCardLabels();
        }
    }, [card.id]);

    useEffect(() => {
        if (card.end_date) {
            const d = new Date(card.end_date);
            const hh = d.getHours().toString().padStart(2, '0');
            const mm = d.getMinutes().toString().padStart(2, '0');
            setDueTime(`${hh}:${mm}`);
        } else {
            setDueTime("00:00");
        }
    }, [card.end_date]);

    // fetch lists when board change
    useEffect(() => {
        if (selectedBoardId && isMovePopoverOpen) {
            fetchListsForBoard(selectedBoardId);
        }
    }, [selectedBoardId, isMovePopoverOpen]);

    // suggest list when open popover
    useEffect(() => {
        if (isMovePopoverOpen && card.board_id) {
            calculateSuggestedList();
        }
    }, [isMovePopoverOpen, card.board_id, card.list_id])

    const calculateSuggestedList = async () => {
        try {
            // Fetch all lists of current board (board of card)
            const lists = await getAllListsOfBoard({ boardId: card.board_id });
            const listsData = Array.isArray(lists) ? lists : [lists];

            // sort lists by position
            const sortedLists = [...listsData].sort((a, b) => a.position - b.position);

            const currentListIndex = sortedLists.findIndex(l => l.id === card.list_id);

            if (currentListIndex === -1) {
                setSuggestedList([]);
                return;
            }

            const suggested : any[] = [];

            if (currentListIndex === 0) {
                if (sortedLists.length > 1) {
                    suggested.push({
                        ...sortedLists[1],
                        direction: "right",
                    });
                }
            } else if (currentListIndex === sortedLists.length - 1) {
                if (sortedLists.length > 1) {
                    suggested.push({
                        ...sortedLists[currentListIndex - 1],
                        direction: "left",
                    });
                }
            } else {
                suggested.push({
                    ...sortedLists[currentListIndex - 1],
                    direction: "left",
                });
                suggested.push({
                    ...sortedLists[currentListIndex + 1],
                    direction: "right",
                });
            }

            setSuggestedList(suggested);
        } catch (err) {
            console.error(`Failed to calculate suggested list: ${err}`);
            setSuggestedList([]);
        }
    }

    // handle click on suggested list
    const handleSuggestedListClick = async (listId: string) => {
        try {
            setSelectedBoardId(card.board_id);
            setSelectedListId(listId);
            setSelectedPosition(0);

            await fetchListsForBoard(card.board_id);
            await fetchCardsForList(card.board_id, listId);

            await handleMoveCardToList({
                cardId: card.id,
                targetListId: listId,
                newIndex: 0,
            });
            toast.success("Card moved to suggested list successfully", {
                position: "top-center",
            });
            setIsMovePopoverOpen(false);
        } catch (err) {
            console.error(`Failed to handle suggested list click: ${err}`);
            toast.error("Failed to handle suggested list click", {
                position: "top-center",
            });
        }
    }

    // fetch lists for board
    const fetchListsForBoard = async (boardId: string) => {
        try {
            const lists = await getAllListsOfBoard({ boardId });
            const listsData = Array.isArray(lists) ? lists : [lists];
            setListsOfSelectedBoard(listsData);
    
            // Reset list về list đầu tiên của board mới (hoặc empty nếu không có list)
            if (listsData.length > 0) {
                // Chỉ set list mới nếu list hiện tại không thuộc board mới
                if (!listsData.find(l => l.id === selectedListId)) {
                    setSelectedListId(listsData[0].id);
                }
            } else {
                // Nếu board không có list nào, reset về empty
                setSelectedListId("");
            }
            
            // Reset position về 0 khi board thay đổi
            setSelectedPosition(0);
        } catch (err) {
            console.error(`Failed to fetch lists for board: ${err}`);
            setListsOfSelectedBoard([]);
            setSelectedListId("");
        }
    };

    // fet cards in selected list
    useEffect(() => {
        if (selectedListId && isMovePopoverOpen && selectedBoardId) {
            fetchCardsForList(selectedBoardId, selectedListId);
        }
    }, [selectedListId, isMovePopoverOpen, selectedBoardId]);

    const fetchCardsForList = async (boardId: string, listId: string) => {
        try {
            const cards = await getAllCardsOfBoard({ boardId });
            const cardsData = Array.isArray(cards) ? cards : [cards];

            const cardsInList = cardsData
                .filter(c => c.list_id === listId)
                .sort((a, b) => a.position - b.position);
            setCardsInSelectedList(cardsInList);

            setSelectedPosition(0);
        } catch (err) {
            console.error(`Failed to fetch cards for list: ${err}`);
            setCardsInSelectedList([]);
        }
    }

    // move card to list
    const handleMoveCard = async () => {
        if (!selectedListId) {
            toast.error("Please select a list");
            return;
        }

        try {
            await handleMoveCardToList({
                cardId: card.id,
                targetListId: selectedListId,
                newIndex: selectedPosition,
            });
            toast.success("Card moved to list successfully", {
                position: "top-center",
            });
            setIsMovePopoverOpen(false);
        } catch (err) {
            console.error(`Failed to move card to list: ${err}`);
            toast.error("Failed to move card to list", {
                position: "top-center",
            });
        }
    }

    const fetchCardLabels = async () => {
        try {
            const data = await getLabelsOfCard({ cardId: card.id });
            const labelsData = Array.isArray(data) ? data : [data];
            setCardLabels(labelsData.filter(Boolean));
        } catch (err) {
            console.error(`Failed to fetch card labels: ${err}`);
        }
    }
    

    console.log("isUpdating", isUpdating);

    const assignedUsers = useMemo(() => {
        if (!card.cardMembers || card.cardMembers.length === 0) return [];

        return card.cardMembers
            .map(cardMember => {
                const memberInfo = membersOfBoard.find(m => m.user_id === cardMember.user_id);

                if (!memberInfo) return null;

                return {
                    user_id: cardMember.user_id,
                    name: memberInfo.user.name,
                    email: memberInfo.user.email,
                    avatar_url: memberInfo.user.avatar_url,
                    assigned_at: cardMember.assigned_at,
                };
            })
            .filter(Boolean) as any[];
    }, [card.cardMembers, membersOfBoard]);

    const availableUsers = useMemo(() => {
        const assignedUserIds = new Set(assignedUsers.map(u => u.user_id));
        return membersOfBoard.filter(user => !assignedUserIds.has(user.user_id));
    }, [membersOfBoard, assignedUsers]);
    
    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description);
    }, [card.title, card.description]);

    const handleAssignUserClick = async (userId: string) => {
        try {
            const newCardMember = {
                card_id: card.id,
                user_id: userId,
                assigned_at: new Date().toISOString(),
            };
            
            updateCardInState(card.id, { 
                cardMembers: [
                    ...(card.cardMembers || []).filter(m => m.user_id !== userId),
                    newCardMember
                ]
            });
            const response = await handleAssignUserToCard({ cardId: card.id, user_id: userId });

            if (response.assigned_at) {
                const updatedCardMember = {
                    card_id: card.id,
                    user_id: userId,
                    assigned_at: response.assigned_at,
                };
                
                updateCardInState(card.id, { 
                    cardMembers: [
                        ...(card.cardMembers || []).filter(m => m.user_id !== userId),
                        updatedCardMember
                    ]
                });
            }
            
        } catch (err) {
            console.error("Failed to assign user: ", err);
            throw err;
        }
    }

    const handleUnassignUserClick = async (userId: string) => {
        try {
            const previousCardMembers = card.cardMembers || [];

            updateCardInState(card.id, { cardMembers: previousCardMembers.filter(u => u.user_id !== userId) });

            await handleUnassignUserFromCard({ cardId: card.id, userId });
        } catch (err) {
            console.error("Failed to unassign user: ", err);
            throw err;
        }
    }

    const handleTitleBlur = async () => {
        const trimmedTitle = title.trim();

        // if nothing changed, return
        if (!trimmedTitle || trimmedTitle === card.title) {
            setTitle(card.title);
            return;
        }

        setIsUpdating(true);
        try {
            updateCardInState(card.id, { title: trimmedTitle });
            await fetchUpdateCard({ cardId: card.id, title: trimmedTitle });
        } catch (err) {
            console.error(`Failed to update card: ${err}`);
            setTitle(card.title);
            updateCardInState(card.id, { title: card.title });
            setIsUpdating(false);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }

    const handleDescriptionBlur = async () => {
        const trimmedDescription = description?.trim();

        // if nothing changed, return
        if (!trimmedDescription || trimmedDescription === card.description) {
            setDescription(card.description);
            return;
        }

        setIsUpdating(true);
        try {
            updateCardInState(card.id, { description: trimmedDescription });
            await fetchUpdateCard({ cardId: card.id, description: trimmedDescription });
        } catch (err) {
            console.error(`Failed to update card: ${err}`);
            setDescription(card.description);
            updateCardInState(card.id, { description: card.description });
            setIsUpdating(false);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }

    const handleDeleteCard = async () => {
        setIsDeleting(true);
        await fetchDeleteCard({ cardId: card.id });
        removeCardFromState(card.id);
        setCardLabels([]);
        onOpenChange?.(false);
        setIsDeleting(false);
    };

    const handleClose = () => {
        onOpenChange?.(false);
    };

    // update due date of card
    const handleDateSelect = async (selectedDate?: Date) => {
        if (!selectedDate) {
            updateCardInState(card.id, { 
                end_date: undefined,
            });
    
            try {
                const response = await handleUpdateDueDateOfCard({ 
                    cardId: card.id, 
                    end_date: undefined 
                });
                console.log("response", response);
            } catch (err) {
                console.error("Failed to update due date: ", err);
                if (card.end_date) {
                    updateCardInState(card.id, { 
                        end_date: card.end_date, 
                        status: card.status 
                    });
                }
            }
            return;
        }
    
        const [hours, minutes] = dueTime.split(':').map(Number);
        const newDate = new Date(selectedDate);
        newDate.setHours(hours || 0, minutes || 0, 0, 0);
        const newIsoDate = newDate.toISOString();
    
        updateCardInState(card.id, { 
            end_date: newIsoDate,
        });
    
        try {
            const response = await handleUpdateDueDateOfCard({ 
                cardId: card.id, 
                end_date: newIsoDate 
            });
            console.log("response update due date", response);
        } catch (err) {
            console.error("Failed to update due date: ", err);
            if (card.end_date) {
                updateCardInState(card.id, { 
                    end_date: card.end_date, 
                    status: card.status 
                });
            } else {
                updateCardInState(card.id, { 
                    end_date: undefined,
                    status: undefined 
                });
            }
        }
    }

    const handleTimeBlur = async (newTime: string) => {
        if (!card.end_date) return;
    
        setDueTime(newTime);
    
        const dateObj = new Date(card.end_date);
        const [hours, minutes] = newTime.split(':').map(Number);
        dateObj.setHours(hours || 0, minutes || 0, 0, 0);
        
        const newIsoDate = dateObj.toISOString();
    
        // if time is not changed, return
        if (newIsoDate === card.end_date) return;
    
        updateCardInState(card.id, { 
            end_date: newIsoDate,
        });
    
        try {
            await handleUpdateDueDateOfCard({ 
                cardId: card.id, 
                end_date: newIsoDate 
            });
        } catch (err) {
            console.error("Failed time update: ", err);
            const d = new Date(card.end_date);
            const hh = d.getHours().toString().padStart(2, '0');
            const mm = d.getMinutes().toString().padStart(2, '0');
            setDueTime(`${hh}:${mm}`);
            updateCardInState(card.id, { 
                end_date: card.end_date,
                status: card.status 
            });
        }
    }

    const handleMarkAsCompleted = async (checked: boolean) => {
        const isCompleted = checked === true ? true : false;
        const previousIsCompleted = card.is_completed;

        updateCardInState(card.id, { 
            is_completed: isCompleted 
        });

        try {
            await handleUpdateDueDateOfCard({ cardId: card.id, end_date: card.end_date, is_completed: isCompleted });
        } catch (err) {
            console.error("Failed to mark as completed: ", err);
            updateCardInState(card.id, { 
                is_completed: previousIsCompleted 
            });
        }
    }

    const selectedBoard = boards.find(b => b.id === selectedBoardId);
    const selectedList = listsOfSelectedBoard.find(l => l.id === selectedListId);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                    <Popover open={isMovePopoverOpen} onOpenChange={setIsMovePopoverOpen}>
                            <PopoverTrigger asChild>
                                <button className="text-xl font-semibold cursor-pointer flex items-center gap-2">
                                    {listName}
                                    <FiChevronDown className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <div className="p-4 space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Di chuyển thẻ</h3>
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => setIsMovePopoverOpen(false)}
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Tabs */}
                                    <Tabs defaultValue="board" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="inbox">Hộp thư đến</TabsTrigger>
                                            <TabsTrigger value="board">Bảng thông tin</TabsTrigger>
                                        </TabsList>
                                        
                                        <TabsContent value="board" className="space-y-4 mt-4">
                                            {/* Suggested */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Đã gợi ý</label>
                                                {suggestedList.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {suggestedList.map((list) => (
                                                            <button
                                                                key={list.id}
                                                                onClick={() => handleSuggestedListClick(list.id)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
                                                            >
                                                                {list.direction === "right" ? <FiArrowRight className="w-4 h-4" /> : <FiArrowLeft className="w-4 h-4" />}
                                                                {list.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-400 px-3 py-2">
                                                        Không có gợi ý
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Destination Selection */}
                                            <div className="space-y-4">
                                                <label className="text-xs font-semibold text-gray-600">Chọn đích đến</label>
                                                
                                                {/* Board Selection */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-600">Bảng thông tin</label>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                                                <span>{selectedBoard?.name || "Chọn bảng"}</span>
                                                                <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-[300px]" align="start">
                                                        {boards.map((board) => (
                                                                <DropdownMenuItem
                                                                    key={board.id}
                                                                    onClick={() => {
                                                                        setSelectedBoardId(board.id);
                                                                        setSelectedListId("");
                                                                        setSelectedPosition(0);
                                                                    }}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {board.name}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                
                                                {/* List and Position Selection */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* List Selection */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-600">Danh sách</label>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                                                    <span>{selectedList?.name || "Chọn danh sách"}</span>
                                                                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-[200px]" align="start">
                                                                {listsOfSelectedBoard.map((list) => (
                                                                    <DropdownMenuItem
                                                                        key={list.id}
                                                                        onClick={() => setSelectedListId(list.id)}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {list.name}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    
                                                    {/* Position Selection */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-600">Vị trí</label>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                                                    <span>{selectedPosition + 1}</span>
                                                                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="w-[150px]" align="start">
                                                                {Array.from({ length: cardsInSelectedList.length + 1 }, (_, index) => (
                                                                    <DropdownMenuItem
                                                                        key={index}
                                                                        onClick={() => setSelectedPosition(index)}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {index + 1}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Move Button */}
                                            <Button
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={handleMoveCard}
                                            >
                                                Di chuyển
                                            </Button>
                                        </TabsContent>
                                        
                                        <TabsContent value="inbox" className="mt-4">
                                            <div className="flex items-center gap-2 justify-between">
                                                <label>Lựa chọn vị trí</label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="w-3xs flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                                                            <span className="text-sm font-semibold">1</span>
                                                            <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[200px]" align="start">
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            1
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                            </div>
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                                                    onClick={handleMoveCard}
                                                >
                                                    Di chuyển
                                                </Button>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-md border-gray-300">
                            <FiTag className="w-4 h-4" />
                            Add tags
                        </button> */}
                        <AddTagToCard
                            cardId={card.id}
                            boardId={card.board_id}
                            onTagAdded={fetchCardLabels}
                        />
                        <DialogChecklist card={card} />
                        {/* Due date */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                                {/* nút mở calendar */}
                                <DueDateToCard 
                                    value={card.end_date ? new Date(card.end_date) : undefined}
                                    onChange={handleDateSelect}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">
                            Title
                        </label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full font-semibold"
                            onBlur={handleTitleBlur}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Add a description..."
                            onBlur={handleDescriptionBlur}
                        />
                    </div>
                    
                    {/* Due date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">
                            Due date
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-semibold">
                                {card.end_date ? formatDDMMYYYY(card.end_date) : "No due date"}
                            </span> 
                            {/* nếu đã có ngày thì cho nhập giờ:phút */}
                            {card.end_date && (
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    onBlur={(e) => handleTimeBlur(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                />
                            )}
                            
                            {/* tags status */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-semibold ${
                                    card.status === 'overdue' ? 'text-red-600' : 
                                    card.status === 'complete' ? 'text-green-600' : 
                                    card.status === 'due soon' ? 'text-yellow-600' : 
                                    'text-gray-600'
                                }`}>
                                    {card.status ? card.status.charAt(0).toUpperCase() + card.status.slice(1) : "No status"}
                                </span>
                            </div>

                            {/* checkbox  */}
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    checked={card.is_completed}
                                    onCheckedChange={handleMarkAsCompleted}
                                />
                                <span className="text-sm font-semibold">Mark as completed</span>
                            </div>
                        </div>
                    </div>
                    {/* Labels */}
                    {cardLabels && cardLabels.length > 0 && (
                        <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900">
                            Tags
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {cardLabels.map((cardLabel) => {
                                const colorConfig = TAG_COLORS.find(c => c.hex === cardLabel.color);
                                return (
                                    <div
                                        key={cardLabel.id}
                                        className={`
                                            px-3 py-1 rounded-full text-white text-xs font-medium
                                            ${colorConfig?.bgClass || 'bg-gray-500'}
                                        `}
                                    >
                                        {cardLabel.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    )}

                    {/* Assigned Users */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Assigned Users
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {assignedUsers.map((assignedUser) => (
                                <div
                                    key={assignedUser.user_id}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                                >
                                    <img
                                        src={assignedUser.avatar_url ?? ""}
                                        alt={assignedUser.name ?? ""}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm">{assignedUser.name ?? ""}</span>
                                    <button className="ml-1 hover:text-red-600" onClick={() => handleUnassignUserClick(assignedUser.user_id)}>
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Available Users */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Available users:</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {availableUsers.map((user) => (
                                    <button
                                        key={user.user_id}
                                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-150 rounded-md hover:bg-gray-50 transition-colors "
                                        onClick={() => handleAssignUserClick(user.user_id)}
                                    >
                                        <img
                                            src={user.user.avatar_url ?? conKhiImg}
                                            alt={user.user.name ?? "User"}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm font-semibold">{user.user.name ?? "User"}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <CardComments cardId={card.id} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                            <FiTrash2 className="w-4 h-4" />
                            {isDeleting ? "Deleting..." : "Delete Card"}
                        </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. The card will be removed from this board.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    variant="destructive"
                                    onClick={handleDeleteCard}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button
                        onClick={handleClose}
                        variant="default"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}