import type { ApiError } from "@/features/auth/login/api/type";
import { projectApi } from "../api/projectApi";
import type {
  ArchiveWorkspaceRequest,
  CreateLinkInvitationToWorkspaceRequest,
  CreateLinkInvitationToWorkspaceResponse,
  CreateWorkspaceRequest,
  DisableLinkInvitationToWorkspaceRequest,
  GetCurrentLinkInvitationToWorkspaceResponse,
  InviteMemberToWorkspaceRequest,
  Project,
  UpdateWorkspaceRequest,
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

  // update workspace
  const updateWorkspace = async (request: UpdateWorkspaceRequest) => {
    try {
      await projectApi.updateWorkspace(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.log(`Failed to update workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  // create link invitation to workspace
  const createLinkInvitationToWorkspace = async (
    request: CreateLinkInvitationToWorkspaceRequest,
  ): Promise<CreateLinkInvitationToWorkspaceResponse> => {
    try {
      const response =
        await projectApi.createLinkInvitationToWorkspace(request);
      if (!response)
        throw new Error("Failed to create link invitation to workspace");
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      console.log(
        `Failed to create link invitation to workspace: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // disable link invitation to workspace
  const disableLinkInvitationToWorkspace = async (
    request: DisableLinkInvitationToWorkspaceRequest,
  ): Promise<void> => {
    try {
      await projectApi.disableLinkInvitationToWorkspace(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.log(
        `Failed to disable link invitation to workspace: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // get current link invitation to workspace
  const getCurrentLinkInvitationToWorkspace = async (
    workspaceId: string,
  ): Promise<GetCurrentLinkInvitationToWorkspaceResponse> => {
    try {
      const response =
        await projectApi.getCurrentLinkInvitationToWorkspace(workspaceId);
      if (!response)
        throw new Error("Failed to get current link invitation to workspace");
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      console.log(
        `Failed to get current link invitation to workspace: ${apiError.message}`,
      );
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
    updateWorkspace,
    createLinkInvitationToWorkspace,
    disableLinkInvitationToWorkspace,
    getCurrentLinkInvitationToWorkspace,
  };
};
