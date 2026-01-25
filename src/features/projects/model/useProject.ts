import type { ApiError } from "@/features/auth/login/api/type";
import { projectApi } from "../api/projectApi";
import type {
  ArchiveWorkspaceRequest,
  CreateWorkspaceRequest,
  InviteMemberToWorkspaceRequest,
  Project,
} from "../api/type";
import { useState } from "react";

export const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  const getAllProjectsOfUser = async () => {
    try {
      const response = await projectApi.getAllProjectsOfUser();
      if (!response) throw new Error("Failed to get all projects of user");
      setProjects(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message);
      return [];
    }
  };

  // create workspace
  const createWorkspace = async (request: CreateWorkspaceRequest) => {
    try {
      const response = await projectApi.createWorkspace(request);
      if (!response) throw new Error("Failed to create workspace");
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      console.log(`Failed to create workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  // get all member of workspace but not in workspace
  const getAllMemberOfWorkspaceButNotInWorkspace = async (
    workspaceId: string,
  ) => {
    try {
      const response =
        await projectApi.getAllMemberOfWorkspaceButNotInWorkspace(workspaceId);
      if (!response)
        throw new Error(
          "Failed to get all member of workspace but not in workspace",
        );
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      console.log(
        `Failed to get all member of workspace but not in workspace: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // invite member to workspace
  const inviteMemberToWorkspace = async (
    request: InviteMemberToWorkspaceRequest,
  ) => {
    try {
      await projectApi.inviteMemberToWorkspace(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.log(`Failed to invite member to workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  // archive workspace
  const archiveWorkspace = async (request: ArchiveWorkspaceRequest) => {
    try {
      await projectApi.archiveWorkspace(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.log(`Failed to archive workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    projects,
    getAllProjectsOfUser,
    createWorkspace,
    getAllMemberOfWorkspaceButNotInWorkspace,
    inviteMemberToWorkspace,
    archiveWorkspace,
  };
};
