import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FiChevronLeft, FiRefreshCcw, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useListContext } from "@/features/providers/ListProvider";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/aleart-dialog";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { CardMemberAvatars } from "../../components/Card/CardMemberAvatars";

type ArchivedMode = "list" | "card";

export interface ArchivedItemsProps {
  onClose: () => void;
}

export function ArchivedItems({ onClose }: ArchivedItemsProps) {
    const { archivedList, fetchAllArchivedListsOfBoard, handleDeleteListFromBoardPermanently, fetchDeleteListFromBoard } = useListContext();
    const { archivedCards, fetchAllArchivedCardsOfBoard, fetchDeleteCard, refreshCards, handleDeleteCardPermanently } = useCardDetailContext();
    const { boardId } = useParams();
    const [isRestoring, setIsRestoring] = useState(false);
    const [mode, setMode] = useState<ArchivedMode>("list");
    const [search, setSearch] = useState("");

    // handle search change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    // filter archived lists
    const filteredArchivedList = archivedList.filter((list) => 
        list.name?.toLowerCase().includes(search.trim().toLowerCase())
    );

    // filter archived cards
    const filteredArchivedCards = archivedCards.filter((card) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        const matchTitle = card?.title?.toLowerCase().includes(query);
        const matchDesc = card?.description?.toLowerCase().includes(query);
        return matchTitle || matchDesc;
    });

    useEffect(() => {
        if (boardId) {
            fetchAllArchivedListsOfBoard({ boardId: boardId });
            fetchAllArchivedCardsOfBoard({ boardId: boardId });
        }
    }, [boardId]);

    // delete list from board permanently
    const deleteListFromBoardPermanently = async (listId: string) => {
        try {
            await handleDeleteListFromBoardPermanently({ boardId: boardId as string, listId: listId });
        } catch (err) {
            console.error(`Failed to delete list from board permanently: ${err}`);
            throw err;
        }
    }

    // restore list from board
    const handleRestoreList = async (listId: string) => {
        setIsRestoring(true);
        try {
            await fetchDeleteListFromBoard({ boardId: boardId as string, listId: listId, archived: false });
            if (boardId) {
                await fetchAllArchivedListsOfBoard({ boardId: boardId });
            }
        } catch (err) {
            console.error(`Failed to restore list: ${err}`);
            throw err;
        } finally {
        setIsRestoring(false);
    }
}
    const handleRestoreCard = async (cardId: string) => {
        setIsRestoring(true);
        try {
            await fetchDeleteCard({ cardId: cardId, archived: false });
            if (boardId) {
                await fetchAllArchivedCardsOfBoard({ boardId: boardId });
                await refreshCards(boardId);
            }
        } catch (err) {
            console.error(`Failed to restore card: ${err}`);
        } finally {
            setIsRestoring(false);
        }
    }

    const deleteCardPermanently = async (cardId: string) => {
        try {
            await handleDeleteCardPermanently({ cardId: cardId });
        } catch (err) {
            console.error(`Failed to delete card permanently: ${err}`);
        }
    }

  return (
    <div className="space-y-4">
        {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="text-sm flex items-center justify-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100"
          onClick={onClose}
          aria-label="Back"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-semibold">Archived items</h3>

        <button
          type="button"
          className="p-1 hover:bg-gray-100 transition-colors rounded-md"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

        {/* Content */}
        <div className="space-y-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search archived items..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2"
                    />
                </div>
                {mode === "list" ? (
                    <Button variant="outline" size="sm" onClick={() => setMode("card")}>
                        Cards
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" onClick={() => setMode("list")}>
                        Lists
                    </Button>
                )}
            </div>
        {/* Archived lists */}
        {mode === "list" && (
            <div className="space-y-4">
                {filteredArchivedList.map((list) => (
                    <div key={list.id} className="flex items-center justify-between gap-2 relative font-medium text-sm">
                    <span className="min-w-0 flex-1 truncate" title={list.name}>
                        {list.name}
                    </span>
                        <div className="flex items-center justify-center gap-2 mb-2 flex-shrink-0">
                            <Button variant="outline" size="sm" className="text-sm" disabled={isRestoring} onClick={() => handleRestoreList(list.id)}><FiRefreshCcw className="w-4 h-4" /> Restore</Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-sm flex items-center justify-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                                        disabled={isRestoring}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent size="sm">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this list permanently?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. All cards in this list will also be deleted permanently.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            variant="destructive"
                                            onClick={() => deleteListFromBoardPermanently(list.id)}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
                {filteredArchivedList.length === 0 && (
                    <div className="text-sm text-gray-500">No archived lists found</div>
                )}
            </div>
        )}

        {mode === "card" && (
            <div className="space-y-4">
                <div className="max-h-[600px] overflow-y-auto space-y-4">
                    {filteredArchivedCards.map((card) => (
                        <div key={card.id} className="p-3 border-b bg-white rounded-md shadow-sm">
                        {/* Title */}
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            {card?.title}
                        </h4>

                        {/* Description */}
                        {card?.description && (
                            <p className="text-xs text-gray-600 mb-2">
                                {card.description}
                            </p>
                        )}
                        
                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                            {/* Members */}
                            {((card?.cardMembers && card.cardMembers.length > 0) || 
                                (card?.assigned_users && card.assigned_users.length > 0)) && (
                                <div className="flex items-center -space-x-2">
                                    <CardMemberAvatars card={card} maxDisplay={2} />
                                </div>
                            )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                            <button
                                type="button"
                                className="hover:text-gray-900 hover:underline cursor-pointer disabled:opacity-50"
                                onClick={() => handleRestoreCard(card.id)}
                                disabled={isRestoring}
                            >
                                Restore
                            </button>
                            <span className="text-gray-400">•</span>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="hover:text-red-600 hover:underline cursor-pointer disabled:opacity-50"
                                        disabled={isRestoring}
                                    >
                                        Delete
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent size="sm">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete this card permanently?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. The card will be permanently removed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            variant="destructive"
                                            onClick={() => deleteCardPermanently(card.id)}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    ))}
                    {filteredArchivedCards.length === 0 && (
                        <div className="text-sm text-gray-500">No archived cards found</div>
                    )}
                </div>
            </div>
        )}
    </div>
    </div>
  );
}