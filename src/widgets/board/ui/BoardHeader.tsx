import { useBoardDetail } from "@/app/providers/BoardDetailProvider";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import React, { useEffect, useRef, useState } from "react";
import { FiEdit, FiMoreHorizontal, FiUserPlus } from "react-icons/fi";
import { DialogInviteToBoard } from "../components/Dialog/DialogInviteToBoard";

export function BoardHeader() {
    const { board, updateBoardName } = useBoardDetail();
    const [isEditName, setIsEditName] = useState(false);
    const [boardName, setBoardName] = useState(board?.name || "");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    // update board name when board name change
    useEffect(() => {
        if (board?.name) {
            setBoardName(board.name);
        }
    }, [board?.name]);

    useEffect(() => {
        if (isEditName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditName]);

    const handleEditName = () => {
        setIsEditName(true);
        setBoardName(board?.name || "");
    }

    const handleSaveName = async () => {
        const trimmedName = boardName.trim();

        // if nothing changed, return
        if (!trimmedName || trimmedName === board?.name) {
            setBoardName(board?.name || "");
            setIsEditName(false);
            return;
        }
        // update board name
        try {
            await updateBoardName(trimmedName);
            setIsEditName(false);

        } catch (err) {
            console.error(`Failed to update board name: ${err}`);
            setBoardName(board?.name || "");
            setIsEditName(false);
            throw err;
        }
    }

    // handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSaveName();
        } else if (e.key === "Escape") { 
            setBoardName(board?.name || "");
            setIsEditName(false);
        }
    }

    // handle members invited (callback when members invited)
    const handleMembersInvited = () => {
        console.log("members invited");
    }

    if (!board) return null;

    return (
        <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
            {/* Left side - BoardName */}
            {
                isEditName ? (
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={boardName} 
                        onChange={(e) => setBoardName(e.target.value)} 
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDown}
                        className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 px-2 py-1 focus:outline-none bg-transparent"
                        placeholder="Enter board name..."
                    />
                ) : (
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold text-gray-900">
                            {board.name}
                        </h1>

                        {/* edit board name */}
                        <button 
                            onClick={handleEditName} 
                            className="p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                    </div>
                )
            }

            {/* Right side - Actions */}
            <div className="flex items-center gap-10">
                {/* invite button */}
                <Button 
                    onClick={() => setIsInviteDialogOpen(true)}
                    variant="outline" size="sm" className="hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    <FiUserPlus className="w-4 h-4" />
                    Invite
                </Button>

                {/* More menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <FiMoreHorizontal className="w-4 h-4 mr-2 hover:text-gray-600 transition-colors cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10}>
                        <DropdownMenuItem 
                            onClick={() => setIsInviteDialogOpen(true)}
                            className="flex items-center gap-2 hover:bg-gray-100 rounded transition-colors cursor-pointe px-2 py-1.5">
                            <FiUserPlus className="w-4 h-4" />
                            Invite members
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={handleEditName}
                            className="flex items-center gap-2 hover:bg-gray-100 rounded transition-colors cursor-pointe px-2 py-1.5">
                            <FiEdit className="w-4 h-4" />
                            Rename board
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DialogInviteToBoard
                isOpen={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
                boardId={board.id}
                onMembersInvited={handleMembersInvited}
            />

        </div>
    );
}