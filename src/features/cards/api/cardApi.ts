import { fetchFactory } from "@/shared/api";
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
} from "./type";
import { CardEndpoint } from "@/shared/api/endpoints";

export const cardApi = {
  getAllCardsOfBoard: (
    request: GetAllCardsOfBoardRequest,
  ): Promise<GetAllCardsOfBoardResponse> => {
    return fetchFactory.get<GetAllCardsOfBoardResponse>(
      CardEndpoint.GET_ALL_CARDS_OF_BOARD.replace("{boardId}", request.boardId),
    );
  },

  // create card
  createCard: (request: CreateCardRequest): Promise<CreateCardResponse> => {
    return fetchFactory.post<CreateCardResponse>(
      CardEndpoint.CREATE_CARD,
      request,
    );
  },

  // delete card (archive)
  deleteCard: (request: DeleteCardRequest): Promise<DeleteCardResponse> => {
    return fetchFactory.delete<DeleteCardResponse>(
      CardEndpoint.DELETE_CARD.replace("{cardId}", request.cardId),
    );
  },

  // update card
  updateCard: (request: UpdateCardRequest): Promise<UpdateCardResponse> => {
    const { cardId, ...body } = request;
    return fetchFactory.patch<UpdateCardResponse>(
      CardEndpoint.UPDATE_CARD.replace("{cardId}", cardId),
      body,
    );
  },

  // assign user to card
  assignUserToCard: (
    request: AssignedUserToCardRequest,
  ): Promise<AssignedUserToCardResponse> => {
    return fetchFactory.post<AssignedUserToCardResponse>(
      CardEndpoint.ASSIGN_USER_TO_CARD.replace("{cardId}", request.cardId),
      { user_id: request.user_id },
    );
  },

  // unassign user from card
  unassignUserFromCard: (
    request: UnassignUserFromCardRequest,
  ): Promise<void> => {
    return fetchFactory.delete<void>(
      CardEndpoint.UNASSIGN_USER_FROM_CARD.replace(
        "{cardId}",
        request.cardId,
      ).replace("{userId}", request.userId),
    );
  },

  // create comment on card
  createCommentOnCard: (
    request: CreateCommentOnCardRequest,
  ): Promise<CreateCommentOnCardResponse> => {
    const { cardId, ...body } = request;
    return fetchFactory.post<CreateCommentOnCardResponse>(
      CardEndpoint.CREATE_COMMENT_ON_CARD.replace("{cardId}", cardId),
      body,
    );
  },

  // get all comments of card
  getAllCommentsOfCard: (
    request: GetAllCommentsOfCardRequest,
  ): Promise<GetAllCommentsOfCardResponse> => {
    return fetchFactory.get<GetAllCommentsOfCardResponse>(
      CardEndpoint.GET_ALL_COMMENTS_OF_CARD.replace("{cardId}", request.cardId),
    );
  },

  // update comment on card
  updateCommentOnCard: (
    request: UpdateCommentOnCardRequest,
  ): Promise<UpdateCommentOnCardResponse> => {
    const { cardId, commentId, ...body } = request;
    return fetchFactory.patch<UpdateCommentOnCardResponse>(
      CardEndpoint.UPDATE_COMMENT_ON_CARD.replace("{cardId}", cardId).replace(
        "{commentId}",
        commentId.toString(),
      ),
      body,
    );
  },

  // delete comment on card
  deleteCommentOnCard: (request: DeleteCommentOnCardRequest): Promise<void> => {
    const { cardId, commentId } = request;
    return fetchFactory.delete<void>(
      CardEndpoint.DELETE_COMMENT_ON_CARD.replace("{cardId}", cardId).replace(
        "{commentId}",
        commentId.toString(),
      ),
    );
  },

  // move card to list
  moveCardToList: (request: MoveCardToListRequest) => {
    const { cardId, ...body } = request;
    return fetchFactory.patch<void>(
      CardEndpoint.MOVE_CARD_TO_LIST.replace("{cardId}", cardId),
      body,
    );
  },

  // update due date of card
  updateDueDateOfCard: (
    request: UpdateDueDateOfCardRequest,
  ): Promise<UpdateDueDateOfCardResponse> => {
    const { cardId, ...body } = request;
    return fetchFactory.patch<UpdateDueDateOfCardResponse>(
      CardEndpoint.UPDATE_DUE_DATE_OF_CARD.replace("{cardId}", cardId),
      body,
    );
  },

  // toggle template card
  toggleTemplateCard: (
    request: ToggleTemplateCardRequest,
  ): Promise<ToggleTemplateCardResponse> => {
    const { cardId } = request;
    return fetchFactory.patch<ToggleTemplateCardResponse>(
      CardEndpoint.TOGGLE_TEMPLATE_CARD.replace("{cardId}", cardId),
    );
  },

  // get all templates of board
  getAllTemplatesOfBoard: (
    request: GetAllTemplatesOfBoardRequest,
  ): Promise<GetAllTemplatesOfBoardResponse> => {
    return fetchFactory.get<GetAllTemplatesOfBoardResponse>(
      CardEndpoint.GET_ALL_TEMPLATES_OF_BOARD.replace(
        "{boardId}",
        request.boardId,
      ),
    );
  },

  // create card from template
  createCardFromTemplate: (
    request: CreateCardFromTemplateRequest,
  ): Promise<CreateCardFromTemplateResponse> => {
    const { templateCardId, ...body } = request;
    return fetchFactory.post<CreateCardFromTemplateResponse>(
      CardEndpoint.CREATE_CARD_FROM_TEMPLATE.replace(
        "{templateCardId}",
        templateCardId,
      ),
      body,
    );
  },

  // create new card template
  createNewCardTemplate: (
    request: CreateNewCardTemplateRequest,
  ): Promise<CreateNewCardTemplateResponse> => {
    return fetchFactory.post<CreateNewCardTemplateResponse>(
      CardEndpoint.CREATE_NEW_CARD_TEMPLATE,
      request,
    );
  },
};
