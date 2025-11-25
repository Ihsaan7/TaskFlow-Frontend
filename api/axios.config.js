import axios from "axios";

const apiConfig = axios.create({
  baseURL: "http://localhost:5000/api",
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
