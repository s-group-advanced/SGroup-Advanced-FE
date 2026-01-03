import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FiX, FiTag, FiCheckSquare, FiUserPlus, FiTrash2 } from "react-icons/fi";
import type { Card } from "@/features/cards/index";
import { useCardDetailContext } from "@/app/providers/CardDetailProvider";
import { useUser } from "@/app/providers/UserProvider";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";

interface DialogCardToListProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    card: Card;
    listName?: string;
}

export function DialogCardToList({ isOpen, onOpenChange, card, listName }: DialogCardToListProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description);
    const [comment, setComment] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useUser();

    const { fetchDeleteCard, removeCardFromState, fetchUpdateCard, updateCardInState } = useCardDetailContext();

    console.log("isUpdating", isUpdating);
    
    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description);
    }, [card.title, card.description]);

    // Mock data
    const assignedUsers = [
        { id: "1", name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" }
    ];

    const availableUsers = [
        { id: "2", name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
        { id: "3", name: "Bob Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" }
    ];

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
                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-md border-gray-300">
                            <FiTag className="w-4 h-4" />
                            Add tags
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-md border-gray-300">
                            <FiCheckSquare className="w-4 h-4" />
                            Add todo
                        </button>
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

                    {/* Assigned Users */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Assigned Users
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {assignedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full"
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm">{user.name}</span>
                                    <button className="ml-1 hover:text-red-600">
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
                                        key={user.id}
                                        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span className="text-sm">{user.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">Comments</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <img
                                src={user?.avatar_url ?? conKhiImg}
                                alt="Current user"
                                className="w-8 h-8 rounded-full"
                            />
                            <Input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1"
                            />
                        </div>
                    </div>
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