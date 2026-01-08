export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
}

export interface VerifyOTPResponse {
  message: string;
}

export interface ChangePasswordRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}
