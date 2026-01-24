import { fetchFactory } from "@/shared/api";
import { ProjectEndpoint } from "@/shared/api/endpoints";
import type {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
  GetAllMemberOfWorkspaceButNotInWorkspaceResponse,
  InviteMemberToWorkspaceRequest,
  Project,
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
};
