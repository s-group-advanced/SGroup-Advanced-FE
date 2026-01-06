import type { ApiError } from "@/shared/api/fetchFactory";
import type {
  CreateChecklistItemOnChecklistRequest,
  CreateChecklistItemOnChecklistResponse,
  CreateChecklistOnCardRequest,
  CreateChecklistOnCardResponse,
  GetAllChecklistOfCardRequest,
  GetAllChecklistOfCardResponse,
  GetChecklistItemsOfChecklistRequest,
  GetChecklistItemsOfChecklistResponse,
  RemoveChecklistFromCardRequest,
  RemoveChecklistItemOnChecklistRequest,
  UpdateChecklistItemOnChecklistRequest,
  UpdateChecklistItemOnChecklistResponse,
} from "../api/type";
import { checklistApi } from "../api/checklistApi";

export const useChecklist = () => {
  // get all checklists of card
  const getAllChecklistOfCard = async (
    request: GetAllChecklistOfCardRequest,
  ): Promise<GetAllChecklistOfCardResponse> => {
    try {
      const data = await checklistApi.getAllChecklistOfCard(request);
      if (!data) throw new Error("Failed to get all checklists of card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to get all checklists of card: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // create checklist on card
  const createChecklistOnCard = async (
    request: CreateChecklistOnCardRequest,
  ): Promise<CreateChecklistOnCardResponse> => {
    try {
      const data = await checklistApi.createChecklistOnCard(request);
      if (!data) throw new Error("Failed to create checklist on card");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(`Failed to create checklist on card: ${apiError.message}`);
      throw apiError;
    }
  };

  // remove checklist from card
  const removeChecklistFromCard = async (
    request: RemoveChecklistFromCardRequest,
  ): Promise<void> => {
    try {
      await checklistApi.removeChecklistFromCard(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to remove checklist from card: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // get checklist items of checklist
  const getChecklistItemsOfChecklist = async (
    request: GetChecklistItemsOfChecklistRequest,
  ): Promise<GetChecklistItemsOfChecklistResponse> => {
    try {
      const data = await checklistApi.getChecklistItemsOfChecklist(request);
      if (!data) throw new Error("Failed to get checklist items of checklist");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to get checklist items of checklist: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // create checklist item on checklist
  const createChecklistItemOnChecklist = async (
    request: CreateChecklistItemOnChecklistRequest,
  ): Promise<CreateChecklistItemOnChecklistResponse> => {
    try {
      const data = await checklistApi.createChecklistItemOnChecklist(request);
      if (!data)
        throw new Error("Failed to create checklist item on checklist");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to create checklist item on checklist: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // update checklist item on checklist
  const updateChecklistItemOnChecklist = async (
    request: UpdateChecklistItemOnChecklistRequest,
  ): Promise<UpdateChecklistItemOnChecklistResponse> => {
    try {
      const data = await checklistApi.updateChecklistItemOnChecklist(request);
      if (!data)
        throw new Error("Failed to update checklist item on checklist");
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to update checklist item on checklist: ${apiError.message}`,
      );
      throw apiError;
    }
  };

  // remove checklist item on checklist
  const removeChecklistItemOnChecklist = async (
    request: RemoveChecklistItemOnChecklistRequest,
  ): Promise<void> => {
    try {
      await checklistApi.removeChecklistItemOnChecklist(request);
    } catch (err) {
      const apiError = err as ApiError;
      console.error(
        `Failed to remove checklist item on checklist: ${apiError.message}`,
      );
      throw apiError;
    }
  };
  return {
    getAllChecklistOfCard,
    createChecklistOnCard,
    removeChecklistFromCard,
    getChecklistItemsOfChecklist,
    createChecklistItemOnChecklist,
    updateChecklistItemOnChecklist,
    removeChecklistItemOnChecklist,
  };
};
