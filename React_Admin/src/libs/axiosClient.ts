import axios from "axios";
import { env } from "../constants/getEnvs";
import { useAuthStore } from "../stores/useAuthStore";
const API_URL = `${env.API_URL}/v1/auth`;

const axiosClient = axios.create({
  baseURL: API_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// REQUEST
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

// RESPONSE

axiosClient.interceptors.response.use(
  async (response) => {
    const { access_token, refresh_token } = response.data.data;
    // LOGIN
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
        // Trường hợp không có token thì chuyển sang trang LOGIN
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

export { axiosClient };