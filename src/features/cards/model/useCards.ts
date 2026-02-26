import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  AssignedUserToCardRequest,
  AssignedUserToCardResponse,
  CreateCardFromTemplateRequest,
  CreateCardFromTemplateResponse,
  CreateCardRequest,
  CreateCardResponse,
  CreateCommentOnCardRequest,
  CreateCommentOnCardResponse,
  CreateNewCardTemplateRequest,
  CreateNewCardTemplateResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  DeleteCommentOnCardRequest,
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
  GetAllCommentsOfCardRequest,
  GetAllCommentsOfCardResponse,
  GetAllTemplatesOfBoardRequest,
  GetAllTemplatesOfBoardResponse,
  MoveCardToListRequest,
  ToggleTemplateCardRequest,
  ToggleTemplateCardResponse,
  UnassignUserFromCardRequest,
  UpdateCardRequest,
  UpdateCardResponse,
  UpdateCommentOnCardRequest,
  UpdateCommentOnCardResponse,
  UpdateDueDateOfCardRequest,
  UpdateDueDateOfCardResponse,
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

  // update due date of card
  const updateDueDateOfCard = async (
    request: UpdateDueDateOfCardRequest,
  ): Promise<UpdateDueDateOfCardResponse> => {
    try {
      const data = await cardApi.updateDueDateOfCard(request);
      if (!data) throw new Error("Failed to update due date of card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to update due date of card: ${apiError.message}`);
      throw apiError;
    }
  };

  // update comment on card
  const updateCommentOnCard = async (
    request: UpdateCommentOnCardRequest,
  ): Promise<UpdateCommentOnCardResponse> => {
    try {
      const data = await cardApi.updateCommentOnCard(request);
      if (!data) throw new Error("Failed to update comment on card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to update comment on card: ${apiError.message}`);
      throw apiError;
    }
  };

  // delete comment on card
  const deleteCommentOnCard = async (
    request: DeleteCommentOnCardRequest,
  ): Promise<void> => {
    try {
      await cardApi.deleteCommentOnCard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to delete comment on card: ${apiError.message}`);
      throw apiError;
    }
  };

  // toggle template card
  const toggleTemplateCard = async (
    request: ToggleTemplateCardRequest,
  ): Promise<ToggleTemplateCardResponse> => {
    try {
      const data = await cardApi.toggleTemplateCard(request);
      if (!data) throw new Error("Failed to toggle template card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to toggle template card: ${apiError.message}`);
      throw apiError;
    }
  };

  // get all templates of board
  const getAllTemplatesOfBoard = async (
    request: GetAllTemplatesOfBoardRequest,
  ): Promise<GetAllTemplatesOfBoardResponse> => {
    try {
      const data = await cardApi.getAllTemplatesOfBoard(request);
      if (!data) throw new Error("Failed to get all templates of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to get all templates of board: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // create card from template
  const createCardFromTemplate = async (
    request: CreateCardFromTemplateRequest,
  ): Promise<CreateCardFromTemplateResponse> => {
    try {
      const data = await cardApi.createCardFromTemplate(request);
      if (!data) throw new Error("Failed to create card from template");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create card from template: ${apiError.message}`);
      throw apiError;
    }
  };

  // create new card template
  const createNewCardTemplate = async (
    request: CreateNewCardTemplateRequest,
  ): Promise<CreateNewCardTemplateResponse> => {
    try {
      const data = await cardApi.createNewCardTemplate(request);
      if (!data) throw new Error("Failed to create new card template");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create new card template: ${apiError.message}`);
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
    updateDueDateOfCard,
    updateCommentOnCard,
    deleteCommentOnCard,
    toggleTemplateCard,
    getAllTemplatesOfBoard,
    createCardFromTemplate,
    createNewCardTemplate,
  };
};
