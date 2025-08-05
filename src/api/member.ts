import type { ListConfig, ResponseConfig } from '@/types/axios'
import type { 
  MemberCenterInfo, 
  MyCommentInfo, 
  MyCollectionInfo, 
  MyLikeInfo, 
  SystemMessageInfo 
} from '@/types/info'
import axios from '@/utils/axios'

// 获取会员中心完整信息
export const getMemberCenterInfo = (
  userId: string,
): Promise<ResponseConfig<MemberCenterInfo>> => {
  return axios.get('/member/center', { params: { userId } })
}

// 获取我的评论列表
export const getMyComments = (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ResponseConfig<ListConfig<MyCommentInfo>>> => {
  return axios.get('/member/comments', { params: { userId, page, limit } })
}

// 获取我的收藏列表
export const getMyCollections = (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ResponseConfig<ListConfig<MyCollectionInfo>>> => {
  return axios.get('/member/collections', { params: { userId, page, limit } })
}

// 获取我的点赞列表
export const getMyLikes = (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ResponseConfig<ListConfig<MyLikeInfo>>> => {
  return axios.get('/member/likes', { params: { userId, page, limit } })
}

// 获取系统消息列表
export const getSystemMessages = (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ResponseConfig<ListConfig<SystemMessageInfo>>> => {
  return axios.get('/member/messages', { params: { userId, page, limit } })
}

// 标记系统消息为已读
export const markMessageAsRead = (
  messageId: string,
): Promise<ResponseConfig<boolean>> => {
  return axios.post('/member/messages/read', { messageId })
}

// 批量标记系统消息为已读
export const markAllMessagesAsRead = (
  userId: string,
): Promise<ResponseConfig<boolean>> => {
  return axios.post('/member/messages/read-all', { userId })
}

// 删除评论
export const deleteMyComment = (
  commentId: string,
): Promise<ResponseConfig<boolean>> => {
  return axios.delete('/member/comments', { params: { commentId } })
}

// 取消收藏
export const removeFromCollection = (
  collectionId: string,
): Promise<ResponseConfig<boolean>> => {
  return axios.delete('/member/collections', { params: { collectionId } })
}

// 取消点赞
export const removeLike = (
  likeId: string,
): Promise<ResponseConfig<boolean>> => {
  return axios.delete('/member/likes', { params: { likeId } })
}