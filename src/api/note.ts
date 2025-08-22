import axios from "@/utils/request";
import type { ResponseConfig } from "@/types/axios";
import type { CommentBlockInfo, CommentInfo } from "@/types/info";

// 获取文章细节
export const getNoteDetail = (
  id: number
): Promise<ResponseConfig<EmptyObjectType>> => {
  return axios.post("/item/detail", { id: id });
};

// 获取评论
export const getComments = (
  id: number,
  num: number
): Promise<ResponseConfig<CommentBlockInfo[]>> => {
  return axios.get("/comments", { params: { id, num } });
};

// 获取回复
export const getReplies = (
  id: number,
  num: number
): Promise<ResponseConfig<CommentInfo[]>> => {
  return axios.get("/replies", { params: { id, num } });
};

// 回复
export const reply = (
  id: number,
  content: string,
  to?: string
): Promise<ResponseConfig<CommentInfo>> => {
  return axios.post("/member/comment", { item_id: id, content });
};

// 点赞
export const like = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/like", { id });
};

// 取消点赞
export const unlike = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/unlike", { id });
};

export const subscribe = (id: number): Promise<ResponseConfig<EmptyObjectType>> => {
  return axios.post("/member/subscribe", { id });
};

export const unSubscribe = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/member/unfollow", { id });
};

export const star = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/star", { id });
};

export const unstar = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/unstar", { id });
};

export const report = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/report", { id });
};
