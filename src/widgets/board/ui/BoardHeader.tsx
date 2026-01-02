import { useBoardDetail } from "@/app/providers/BoardDetailProvider";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { FiEdit, FiMoreHorizontal, FiUserPlus } from "react-icons/fi";

export function BoardHeader() {
    const { board } = useBoardDetail();

    if (!board) return null;

    return (
        <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
            {/* Left side - BoardName */}
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-gray-900">
                    {board.name}
                </h1>

                {/* edit board name */}
                <button className="p-2 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    <FiEdit className="w-4 h-4" />
                </button>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-10">
                {/* invite button */}
                <Button variant="outline" size="sm" className="hover:bg-gray-100 rounded transition-colors cursor-pointer">
                    <FiUserPlus className="w-4 h-4" />
                    Invite
                </Button>

                {/* More menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <FiMoreHorizontal className="w-4 h-4 mr-2 hover:text-gray-600 transition-colors cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={10}>
                        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded transition-colors cursor-pointe px-2 py-1.5">
                            <FiUserPlus className="w-4 h-4" />
                            Invite members
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded transition-colors cursor-pointe px-2 py-1.5">
                            <FiEdit className="w-4 h-4" />
                            Rename board
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>
    );
}