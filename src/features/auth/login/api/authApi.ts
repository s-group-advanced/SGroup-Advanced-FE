import { AuthEndpoint, fetchFactory } from "@/shared/api";
import type {
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
} from "@/features/auth/login/api/type";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/features/auth/login/api/type";
import type {
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "@/features/auth/login/api/type";

export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return fetchFactory.post<LoginResponse>(AuthEndpoint.LOGIN, credentials, {
      withCredentials: true,
    });
  },

  register: (credentials: RegisterRequest): Promise<RegisterResponse> => {
    return fetchFactory.post<RegisterResponse>(
      AuthEndpoint.REGISTER,
      credentials,
      {
        withCredentials: true,
      },
    );
  },

  verifyOTP: (credentials: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    return fetchFactory.post<VerifyOTPResponse>(
      AuthEndpoint.VERIFY_EMAIL,
      credentials,
      {
        withCredentials: true,
      },
    );
  },

  logout: (): Promise<void> => {
    return fetchFactory.post<void>(
      AuthEndpoint.LOGOUT,
      {},
      {
        withCredentials: true,
      },
    );
  },

  checkMe: (): Promise<boolean> => {
    return fetchFactory.get<boolean>(AuthEndpoint.CHECK_ME, {
      withCredentials: true,
    });
  },

  // Update profile
  updateProfile: (request: UpdateProfileRequest): Promise<void> => {
    const { id, ...body } = request;
    return fetchFactory.patch<void>(
      AuthEndpoint.UPDATE_PROFILE.replace("{userId}", id),
      body,
      {
        withCredentials: true,
      },
    );
  },
};
