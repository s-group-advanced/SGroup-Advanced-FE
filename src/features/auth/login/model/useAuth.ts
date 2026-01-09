import { useState } from "react";
import { authApi } from "@/features/auth/login/api/authApi";
import type {
  ApiError,
  LoginRequest,
  VerifyOTPRequest,
} from "@/features/auth/login/api/type";
import type { RegisterRequest } from "@/features/auth/login/api/type";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const navigate = useNavigate();

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      alert(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(credentials);
      // localStorage.setItem("registerEmail", credentials.email);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      alert(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (credentials: VerifyOTPRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOTP(credentials);
      navigate("/");
      return response;
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError);
      alert(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      navigate("/");
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      alert(apiError.message);
    }
  };

  const checkMe = async () => {
    try {
      const response = await authApi.checkMe();
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      throw apiError;
    }
  };

  return {
    isLoading,
    login,
    error,
    register,
    verifyOTP,
    logout,
    checkMe,
  };
};
