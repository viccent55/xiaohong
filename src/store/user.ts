import { defineStore } from 'pinia'
import { setDefaultPermission } from '@/hooks/usePermisions'
import { PERMISSION } from '@/common/permision'
import { writeToken, removeToken } from '@/hooks/useJWT'
import { closeLoginDialog, openLoginDialog } from '@/hooks/useLoginDialog'
import { login as apiLogin } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    useId: -1,
  }),
  actions: {
    // 使用token登录或密码登录
    async login(params?: { phone: number; captcha: number }) {
      apiLogin(params ? params : undefined).then(res => {
        if (res.code === 200) {
          // 写入 token
          writeToken(res.data.token)
          // 设置权限
          setDefaultPermission(PERMISSION.User)
          // 设置登录状态
          this.isLogin = true

          this.useId = parseInt(res.data.id)

          // 关闭登录弹窗
          closeLoginDialog()
        } else {
          // 打开登录弹窗
          openLoginDialog()
        }
      })
    },
    // 退出登录
    logout() {
      if (!this.isLogin) return
      // 移除 token
      removeToken()
      // 重置权限
      setDefaultPermission(PERMISSION.Visitor)
      // 重置登录状态
      this.isLogin = false
      // 打开登录弹窗
      openLoginDialog()
    },
  },
})
