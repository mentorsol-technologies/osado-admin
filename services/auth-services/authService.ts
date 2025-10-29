import api from "@/lib/axios";
export interface LoginPayload {
  callingCode: string;
  phoneNumber: string;
  authProvider: string;
  countryCode: string;
  password: string;
}
export interface ForgetPasswordPayload {
  callingCode: string;
  phoneNumber: string;
}
export interface VerifyOtpPayload {
  otpCode: number;
  userId: string;
}
export interface CreateNewPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export const loginService = (data: LoginPayload) =>
  api.post("auth/signIn", data);

export const signupService = (data: any) =>
  api.post("/auth/signup", data);

export const forgotPasswordService = async (data: ForgetPasswordPayload) => {
  const res = await api.post("/auth/forgetPassword", data);
  return res.data;
};

export const verifyOtpService = async (data: VerifyOtpPayload) => {
  const res = await api.post("/auth/verifyOtp", data);
  return res.data;
};

export const CreateNewPasswordService = (
  data: CreateNewPasswordPayload,
  token?: string
) =>
  api.patch("/auth/resetPassword", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const refreshTokenService = () =>
  api.post("/auth/refresh-token");

export const logoutService = () =>
  api.post("/auth/logout");