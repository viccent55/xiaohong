import axios from '@/utils/axios'
import type { ResponseConfig } from '@/types/axios'
import type {
  CommentBlockInfo,
  CommentInfo,
  NoteDetailInfo,
} from '@/types/info'

// 获取文章细节
export const getNoteDetail = (
  id: string,
): Promise<ResponseConfig<NoteDetailInfo>> => {
  return axios.get('/noteDetail', { params: { id } })
}

// 获取评论
export const getComments = (
  id: string,
  num: number,
): Promise<ResponseConfig<CommentBlockInfo[]>> => {
  return axios.get('/comments', { params: { id, num } })
}

// 获取回复
export const getReplies = (
  id: string,
  num: number,
): Promise<ResponseConfig<CommentInfo[]>> => {
  return axios.get('/replies', { params: { id, num } })
}

// 回复
export const reply = (
  id: string,
  content: string,
  to?: string,
): Promise<ResponseConfig<CommentInfo>> => {
  return axios.post('/reply', { id, to, content })
}

// 点赞
export const like = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/like', { id })
}

// 取消点赞
export const unlike = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/unlike', { id })
}

// 关注
export const follow = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/follow', { id })
}

// 取消关注
export const unfollow = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/unfollow', { id })
}

// 收藏
export const star = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/star', { id })
}

// 取消收藏
export const unstar = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/unstar', { id })
}

// 举报
export const report = (id: string): Promise<ResponseConfig<null>> => {
  return axios.post('/report', { id })
}
