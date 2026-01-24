import { FiUserPlus } from "react-icons/fi";
import { Button } from "@/shared/ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { InviteToWorkspace } from "../components/dialog/InviteToWorkspace";
export function WorkspaceHeader() {
    const { workspaceId } = useParams();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-gray-200 flex items-center justify-between">
                <div className="border-gray-200 flex">
                    <h1 className="text-lg font-medium mx-4">Dashboard</h1>
                </div>
                {/* invite members to workspace */}
                <InviteToWorkspace isOpen={isOpen} onOpenChange={setIsOpen} triggerButton={<Button variant="outline" size="default" className="hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                    <FiUserPlus className="w-4 h-4" />
                    Invite members
                </Button>} workspaceId={workspaceId || ""} />
            </div>
            <div className="w-full h-px bg-gray-200 my-2"></div>
    </div>
  );
}