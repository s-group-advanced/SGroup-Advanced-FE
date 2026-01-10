import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogClose,
  } from "@/shared/ui/dialog/index";
  import { Button } from "@/shared/ui/button/button";
  import { FaPlus } from "react-icons/fa";
  import { Label } from "@/shared/ui/label/label";
  import { Input } from "@/shared/ui/input/input";
  import { useState, useEffect } from "react";
  import { useBoardContext } from "@/features/providers/index";
  import type { ApiError } from "@/shared/api/fetchFactory"; 
  
  interface DialogNewBoardProps {
    headerTitle?: string;
    headerDescription?: string;
    mode?: "create" | "edit";
    triggerButton?: React.ReactNode;
    workspaceId?: string;  
    onBoardCreated?: () => void;  // callback để refresh danh sách boards
  }
  
  export function DialogNewBoard({ 
    headerTitle,
    headerDescription,
    mode = "create",
    triggerButton,
    workspaceId,  
    onBoardCreated  
  }: DialogNewBoardProps) {
    const [boardTitle, setBoardTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);  
    
    const { isEditDialogOpen, selectedBoard, closeEditDialog, updateBoard, createBoard } = useBoardContext();
  
    // Sync với Context cho chế độ Edit
    useEffect(() => {
        if (mode === "edit" && isEditDialogOpen && selectedBoard) {
            setBoardTitle(selectedBoard.name);
            setDescription(selectedBoard.description);
            setIsOpen(true);
        }
    }, [mode, isEditDialogOpen, selectedBoard]);
  
    const isEdit = mode === "edit";
    const title = headerTitle || (isEdit ? "Edit Board" : "Create New Board");
    const desc = headerDescription || (isEdit 
        ? "Update your board information" 
        : "Create a new board to organize your tasks");
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!boardTitle.trim()) {
            alert("Board title is required");
            return;
        }
  
        setIsSubmitting(true);
  
        try {
            if (isEdit && selectedBoard) {
                // Update board
                await updateBoard({
                    boardId: selectedBoard.id,
                    name: boardTitle.trim(),
                    description: description.trim() || undefined,
                });
                closeEditDialog();
            } else {
                // Create new board
                if (!workspaceId) {
                    alert("Workspace ID is required to create a board");
                    return;
                }
  
                const newBoard = await createBoard({
                    name: boardTitle.trim(),
                    description: description.trim() || undefined,
                    workspaceId: workspaceId
                });
  
                console.log("Board created:", newBoard);
  
                // Gọi callback để refresh danh sách board
                if (onBoardCreated) {
                    onBoardCreated();
                }
            }
            
            // Reset form khi đóng
            setBoardTitle("");
            setDescription("");
            setIsOpen(false);
        } catch (error) {
            const apiError = error as ApiError;
            alert(apiError.message || "Failed to save board");
            console.error("Error saving board:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
  
    const handleClose = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            if (isEdit) {
                closeEditDialog();
            }
            // Reset form khi đóng dialog
            setBoardTitle("");
            setDescription("");
        }
    };
  
    return (
        <Dialog open={isEdit ? isEditDialogOpen : isOpen} onOpenChange={handleClose}>
            {/* Trigger Button */}
            {!isEdit && (
                <DialogTrigger asChild>
                    {triggerButton || (
                        <Button className="bg-white text-black border border-gray-300 hover:bg-gray-100">
                            <FaPlus className="text-black mr-2 w-3 h-3" />
                            Add Board
                        </Button>
                    )}
                </DialogTrigger>
            )}
  
            {/* Dialog Content */}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{desc}</DialogDescription>
                    </DialogHeader>
  
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="name">Board Title</Label>
                            <Input
                                id="name"
                                placeholder="Enter board title"
                                value={boardTitle}
                                onChange={(e) => setBoardTitle(e.target.value)}
                                required
                                disabled={isSubmitting}
                                maxLength={255}
                            />
                        </div>
                        
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Enter board description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
  
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            disabled={!boardTitle.trim() || isSubmitting} 
                            type="submit"
                        >
                            {isSubmitting 
                                ? "Saving..." 
                                : (isEdit ? "Update Board" : "Create Board")
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
  }