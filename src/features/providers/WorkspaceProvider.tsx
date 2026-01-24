// src/features/projects/model/ProjectProvider.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { projectApi } from "../projects/api/projectApi";
import type { InviteMemberToWorkspaceRequest, Project } from "../projects/api/type";
import type { GetAllMemberOfWorkspaceButNotInWorkspaceResponse } from "../projects/index";

interface WorkspaceContextType {
    projects: Project[];
    isLoading: boolean;
    getAllProjectsOfUser: () => Promise<void>;
    clearWorkspaces: () => void;
    fetchAllMemberOfWorkspaceButNotInWorkspace: (workspaceId: string) => Promise<GetAllMemberOfWorkspaceButNotInWorkspaceResponse[]>;
    handleInviteMemberToWorkspace: (request: InviteMemberToWorkspaceRequest) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllProjectsOfUser = async () => {
        setIsLoading(true);
        try {
            const response = await projectApi.getAllProjectsOfUser();
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

    const value: WorkspaceContextType = {
        projects,
        isLoading,
        getAllProjectsOfUser,
        clearWorkspaces,
        fetchAllMemberOfWorkspaceButNotInWorkspace,
        handleInviteMemberToWorkspace
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