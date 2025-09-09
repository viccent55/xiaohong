<script setup lang="ts">
  import CloseButton from "@/components/global/CloseButton.vue";
  import { reactive, ref, watch } from "vue";
  import { loginDialogVisible, closeLoginDialog } from "@/hooks/useLoginDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { useUserStore } from "@/store/user";
  import { ElMessage } from "element-plus";
  import { login, register, veryCode } from "@/api/user";
  import ForgotPassword from "./ForgotPassword.vue";
  import { openPage } from "@/service";
  import { useStore } from "@/store";
  // state
  const dialogMode = ref<"all" | "left" | "right">();
  const store = useStore();
  const state = reactive({
    login: {
      email: "",
      password: "",
    },
    register: {
      email: "",
      password: "",
      password_repeat: "",
      invite_code: "",
      visitor: "",
      subscribed: 0,
    },
    isLogin: true,
    code: "",
  });
  // 监听屏幕宽度变化
  watch(
    () => screenMode.value,
    (value, oldValue) => {
      // 首次加载
      if (!oldValue) {
        dialogMode.value = screenMode.value === "pc" ? "all" : "right";
      }

      if (value === "pc") {
        dialogMode.value = "all";
      } else if (oldValue === "pc") {
        dialogMode.value = "right";
      }
    },
    { immediate: true }
  );
  // 关闭
  const handleClose = () => {
    state.isLogin = true;
    closeLoginDialog();
  };

  const storeUser = useUserStore();
  // 登录
  const onLogin = async () => {
    if (!state.login.email) {
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    if (!state.login.password) {
      ElMessage.warning("请输入您的密码");
      return;
    }
    try {
      const response = await login(state.login);
      if (response.errcode === 0) {
        storeUser.login(response.data?.token, response.data?.userinfo);
        ElMessage.success("登录成功");
        closeLoginDialog();
      } else {
        ElMessage.error(response.info);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const onPrepareRegister = async () => {
    if (!state.register.email) {
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    if (!state.register.password && !state.register.password_repeat) {
      ElMessage.warning("请输入您的密码");
      return;
    }
    if (state.register.password !== state.register.password_repeat) {
      ElMessage.warning("两次密码不一致");
      return;
    }
    try {
      state.register.visitor = storeUser.visitCode;
      const response = await register(state.register);
      if (response.errcode === 0) {
        ElMessage.success("请检查您的电子邮件以获取代码!");
      } else {
        ElMessage.error(response.info);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const onVerifyRegister = async () => {
    if (!state.register.email) {
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    if (!state.code) {
      ElMessage.warning("请输入您的代码");
      return;
    }

    try {
      const response = await veryCode({
        email: state.register.email,
        code: state.code,
      });
      if (response.errcode === 0) {
        ElMessage.success(response.info);
        closeLoginDialog();
      } else {
        ElMessage.error(response.info);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const onAuth = () => {
    if (state.isLogin) {
      onLogin();
    } else {
      onPrepareRegister();
    }
  };

  const forgotPasswordRef = ref();
  const openFogotDialog = () => {
    loginDialogVisible.value = false;
    forgotPasswordRef.value.openDialog();
  };
</script>

<template>
  <el-dialog
    v-model="loginDialogVisible"
    :width="screenMode === 'phone' ? '90%' : 'fit-content'"
    style="border-radius: 16px"
    :show-close="false"
    align-center
    @close="handleClose"
  >
    <div class="login-dialog">
      <!-- 关闭按钮 -->
      <CloseButton
        class="close-btn"
        @click="handleClose"
      />

      <!-- 手机号登录区域 -->
      <div
        class="right"
        v-if="dialogMode !== 'left'"
      >
        <h1>{{ state.isLogin ? "邮箱登录" : "邮箱注册" }}</h1>
        <el-form
          class="px-8 pt-2 pb-0 w-full"
          ref="form"
          label-position="top"
          label-width="auto"
          v-if="state.isLogin"
        >
          <el-form-item label="电子邮件">
            <el-input
              v-model="state.login.email"
              type="email"
              label="电子邮件"
              size="large"
            />
          </el-form-item>
          <el-form-item
            label="密码"
            size="large"
          >
            <el-input
              v-model="state.login.password"
              size="large"
              show-password
              type="password"
              @keydown.enter="onAuth()"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              size="large"
              class="w-full"
              round
              v-if="state.isLogin"
              @click="onAuth()"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <el-form
          v-else
          class="px-8 pt-2 pb-0 w-full"
          ref="form"
          label-position="left"
          label-width="auto"
        >
          <el-form-item style="margin-bottom: 0">
            <template #label>
              <span class="text-red-500 mr-1">*</span>
              电子邮件
            </template>
            <el-input
              v-model="state.register.email"
              type="email"
              label="电子邮件"
              size="large"
            />
          </el-form-item>
          <el-form-item label=" ">
            <el-checkbox
              v-model="state.register.subscribed"
              :true-label="1"
              :false-label="0"
            >
              <template #default>
                <div
                  class="md:mt-0 mt-3"
                  style="white-space: normal"
                >
                  <span class="text-xs text-gray-500">订阅邮箱</span>
                  <span class="ml-1 text-xs text-sky-800">
                    接收最新域名地址 永不失联
                  </span>
                </div>
              </template>
            </el-checkbox>
          </el-form-item>
          <el-form-item size="large">
            <template #label>
              <span class="text-red-500 mr-1">*</span>
              密码
            </template>
            <el-input
              v-model="state.register.password"
              size="large"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <template #label>
              <span class="text-red-500 mr-1">*</span>
              重复密码
            </template>
            <el-input
              v-model="state.register.password_repeat"
              type="password"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item
            label=""
            size="large"
          >
            <template #label>
              <span class="ml-3">邀请码</span>
            </template>
            <el-input
              v-model="state.register.invite_code"
              size="large"
              type="password"
            />
          </el-form-item>

          <el-form-item>
            <template #label>
              <span class="text-red-500 mr-1">*</span>
              邮箱验证码
            </template>
            <el-input
              v-model="state.code"
              placeholder="输入您的代码"
              size="large"
              type="text"
            >
              <template #append>
                <el-button
                  type="danger"
                  @click="onPrepareRegister"
                >
                  获取
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <div class="flex flex-col justify-end text-end w-100 mb-5">
            <el-button
              type="danger"
              size="large"
              class="w-full"
              round
              @click="onVerifyRegister"
            >
              注册
            </el-button>
          </div>
        </el-form>

        <div class="flex flex-col items-center gap-2 my-3 w-full px-8">
          <div class="flex justify-between w-full text-sm">
            <el-button
              @click="openFogotDialog"
              class="border-none"
              size="small"
              link
            >
              <span>忘记密码了吗？</span>
            </el-button>
            <div
              class="flex text-blue-500 cursor-pointer"
              @click="state.isLogin = !state.isLogin"
            >
              <div>{{ state.isLogin ? "没有账号？" : "已有账户？" }}</div>
            </div>
          </div>

          <div
            class="w-full"
            v-if="screenMode === 'phone'"
          >
            <ul
              class="grid grid-cols-1 my-0 justify-center list-disc text-blue-400 w-full"
            >
              <li>
                <el-link
                  :href="store.configuration?.home_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-xs">
                    {{ store.configuration?.home_url }}
                  </span>
                </el-link>
              </li>
              <li>
                <el-link
                  :href="store.configuration?.domain_next"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-xs">
                    {{ store.configuration?.domain_next }}
                  </span>
                </el-link>
              </li>
              <li>
                <el-link
                  :href="store.configuration?.domain_latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-xs">
                    {{ store.configuration?.domain_latest }}
                  </span>
                </el-link>
              </li>
              <li>
                <el-link
                  :href="`mailto:` + store.configuration?.email"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-xs">{{ store.configuration?.email }}</span>
                </el-link>
              </li>
            </ul>

            <div class="flex justify-center gap-6 mt-4 text-gray-600">
              <a
                :href="store?.configuration?.github"
                target="_blank"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <rect
                    width="16"
                    height="16"
                    fill="none"
                  />
                  <path
                    fill="currentColor"
                    d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"
                  />
                </svg>
              </a>
              <a
                :href="store?.configuration?.twitter"
                target="_blank"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="256"
                  height="209"
                  viewBox="0 0 256 209"
                >
                  <rect
                    width="256"
                    height="209"
                    fill="none"
                  />
                  <path
                    fill="#55acee"
                    d="M256 25.45a105 105 0 0 1-30.166 8.27c10.845-6.5 19.172-16.793 23.093-29.057a105.2 105.2 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52c0 4.117.465 8.125 1.36 11.97c-43.65-2.191-82.35-23.1-108.255-54.876c-4.52 7.757-7.11 16.78-7.11 26.404c0 18.222 9.273 34.297 23.365 43.716a52.3 52.3 0 0 1-23.79-6.57q-.004.33-.003.661c0 25.447 18.104 46.675 42.13 51.5a52.6 52.6 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475c-17.975 14.086-40.622 22.483-65.228 22.483c-4.24 0-8.42-.249-12.529-.734c23.243 14.902 50.85 23.597 80.51 23.597c96.607 0 149.434-80.031 149.434-149.435q0-3.417-.152-6.795A106.8 106.8 0 0 0 256 25.45"
                  />
                </svg>
              </a>
              <a
                :href="store?.configuration?.gitlab"
                target="_blank"
                aria-label="GitLab"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="256"
                  height="247"
                  viewBox="0 0 256 247"
                >
                  <rect
                    width="256"
                    height="247"
                    fill="none"
                  />
                  <path
                    fill="#e24329"
                    d="m251.845 97.642l-.328-.986l-34.85-90.903c-.657-1.808-1.972-3.287-3.616-4.274Q210.586 0 207.627 0c-1.973 0-3.78.822-5.26 1.973a8.73 8.73 0 0 0-3.124 4.767l-23.506 71.999H80.56l-23.506-72c-.493-1.808-1.644-3.451-3.123-4.766C52.45.822 50.643 0 48.67 0s-3.781.329-5.425 1.48c-1.644.986-2.96 2.465-3.617 4.273L4.781 96.656l-.33.986c-10.355 26.959-1.479 57.37 21.535 74.794h.328c0 .164 53.096 39.944 53.096 39.944l26.3 19.89l15.946 12c3.78 2.96 9.205 2.96 12.986 0l15.945-12l26.3-19.89l53.424-39.944c23.014-17.425 31.726-47.835 21.37-74.794z"
                  />
                  <path
                    fill="#fc6d26"
                    d="m251.845 97.642l-.328-.986c-17.26 3.616-33.205 10.85-46.849 21.04c-.164 0-41.424 31.398-76.602 57.863a18377 18377 0 0 0 48.657 36.821l53.424-39.944c23.013-17.425 31.726-47.835 21.37-74.794z"
                  />
                  <path
                    fill="#fca326"
                    d="m79.245 212.38l26.301 19.89l15.945 12c3.78 2.96 9.206 2.96 12.986 0l15.945-12l26.301-19.89s-22.684-17.095-48.657-36.82c-26.136 19.725-48.82 36.82-48.82 36.82"
                  />
                  <path
                    fill="#fc6d26"
                    d="M51.465 117.697c-13.644-10.192-29.589-17.589-46.849-21.04l-.329.985c-10.356 26.959-1.479 57.37 21.534 74.794h.33c0 .164 53.094 39.944 53.094 39.944s22.685-17.095 48.821-36.82c-35.013-26.466-76.272-57.699-76.601-57.863"
                  />
                </svg>
              </a>
            </div>
            <el-button
              type="warning"
              class="w-full mt-4"
              round
              @click="openPage(store.configuration?.download_app_url)"
            >
              <span>App下载</span>
            </el-button>
          </div>
        </div>
        <!-- <div class="other">
          <input
            type="checkbox"
            v-model="form.agreeProtocol"
          />
          <span>我已阅读并同意相关协议</span>
        </div> -->
      </div>
    </div>
  </el-dialog>
  <ForgotPassword
    ref="forgotPasswordRef"
    @open="loginDialogVisible = true"
  />
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .login-dialog {
    display: flex;
    position: relative;

    .mobile-mode({
      flex-direction: column;
    });
  }

  // 关闭按钮
  .close-btn {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  // 移动端切换按钮
  .bottom {
    display: none;
    text-align: center;
    border-top: 1px solid var(--border-color);

    button {
      .btn-base();
      width: 80%;
      background-color: var(--background-color-dark);
      margin: 16px;
    }

    .mobile-mode({
      display: block;
    });
  }

  // 扫码登录区域
  .left {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .mobile-mode({
    min-width: 100%;
    padding: 20px 0;
  });

    .header {
      width: 100%;
      padding: 32px 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        padding: 0 20px;
        margin-bottom: 20px;
        border-radius: 999px;
        height: 48px;
        line-height: 48px;
        font-size: 1.2rem;
        text-align: center;
        color: #3d8af5;
        font-weight: 600;
        // background-color: rgba(61, 138, 245, 0.1);
      }

      img {
        height: 32px;
      }
    }

    // 二维码区域
    .code-area {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .qrcode-wrapper {
        width: 160px;
        height: 160px;
        border-radius: 16px;
        border: 1px solid var(--border-color);
        position: relative;
        overflow: hidden;

        span {
          position: absolute;
          color: var(--primary-color);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          cursor: pointer;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .tip {
        color: var(--text-color-dark);
        margin-top: 20px;
        margin-bottom: auto;

        span {
          font-weight: 600;
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }

  // 手机号登录区域
  .right {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .mobile-mode({
    min-width: 100%;
  });

    h1 {
      margin-top: 20px;
      font-size: 18px;
      color: var(--text-color-dark);
    }

    .input {
      width: 300px;
      height: 48px;
      .btn-large();

      .mobile-mode({
      width: 90%;
    });

      input {
        width: 100%;
        background-color: transparent;
      }

      &:first-of-type {
        margin-top: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          border-right: 1px solid var(--border-color);
          padding-right: 8px;
          margin-right: 8px;
        }
      }

      &:nth-of-type(2) {
        display: flex;
        justify-content: center;
        align-items: center;

        button {
          white-space: nowrap;
          color: var(--primary-color);
        }
      }

      &:not(:last-of-type) {
        background-color: var(--background-color-dark);
        margin-bottom: 16px;
      }

      &:last-of-type {
        color: var(--background-color);
        background-color: var(--primary-color);
      }
    }

    .other {
      display: flex;
      align-items: center;
      margin: 6px 0;

      span {
        margin-left: 8px;
        font-size: 14px;
      }
    }
  }

  .bottom-tip {
    margin-top: auto;
    font-size: 14px;
    margin-bottom: 36px;
  }

  .social-link-item {
    img {
      width: 32px;
      height: 32px;
      transition: transform 0.2s ease-in-out;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
</style>
