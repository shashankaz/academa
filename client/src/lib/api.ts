import axios from "axios";
import { isTokenPresent, removeAuthToken } from "./cookies";

axios.defaults.baseURL = import.meta.env.VITE_API_URL + "/api/v1";

const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/logout");

    if (!isAuthEndpoint && !isTokenPresent()) {
      console.warn("No authentication token found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication token is invalid or expired");

      removeAuthToken();

      window.dispatchEvent(new CustomEvent("auth:token-expired"));
    }

    return Promise.reject(error);
  }
);

export { api };
