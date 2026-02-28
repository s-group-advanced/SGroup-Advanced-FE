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
    CHANGE_PASSWORD: "/auth/reset-password",
    CHECK_ME: "/users/me",
    UPDATE_PROFILE: "/users/{userId}",
  },
  HOME: {},
  USER: {
    GET_ALL_USERS: "/users/",
    GET_USER_BY_ID: "/users/me",
  },
  PROJECT: {
    GET_ALL_PROJECTS_OF_WORKSPACE: "/api/workspaces/my-workspaces",
    CREATE_WORKSPACE: "/api/workspaces/",
    GET_ALL_MEMBER_OF_WORKSPACE_BUT_NOT_IN_WORKSPACE:
      "/api/workspaces/{workspaceId}/available-users",
    INVITE_MEMBER_TO_WORKSPACE: "/api/workspaces/members/{workspaceId}",
    ARCHIVE_WORKSPACE: "/api/workspaces/status/{workspaceId}",
    UPDATE_WORKSPACE: "/api/workspaces/{workspaceId}",
    CREATE_LINK_INVITATION_TO_WORKSPACE:
      "/api/workspaces/{workspaceId}/generate-invitation-link",
    DISABLE_LINK_INVITATION_TO_WORKSPACE:
      "/api/workspaces/{workspaceId}/invite-link/{token}",
    GET_CURRENT_LINK_INVITATION_TO_WORKSPACE:
      "/api/workspaces/{workspaceId}/invitation-link",
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
    CREATE_BOARD_FROM_TEMPLATE: "/boards/template",
    GET_INVITE_LINK_JOIN_TO_BOARD: "/boards/{boardId}/invite-link",
    JOIN_BOARD_BY_INVITE_LINK: "/boards/invite/{token}",
    GET_ALL_BOARDS_OF_USER_MEMBER_OF_WORKSPACE: "/boards/my-boards",
  },
  CARD: {
    GET_ALL_CARDS_OF_BOARD: "/boards/{boardId}/cards?archived=false",
    GET_ALL_ARCHIVED_CARDS_OF_BOARD: "/boards/{boardId}/cards?archived=true",
    CREATE_CARD: "/cards",
    DELETE_CARD: "/cards/{cardId}/archive",
    DELETE_CARD_PERMANENTLY: "/cards/{cardId}",
    UPDATE_CARD: "/cards/{cardId}",
    ASSIGN_USER_TO_CARD: "/cards/{cardId}/members",
    UNASSIGN_USER_FROM_CARD: "/cards/{cardId}/members/{userId}",
    CREATE_COMMENT_ON_CARD: "/cards/{cardId}/comments",
    GET_ALL_COMMENTS_OF_CARD: "/cards/{cardId}/comments",
    UPDATE_COMMENT_ON_CARD: "/cards/{cardId}/comments/{commentId}",
    DELETE_COMMENT_ON_CARD: "/cards/{cardId}/comments/{commentId}",
    ADD_LABEL_TO_CARD: "/cards/{cardId}/labels",
    GET_LABELS_OF_CARD: "/cards/{cardId}/labels",
    GET_AVAILABLE_LABELS_OF_BOARD: "/cards/{cardId}/labels/available",
    REMOVE_LABEL_FROM_CARD: "/cards/{cardId}/labels/{labelId}",
    MOVE_CARD_TO_LIST: "/cards/{cardId}/move",
    UPDATE_DUE_DATE_OF_CARD: "/cards/{cardId}/due-date",
    TOGGLE_TEMPLATE_CARD: "/cards/{cardId}/toggle-template",
    GET_ALL_TEMPLATES_OF_BOARD: "/cards/templates/board/{boardId}",
    CREATE_CARD_FROM_TEMPLATE: "/cards/{templateCardId}/use-template",
    CREATE_NEW_CARD_TEMPLATE: "/cards/templates",
    MOVE_CARD_TO_ANOTHER_LIST: "/cards/{cardId}/move",
    COPY_CARD_TO_ANOTHER_LIST: "/cards/{cardId}/copy",
  },
  LIST: {
    GET_ALL_LISTS_OF_BOARD: "/boards/{boardId}/lists?archived=false",
    CREATE_LIST: "/boards/{boardId}/lists",
    UPDATE_NAME_LIST: "/boards/{boardId}/lists/{listId}",
    DELETE_LIST_FROM_BOARD: "/boards/{boardId}/lists/{listId}/archive",
    MOVE_LIST_TO_BOARD: "/boards/lists/{listId}/reorder",
    MOVE_LIST_TO_ANOTHER_BOARD: "/boards/lists/{listId}/move",
    COPY_LIST_TO_BOARD: "/boards/lists/{listId}/copy",
    GET_ALL_ARCHIVED_LISTS_OF_BOARD: "/boards/{boardId}/lists?archived=true",
    DELETE_LIST_FROM_BOARD_PERMANENTLY: "/boards/{boardId}/lists/{listId}",
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
  BOARD_TEMPLATE: {
    GET_ALL_BOARD_TEMPLATES: "/board-templates/",
  },
};

export const AuthEndpoint = API_ENDPOINTS.AUTH;
export const UserEndpoint = API_ENDPOINTS.USER;
export const ProjectEndpoint = API_ENDPOINTS.PROJECT;
export const BoardEndpoint = API_ENDPOINTS.BOARD;
export const CardEndpoint = API_ENDPOINTS.CARD;
export const ListEndpoint = API_ENDPOINTS.LIST;
export const ChecklistEndpoint = API_ENDPOINTS.CHECKLIST;
export const BoardTemplateEndpoint = API_ENDPOINTS.BOARD_TEMPLATE;
