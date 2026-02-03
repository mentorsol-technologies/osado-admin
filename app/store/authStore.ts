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
        localStorage.setItem("osado-admin-token", token);
        Cookies.set("osado-admin-token", token, { expires: 7 });
        set({ token });
      },

      logout: () => {
        localStorage.removeItem("osado-admin-token");
        Cookies.remove("osado-admin-token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "osado-admin-auth",
    },
  ),
);
