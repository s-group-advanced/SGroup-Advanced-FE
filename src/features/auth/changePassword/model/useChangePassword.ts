import { useState } from "react";
import { changePasswordApi } from "../api/changePasswordApi";

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await changePasswordApi.forgotPassword(email);
      if (!response) throw new Error("Failed to send reset link");
      return response;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await changePasswordApi.verifyOTP({ email, code });
      if (!response) throw new Error("Failed to verify OTP");
      return response;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await changePasswordApi.changePassword({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (!response) throw new Error("Failed to change password");
      return response;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    forgotPassword,
    verifyOTP,
    changePassword,
  };
};
