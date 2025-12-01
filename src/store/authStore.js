import { create } from "zustand";
import apiConfig from "../../api/axios.config";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  checkAuth: async () => {
    try {
      const res = await apiConfig.get("/api/v1/users/me");
      set({ user: res.data.data, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  },

  setUser: (user) => set({ user, loading: false }),

  logout: async () => {
    try {
      await apiConfig.post("/api/v1/users/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (_) {}
    set({ user: null });
  },
}));
export default useAuthStore;
