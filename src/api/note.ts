import axios from "@/utils/request";
import type { ResponseConfig } from "@/types/axios";
import type { CommentBlockInfo, CommentInfo } from "@/types/info";

// 获取文章细节
export const getNoteDetail = (
  id: number,
  visitor: string
): Promise<ResponseConfig<EmptyObjectType>> => {
  return axios.post("/item/detail", { id, visitor });
};

// 获取评论
export const getComments = (
  id: number,
  num: number
): Promise<ResponseConfig<CommentBlockInfo[]>> => {
  return axios.get("/member/comments", { params: { id, num } });
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
  return axios.post("/member/like", { id });
};


export const follow = (
  id: number
): Promise<ResponseConfig<EmptyObjectType>> => {
  return axios.post("/member/follow", { owner: id });
};

export const unFollow = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/member/unFollow", { id });
};

export const star = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/member/collect", { id });
};

export const unstar = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/unstar", { id });
};

export const report = (id: number): Promise<ResponseConfig<null>> => {
  return axios.post("/report", { id });
};
