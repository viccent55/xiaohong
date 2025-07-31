import type { ResponseConfig } from '@/types/axios'
import axios from '@/utils/axios'

// 获取二维码
export function getQrcode(): Promise<ResponseConfig<string>> {
  return axios.get('/qrcode')
}

// 获取验证码
export function getCaptcha(params: {
  phone: string
}): Promise<ResponseConfig<null>> {
  return axios.post('/captcha', { params })
}

// 登录
export function login(params?: {
  phone: number
  captcha: number
}): Promise<ResponseConfig<{ token: string; id: string }>> {
  return axios.post('/login', params ? params : null)
}

// 登出
export function logout(): Promise<ResponseConfig<null>> {
  return axios.get('/logout')
}
