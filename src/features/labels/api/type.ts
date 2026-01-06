export interface AddLabelOnBoardRequest {
  boardId: string;
  name: string;
  color: string;
}

export interface AddLabelToBoardResponse {
  id: string;
  board_id: string;
  name: string;
  color: string;
}

export interface AddLabelToCardRequest {
  cardId: string;
  label_id: string;
}

export interface GetAllLabelsOfBoardRequest {
  boardId: string;
}

export interface GetAllLabelsOfBoardResponse {
  id: string;
  board_id: string;
  name: string;
  color: string;
}

export interface GetLabelsOfCardRequest {
  cardId: string;
}

export interface GetLabelsOfCardResponse {
  id: string;
  card_id: string;
  label_id: string;
  board_id: string;
  name: string;
  color: string;
}

export interface GetAvailableLabelsOfBoardRequest {
  cardId: string;
}

export interface GetAvailableLabelsOfBoardResponse {
  id: string;
  name: string;
  color: string;
}

export interface RemoveLabelFromCardRequest {
  cardId: string;
  labelId: string;
}
