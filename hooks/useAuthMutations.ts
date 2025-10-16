// src/hooks/useAuthMutations.ts
import { useAuthStore } from "@/app/store/authStore";
import {
  loginService,
  logoutService,
  signupService,
  type LoginPayload,
  forgotPasswordService,
  ForgetPasswordPayload,
  CreateNewPasswordPayload,
  CreateNewPasswordService,
  verifyOtpService,
  VerifyOtpPayload,
} from "@/services/auth-services/authService";
import { useMutation } from "@tanstack/react-query";

export const useAuthMutations = () => {
  const { setUser, setToken, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => loginService(data),
    onSuccess: (response) => {
      const { user, accessToken } = response?.data || {};
      if (user && accessToken) {
        setUser(user);
        setToken(accessToken);
      }
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error?.response?.data?.message || error.message
      );
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupService,
    onSuccess: (response) => {
      console.log("Signup success:", response);
    },
  });
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgetPasswordPayload) => forgotPasswordService(data),
    onSuccess: (response) => {
      console.log("✅ Forgot password request sent successfully:", response);
      // You can show a toast or redirect to OTP screen here
    },
    onError: (error: any) => {
      console.error(
        "Forgot password failed:",
        error?.response?.data?.message || error.message
      );
    },
  });
  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyOtpPayload) => verifyOtpService(data),
    onSuccess: (response) => {
      console.log("✅ OTP verified successfully:", response);
      // you can save userId or token if returned, or navigate to create-password page
    },
    onError: (error: any) => {
      console.error(
        "OTP verification failed:",
        error?.response?.data?.message || error.message
      );
    },
  });

  const createNewPasswordMutation = useMutation({
    mutationFn: async ({ newPassword, confirmPassword, token }: any) =>
      await CreateNewPasswordService({ newPassword, confirmPassword }, token),
  });
  const logoutMutation = useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      logout();
    },
  });

  return {
    loginMutation,
    signupMutation,
    logoutMutation,
    forgotPasswordMutation,
    verifyOtpMutation,
    createNewPasswordMutation,

  };
};
