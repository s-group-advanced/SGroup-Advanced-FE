import { BoardEndpoint } from "@/shared/api/endpoints";
import type {
  AcceptInvitationToBoardRequest,
  AcceptInvitationToBoardResponse,
  AddBoardToWorkspaceRequest,
  AddBoardToWorkspaceResponse,
  Board,
  DeleteBoardRequest,
  EditBoardRequest,
  GetAllMemberOfBoardRequest,
  GetAllMemberOfBoardResponse,
  GetAllMemberOfWorkspaceButNotInBoardRequest,
  GetAllMemberOfWorkspaceButNotInBoardResponse,
  GetBoardByIdRequest,
  GetBoardByIdResponse,
  InviteUserToBoardRequest,
  InviteUserToBoardResponse,
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

  getBoardById: (
    request: GetBoardByIdRequest,
  ): Promise<GetBoardByIdResponse> => {
    return fetchFactory.get<GetBoardByIdResponse>(
      BoardEndpoint.GET_BOARD_BY_ID.replace("{boardId}", request.boardId),
    );
  },

  // get all member of workspace but not in board
  getAllMemberOfWorkspaceButNotInBoard: (
    request: GetAllMemberOfWorkspaceButNotInBoardRequest,
  ): Promise<GetAllMemberOfWorkspaceButNotInBoardResponse> => {
    return fetchFactory.get<GetAllMemberOfWorkspaceButNotInBoardResponse>(
      BoardEndpoint.GET_ALL_MEMBER_OF_WORKSPACE_BUT_NOT_IN_BOARD.replace(
        "{boardId}",
        request.boardId,
      ),
    );
  },

  // invite user to board
  inviteUserToBoard: (
    request: InviteUserToBoardRequest,
  ): Promise<InviteUserToBoardResponse> => {
    return fetchFactory.post<InviteUserToBoardResponse>(
      BoardEndpoint.INVITE_USER_TO_BOARD.replace("{boardId}", request.boardId),
      {
        invited_email: request.invited_email,
      },
    );
  },

  // accept invitation to board
  acceptInvitationToBoard: (
    request: AcceptInvitationToBoardRequest,
  ): Promise<AcceptInvitationToBoardResponse> => {
    return fetchFactory.post<AcceptInvitationToBoardResponse>(
      BoardEndpoint.ACCEPT_INVITATION_TO_BOARD.replace(
        "{token}",
        request.token,
      ),
      {},
    );
  },

  // get all member of board
  getAllMemberOfBoard: (
    request: GetAllMemberOfBoardRequest,
  ): Promise<GetAllMemberOfBoardResponse> => {
    return fetchFactory.get<GetAllMemberOfBoardResponse>(
      BoardEndpoint.GET_ALL_MEMBER_OF_BOARD.replace(
        "{boardId}",
        request.boardId,
      ),
    );
  },
};
