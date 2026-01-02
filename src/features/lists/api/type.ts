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
