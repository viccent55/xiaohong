import type { ResponseConfig, ListConfig } from '@/types/axios'
import type { ExploreFeedInfo } from '@/types/info'
import axios from '@/utils/axios'

// 获取推荐列表
export function getExploreFeeds(params: {
  num: number // 数量
  channel: string // 频道标签
  only_pic: boolean // 只看图文
}): Promise<ResponseConfig<ListConfig<ExploreFeedInfo>>> {
  return axios.get('/feeds', { params })
}

// 获取用户信息
export function getUserInfo(params: {
  id: number // 用户ID
}): Promise<ResponseConfig<any>> {
  return axios.get('/user', { params })
}
