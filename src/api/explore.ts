import type { ResponseConfig } from "@/types/axios";
import axios from "@/utils/request";

export function visitorCode(code: string) {
  return axios.post("/item/explore", {
    visitorCode: code,
  });
}

// 获取推荐列表
export function getExploreFeeds(params: {
  visitorCode: string;
  videos_id: string;
  galleries_id: string;
  video_offset: string;
  gallery_offset: string;
}): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.post("/item/explore", params);
}

// 获取用户信息
export function getUserInfo(params: {
  id: number; // 用户ID
}): Promise<ResponseConfig<any>> {
  return axios.get("/user", { params });
}

// getConfiguration
export function getConfiguration(): Promise<ResponseConfig<EmptyObjectType>> {
  return axios.get("/index/config");
}
