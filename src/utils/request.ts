import axios, { type AxiosInstance } from "axios";
import { useUserStore } from "@/store/user";
import { appendToken } from "@/hooks/useJWT";
import { encrypt, decrypt, makeSign } from "@/utils/crypto";
import dayjs from "dayjs";

const instance: AxiosInstance = axios.create({
  baseURL: !import.meta.env.DEV
    ? import.meta.env.VITE_API_URL_PROD // uses Vite proxy
    : "/apiv1",
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    appendToken(config);
    // console.log(
    //   `Request: ${config.url}\n`,
    //   config.method === "get" ? config.params : config.data,
    //   "\ntoken:",
    //   config.headers.Authorization
    // );
    // const client = "pwa";
    // const timestamp = dayjs().unix();
    // // If body data exists → encrypt it
    // if (config.data) {
    //   const encryptedData = encrypt(config.data);
    //   const sign = makeSign(client, timestamp, encryptedData);

    //   // overwrite request body
    //   config.data = {
    //     client,
    //     timestamp,
    //     data: encryptedData,
    //     sign,
    //   };
    // }
    return config;
  },
  (error) => {
    // What to do about request errors
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      // decrypt only if response contains "data"
      if (response.data?.data) {
        try {
          // response.data.data = decrypt(response.data.data);
        } catch (e) {
          console.warn("Decryption failed:", e);
        }
      }
      return response.data;
    }

    if ([401, 403, 500].includes(response.status)) {
      const userStore = useUserStore();
      userStore.logout();
      return Promise.reject(response.data);
    }

    return Promise.reject(response.data);
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default instance;
