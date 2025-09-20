import axios, { type AxiosInstance } from "axios";
import { useUserStore } from "@/store/user";
import { appendToken, refreshToken } from "@/hooks/useJWT";
import { encrypt, decrypt, makeSign } from "@/utils/crypto";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";

const instance: AxiosInstance = axios.create({
  baseURL: `${
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL_LOC
      : import.meta.env.VITE_API_URL_PROD
  }/apiv1`,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

instance.interceptors.request.use(
  (config) => {
    appendToken(config);
    // console.log(
    //   `Request: ${config.url}\n`,
    //   config.method === "get" ? config.params : config.data,
    //   "\ntoken:",
    //   config.headers.Authorization
    // );

    if (import.meta.env.MODE === "development") {
      console.log(`request => ${config.url}`, { ...config.data });
    }
    const client = "pwa";
    const timestamp = dayjs().unix();
    // If body data exists → encrypt it

    if (config.data) {
      const encryptedData = encrypt(config.data);
      const sign = makeSign(timestamp, encryptedData);
      config.data = {
        client,
        timestamp,
        data: encryptedData,
        sign,
      };
    }
    return config;
  },
  (error) => {
    // What to do about request errors
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    if (response.data.errcode === 401001) {
      const userStore = useUserStore();
      userStore.logout();
      ElMessage.error(response.data.info);
    }

    if (response.data.errcode === 401013) {
      const originalRequest = response.config;

      if (isRefreshing) {
        // If a refresh is already in progress, queue this request to be retried later.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;
      const userStore = useUserStore();

      return userStore
        .refreshToken()
        .then((newAccessToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    if (response.status === 200) {
      // decrypt only if response contains "data"
      if (response.data?.data) {
        try {
          const decrypted = decrypt(response.data.data);
          response.data = decrypted;
          if (import.meta.env.MODE === "development") {
            console.log(`Decrypted: ${response.config.url}`, decrypted);
          }
        } catch (e) {
          console.warn("Decryption failed:", e, response.data);
        }
      }
      return response.data;
    }

    return Promise.reject(response.data);
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default instance;
