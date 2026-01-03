import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  CreateCardRequest,
  CreateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
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

  // create card
  const createCard = async (
    request: CreateCardRequest,
  ): Promise<CreateCardResponse> => {
    try {
      const data = await cardApi.createCard(request);
      if (!data) throw new Error("Failed to create card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create card: ${apiError.message}`);
      throw apiError;
    }
  };

  // delete card (archive)
  const deleteCard = async (
    request: DeleteCardRequest,
  ): Promise<DeleteCardResponse> => {
    try {
      const data = await cardApi.deleteCard(request);
      if (!data) throw new Error("Failed to delete card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to delete card: ${apiError.message}`);
      throw apiError;
    }
  };

  // update card
  const updateCard = async (
    request: UpdateCardRequest,
  ): Promise<UpdateCardResponse> => {
    try {
      const data = await cardApi.updateCard(request);
      if (!data) throw new Error("Failed to update card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to update card: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllCardsOfBoard,
    createCard,
    deleteCard,
    updateCard,
  };
};
