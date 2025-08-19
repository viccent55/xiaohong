/**
 * 使用localStorage存储JWT token，并在每次请求时附带上token。
 */

import { Session } from "@/utils/storage"

const TOKEN_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'


// 向请求头中添加token
function appendToken(config: any) {
  
  const token = Session.get(TOKEN_KEY)
  const refresh = Session.get(REFRESH_KEY)
  // 检查token是否存在，如果不存在，则返回
  if (!token && refresh) {
    console.log('call refresh function ....')
  } else return;

  // 向请求头中添加token
  config.headers.Authorization = `Bearer ${token}`
}

// 将新的token写入localStorage
function writeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function refreshToken(refresh_token: string) {
  localStorage.setItem(REFRESH_KEY, refresh_token)
}

// 移除token
function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export { appendToken, refreshToken, writeToken, removeToken }
