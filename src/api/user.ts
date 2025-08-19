import type { ListConfig, ResponseConfig } from "@/types/axios";
import type { ExploreFeedInfo, UserDetailInfo } from "@/types/info";
import service from "@/utils/request";

export function login(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("index/login", params);
}

export function refresh(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("index/refresh", params);
}

export function register(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("index/prepareRegister", params);
}

export function veryCode(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("index/register", params);
}

export function logout(params?: object) {
  return service({
    url: "logout",
    method: "auth/post",
    data: params,
  });
}

export const getUserInfo = (
  id: string
): Promise<ResponseConfig<UserDetailInfo>> => {
  return service.get("/user/info", { params: { id } });
};

export const setUserInfo = (
  params: object
): Promise<ResponseConfig<UserDetailInfo>> => {
  return service.post("/member/setinfo", params);
};
// 获取笔记
export const getNoteFeeds = (
  id: string,
  num: number
): Promise<ResponseConfig<ListConfig<EmptyObjectType>>> => {
  return service.get("/member/myPost", { params: { id, num } });
};

// 获取收藏
export const getStarFeeds = (
  id: string,
  num: number
): Promise<ResponseConfig<ListConfig<EmptyObjectType>>> => {
  return service.get("/user/starfeeds", { params: { id, num } });
};
