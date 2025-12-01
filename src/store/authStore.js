import { create } from "zustand";
import apiConfig from "../../api/axios.config";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ user: null, loading: false });
        return;
      }
      const res = await apiConfig.get("/api/v1/users/me");
      set({ user: res.data.data, loading: false });
    } catch (err) {
      localStorage.removeItem("accessToken");
      set({ user: null, loading: false });
    }
  },

  setUser: (user) => set({ user, loading: false }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null });
  },
}));
export default useAuthStore;
