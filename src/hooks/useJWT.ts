/**
 * 使用localStorage存储JWT token，并在每次请求时附带上token。
 */

const TOKEN_KEY = 'jwtToken'

// 向请求头中添加token
function appendToken(config: any) {
  const token = localStorage.getItem(TOKEN_KEY)

  // 检查token是否存在，如果不存在，则返回
  if (!token) {
    return
  }

  // 向请求头中添加token
  config.headers.Authorization = `Bearer ${token}`
}

// 将新的token写入localStorage
function writeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除token
function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export { appendToken, writeToken, removeToken }
