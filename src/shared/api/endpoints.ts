export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    LOGOUT: "/auth/logout",
    RENEW_TOKEN: "/auth/refresh",
    CHECK_AUTH: "/auth/check-auth",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_OTP: "/auth/verify-otp",
    CHANGE_PASSWORD: "/auth/change-password",
    CHECK_ME: "/users/me",
  },
  HOME: {},
  USER: {
    GET_ALL_USERS: "/users/",
    GET_USER_BY_ID: "/users/me",
  },
  PROJECT: {
    GET_ALL_PROJECTS_OF_WORKSPACE: "/api/workspaces/my-workspaces",
    CREATE_WORKSPACE: "/api/workspaces/",
  },
  BOARD: {
    GET_BOARD_OF_WORKSPACE: "/boards",
    ADD_BOARD_TO_WORKSPACE: "/boards",
    DELETE_BOARD_FROM_WORKSPACE: "/boards/{boardId}/permanent",
    EDIT_BOARD_IN_WORKSPACE: "/boards/{boardId}",
    GET_BOARD_BY_ID: "/boards/{boardId}",
    GET_ALL_MEMBER_OF_WORKSPACE_BUT_NOT_IN_BOARD:
      "/boards/{boardId}/available-members",
    INVITE_USER_TO_BOARD: "/boards/{boardId}/invitations",
    ACCEPT_INVITATION_TO_BOARD: "/boards/invitations/{token}/accept",
    GET_ALL_MEMBER_OF_BOARD: "/boards/{boardId}/members",
    CREATE_LABEL_ON_BOARD: "/boards/{boardId}/labels",
    GET_ALL_LABELS_OF_BOARD: "/boards/{boardId}/labels",
  },
  CARD: {
    GET_ALL_CARDS_OF_BOARD: "/boards/{boardId}/cards?archived=false",
    CREATE_CARD: "/cards",
    DELETE_CARD: "/cards/{cardId}/archive",
    UPDATE_CARD: "/cards/{cardId}",
    ASSIGN_USER_TO_CARD: "/cards/{cardId}/members",
    UNASSIGN_USER_FROM_CARD: "/cards/{cardId}/members/{userId}",
    CREATE_COMMENT_ON_CARD: "/cards/{cardId}/comments",
    GET_ALL_COMMENTS_OF_CARD: "/cards/{cardId}/comments",
    ADD_LABEL_TO_CARD: "/cards/{cardId}/labels",
    GET_LABELS_OF_CARD: "/cards/{cardId}/labels",
    GET_AVAILABLE_LABELS_OF_BOARD: "/cards/{cardId}/labels/available",
    REMOVE_LABEL_FROM_CARD: "/cards/{cardId}/labels/{labelId}",
  },
  LIST: {
    GET_ALL_LISTS_OF_BOARD: "/boards/{boardId}/lists?archived=false",
    CREATE_LIST: "/boards/{boardId}/lists",
    UPDATE_NAME_LIST: "/boards/{boardId}/lists/{listId}",
    DELETE_LIST_FROM_BOARD: "/boards/{boardId}/lists/{listId}/archive",
  },
  CHECKLIST: {
    GET_ALL_CHECKLISTS_OF_CARD: "/cards/{cardId}/checklists",
    CREATE_CHECKLIST_ON_CARD: "/cards/{cardId}/checklists",
    REMOVE_CHECKLIST_FROM_CARD: "/cards/{cardId}/checklists/{checklistId}",
    GET_CHECKLIST_ITEMS_OF_CHECKLIST:
      "/cards/{cardId}/checklists/{checklistId}/items",
    CREATE_CHECKLIST_ITEM_ON_CHECKLIST:
      "/cards/{cardId}/checklists/{checklistId}/items",
    UPDATE_CHECKLIST_ITEM_ON_CHECKLIST:
      "/cards/{cardId}/checklists/{checklistId}/items/{itemId}",
    REMOVE_CHECKLIST_ITEM_ON_CHECKLIST:
      "/cards/{cardId}/checklists/{checklistId}/items/{itemId}",
  },
};

export const AuthEndpoint = API_ENDPOINTS.AUTH;
export const UserEndpoint = API_ENDPOINTS.USER;
export const ProjectEndpoint = API_ENDPOINTS.PROJECT;
export const BoardEndpoint = API_ENDPOINTS.BOARD;
export const CardEndpoint = API_ENDPOINTS.CARD;
export const ListEndpoint = API_ENDPOINTS.LIST;
export const ChecklistEndpoint = API_ENDPOINTS.CHECKLIST;
