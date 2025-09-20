import type { ListConfig, ResponseConfig } from "@/types/axios";
import type { UserDetailInfo } from "@/types/info";
import service from "@/utils/request";

export function login(
  params?: object
): Promise<EmptyObjectType> {
  return service.post("index/login", params);
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

export function retrySendEmailCode(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("index/retrySendEmailCode", params);
}

export function logout(params?: object) {
  return service({
    url: "logout",
    method: "auth/post",
    data: params,
  });
}

export const setUserInfo = (
  params: object
): Promise<ResponseConfig<UserDetailInfo>> => {
  return service.post("/member/setinfo", params);
};

// 获取收藏
export const getStarFeeds = (
  params: object
): Promise<ResponseConfig<ListConfig<EmptyObjectType>>> => {
  return service.post("/item/myCollect", params);
};

export const getLikeFeeds = (
  params: object
): Promise<ResponseConfig<ListConfig<EmptyObjectType>>> => {
  return service.post("/item/myLike", params);
};

export function changePassword(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/member/resetPassword", params);
}
export function forgotPassword(
  email?: string
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/index/forgotPassword", {
    email,
  });
}
export function resetPassword(
  params?: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return service.post("/index/setPassword", params);
}
