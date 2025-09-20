import axios from "axios";
import { useDecryption } from "@/composables/useDecryption";

const apiEndPoint =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOC
    : import.meta.env.VITE_API_URL_PROD;

export async function gePostionAds(id: number): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/advert/${id}`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getConfiguration(): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/index/config`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function getUserInfo(id: number): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/index/userinfo-${id}`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getPageInfo(pageName: string): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/article-${pageName}`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getNoteDetail(
  id: number,
  visitor: string
): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/item/${id}/${visitor}`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getNoteFeeds(
  id: number,
  page: number
): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.get(`${apiEndPoint}/apiv1/item/user-${id}/${page}`);
    if (res.data) {
      const decrypted = encryptData(res.data);
      res.data = decrypted;
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function refreshToken(
  refresh_token: string
): Promise<EmptyObjectType> {
  try {
    const { encryptData } = useDecryption();
    const res = await axios.post(
      `${apiEndPoint}/apiv1/member/refreshToken`,
      {
        refresh_token,
      },
      {
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      }
    );
    if (res.data.errorcode == 0) {
      const decrypted = encryptData(res.data);

      res.data = decrypted;
    } else {
      return Promise.reject(res.data);
    }
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
