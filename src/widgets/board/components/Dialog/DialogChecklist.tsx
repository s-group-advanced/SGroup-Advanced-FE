import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import { FiCheckSquare, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Card } from "@/features/cards";
import { useChecklist, type Checklist } from "@/features/checklists";
import { useChecklistContext } from "@/app/providers/ChecklistProvider";
import type { ChecklistItem } from "@/features/checklists/api/type";

interface DialogChecklistProps {
    card: Card;
}

// Checklist local type có thêm items + progress từ BE
type ChecklistWithItems = Checklist & {
    items?: ChecklistItem[];
    progress?: number;
};

export function DialogChecklist({ card }: DialogChecklistProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [checklistsOfCard, setChecklistsOfCard] = useState<ChecklistWithItems[]>([]);
    const [isAddingItem, setIsAddingItem] = useState<string | null>(null);
    const [checklistName, setChecklistName] = useState("");
    const [checklistItemContent, setChecklistItemContent] = useState("");

    const { getAllChecklistOfCard } = useChecklist();
    const {
        handleCreateChecklistOnCard,
        handleRemoveChecklistFromCard,
        handleCreateChecklistItemOnChecklist,
        handleUpdateChecklistItemOnChecklist,
        handleRemoveChecklistItemOnChecklist,
    } = useChecklistContext();

    useEffect(() => {
        if (isOpen && card.id) {
            fetchAllChecklistsOfCard();
            setIsAddingItem(null);
        }
    }, [isOpen, card.id]);

    // Lấy toàn bộ checklist, items, progress của card
    const fetchAllChecklistsOfCard = async () => {
        try {
            const data = await getAllChecklistOfCard({ cardId: card.id });
            if (!data) throw new Error("Failed to fetch all checklists of card");

            const checklistsArray = Array.isArray(data) ? data : (data.checklists || []);
            setChecklistsOfCard(checklistsArray as ChecklistWithItems[]);
        } catch (err) {
            console.error(`Failed to fetch all checklists of card: ${err}`);
            setChecklistsOfCard([]);
        }
    };

    // Tạo checklist mới trên card
    const createChecklistOnCard = async () => {
        if (!checklistName.trim()) return;
        const nameToCreate = checklistName.trim();

        setIsAddingItem(null);
        setChecklistName("");

        try {
            const data = await handleCreateChecklistOnCard({
                cardId: card.id,
                name: nameToCreate,
            });
            if (!data) throw new Error("Failed to create checklist on card");

            // Reload all checklists of card
            await fetchAllChecklistsOfCard();
        } catch (err) {
            console.error(`Failed to create checklist on card: ${err}`);
            setChecklistName(nameToCreate);
        }
    };

    // Xoá checklist khỏi card
    const removeChecklistFromCard = async (checklistId: string) => {
        if (!checklistId) return;
        try {
            await handleRemoveChecklistFromCard({ cardId: card.id, checklistId });

            // Update UI local
            setChecklistsOfCard(prev => prev.filter(c => c.id !== checklistId));
        } catch (err) {
            console.error(`Failed to remove checklist from card: ${err}`);
        }
    };

    // Tạo checklist item cho checklist
    const createChecklistItemOnChecklist = async (checklistId: string) => {
        if (!checklistId) return;
        if (!checklistItemContent.trim()) return;

        const contentToCreate = checklistItemContent.trim();
        setChecklistItemContent("");
        setIsAddingItem(null);

        try {
            await handleCreateChecklistItemOnChecklist({
                cardId: card.id,
                checklistId,
                name: contentToCreate,
            });

            // Reload all checklists of card
            await fetchAllChecklistsOfCard();
        } catch (err) {
            console.error(`Failed to create checklist item on checklist: ${err}`);
            setChecklistItemContent(contentToCreate);
        }
    };

    // Update checklist item on checklist
    const toggleChecklistItem = async (checklistId: string, item: ChecklistItem) => {
        if (!checklistId || !item.id) return;
        const nextChecked = !item.is_checked;
      
        try {
          const res = await handleUpdateChecklistItemOnChecklist({
            cardId: card.id,
            checklistId,
            itemId: item.id,
            is_completed: nextChecked,
          });
      
          // cập nhật local items + progress (dùng progress trả về, hoặc tự tính)
          setChecklistsOfCard(prev =>
            prev.map(cl => {
              if (cl.id !== checklistId) return cl;
              const updatedItems = (cl.items || []).map(it =>
                it.id === item.id ? { ...it, is_checked: nextChecked } : it
              );
      
              const newProgress =
                res.checklist?.progress ??
                (() => {
                  const total = updatedItems.length || 1;
                  const done = updatedItems.filter(it => it.is_checked).length;
                  return (done / total) * 100;
                })();
      
              return { ...cl, items: updatedItems, progress: newProgress };
            })
          );
        } catch (err) {
          console.error("Failed to update checklist item:", err);
        }
      };

    // Remove checklist item on checklist
    const removeChecklistItemOnChecklist = async (checklistId: string, itemId: string) => {
        if (!checklistId || !itemId) return;
        try {
            await handleRemoveChecklistItemOnChecklist({ cardId: card.id, checklistId, itemId });
            setChecklistsOfCard(prev =>
                prev.map(cl => {
                  if (cl.id !== checklistId) return cl;
                  const updatedItems = (cl.items || []).filter(it => it.id !== itemId);
                  const total = updatedItems.length || 1;
                  const done = updatedItems.filter(it => it.is_checked).length;
                  const progress = (done / total) * 100;
                  return { ...cl, items: updatedItems, progress };
                })
              );
        } catch (err) {
            console.error(`Failed to remove checklist item on checklist: ${err}`);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-sm"
                >
                    <FiCheckSquare className="w-4 h-4" />
                    Add todo
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[420px] p-0 h-[500px] flex flex-col">
                {/* Header */}
                <div className="p-5 space-y-3">
                    <div className="pb-2 border-b border-gray-200">
                        <h3 className="text-base font-semibold text-gray-900">Todos</h3>
                    </div>
                </div>

                {/* Tạo checklist mới */}
                <div className="pl-5 pr-5 pb-5 space-y-4">
                    <label
                        htmlFor="todo-title"
                        className="text-sm font-semibold text-gray-900"
                    >
                        Add new todo
                    </label>
                    <div className="flex items-center gap-2 justify-between">
                        <Input
                            type="text"
                            className="w-[20rem]"
                            placeholder="Enter todo title"
                            value={checklistName}
                            onChange={e => setChecklistName(e.target.value)}
                        />
                        <Button
                            onClick={createChecklistOnCard}
                            disabled={!checklistName.trim()}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors font-semibold shadow-sm active:bg-black"
                        >
                            <FiPlus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Danh sách checklist của card */}
                <div 
                    className="flex-1 overflow-y-auto min-h-0 overscroll-y-contain"
                    onWheel={(e) => e.stopPropagation()} 
                >
                    {checklistsOfCard.map(checklist => {
                        const checklistProgress = checklist.progress ?? 0;
                        const checklistItems = checklist.items || [];
                        return (
                            <div
                                key={checklist.id}
                                className="px-5 pb-4 space-y-3"
                            >
                                {/* Tên checklist + nút xoá */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiCheckSquare className="w-4 h-4" />
                                        <p className="font-medium text-sm">
                                            {checklist.name}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            removeChecklistFromCard(checklist.id || "")
                                        }
                                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors hover:bg-gray-100"
                                    >
                                        <FiTrash2 className="w-3 h-3" />
                                        Remove
                                    </Button>
                                </div>
                                {/* Progress của checklist */}
                                <div className="space-y-1.5 flex items-center gap-2">
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span className="font-medium">
                                            {Math.round(checklistProgress)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                            style={{ width: `${checklistProgress}%` }}
                                        />
                                    </div>
                                </div>
                                {/* Checklist items */}
                                {checklistItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2 justify-start"
                                    >
                                        <input
                                            type="checkbox"
                                            className="text-sm h-3 w-3"
                                            checked={item.is_checked}
                                            onChange={() => toggleChecklistItem(checklist.id || "", item)}
                                        />
                                        <p className="font-normal text-sm ml-2">
                                            {item.content}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            className="px-2 py-1 text-xs ml-auto"
                                            onClick={() => removeChecklistItemOnChecklist(checklist.id || "", item.id)}
                                        >
                                            <FiTrash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                                {/* Form thêm checklist item */}
                                {isAddingItem === checklist.id ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Enter todo item"
                                            className="flex-1 text-sm h-8"
                                            autoFocus
                                            value={checklistItemContent}
                                            onChange={e =>
                                                setChecklistItemContent(e.target.value)
                                            }
                                        />
                                        <Button
                                            variant="ghost"
                                            className="px-2 py-1 text-xs"
                                            onClick={() =>
                                                createChecklistItemOnChecklist(
                                                    checklist.id || "",
                                                )
                                            }
                                            disabled={!checklistItemContent.trim()}
                                        >
                                            Add
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="px-2 py-1 text-xs"
                                            onClick={() => setIsAddingItem(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                setIsAddingItem(checklist.id || null)
                                            }
                                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors hover:bg-gray-100 cursor-pointer"
                                        >
                                            <FiPlus className="w-3 h-3" />
                                            Add todo
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}