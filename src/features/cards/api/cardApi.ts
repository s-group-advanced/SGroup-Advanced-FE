import { fetchFactory } from "@/shared/api";
import type {
  AssignedUserToCardRequest,
  AssignedUserToCardResponse,
  CreateCardRequest,
  CreateCardResponse,
  CreateCommentOnCardRequest,
  CreateCommentOnCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  DeleteCommentOnCardRequest,
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
  GetAllCommentsOfCardRequest,
  GetAllCommentsOfCardResponse,
  MoveCardToListRequest,
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
};
