import { BoardEndpoint } from "@/shared/api/endpoints";
import type {
  AddBoardToWorkspaceRequest,
  AddBoardToWorkspaceResponse,
  Board,
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
};
