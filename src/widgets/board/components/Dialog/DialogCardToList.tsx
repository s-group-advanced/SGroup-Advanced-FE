import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FiX, FiUserPlus, FiTrash2 } from "react-icons/fi";
import type { Card } from "@/features/cards/index";
import { useCardDetailContext } from "@/app/providers/CardDetailProvider";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";
import { useBoardDetail } from "@/app/providers/BoardDetailProvider";
import { CardComments } from "../Card/CardComments";
import { AddTagToCard } from "./AddTagToCard";
import { useLabels } from "@/features/labels/index";
import { TAG_COLORS } from "@/shared/constants/tagColors";
import { DialogChecklist } from "./DialogChecklist";

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

    const { getLabelsOfCard } = useLabels();
    const [cardLabels, setCardLabels] = useState<any[]>([]);

    useEffect(() => {
        if (card.id) {
            fetchCardLabels();
        }
    }, [card.id]);

    const fetchCardLabels = async () => {
        try {
            const data = await getLabelsOfCard({ cardId: card.id });
            const labelsData = Array.isArray(data) ? data : [data];
            setCardLabels(labelsData.filter(Boolean));
        } catch (err) {
            console.error(`Failed to fetch card labels: ${err}`);
        }
    }
    const { 
            fetchDeleteCard, 
            removeCardFromState, 
            fetchUpdateCard, 
            updateCardInState, 
            handleAssignUserToCard, 
            handleUnassignUserFromCard 
        } = useCardDetailContext();

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
        if (confirm("Are you sure you want to delete this card?")) {
            setIsDeleting(true);
            await fetchDeleteCard({ cardId: card.id });
            removeCardFromState(card.id);
            setCardLabels([]);
            onOpenChange?.(false);
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        onOpenChange?.(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            {listName}
                        </DialogTitle>
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
                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-md border-gray-300">
                            <FiUserPlus className="w-4 h-4" />
                            Add member
                        </button>
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
                    <Button
                        variant="destructive"
                        onClick={handleDeleteCard}
                        disabled={isDeleting}
                    >
                        <FiTrash2 className="w-4 h-4" />
                        {isDeleting ? "Deleting..." : "Delete Card"}
                    </Button>
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