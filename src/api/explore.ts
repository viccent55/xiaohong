import type { ResponseConfig } from "@/types/axios";
import axios from "@/utils/request";

export function visitorCode(code: string) {
  return axios.post("/item/explore", {
    visitorCode: code,
  });
}

// 获取推荐列表
export function getExploreFeeds(
  params: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/item/recommend", params);
}

// 获取用户信息
export function getUserInfo(params: {
  id: number; // 用户ID
}): Promise<ResponseConfig<any>> {
  return axios.get("/user", { params });
}

// getConfiguration
export function getConfiguration(
  params: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/index/config", params);
}

// Visitor
export function newVisitor(
  params: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/index/newVisitor", params);
}

// Active Visitor
export function activeVisitor(
  params: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/index/activeVisitor", params);
}

export function installPwa(
  param: object
): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/index/download", param);
}
