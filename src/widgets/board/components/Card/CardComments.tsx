import type { GetAllCommentsOfCardResponse } from "@/features/cards";
import { useEffect, useState } from "react";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { useUser } from "@/features/providers/UserProvider";
import { formatTimeAgo } from "@/shared/utils/dateUtils";
import { useSSE } from "@/shared/hook/useSSE";

interface CardCommentsProps {
    cardId: string;
}

export function CardComments({ cardId }: CardCommentsProps) {
    const [comments, setComments] = useState<GetAllCommentsOfCardResponse[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { handleGetAllCommentsOfCard, handleCreateCommentOnCard } = useCardDetailContext();
    const { user } = useUser();

    const { isConnected } = useSSE(
        `${import.meta.env.VITE_API_BASE_URL}/cards/${cardId}/comments/stream`,
        {
            enabled: !!cardId,
            onMessage: (data) => {
                if (data.event === 'comment_created' && data.data) {
                    const newCommentData = data.data;
    
                    setComments(prev => {
                        const exists = prev.some(c => c.id === newCommentData.id);
                        if (exists) {
                            return prev;
                        }
    
                        const newComments = [...prev, newCommentData];
                        return newComments;
                    });
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
                    {comments.map((comment) => (
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
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                ))}
            </div>
        </div>
    )
}