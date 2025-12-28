import { fetchFactory } from "@/shared/api";
import { ProjectEndpoint } from "@/shared/api/endpoints";
import type {
  CreateWorkspaceRequest,
  CreateWorkspaceResponse,
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
};
