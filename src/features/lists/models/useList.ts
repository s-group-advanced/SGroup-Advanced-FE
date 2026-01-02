import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  GetAllListofBoardRequest,
  GetAllListofBoardResponse,
} from "../api/type";
import { listApi } from "../api/listApi";

export const useLists = () => {
  // get all lists of board
  const getAllListsOfBoard = async (
    request: GetAllListofBoardRequest,
  ): Promise<GetAllListofBoardResponse> => {
    try {
      const data = await listApi.getAllListOfBoard(request);
      if (!data) throw new Error("Failed to get all lists of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all lists of board: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllListsOfBoard,
  };
};
