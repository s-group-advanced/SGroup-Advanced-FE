import type { Board } from "@/features/boards/index";

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface BoardTemplate {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  lists?: ListTemplate[];
}

export interface ListTemplate {
  id: string;
  name: string;
  position: number;
  cover_img?: string;
  template: BoardTemplate;
  cards?: CardTemplate[];
}

export interface CardTemplate {
  id: string;
  title: string;
  description?: string;
  position: number;
  list: ListTemplate;
  priority?: string;
  cover_img?: string;
}

export interface GetAllBoardTemplatesResponse {
  boards: BoardTemplate[];
  lists: ListTemplate[];
  cards: CardTemplate[];
}

export interface CreateBoardFromTemplateRequest {
  workspaceId: string;
  templateId: string;
}

export interface CreateBoardFromTemplateResponse {
  board: Board;
}
