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
  },
};

export const AuthEndpoint = API_ENDPOINTS.AUTH;
export const UserEndpoint = API_ENDPOINTS.USER;
export const ProjectEndpoint = API_ENDPOINTS.PROJECT;
export const BoardEndpoint = API_ENDPOINTS.BOARD;
