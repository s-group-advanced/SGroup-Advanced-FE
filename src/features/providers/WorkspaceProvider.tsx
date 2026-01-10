// src/features/projects/model/ProjectProvider.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { projectApi } from "../projects/api/projectApi";
import type { Project } from "../projects/api/type";

interface WorkspaceContextType {
    projects: Project[];
    isLoading: boolean;
    getAllProjectsOfUser: () => Promise<void>;
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

    // Fetch projects khi mount
    useEffect(() => {
        getAllProjectsOfUser();
    }, []);

    const value: WorkspaceContextType = {
        projects,
        isLoading,
        getAllProjectsOfUser,
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