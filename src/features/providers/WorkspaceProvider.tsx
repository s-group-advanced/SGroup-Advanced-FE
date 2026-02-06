// src/features/projects/model/ProjectProvider.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { projectApi } from "../projects/api/projectApi";
import type { ArchiveWorkspaceRequest, CreateLinkInvitationToWorkspaceRequest, CreateLinkInvitationToWorkspaceResponse, CreateWorkspaceRequest, CreateWorkspaceResponse, DisableLinkInvitationToWorkspaceRequest, InviteMemberToWorkspaceRequest, Project } from "../projects/api/type";
import type { GetAllMemberOfWorkspaceButNotInWorkspaceResponse, GetCurrentLinkInvitationToWorkspaceResponse, UpdateWorkspaceRequest } from "../projects/index";

type WorkspaceLinkInvitationState = {
    linkInvitation: string;
    tokenInvitation: string;
    isCreatingLinkInvitation: boolean;
}
interface WorkspaceContextType {
    projects: Project[];
    isLoading: boolean;
    getAllProjectsOfUser: () => Promise<void>;
    createWorkspace: (request: CreateWorkspaceRequest) => Promise<CreateWorkspaceResponse>;
    clearWorkspaces: () => void;
    fetchAllMemberOfWorkspaceButNotInWorkspace: (workspaceId: string) => Promise<GetAllMemberOfWorkspaceButNotInWorkspaceResponse[]>;
    handleInviteMemberToWorkspace: (request: InviteMemberToWorkspaceRequest) => Promise<void>;
    handleToggleArchiveWorkspace: (request: ArchiveWorkspaceRequest) => Promise<void>;

    selectedWorkspace: Project | null;
    isEditDialogOpen: boolean;
    openEditDialog: (workspaceId: string) => void;
    closeEditDialog: () => void;
    updateWorkspace: (request: UpdateWorkspaceRequest) => Promise<void>;

