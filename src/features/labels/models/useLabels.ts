import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  AddLabelOnBoardRequest,
  AddLabelToCardRequest,
  GetAllLabelsOfBoardRequest,
  GetAllLabelsOfBoardResponse,
  GetAvailableLabelsOfBoardRequest,
  GetAvailableLabelsOfBoardResponse,
  GetLabelsOfCardRequest,
  GetLabelsOfCardResponse,
  RemoveLabelFromCardRequest,
} from "../api/type";
import { labelApi } from "../api/labelApi";

export const useLabels = () => {
  // add label on board
  const addLabelOnBoard = async (
    request: AddLabelOnBoardRequest,
  ): Promise<void> => {
    try {
      await labelApi.addLabelOnBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to add label on board: ${apiError.message}`);
      throw apiError;
    }
  };

  // add label to card
  const addLabelToCard = async (
    request: AddLabelToCardRequest,
  ): Promise<void> => {
    try {
      await labelApi.addLabelToCard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to add label to card: ${apiError.message}`);
      throw apiError;
    }
  };

  // get all labels of board
  const getAllLabelsOfBoard = async (
    request: GetAllLabelsOfBoardRequest,
  ): Promise<GetAllLabelsOfBoardResponse> => {
    try {
      const data = await labelApi.getAllLabelsOfBoard(request);
      if (!data) throw new Error("Failed to get all labels of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all labels of board: ${apiError.message}`);
      throw apiError;
    }
  };

  // get labels of card
  const getLabelsOfCard = async (
    request: GetLabelsOfCardRequest,
  ): Promise<GetLabelsOfCardResponse> => {
    try {
      const data = await labelApi.getLabelsOfCard(request);
      if (!data) throw new Error("Failed to get labels of card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get labels of card: ${apiError.message}`);
      throw apiError;
    }
  };

  // get available labels of board
  const getAvailableLabelsOfBoard = async (
    request: GetAvailableLabelsOfBoardRequest,
  ): Promise<GetAvailableLabelsOfBoardResponse> => {
    try {
      const data = await labelApi.getAvailableLabelsOfBoard(request);
      if (!data) throw new Error("Failed to get available labels of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to get available labels of board: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // remove label from card
  const removeLabelFromCard = async (
    request: RemoveLabelFromCardRequest,
  ): Promise<void> => {
    try {
      await labelApi.removeLabelFromCard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to remove label from card: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    addLabelOnBoard,
    addLabelToCard,
    getAllLabelsOfBoard,
    getLabelsOfCard,
    getAvailableLabelsOfBoard,
    removeLabelFromCard,
  };
};
