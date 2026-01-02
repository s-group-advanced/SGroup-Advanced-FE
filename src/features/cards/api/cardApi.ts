import { fetchFactory } from "@/shared/api";
import type {
  GetAllCardsOfBoardRequest,
  GetAllCardsOfBoardResponse,
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
};
