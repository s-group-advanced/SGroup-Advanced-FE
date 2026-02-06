import { fetchFactory } from "@/shared/api";
import { ProjectEndpoint } from "@/shared/api/endpoints";
import type {
  ArchiveWorkspaceRequest,
  CreateLinkInvitationToWorkspaceRequest,
  CreateLinkInvitationToWorkspaceResponse,
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  DisableLinkInvitationToWorkspaceRequest,
  GetAllMemberOfWorkspaceButNotInWorkspaceResponse,
  GetCurrentLinkInvitationToWorkspaceResponse,
  InviteMemberToWorkspaceRequest,
  Project,
  UpdateWorkspaceRequest,
} from "./type";

export const projectApi = {
  getAllProjectsOfUser: (): Promise<Project[]> => {
    return fetchFactory.get<Project[]>(
      ProjectEndpoint.GET_ALL_PROJECTS_OF_WORKSPACE,
    );
  },

  // create workspace
  createWorkspace: (
    request: CreateWorkspaceRequest,
  ): Promise<CreateWorkspaceResponse> => {
    return fetchFactory.post<CreateWorkspaceResponse>(
      ProjectEndpoint.CREATE_WORKSPACE,
      request,
    );
  },

  // get all member of workspace but not in workspace
  getAllMemberOfWorkspaceButNotInWorkspace: (
    workspaceId: string,
  ): Promise<GetAllMemberOfWorkspaceButNotInWorkspaceResponse> => {
    return fetchFactory.get<GetAllMemberOfWorkspaceButNotInWorkspaceResponse>(
      ProjectEndpoint.GET_ALL_MEMBER_OF_WORKSPACE_BUT_NOT_IN_WORKSPACE.replace(
        "{workspaceId}",
        workspaceId,
      ),
    );
  },

  // invite member to workspace
  inviteMemberToWorkspace: (request: InviteMemberToWorkspaceRequest) => {
    const { workspaceId, email } = request;
    return fetchFactory.post<void>(
      ProjectEndpoint.INVITE_MEMBER_TO_WORKSPACE.replace(
        "{workspaceId}",
        workspaceId,
      ),
      {
        email,
      },
    );
  },

  // archive workspace
  archiveWorkspace: (request: ArchiveWorkspaceRequest) => {
    return fetchFactory.patch<void>(
      ProjectEndpoint.ARCHIVE_WORKSPACE.replace(
        "{workspaceId}",
        request.workspaceId,
      ),
    );
  },

  // update workspace
  updateWorkspace: (request: UpdateWorkspaceRequest) => {
    const { workspaceId, ...body } = request;
    return fetchFactory.patch<void>(
      ProjectEndpoint.UPDATE_WORKSPACE.replace("{workspaceId}", workspaceId),
      body,
    );
  },

  // create link invitation to workspace
  createLinkInvitationToWorkspace: (
    request: CreateLinkInvitationToWorkspaceRequest,
  ): Promise<CreateLinkInvitationToWorkspaceResponse> => {
    return fetchFactory.post<CreateLinkInvitationToWorkspaceResponse>(
      ProjectEndpoint.CREATE_LINK_INVITATION_TO_WORKSPACE.replace(
        "{workspaceId}",
        request.workspaceId,
      ),
    );
  },

  // disable link invitation to workspace
  disableLinkInvitationToWorkspace: (
    request: DisableLinkInvitationToWorkspaceRequest,
  ): Promise<void> => {
    return fetchFactory.delete<void>(
      ProjectEndpoint.DISABLE_LINK_INVITATION_TO_WORKSPACE.replace(
        "{workspaceId}",
        request.workspaceId,
      ).replace("{token}", request.token),
    );
  },

  // get current link invitation to workspace
  getCurrentLinkInvitationToWorkspace: (
    workspaceId: string,
  ): Promise<GetCurrentLinkInvitationToWorkspaceResponse> => {
    return fetchFactory.get<GetCurrentLinkInvitationToWorkspaceResponse>(
      ProjectEndpoint.GET_CURRENT_LINK_INVITATION_TO_WORKSPACE.replace(
        "{workspaceId}",
        workspaceId,
      ),
    );
  },
};
