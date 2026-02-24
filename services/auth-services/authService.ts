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

export interface UpdateProfilePayload {
  name?: string;
  surName?: string;
  roleId?: string;
  email?: string;
  callingCode?: string;
  photoId?: string;
  phoneNumber?: string;
  countryCode?: string;
  status?: string;
  authProvider?: string;
  bio?: string;
  customInput?: any;
  city?: string;
  state?: string;
  postalCode?: string;
}

export const loginService = (data: LoginPayload) =>
  api.post("/auth/signIn", data);

export const signupService = (data: any) => api.post("/auth/signup", data);

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
  token?: string,
) =>
  api.patch("/auth/resetPassword", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const refreshTokenService = () => api.post("/auth/refresh-token");

export const logoutService = () => api.post("/auth/logout");

// Profile Services
export const getCurrentAdminService = async () => {
  const res = await api.get("/admin/currentAdmin");
  return res;
};

export const updateProfileService = async (data: UpdateProfilePayload) => {
  const res = await api.patch("/admin/updateProfile", data);
  return res;
};

// Dashboard events card data

export const getDashboardEventsDataService = async () => {
  const res = await api.get("/auth/admin-dashboard");
  return res;
};
