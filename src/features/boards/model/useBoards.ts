import type { ApiError } from "@/shared/api/fetchFactory";
import { boardApi } from "../api/boardApi";
import type {
  AddBoardToWorkspaceResponse,
  AddBoardToWorkspaceRequest,
  Board,
  DeleteBoardRequest,
  EditBoardRequest,
  GetBoardByIdRequest,
  GetBoardByIdResponse,
  GetAllMemberOfWorkspaceButNotInBoardRequest,
  GetAllMemberOfWorkspaceButNotInBoardResponse,
  InviteUserToBoardRequest,
  InviteUserToBoardResponse,
  AcceptInvitationToBoardRequest,
  AcceptInvitationToBoardResponse,
  GetAllMemberOfBoardRequest,
  GetAllMemberOfBoardResponse,
} from "../api/type";

export const useBoards = () => {
  // Lấy tất cả board của workspace
  const getAllBoardsOfWorkspace = async (
    workspaceId: string,
  ): Promise<Board[]> => {
    try {
      const data = await boardApi.getAllBoardsOfWorkspace(workspaceId);
      if (!data) throw new Error("Failed to get all boards of workspace");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message);
      return [];
    }
  };

  // thêm board vào workspace
  const addBoardToWorkspace = async (
    request: AddBoardToWorkspaceRequest,
  ): Promise<AddBoardToWorkspaceResponse> => {
    try {
      const data = await boardApi.addBoardToWorkspace(request);
      if (!data) throw new Error("Failed to add board to workspace");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to add board to workspace: ${apiError.message}`);
      throw apiError;
    }
  };

  // delete permanent board
  const deleteBoardToWorkspace = async (
    request: DeleteBoardRequest,
  ): Promise<void> => {
    try {
      await boardApi.deleteBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to delete board: ${apiError.message}`);
      throw apiError;
    }
  };

  // edit board
  const editBoardToWorkspace = async (
    request: EditBoardRequest,
  ): Promise<void> => {
    try {
      await boardApi.editBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to edit board: ${apiError.message}`);
      throw apiError;
    }
  };

  // get board by id
  const getBoardById = async (
    request: GetBoardByIdRequest,
  ): Promise<GetBoardByIdResponse> => {
    try {
      const data = await boardApi.getBoardById(request);
      if (!data) throw new Error("Failed to get board by id");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get board by id: ${apiError.message}`);
      throw apiError;
    }
  };

  // get all member of workspace but not in board
  const getAllMemberOfWorkspaceButNotInBoard = async (
    request: GetAllMemberOfWorkspaceButNotInBoardRequest,
  ): Promise<GetAllMemberOfWorkspaceButNotInBoardResponse> => {
    try {
      const data = await boardApi.getAllMemberOfWorkspaceButNotInBoard(request);
      if (!data)
        throw new Error(
          "Failed to get all member of workspace but not in board",
        );
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to get all member of workspace but not in board: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // invite user to board
  const inviteUserToBoard = async (
    request: InviteUserToBoardRequest,
  ): Promise<InviteUserToBoardResponse> => {
    try {
      const data = await boardApi.inviteUserToBoard(request);
      if (!data) throw new Error("Failed to invite user to board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to invite user to board: ${apiError.message}`);
      throw apiError;
    }
  };

  // accept invitation to board
  const acceptInvitationToBoard = async (
    request: AcceptInvitationToBoardRequest,
  ): Promise<AcceptInvitationToBoardResponse> => {
    try {
      const data = await boardApi.acceptInvitationToBoard(request);
      if (!data) throw new Error("Failed to accept invitation to board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to accept invitation to board: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // get all member of board
  const getAllMemberOfBoard = async (
    request: GetAllMemberOfBoardRequest,
  ): Promise<GetAllMemberOfBoardResponse> => {
    try {
      const data = await boardApi.getAllMemberOfBoard(request);
      if (!data) throw new Error("Failed to get all member of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all member of board: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllBoardsOfWorkspace,
    addBoardToWorkspace,
    deleteBoardToWorkspace,
    editBoardToWorkspace,
    getBoardById,
    getAllMemberOfWorkspaceButNotInBoard,
    inviteUserToBoard,
    acceptInvitationToBoard,
    getAllMemberOfBoard,
  };
};
