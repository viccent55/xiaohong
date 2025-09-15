import { defineStore } from "pinia";
import { setDefaultPermission } from "@/hooks/usePermisions";
import { PERMISSION } from "@/common/permision";
import { removeToken } from "@/hooks/useJWT";
import { closeLoginDialog, loginDialogVisible } from "@/hooks/useLoginDialog";

import type { UserDetailInfo } from "@/types/info";

export const useUserStore = defineStore("user", {
  state: () => ({
    isLogin: false,
    useId: -1,
    userInfo: {} as UserDetailInfo,
    visitCode: "",
    videos_id: "",
    token: {
      access_token: "",
      refresh_token: "",
    },
  }),
  actions: {
    // 使用token登录或密码登录
    async login(
      token: { access_token: string; refresh_token: string },
      userInfo: UserDetailInfo
    ) {
      this.token = {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };

      this.isLogin = true;
      this.userInfo = userInfo;
      this.useId = this.userInfo.id;
      setDefaultPermission(PERMISSION.User);
      closeLoginDialog();
    },
    // 退出登录
    logout() {
      if (!this.isLogin) return;
      // 移除 token
      removeToken();
      // 重置权限
      setDefaultPermission(PERMISSION.Visitor);
      this.useId = -1;
      this.userInfo = {} as UserDetailInfo;
      this.isLogin = false;
      window.location.href = "/";
      // 重置登录状态
      // this.isLogin = false;
      // 打开登录弹窗
      // openLoginDialog();
    },
  },
  getters: {
    loginDialogVisible: () => {
      return loginDialogVisible.value;
    },
  },
  persist: {
    pick: ["visitCode", "userInfo", "isLogin", "useId", "token"],
  },
});
