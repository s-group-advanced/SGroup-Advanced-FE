import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  CreateBoardFromTemplateRequest,
  CreateBoardFromTemplateResponse,
  GetAllBoardTemplatesResponse,
} from "../api/type";
import { boardTemplateApi } from "../api/boardTemplateApi";

export const useBoardTemplates = () => {
  // get all board templates
  const getAllBoardTemplates =
    async (): Promise<GetAllBoardTemplatesResponse> => {
      try {
        const data = await boardTemplateApi.getAllBoardTemplates();
        if (!data) throw new Error("Failed to get all board templates");
        return data;
      } catch (err) {
        const apiError = err as ApiError;
        throw apiError;
      }
    };

  // create board template
  const createBoardTemplate = async (
    request: CreateBoardFromTemplateRequest,
  ): Promise<CreateBoardFromTemplateResponse> => {
    try {
      const data = await boardTemplateApi.createBoardTemplate(request);
      if (!data) throw new Error("Failed to create board template");
      return { board: data as any };
    } catch (err) {
      const apiError = err as ApiError;
      throw apiError;
    }
  };

  return {
    getAllBoardTemplates,
    createBoardTemplate,
  };
};
