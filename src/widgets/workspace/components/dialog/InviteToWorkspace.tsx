import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogHeader } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { useEffect, useState } from "react";
import type { GetAllMemberOfWorkspaceButNotInWorkspaceResponse } from "@/features/projects/index";
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider";
import conKhiImg from "@/shared/assets/img/conKhi.jpg";
import { toast } from "sonner";
import { LinkIcon } from "lucide-react";

interface InviteToWorkspaceProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerButton?: React.ReactNode;
    workspaceId: string;
}

export function InviteToWorkspace({ isOpen, onOpenChange, triggerButton, workspaceId }: InviteToWorkspaceProps) {
    const [email, setEmail] = useState("");
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [invitingUserIds, setInvitingUserIds] = useState<string[]>([]);
    const [allUsers, setAllUsers] = useState<GetAllMemberOfWorkspaceButNotInWorkspaceResponse[]>([]);
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]); 
    const { 
        fetchAllMemberOfWorkspaceButNotInWorkspace, 
        handleInviteMemberToWorkspace, 
        handleCreateLinkInvitationToWorkspace, 
        handleDisableLinkInvitationToWorkspace, 
        getWorkspaceLinkInvitation, setWorkspaceLinkInvitation, 
        fetchCurrentLinkInvitationToWorkspace,
    } = useWorkspaceContext();

    const { linkInvitation, tokenInvitation, isCreatingLinkInvitation } = getWorkspaceLinkInvitation(workspaceId);
    useEffect(() => {
        if (isOpen) {
            setInvitedUsers([]);
            setInvitingUserIds([]); 
            fetchAllMemberOfWorkspaceButNotInWorkspaceData();

            fetchCurrentLinkInvitationToWorkspace(workspaceId).catch(() => {

            });
        }
    }, [isOpen, workspaceId]);

    const fetchAllMemberOfWorkspaceButNotInWorkspaceData = async () => {
        try {
            const data = await fetchAllMemberOfWorkspaceButNotInWorkspace(workspaceId);
            setAllUsers(data);
        } catch (err) {
            console.error(`Failed to fetch users: ${err}`);
        }
    }

    const handleSendInvitation = async () => {
        if (!email.trim() || isSendingEmail) return;
        
        setIsSendingEmail(true); 
        try {
            await handleInviteMemberToWorkspace({
                workspaceId,
                email: email.trim(),
            });
            setEmail("");
            toast.success(`Invitation successfully sent to ${email.trim()}.`, {
                position: "top-center",
            });
        } catch (err) {
            console.error(`Failed to send invitation: ${err}`);
            toast.error("Failed to send invitation. Please try again.", {
                position: "top-center",
            });
        } finally {
            setIsSendingEmail(false);
        }
    }

    const handleQuickInvite = async (user: GetAllMemberOfWorkspaceButNotInWorkspaceResponse) => {
        if (invitedUsers.includes(user.id) || invitingUserIds.includes(user.id)) return;
        
        setInvitingUserIds([...invitingUserIds, user.id]); 
        try {
            await handleInviteMemberToWorkspace({
                workspaceId,
                email: user.email,
            });
            setInvitedUsers([...invitedUsers, user.id]);
            toast.success(`Invitation successfully sent to ${user.email.trim()}.`, {
                position: "top-center",
            });
        } catch (err) {
            console.error(`Failed to invite user: ${err}`);
            toast.error("Failed to invite user. Please try again.", {
                position: "top-center",
            });
        } finally {
            setInvitingUserIds(prev => prev.filter(id => id !== user.id)); 
        }
    }

    // create link invitation to workspace
    const createLinkInvitationToWorkspace = async (): Promise<void> => {
        try {
            const data = await handleCreateLinkInvitationToWorkspace({
                workspaceId,
            });
            setWorkspaceLinkInvitation(workspaceId, {
                linkInvitation: data.inviteUrl,
                tokenInvitation: data.token,
                isCreatingLinkInvitation: true,
            });

            // auto add link invitation to clipboard
            navigator.clipboard.writeText(data.inviteUrl);
            toast.success("Link invitation copied to clipboard.", {
                position: "top-center",
            });
        } catch (err) {
            console.error(`Failed to create link invitation to workspace: ${err}`);
            toast.error("Failed to create link invitation to workspace. Please try again.", {
                position: "top-center",
            });
            setWorkspaceLinkInvitation(workspaceId, {
                isCreatingLinkInvitation: false,
            });
        }
    }

    // disable link invitation to workspace
    const disableLinkInvitationToWorkspace = async (): Promise<void> => {
        try {
            await handleDisableLinkInvitationToWorkspace({
                workspaceId,
                token: tokenInvitation,
            });
            setWorkspaceLinkInvitation(workspaceId, {
                linkInvitation: "",
                tokenInvitation: "",
                isCreatingLinkInvitation: false,
            });
            toast.success("Link invitation disabled.", {
                position: "top-center",
            });
        } catch (err) {
            console.error(`Failed to disable link invitation to workspace: ${err}`);
            toast.error("Failed to disable link invitation to workspace. Please try again.", {
                position: "top-center",
            });
        } finally {
            setWorkspaceLinkInvitation(workspaceId, {
                isCreatingLinkInvitation: false,
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Invite to Workspace
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-gray-600">
                        Invite team members to collaborate on this workspace.
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
                                if (e.key === "Enter" && !isSendingEmail) {
                                    handleSendInvitation();
                                }
                            }}
                            className="w-full mt-2"
                        />
                        <Button
                            onClick={handleSendInvitation}
                            className="w-full bg-black hover:bg-gray-800 text-white"
                            disabled={!email.trim() || isSendingEmail}
                        >
                            {isSendingEmail ? "Sending..." : "Send Invitation"}
                        </Button>
                    </div>

                    {/* Quick Invite Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Quick Invite
                        </label>
                        <div className="space-y-2">
                            {allUsers.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No users available to invite
                                </p>
                            ) : (
                                allUsers.map((user) => {
                                    const isInviting = invitingUserIds.includes(user.id);
                                    const isInvited = invitedUsers.includes(user.id);
                                    
                                    return (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between py-2"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar_url || conKhiImg}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = conKhiImg;
                                                    }}
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
                                                disabled={isInvited || isInviting}
                                            >
                                                {isInviting ? "Inviting..." : isInvited ? "Invited" : "Invite"}
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t">
                    <DialogClose asChild>
                        <Button variant="outline" className="px-6">
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
                
                {/* Invite join to workspace by via link invitation */}
                <div className="space-y-3 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                        <label className="text-xs font-semibold text-gray-900 flex items-center  gap-2">
                            Invite join to workspace by via link invitation
                        </label>
                        {isCreatingLinkInvitation && (
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    disableLinkInvitationToWorkspace();
                                }}
                                className="text-xs text-blue-500 underline hover:text-blue-700"
                            >
                                Disable link
                            </a>
                        )}
                        
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={isCreatingLinkInvitation ? () => {
                            navigator.clipboard.writeText(linkInvitation);
                            toast.success("Link invitation copied to clipboard.", {
                                position: "top-center",
                            });
                        } : createLinkInvitationToWorkspace}
                    >
                        <LinkIcon className="w-4 h-4" />
                        {isCreatingLinkInvitation ? "Copy Link" : "Create Link"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}