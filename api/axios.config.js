import axios from "axios";

const apiConfig = axios.create({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiConfig;
