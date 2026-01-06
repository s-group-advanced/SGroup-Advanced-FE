export interface Checklist {
  id?: string;
  cardId: string;
  name: string;
  position: number;
  createdAt: string;
  progress?: number;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  checklist_id: string;
  content: string;
  position: number;
  is_checked: boolean;
  due_at: string;
  completed_at: string;
}

export interface GetAllChecklistOfCardRequest {
  cardId: string;
}

export interface GetAllChecklistOfCardResponse {
  checklists: Checklist[];
  items: ChecklistItem[];
  progress: number;
}

export interface CreateChecklistOnCardRequest {
  cardId: string;
  name: string;
}

export interface CreateChecklistOnCardResponse {
  checklist: Checklist;
}

export interface RemoveChecklistFromCardRequest {
  cardId: string;
  checklistId: string;
}

export interface GetChecklistItemsOfChecklistRequest {
  cardId: string;
  checklistId: string;
}

export interface GetChecklistItemsOfChecklistResponse {
  items: ChecklistItem[];
}

export interface CreateChecklistItemOnChecklistRequest {
  cardId: string;
  checklistId: string;
  name: string;
}

export interface CreateChecklistItemOnChecklistResponse {
  checklist: Checklist;
  item: ChecklistItem;
}

export interface UpdateChecklistItemOnChecklistRequest {
  cardId: string;
  checklistId: string;
  itemId: string;
  is_completed: boolean;
}

export interface UpdateChecklistItemOnChecklistResponse {
  checklist: Checklist;
  item: ChecklistItem;
}

export interface RemoveChecklistItemOnChecklistRequest {
  cardId: string;
  checklistId: string;
  itemId: string;
}
