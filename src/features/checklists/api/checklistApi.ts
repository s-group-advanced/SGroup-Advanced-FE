import { fetchFactory } from "@/shared/api";
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
} from "./type";
import { ChecklistEndpoint } from "@/shared/api/endpoints";

export const checklistApi = {
  // get all checklists of card
  getAllChecklistOfCard: (
    request: GetAllChecklistOfCardRequest,
  ): Promise<GetAllChecklistOfCardResponse> => {
    return fetchFactory.get<GetAllChecklistOfCardResponse>(
      ChecklistEndpoint.GET_ALL_CHECKLISTS_OF_CARD.replace(
        "{cardId}",
        request.cardId,
      ),
    );
  },

  // create checklist on card
  createChecklistOnCard: (
    request: CreateChecklistOnCardRequest,
  ): Promise<CreateChecklistOnCardResponse> => {
    const { cardId, ...body } = request;
    return fetchFactory.post<CreateChecklistOnCardResponse>(
      ChecklistEndpoint.CREATE_CHECKLIST_ON_CARD.replace("{cardId}", cardId),
      body,
    );
  },

  // remove checklist from card
  removeChecklistFromCard: (
    request: RemoveChecklistFromCardRequest,
  ): Promise<void> => {
    const { cardId, checklistId } = request;
    return fetchFactory.delete<void>(
      ChecklistEndpoint.REMOVE_CHECKLIST_FROM_CARD.replace(
        "{cardId}",
        cardId,
      ).replace("{checklistId}", checklistId),
    );
  },

  // get checklist items of checklist
  getChecklistItemsOfChecklist: (
    request: GetChecklistItemsOfChecklistRequest,
  ): Promise<GetChecklistItemsOfChecklistResponse> => {
    const { cardId, checklistId } = request;
    return fetchFactory.get<GetChecklistItemsOfChecklistResponse>(
      ChecklistEndpoint.GET_CHECKLIST_ITEMS_OF_CHECKLIST.replace(
        "{cardId}",
        cardId,
      ).replace("{checklistId}", checklistId),
    );
  },

  // create checklist item on checklist
  createChecklistItemOnChecklist: (
    request: CreateChecklistItemOnChecklistRequest,
  ): Promise<CreateChecklistItemOnChecklistResponse> => {
    const { cardId, checklistId, ...body } = request;
    return fetchFactory.post<CreateChecklistItemOnChecklistResponse>(
      ChecklistEndpoint.CREATE_CHECKLIST_ITEM_ON_CHECKLIST.replace(
        "{cardId}",
        cardId,
      ).replace("{checklistId}", checklistId),
      body,
    );
  },

  // update checklist item on checklist
  updateChecklistItemOnChecklist: (
    request: UpdateChecklistItemOnChecklistRequest,
  ): Promise<UpdateChecklistItemOnChecklistResponse> => {
    const { cardId, checklistId, itemId, ...body } = request;
    return fetchFactory.patch<UpdateChecklistItemOnChecklistResponse>(
      ChecklistEndpoint.UPDATE_CHECKLIST_ITEM_ON_CHECKLIST.replace(
        "{cardId}",
        cardId,
      )
        .replace("{checklistId}", checklistId)
        .replace("{itemId}", itemId),
      body,
    );
  },

  // remove checklist item on checklist
  removeChecklistItemOnChecklist: (
    request: RemoveChecklistItemOnChecklistRequest,
  ): Promise<void> => {
    const { cardId, checklistId, itemId } = request;
    return fetchFactory.delete<void>(
      ChecklistEndpoint.REMOVE_CHECKLIST_ITEM_ON_CHECKLIST.replace(
        "{cardId}",
        cardId,
      )
        .replace("{checklistId}", checklistId)
        .replace("{itemId}", itemId),
    );
  },
};
