export interface List {
  id: string;
  board_id: string;
  title: string;
  name: string;
  archived: boolean;
  position: number;
  cover_img: string;
}

export interface GetAllListofBoardRequest {
  boardId: string;
}

export interface GetAllListofBoardResponse {
  id: string;
  board_id: string;
  title: string;
  name: string;
  archived: boolean;
  position: number;
  cover_img: string;
}

export interface CreateListRequest {
  title: string;
  name: string;
  board_id: string;
}

export interface CreateListResponse {
  id: string;
  board_id: string;
  title: string;
  name: string;
  archived: boolean;
  position: number;
  cover_img: string;
}

export interface UpdateNameListRequest {
  boardId: string;
  listId: string;
  name: string;
}

export interface DeleteListFromBoardRequest {
  boardId: string;
  listId: string;
  archived: boolean;
}
