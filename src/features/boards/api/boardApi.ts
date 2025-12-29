import { BoardEndpoint } from "@/shared/api/endpoints";
import type {
  AddBoardToWorkspaceRequest,
  AddBoardToWorkspaceResponse,
  Board,
  DeleteBoardRequest,
  EditBoardRequest,
} from "./type";
import { fetchFactory } from "@/shared/api";

export const boardApi = {
  getAllBoardsOfWorkspace: (workspaceId: string): Promise<Board[]> => {
    return fetchFactory.get<Board[]>(
      `${BoardEndpoint.GET_BOARD_OF_WORKSPACE}?workspace_id=${workspaceId}`,
    );
  },

  addBoardToWorkspace: (
    request: AddBoardToWorkspaceRequest,
  ): Promise<AddBoardToWorkspaceResponse> => {
    return fetchFactory.post<AddBoardToWorkspaceResponse>(
      BoardEndpoint.ADD_BOARD_TO_WORKSPACE,
      request,
    );
  },

  deleteBoard: (request: DeleteBoardRequest): Promise<void> => {
    return fetchFactory.delete<void>(
      BoardEndpoint.DELETE_BOARD_FROM_WORKSPACE.replace(
        "{boardId}",
        request.boardId,
      ),
    );
  },

  editBoard: (request: EditBoardRequest): Promise<void> => {
    const { boardId, ...body } = request;
    return fetchFactory.patch<void>(
      BoardEndpoint.EDIT_BOARD_IN_WORKSPACE.replace("{boardId}", boardId),
      body,
    );
  },
};
