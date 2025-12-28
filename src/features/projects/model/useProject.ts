import type { ApiError } from "@/features/auth/login/api/type";
import { projectApi } from "../api/projectApi";
import type { CreateWorkspaceRequest } from "../api/type";

export const useProject = () => {
  const getAllProjectsOfUser = async () => {
    try {
      const response = await projectApi.getAllProjectsOfUser();
      if (!response) throw new Error("Failed to get all projects of user");
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
  return {
    getAllProjectsOfUser,
    createWorkspace,
  };
};
