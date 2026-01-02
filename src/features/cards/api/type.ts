import type { User } from "@/features/home/api/type";

export interface Card {
  id: string;
  list_id: string;
  board_id: string;
  title: string;
  description: string;
  position: number;
  created_by: User;
  created_at: string;
  updated_at: string;
  comments_count: number;
  attachments_count: number;
  archived: boolean;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  lists: ListItem[];
  labels: any[];
  checklists: any[];
}

export interface ListItem {
  id: string;
  board_id: string;
  title: string;
  name: string;
  archived: boolean;
  position: number;
  cover_img: string;
  cards: Card[];
}

export interface GetAllCardsOfBoardRequest {
  boardId: string;
}

export interface GetAllCardsOfBoardResponse {
  cards: Card[];
}
