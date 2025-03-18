import axios from "axios";
import { env } from "../constants/getEnvs";
import { useAuthStore } from "../stores/useAuthStore";

// API URL cho xác thực (users)
const API_URL_AUTH = `${env.API_URL}/v1/auth`;

// API URL cho nhà hàng (không cần xác thực)
const API_URL_RESTAURANTS = `${env.API_URL}/v1`;

// Instance cho users (có xác thực)
const axiosClient = axios.create({
  baseURL: API_URL_AUTH,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// Instance cho nhà hàng (không xác thực)
const axiosClientPublic = axios.create({
  baseURL: API_URL_RESTAURANTS,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST Interceptor cho axiosClient (users)
axiosClient.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState();
    const token = tokens?.accessToken;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// RESPONSE Interceptor cho axiosClient (users)
axiosClient.interceptors.response.use(
  async (response) => {
    const { access_token, refresh_token } = response.data.data;
    if (access_token) {
      useAuthStore.getState().setTokens({ accessToken: access_token, refreshToken: refresh_token });
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    if (error?.response?.status === 401 && !originalConfig.sent) {
      console.log("Error 🚀", error);
      originalConfig.sent = true;
      try {
        const { tokens, clearTokens } = useAuthStore.getState();
        const token = tokens?.accessToken;
        if (!token) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshToken = tokens?.refreshToken;
        if (refreshToken) {
          const response = await axiosClient.post("/refresh-token", {
            refreshToken: refreshToken,
          });

          const { access_token } = response.data;
          useAuthStore.getState().setTokens({ accessToken: access_token, refreshToken });

          originalConfig.headers = {
            ...originalConfig.headers,
            authorization: `Bearer ${access_token}`,
          };

          return axiosClient(originalConfig);
        } else {
          clearTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
);

export { axiosClient, axiosClientPublic };