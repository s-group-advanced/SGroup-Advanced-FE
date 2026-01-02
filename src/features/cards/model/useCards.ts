import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
} from "../api/type";
import { cardApi } from "../api/cardApi";

export const useCards = () => {
  // get all cards of board
  const getAllCardsOfBoard = async (
    request: GetAllCardsOfBoardRequest,
  ): Promise<GetAllCardsOfBoardResponse> => {
    try {
      const data = await cardApi.getAllCardsOfBoard(request);
      if (!data) throw new Error("Failed to get all cards of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all cards of board: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllCardsOfBoard,
  };
};
