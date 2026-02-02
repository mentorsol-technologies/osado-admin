import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthState {
  user: any | null;
  userId: string | null;
  accessToken: string | null;
  token: string | null;
  setUser: (user: any) => void;
  setUserId: (id: string) => void;
  setAccessToken: (token: string) => void;
  setToken: (token: string) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userId: null,
      accessToken: null,
      token: null,

      setUser: (user) => set({ user }),

      setUserId: (id) => set({ userId: id }),
      setAccessToken: (token) => set({ accessToken: token }),
      setToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          Cookies.set("token", token, { expires: 7 }); // ✅ store cookie for middleware
        }
        set({ token });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          Cookies.remove("token"); // ✅ remove cookie to break session
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // key for localStorage
    },
  ),
);
