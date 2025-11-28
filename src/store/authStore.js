import { create } from "zustand";
import apiConfig from "../../api/axios.config";

const useAuthStore = create((set) => {
  user: null, loading, true;

  checkAuth: async () => {
    try {
      const res = apiConfig.get("/api/v1/users/me");
      set({ user: res.data.user, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  };

  setUser: (user) => set({ user, loading: false });

  logout: () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    set({ user: null });
  };
});

export default useAuthStore;
