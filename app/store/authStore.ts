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
          localStorage.setItem("osado_admin_token", token);
          Cookies.set("osado_admin_token", token, { expires: 7 });
        }
        set({ token });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("osado_admin_token");
          Cookies.remove("osado_admin_token");
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "osado-admin-auth-storage",
    },
  ),
);
