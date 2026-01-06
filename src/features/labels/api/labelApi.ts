import { fetchFactory } from "@/shared/api";
import type {
  AddLabelOnBoardRequest,
  AddLabelToBoardResponse,
  AddLabelToCardRequest,
  GetAllLabelsOfBoardRequest,
  GetAllLabelsOfBoardResponse,
  GetAvailableLabelsOfBoardRequest,
  GetAvailableLabelsOfBoardResponse,
  GetLabelsOfCardRequest,
  GetLabelsOfCardResponse,
  RemoveLabelFromCardRequest,
} from "./type";
import { BoardEndpoint, CardEndpoint } from "@/shared/api/endpoints";

export const labelApi = {
  // add label on board
  addLabelOnBoard: (
    request: AddLabelOnBoardRequest,
  ): Promise<AddLabelToBoardResponse> => {
    const { boardId, ...body } = request;
    return fetchFactory.post<AddLabelToBoardResponse>(
      BoardEndpoint.CREATE_LABEL_ON_BOARD.replace("{boardId}", boardId),
      body,
    );
  },

  // add label to card
  addLabelToCard: (request: AddLabelToCardRequest): Promise<void> => {
    const { cardId, ...body } = request;
    return fetchFactory.post<void>(
      CardEndpoint.ADD_LABEL_TO_CARD.replace("{cardId}", cardId),
      body,
    );
  },

  // get all labels of board
  getAllLabelsOfBoard: (
    request: GetAllLabelsOfBoardRequest,
  ): Promise<GetAllLabelsOfBoardResponse> => {
    return fetchFactory.get<GetAllLabelsOfBoardResponse>(
      BoardEndpoint.GET_ALL_LABELS_OF_BOARD.replace(
        "{boardId}",
        request.boardId,
      ),
    );
  },

  // get labels of card
  getLabelsOfCard: (
    request: GetLabelsOfCardRequest,
  ): Promise<GetLabelsOfCardResponse> => {
    return fetchFactory.get<GetLabelsOfCardResponse>(
      CardEndpoint.GET_LABELS_OF_CARD.replace("{cardId}", request.cardId),
    );
  },

  // get available labels of board
  getAvailableLabelsOfBoard: (
    request: GetAvailableLabelsOfBoardRequest,
  ): Promise<GetAvailableLabelsOfBoardResponse> => {
    return fetchFactory.get<GetAvailableLabelsOfBoardResponse>(
      CardEndpoint.GET_AVAILABLE_LABELS_OF_BOARD.replace(
        "{cardId}",
        request.cardId,
      ),
    );
  },

  // remove label from card
  removeLabelFromCard: (request: RemoveLabelFromCardRequest): Promise<void> => {
    const { cardId, labelId } = request;
    return fetchFactory.delete<void>(
      CardEndpoint.REMOVE_LABEL_FROM_CARD.replace("{cardId}", cardId).replace(
        "{labelId}",
        labelId,
      ),
    );
  },
};
