import { fetchFactory } from "@/shared/api";
import type {
  CreateCardRequest,
  CreateCardResponse,
  DeleteCardRequest,
  DeleteCardResponse,
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
  UpdateCardRequest,
  UpdateCardResponse,
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
};
