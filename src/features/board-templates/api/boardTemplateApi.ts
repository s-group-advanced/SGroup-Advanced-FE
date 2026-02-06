import { fetchFactory } from "@/shared/api";
import type {
  ApiResponse,
  CreateBoardFromTemplateRequest,
  CreateBoardFromTemplateResponse,
  GetAllBoardTemplatesResponse,
} from "./type";
import { BoardEndpoint, BoardTemplateEndpoint } from "@/shared/api/endpoints";

export const boardTemplateApi = {
  getAllBoardTemplates: async (): Promise<GetAllBoardTemplatesResponse> => {
    const response = await fetchFactory.get<
      ApiResponse<GetAllBoardTemplatesResponse>
    >(BoardTemplateEndpoint.GET_ALL_BOARD_TEMPLATES);
    const boards = Array.isArray(response.data) ? response.data : [];
    return {
      boards,
      lists: [],
      cards: [],
    };
  },

  // create board template
  createBoardTemplate: async (
    request: CreateBoardFromTemplateRequest,
  ): Promise<CreateBoardFromTemplateResponse> => {
    return await fetchFactory.post<CreateBoardFromTemplateResponse>(
      BoardEndpoint.CREATE_BOARD_FROM_TEMPLATE,
      request,
    );
  },
};
