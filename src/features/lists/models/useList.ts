import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  CopyListToBoardRequest,
  CreateListRequest,
  CreateListResponse,
  DeleteListFromBoardRequest,
  GetAllListofBoardRequest,
  GetAllListofBoardResponse,
  MoveListToAnotherBoardRequest,
  MoveListToBoardRequest,
  UpdateNameListRequest,
} from "../api/type";
import { listApi } from "../api/listApi";

export const useLists = () => {
  // get all lists of board
  const getAllListsOfBoard = async (
    request: GetAllListofBoardRequest,
  ): Promise<GetAllListofBoardResponse> => {
    try {
      const data = await listApi.getAllListOfBoard(request);
      if (!data) throw new Error("Failed to get all lists of board");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to get all lists of board: ${apiError.message}`);
      throw apiError;
    }
  };

  // create list
  const createList = async (
    request: CreateListRequest,
  ): Promise<CreateListResponse> => {
    try {
      const data = await listApi.createList(request);
      if (!data) throw new Error("Failed to create list");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create list: ${apiError.message}`);
      throw apiError;
    }
  };

  // update name list
  const updateNameList = async (request: UpdateNameListRequest) => {
    try {
      await listApi.updateNameList(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to update name list: ${apiError.message}`);
      throw apiError;
    }
  };

  // delete list from board (archive)
  const deleteListFromBoard = async (request: DeleteListFromBoardRequest) => {
    try {
      await listApi.deleteListFromBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to delete list from board: ${apiError.message}`);
      throw apiError;
    }
  };

  // move list to board
  const moveListToBoard = async (request: MoveListToBoardRequest) => {
    try {
      await listApi.moveListToBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to move list to board: ${apiError.message}`);
      throw apiError;
    }
  };

  // move list to another board
  const moveListToAnotherBoard = async (
    request: MoveListToAnotherBoardRequest,
  ) => {
    try {
      await listApi.moveListToAnotherBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to move list to another board: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // copy list to board
  const copyListToBoard = async (request: CopyListToBoardRequest) => {
    try {
      await listApi.copyListToBoard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to copy list to board: ${apiError.message}`);
      throw apiError;
    }
  };

  return {
    getAllListsOfBoard,
    createList,
    updateNameList,
    deleteListFromBoard,
    moveListToBoard,
    moveListToAnotherBoard,
    copyListToBoard,
  };
};
