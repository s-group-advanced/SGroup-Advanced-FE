import { ListEndpoint } from "@/shared/api/endpoints";
import type {
  CreateListRequest,
  CreateListResponse,
  DeleteListFromBoardRequest,
  GetAllListofBoardRequest,
  GetAllListofBoardResponse,
  UpdateNameListRequest,
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

  // create list
  createList: (request: CreateListRequest): Promise<CreateListResponse> => {
    const { board_id, ...body } = request;
    return fetchFactory.post<CreateListResponse>(
      ListEndpoint.CREATE_LIST.replace("{boardId}", board_id),
      body,
    );
  },

  // update name list
  updateNameList: (request: UpdateNameListRequest) => {
    const { boardId, listId, ...body } = request;
    return fetchFactory.patch<void>(
      ListEndpoint.UPDATE_NAME_LIST.replace("{boardId}", boardId).replace(
        "{listId}",
        listId,
      ),
      body,
    );
  },

  // delete list from board (archive)
  deleteListFromBoard: (request: DeleteListFromBoardRequest) => {
    return fetchFactory.patch<void>(
      ListEndpoint.DELETE_LIST_FROM_BOARD.replace(
        "{boardId}",
        request.boardId,
      ).replace("{listId}", request.listId),
      { archived: true },
    );
  },
};
