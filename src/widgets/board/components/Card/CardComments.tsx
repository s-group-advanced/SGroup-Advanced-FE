import type { GetAllCommentsOfCardResponse } from "@/features/cards";
import { useEffect, useState } from "react";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { useUser } from "@/features/providers/UserProvider";
import { formatTimeAgo } from "@/shared/utils/dateUtils";
import { useSSE } from "@/shared/hook/useSSE";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/shared/ui/aleart-dialog/index";
import { toast } from "sonner";
interface CardCommentsProps {
    cardId: string;
}

export function CardComments({ cardId }: CardCommentsProps) {
    const [comments, setComments] = useState<GetAllCommentsOfCardResponse[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentBody, setEditCommentBody] = useState("");
    const [deletedCommentId, setDeletedCommentId] = useState<string | null>(null);
    const { handleGetAllCommentsOfCard, handleCreateCommentOnCard, handleUpdateCommentOnCard, handleDeleteCommentOnCard } = useCardDetailContext();
    const { user } = useUser();
    
    const { isConnected } = useSSE(
        `${import.meta.env.VITE_API_BASE_URL}/cards/${cardId}/comments/stream`,
        {
            enabled: !!cardId,
            onMessage: (data) => {
                if (data.event === 'comment_created' && data.data) {
                    const newCommentData = data.data;

                    if (!newCommentData.author_id && newCommentData.author?.id) {
                        newCommentData.author_id = newCommentData.author.id;
                    }
                    if (!newCommentData.author && newCommentData.author_id && user) {
                        const commentAuthorId = String(newCommentData.author_id);
                        const currentUserId = String(user.id);
                        
                        // Only add author from user if the comment is actually from the current user
                        if (commentAuthorId === currentUserId) {
                            newCommentData.author = {
                                id: user.id,
                                name: user.name || "",
                                email: user.email || "",
                                avatar_url: user.avatar_url || "",
                            };
                        }
                    }
                    setComments(prev => {
                        const exists = prev.some(c => c.id === newCommentData.id);
                        if (exists) {
                            return prev;
                        }
    
                        const newComments = [...prev, newCommentData];
                        return newComments;
                    });
                } else if (data.event === 'comment_updated' && data.data) {
                    const updatedCommentData = data.data;

                    setComments(prev =>
                        prev.map(c =>
                            c.id === updatedCommentData.id
                                ? { ...c, ...updatedCommentData } // Merge all new data
                                : c
                        )
                    );
                } else if (data.event === 'comment_deleted' && data.data) {
                    const deletedCommentId = data.data.id || data.data.comment_id;
                    setComments(prev => 
                        prev.filter(c => c.id !== deletedCommentId)
                    );
                }
            },
            onError: (error) => {
                console.error("SSE Error:", error);
            },
            onOpen: () => {
                console.log("SSE Connected for card:", cardId);
            }
        }
    );

    const handleStartEdit = (comment: GetAllCommentsOfCardResponse) => {
        setEditingCommentId(comment.id);
        setEditCommentBody(comment.body);
    }

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditCommentBody("");
    }

    const handleSaveEdit = async () => {
        if (!editCommentBody || !editCommentBody.trim()) return;

        try {
            setComments(prev =>
                prev.map(c =>
                    c.id === editingCommentId
                        ? { ...c, body: editCommentBody.trim() }
                        : c
                )
            );
            await handleUpdateCommentOnCard({
                cardId,
                commentId: editingCommentId as string,
                body: editCommentBody.trim(),
            });
            setEditingCommentId(null);
            setEditCommentBody("");
        } catch (err) {
            console.error(`Failed to save edit: ${err}`);
        }
    }

    const handleDeleteComment = async () => {
        if (!deletedCommentId) return;

        try {
            await handleDeleteCommentOnCard({
                cardId,
                commentId: deletedCommentId as string,
            });
            setDeletedCommentId(null);
            toast.success("Comment deleted successfully");
        } catch (err) {
            console.error(`Failed to delete comment: ${err}`);
        }
    }

    // fetch comments when component mounts
    useEffect(() => {
        if (cardId) {
            fetchComments();
            
        }
    }, [cardId]);

    const fetchComments = async () => {
        try {
            const response = await handleGetAllCommentsOfCard({ cardId });
            const commentsData = Array.isArray(response) ? response : [response];
            setComments(commentsData);
        } catch (err) {
            console.error(`Failed to fetch comments: ${err}`);
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return formatTimeAgo(dateString);
        } catch {
            return dateString;
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await handleCreateCommentOnCard({ cardId, body: newComment.trim() });
            if (!response) throw new Error("Failed to add comment");
            
            setNewComment("");
        } catch (err) {
            console.error(`Failed to add comment: ${err}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    }

    const handleKeyDownForEdit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveEdit();
        }
    }

    return (
        <div className="space-y-4 pt-4 border-t">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">Comments</span>
                {comments.length > 0 && (
                    <span className="text-xs text-gray-500">({comments.length})</span>
                )}
                {isConnected && (
                    <span className="text-xs text-green-500">
                        
                    </span>
                )}
            </div>

            {/* Add Comment Input */}
            <div className="flex items-start gap-3">
                <img
                    src={user?.avatar_url || ""}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/32";
                    }}
                />
                <div className="flex-1 space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                        rows={2}
                        disabled={isSubmitting}
                        onKeyDown={handleKeyDown}
                    />
                    {newComment.trim() && (
                        <button
                            onClick={handleAddComment}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {/* {isSubmitting ? "Adding..." : "Add Comment"} */}
                            Add Comment
                        </button>
                    )}
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
                {comments.map((comment) => {
                    const isEditing = editingCommentId === comment.id;
                    const isOwner = comment.author_id === user?.id;

                    return (
                        <div key={comment.id} className="flex items-start gap-3">
                            <img
                                src={comment.author?.avatar_url || ""}
                                alt={comment.author?.name || "User"}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.src = "https://via.placeholder.com/32";
                                }}
                            />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {comment.author?.name || "Unknown User"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(comment.created_at)}
                                    </span>
                                    {comment.edited_at && (
                                        <span className="text-xs text-gray-400 italic">(edited)</span>
                                    )}
                                    {isOwner && !isEditing && (
                                        <div className="flex items-center gap-1 ml-auto">
                                            <button
                                                onClick={() => handleStartEdit(comment)}
                                                className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors"
                                                title="Edit comment"
                                            >
                                                <FiEdit2 className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => setDeletedCommentId(comment.id)}
                                                className="p-1 text-gray-500 hover:text-red-600 rounded transition-colors"
                                                title="Delete comment"
                                            >
                                                <FiTrash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editCommentBody}
                                            onChange={(e) => setEditCommentBody(e.target.value)}
                                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                                            rows={2}
                                            onKeyDown={handleKeyDownForEdit}
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={!editCommentBody.trim()}
                                                className="px-3 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                            >
                                                <FiCheck className="w-4 h-4" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-1"
                                            >
                                                <FiX className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {comment.body}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deletedCommentId !== null}
                onOpenChange={(open) => !open && setDeletedCommentId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletedCommentId(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteComment}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}