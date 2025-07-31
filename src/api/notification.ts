import axios from '@/utils/axios'
import type { ListConfig, ResponseConfig } from '@/types/axios'
import type { NotificationInfo } from '@/types/info'

export function getNotificationCount(
  id: string,
): Promise<ResponseConfig<number[]>> {
  return axios.get('/notification/count', { params: { id } })
}

// 获取关注你通知
export function getNotificationInfo(
  id: string,
  num: number,
  index: number,
): Promise<ResponseConfig<ListConfig<NotificationInfo>>> {
  return axios.get('/notification/info', { params: { id, num, index } })
}
