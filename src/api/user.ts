import type { ListConfig, ResponseConfig } from '@/types/axios'
import type { ExploreFeedInfo, UserDetailInfo } from '@/types/info'
import axios from '@/utils/axios'

// 获取
export const getUserInfo = (
  id: string,
): Promise<ResponseConfig<UserDetailInfo>> => {
  return axios.get('/user/info', { params: { id } })
}

// 获取笔记
export const getNoteFeeds = (
  id: string,
  num: number,
): Promise<ResponseConfig<ListConfig<ExploreFeedInfo>>> => {
  return axios.get('/user/notefeeds', { params: { id, num } })
}

// 获取收藏
export const getStarFeeds = (
  id: string,
  num: number,
): Promise<ResponseConfig<ListConfig<ExploreFeedInfo>>> => {
  return axios.get('/user/starfeeds', { params: { id, num } })
}
