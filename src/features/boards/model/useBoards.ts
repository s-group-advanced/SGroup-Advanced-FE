import type { ApiError } from "@/shared/api/fetchFactory";
import { boardApi } from "../api/boardApi";
import type {
  AddBoardToWorkspaceResponse,
  AddBoardToWorkspaceRequest,
  Board,
  DeleteBoardRequest,
  EditBoardRequest,
  GetBoardByIdRequest,
  GetBoardByIdResponse,
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

  // delete permanent board
  const deleteBoardToWorkspace = async (
    request: DeleteBoardRequest,
  ): Promise<void> => {
    try {
      await boardApi.deleteBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to delete board: ${apiError.message}`);
      throw apiError;
    }
  };

  // edit board
  const editBoardToWorkspace = async (
    request: EditBoardRequest,
  ): Promise<void> => {
    try {
      await boardApi.editBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to edit board: ${apiError.message}`);
      throw apiError;
    }
  };

  // get board by id
  const getBoardById = async (
    request: GetBoardByIdRequest,
  ): Promise<GetBoardByIdResponse> => {
    try {
      const data = await boardApi.getBoardById(request);
      if (!data) throw new Error("Failed to get board by id");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get board by id: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllBoardsOfWorkspace,
    addBoardToWorkspace,
    deleteBoardToWorkspace,
    editBoardToWorkspace,
    getBoardById,
  };
};
