import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  AssignedUserToCardRequest,
  AssignedUserToCardResponse,
  CreateCardRequest,
  CreateCardResponse,
  CreateCommentOnCardRequest,
  CreateCommentOnCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
  GetAllCommentsOfCardRequest,
  GetAllCommentsOfCardResponse,
  MoveCardToListRequest,
  UnassignUserFromCardRequest,
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

  // assign user to card
  const assignUserToCard = async (
    request: AssignedUserToCardRequest,
  ): Promise<AssignedUserToCardResponse> => {
    try {
      const data = await cardApi.assignUserToCard(request);
      if (!data) throw new Error("Failed to assign user to card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to assign user to card: ${apiError.message}`);
      throw apiError;
    }
  };

  // unassign user from card
  const unassignUserFromCard = async (
    request: UnassignUserFromCardRequest,
  ): Promise<void> => {
    try {
      await cardApi.unassignUserFromCard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to unassign user from card: ${apiError.message}`);
      throw apiError;
    }
  };

  // create comment on card
  const createCommentOnCard = async (
    request: CreateCommentOnCardRequest,
  ): Promise<CreateCommentOnCardResponse> => {
    try {
      const data = await cardApi.createCommentOnCard(request);
      if (!data) throw new Error("Failed to create comment on card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create comment on card: ${apiError.message}`);
      throw apiError;
    }
  };

  // get all comments of card
  const getAllCommentsOfCard = async (
    request: GetAllCommentsOfCardRequest,
  ): Promise<GetAllCommentsOfCardResponse> => {
    try {
      const data = await cardApi.getAllCommentsOfCard(request);
      if (!data) throw new Error("Failed to get all comments of card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all comments of card: ${apiError.message}`);
      throw apiError;
    }
  };

  // move card to list
  const moveCardToList = async (request: MoveCardToListRequest) => {
    try {
      await cardApi.moveCardToList(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to move card to list: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllCardsOfBoard,
    createCard,
    deleteCard,
    updateCard,
    assignUserToCard,
    unassignUserFromCard,
    createCommentOnCard,
    getAllCommentsOfCard,
    moveCardToList,
  };
};
