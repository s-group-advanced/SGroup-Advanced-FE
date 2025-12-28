import type { ApiError } from "@/shared/api/fetchFactory";
import { boardApi } from "../api/boardApi";
import type {
  AddBoardToWorkspaceResponse,
  AddBoardToWorkspaceRequest,
  Board,
} from "../api/type";

export const useBoards = () => {
  // Lấy tất cả board của workspace
  const getAllBoardsOfWorkspace = async (
    workspaceId: string,
  ): Promise<Board[]> => {
    try {
      const data = await boardApi.getAllBoardsOfWorkspace(workspaceId);
      if (!data) throw new Error("Failed to get all boards of workspace");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message);
      return [];
    }
  };

  // thêm board vào workspace
  const addBoardToWorkspace = async (
    request: AddBoardToWorkspaceRequest,
  ): Promise<AddBoardToWorkspaceResponse> => {
    try {
      const data = await boardApi.addBoardToWorkspace(request);
      if (!data) throw new Error("Failed to add board to workspace");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to add board to workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllBoardsOfWorkspace,
    addBoardToWorkspace,
  };
};
