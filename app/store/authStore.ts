import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthState {
  user: any | null;
  userId: string | null;
  accessToken: string | null;
  token: string | null;
  // Seeded straight from the sign-in response (already includes it, no
  // extra request needed) so the sidebar/dashboard know immediately
  // whether this is an admin, without waiting on a /users/me round-trip.
  role: string | null;
  setUser: (user: any) => void;
  setUserId: (id: string) => void;
  setAccessToken: (token: string) => void;
  setToken: (token: string) => void;
  setRole: (role: string | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userId: null,
      accessToken: null,
      token: null,
      role: null,

      setUser: (user) => set({ user }),
      setUserId: (id) => set({ userId: id }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRole: (role) => set({ role }),

      setToken: (token) => {
        localStorage.setItem("osado-admin-token", token);
        Cookies.set("osado-admin-token", token, { expires: 7 });
        set({ token });
      },

      logout: () => {
        localStorage.removeItem("osado-admin-token");
        Cookies.remove("osado-admin-token");
        set({ user: null, token: null, role: null });
      },
    }),
    {
      name: "osado-admin-auth",
    },
  ),
);
