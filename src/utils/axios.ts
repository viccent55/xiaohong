import axios, { type AxiosInstance } from 'axios'
import { appendToken } from '@/hooks/useJWT'
import { useUserStore } from '@/store/user'

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  config => {
    appendToken(config)
    console.log(
      `Request: ${config.url}\n`,
      config.method === 'get' ? config.params : config.data,
      '\ntoken:',
      config.headers.Authorization,
    )
    return config
  },
  error => {
    console.log(error)
  },
)

instance.interceptors.response.use(
  response => {
    console.log(`Response: ${response.config.url}\n`, response.data)
    // 正常响应
    if (response.status === 200) {
      return response.data
    }
    // 未登录或登录过期
    if (response.status === 401 || response.status === 403) {
      const userStore = useUserStore()
      userStore.logout()
      return Promise.reject(response.data)
    }
    return Promise.reject(response.data)
  },
  error => {
    console.log(error)
  },
)

export default instance
