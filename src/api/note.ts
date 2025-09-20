import axios from "@/utils/request";
import type { ResponseConfig } from "@/types/axios";
import type { CommentBlockInfo, CommentInfo } from "@/types/info";



// 获取评论
export const getComments = (
  id: string | number
): Promise<ResponseConfig<CommentBlockInfo[]>> => {
  return axios.post("/item/comments", {
    id: id,
  });
};

// 获取回复
export const getReplies = (
  id: String | Number,
  num: number
): Promise<ResponseConfig<CommentInfo[]>> => {
  return axios.get("/replies", { params: { id, num } });
};

// 回复
export const reply = (
  id: string | number,
  content: string,
  pid: number
): Promise<ResponseConfig<CommentInfo>> => {
  return axios.post("/member/comment", { id, pid, content });
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

export const search = (keyword: string): Promise<ResponseConfig<null>> => {
  return axios.post("/member/search", { keyword });
};
