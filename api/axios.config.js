import axios from "axios";

const apiConfig = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiConfig;
