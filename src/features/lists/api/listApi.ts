import { ListEndpoint } from "@/shared/api/endpoints";
import type {
  GetAllListofBoardRequest,
  GetAllListofBoardResponse,
} from "./type";
import { fetchFactory } from "@/shared/api";

export const listApi = {
  getAllListOfBoard: (
    request: GetAllListofBoardRequest,
  ): Promise<GetAllListofBoardResponse> => {
    return fetchFactory.get<GetAllListofBoardResponse>(
      ListEndpoint.GET_ALL_LISTS_OF_BOARD.replace("{boardId}", request.boardId),
    );
  },
};