    handleCreateLinkInvitationToWorkspace: (request: CreateLinkInvitationToWorkspaceRequest) => Promise<CreateLinkInvitationToWorkspaceResponse>;
    handleDisableLinkInvitationToWorkspace: (request: DisableLinkInvitationToWorkspaceRequest) => Promise<void>;
    getWorkspaceLinkInvitation: (workspaceId: string) => WorkspaceLinkInvitationState;
    setWorkspaceLinkInvitation: (workspaceId: string, patch: Partial<WorkspaceLinkInvitationState>) => void;
    fetchCurrentLinkInvitationToWorkspace: (workspaceId: string) => Promise<GetCurrentLinkInvitationToWorkspaceResponse | null>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedWorkspace, setSelectedWorkspace] = useState<Project | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    

    const [workspaceLinkInvitations, setWorkspaceLinkInvitations] = useState<Record<string, WorkspaceLinkInvitationState>>({});

    const getAllProjectsOfUser = async () => {
        setIsLoading(true);
        try {
            const response = await projectApi.getAllProjectsOfUser();
            console.log(`getAllProjectsOfUser: ${JSON.stringify(response)}`);
            if (response) {
                setProjects(response);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearWorkspaces = () => {
        setProjects([]);
    }

    // Fetch projects khi mount
    useEffect(() => {
        getAllProjectsOfUser();
    }, []);

    // fetch all member of workspace but not in workspace
    const fetchAllMemberOfWorkspaceButNotInWorkspace = async (workspaceId: string): Promise<GetAllMemberOfWorkspaceButNotInWorkspaceResponse[]> => {
        try {
            const data = await projectApi.getAllMemberOfWorkspaceButNotInWorkspace(workspaceId);
            return data as unknown as GetAllMemberOfWorkspaceButNotInWorkspaceResponse[];
        } catch (err) {
            console.error(`Failed to fetch all member of workspace but not in workspace: ${err}`);
            throw err;
        }
    }

    // create workspace
    const createWorkspace = async (request: CreateWorkspaceRequest) => {
        try {
            const data = await projectApi.createWorkspace(request) as CreateWorkspaceResponse;
            return data;
        } catch (err) {
            console.error(`Failed to create workspace: ${err}`);
            throw err;
        }
    }

    // invite member to workspace
    const handleInviteMemberToWorkspace = async (request: InviteMemberToWorkspaceRequest) => {
        setIsLoading(true);
        try {
            await projectApi.inviteMemberToWorkspace(request);
        } catch (err) {
            console.error(`Failed to invite member to workspace: ${err}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    // archive workspace
    const handleToggleArchiveWorkspace = async (request: ArchiveWorkspaceRequest) => {
        try {
            await projectApi.archiveWorkspace(request);
            setProjects(prev => 
                prev.map(p => 
                    p.id === request.workspaceId 
                        ? { ...p, archive: !p.archive }
                        : p
                )
            );
        } catch (err) {
            console.error(`Failed to archive workspace: ${err}`);
            throw err;
        }
    }

    // open edit dialog
    const openEditDialog = (workspaceId: string) => {
        const workspace = projects.find(p => p.id === workspaceId);
        if (!workspace) return;
        setSelectedWorkspace(workspace);
        setIsEditDialogOpen(true);
    }

    // close edit dialog
    const closeEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedWorkspace(null);
    }

    // update workspace
    const updateWorkspace = async (request: UpdateWorkspaceRequest) => {
        try {
            await projectApi.updateWorkspace(request);

            setProjects(prev => 
                prev.map(p => 
                    p.id === request.workspaceId
                    ? {
                        ...p,
                        name: request.name ?? p.name,
                        description: request.description ?? p.description,
                    }
                    : p
                )
            )
            closeEditDialog();
        } catch (err) {
            console.error(`Failed to update workspace: ${err}`);
            throw err;
        }
    }

    const getWorkspaceLinkInvitation = (workspaceId: string): WorkspaceLinkInvitationState => 
        workspaceLinkInvitations[workspaceId] ?? {
            linkInvitation: '',
            tokenInvitation: '',
            isCreatingLinkInvitation: false,
        };

    const setWorkspaceLinkInvitation = (
        workspaceId: string,
        patch: Partial<WorkspaceLinkInvitationState>
      ) => {
        setWorkspaceLinkInvitations(prev => ({
          ...prev,
          [workspaceId]: {
            ...prev[workspaceId],
            ...patch,
          },
        }));
      };
    // create link invitation to workspace
    const handleCreateLinkInvitationToWorkspace = async (request: CreateLinkInvitationToWorkspaceRequest): Promise<CreateLinkInvitationToWorkspaceResponse> => {
        try {
            const data = await projectApi.createLinkInvitationToWorkspace(request);
            if (!data) throw new Error("Failed to create link invitation to workspace");
            return data;
        } catch (err) {
            console.error(`Failed to create link invitation to workspace: ${err}`);
            throw err;
        }
    }

    // disable link invitation to workspace
    const handleDisableLinkInvitationToWorkspace = async (request: DisableLinkInvitationToWorkspaceRequest): Promise<void> => {
        try {
            await projectApi.disableLinkInvitationToWorkspace(request);
        } catch (err) {
            console.error(`Failed to disable link invitation to workspace: ${err}`);
            throw err;
        }
    }

    // get current link invitation to workspace
    const fetchCurrentLinkInvitationToWorkspace = async (workspaceId: string): Promise<GetCurrentLinkInvitationToWorkspaceResponse | null> => {
        try {
            const res = await projectApi.getCurrentLinkInvitationToWorkspace(workspaceId);
            if (!res?.exists) {
                setWorkspaceLinkInvitation(workspaceId, {
                    linkInvitation: "",
                    tokenInvitation: "",
                    isCreatingLinkInvitation: false,
                });
                return null;
            }

            const state: WorkspaceLinkInvitationState = {
                linkInvitation: res.inviteUrl ?? "",
                tokenInvitation: res.token ?? "",
                isCreatingLinkInvitation: true,
            }
            setWorkspaceLinkInvitation(workspaceId, state);
            return {
                exists: true,
                inviteUrl: state.linkInvitation,
                token: state.tokenInvitation,
                createdAt: res.createdAt ?? "",
            };
        } catch (err: any) {
            if (err?.statusCode === 404) {
              setWorkspaceLinkInvitation(workspaceId, {
                linkInvitation: "",
                tokenInvitation: "",
                isCreatingLinkInvitation: false,
              });
              return {
                exists: false,
                inviteUrl: undefined,
                token: undefined,
                createdAt: undefined,
              };
            }
            console.error(`Failed to get current link invitation to workspace: ${err}`);
            throw err;
          }
    }
    const value: WorkspaceContextType = {
        projects,
        isLoading,
        getAllProjectsOfUser,
        clearWorkspaces,
        fetchAllMemberOfWorkspaceButNotInWorkspace,
        handleInviteMemberToWorkspace,
        handleToggleArchiveWorkspace,
        createWorkspace,
        selectedWorkspace,
        isEditDialogOpen,
        openEditDialog,
        closeEditDialog,
        updateWorkspace,
        handleCreateLinkInvitationToWorkspace,
        handleDisableLinkInvitationToWorkspace,
        getWorkspaceLinkInvitation,
        setWorkspaceLinkInvitation,
        fetchCurrentLinkInvitationToWorkspace,
    }

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspaceContext() {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
    }
    return context;
}