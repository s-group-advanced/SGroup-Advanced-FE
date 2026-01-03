import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogHeader } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { GetAllMemberOfWorkspaceButNotInBoardResponse } from "@/features/boards/index";
import { useBoardDetail } from "@/app/providers/index";
import { useBoards } from "@/features/boards";

interface DialogInviteToBoardProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
    boardId: string;
    onMembersInvited?: (user: GetAllMemberOfWorkspaceButNotInBoardResponse) => void;
}

export function DialogInviteToBoard({ isOpen, onOpenChange, triggerButton, boardId, onMembersInvited }: DialogInviteToBoardProps) {
    const [email, setEmail] = useState("");
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
    const [allMemberOfWorkspaceButNotInBoard, setAllMemberOfWorkspaceButNotInBoard] = useState<GetAllMemberOfWorkspaceButNotInBoardResponse[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { fetchAllMemberOfWorkspaceButNotInBoard } = useBoardDetail();
    const { inviteUserToBoard } = useBoards();


    useEffect(() => {
        if (isOpen) {
            fetchAllMemberOfWorkspaceButNotInBoardData();
        }
    }, [isOpen, boardId]);

    const fetchAllMemberOfWorkspaceButNotInBoardData = async () => {
        try {
            const data = await fetchAllMemberOfWorkspaceButNotInBoard(boardId);
            setAllMemberOfWorkspaceButNotInBoard(data as unknown as GetAllMemberOfWorkspaceButNotInBoardResponse[]);
        } catch (err) {
            console.error(`Failed to fetch all member of workspace but not in board: ${err}`);
            throw err;
        }
    }

    const handleSendInvitation = async () => {
        if (!email.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await inviteUserToBoard({
                boardId,
                invited_email: email.trim(),
            })

            setEmail("");
            onMembersInvited?.({
                id: "",
                name: email.trim(),
                email: email.trim(),
                avatar_url: "",
                roles: [],
                permissions: [],
            });
        } catch (err) {
            console.error(`Failed to send invitation: ${err}`);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleQuickInvite = async (user: GetAllMemberOfWorkspaceButNotInBoardResponse) => {
        if (invitedUsers.includes(user.id) || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await inviteUserToBoard({
                boardId,
                invited_email: user.email,
                invited_user_id: user.id,
            });

            setInvitedUsers([...invitedUsers, user.email]);
            onMembersInvited?.(user);
        } catch (err) {
            console.error(`Failed to invite user: ${err}`);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Invite to Board
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600">
                        Invite team members to collaborate on this board.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Invite by Email Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Invite by Email
                        </label>
                        <Input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isSubmitting) {
                                    handleSendInvitation();
                                }
                            }}
                            className="w-full"
                        />
                        <Button
                            onClick={handleSendInvitation}
                            className="w-full bg-black hover:bg-gray-800 text-white"
                            disabled={!email.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Invitation"}
                        </Button>
                    </div>

                    {/* Quick Invite Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Quick Invite
                        </label>
                        <div className="space-y-2">
                            {allMemberOfWorkspaceButNotInBoard.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleQuickInvite(user)}
                                        className="bg-black hover:bg-gray-800 text-white px-6"
                                        size="sm"
                                        disabled={invitedUsers.includes(user.email || "") || isSubmitting}
                                    >
                                        {invitedUsers.includes(user.email || "") ? "Invited" : "Invite"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <DialogClose asChild>
                        <Button variant="outline" className="px-6" disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}