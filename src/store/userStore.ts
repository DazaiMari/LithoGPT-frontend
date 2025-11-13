import { create } from "zustand";
import { setToken, removeToken, getToken } from "@/utils/token";

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: getToken(),
  setToken: (token) => {
    setToken(token);
    set({ token });
  },
  clearToken: () => {
    removeToken();
    set({ token: null });
  },
}));
