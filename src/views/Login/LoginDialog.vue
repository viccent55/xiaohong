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
    step: 1,
    verifyRegister: {
      email: "",
      code: "",
    },
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
      const request = {
        ...state.register,
        visitor: storeUser.visitCode,
        chan: store.chan ?? "",
      };
      const response = await register(request);
      if (response.errcode === 0) {
        ElMessage.success("已申请注册!");
        state.step++;
      } else {
        ElMessage.error(response.info);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const onVerifyRegister = async () => {
    // if (!state.verifyRegister.email) {
    //   ElMessage.warning("请输入您的代码");
    //   return;
    // }
    if (!state.verifyRegister.code) {
      ElMessage.warning("请输入您的代码");
      return;
    }

    try {
      const response = await veryCode({
        email: state.register.email,
        code: state.verifyRegister.code,
      });
      if (response.errcode === 0) {
        ElMessage.success(response.info);
        state.step = 1;
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
        <h4>{{ state.isLogin ? "邮箱登录" : "邮箱注册" }}</h4>
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
        <div v-else>
          <div class="py-2">
            <el-steps
              style="max-width: 600px; margin: auto"
              :active="state.step"
              align-center
            >
              <el-step
                title="步骤 1"
                description="注册账户"
              />
              <el-step
                title="步骤 2"
                description="验证你的邮箱"
              />
            </el-steps>
          </div>
          <el-form
            v-if="state.step === 1"
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

            <div class="flex flex-col justify-end text-end w-100 mb-5">
              <el-button
                type="danger"
                size="large"
                class="w-full"
                round
                @click="onPrepareRegister"
              >
                注册
              </el-button>
            </div>
          </el-form>
          <el-form
            v-if="state.step === 2"
            class="px-8 pt-2 pb-0 w-full"
            ref="form"
            label-position="left"
            label-width="auto"
          >
            <!-- <el-form-item>
              <template #label>
                <span class="text-red-500 mr-1">*</span>
                电子邮件
              </template>
              <el-input
                v-model="state.verifyRegister.email"
                type="email"
                label="电子邮件"
                placeholder="输入您的电子邮件"
                size="large"
              />
            </el-form-item> -->
            <el-form-item>
              <template #label>
                <span class="text-red-500 mr-1">*</span>
                邮箱验证码
              </template>
              <el-input
                v-model="state.verifyRegister.code"
                placeholder="输入您的代码"
                size="large"
                type="text"
              ></el-input>
            </el-form-item>
            <div class="flex flex-col justify-end text-end w-100 mb-5">
              <el-button
                type="danger"
                size="large"
                class="w-full"
                round
                @click="onVerifyRegister"
              >
                验证电子邮件
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="flex flex-col items-center gap-2 my-3 w-full px-8">
          <div class="flex justify-between w-full text-sm">
            <el-button
              v-if="state.isLogin"
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
              <div>
                {{
                  state.isLogin
                    ? "没有账号？"
                    : state.step == 1
                    ? "已有账户？去登录"
                    : "暂不验证 去登录"
                }}
              </div>
            </div>
          </div>

          <div
            class="w-full"
            v-if="screenMode === 'phone'"
          >
            <el-button
              type="warning"
              class="w-full my-4"
              round
              @click="openPage(store.configuration?.download_app_url)"
            >
              <span>App下载</span>
            </el-button>
            <ul
              class="grid grid-cols-1 my-0 justify-center list-none w-full px-0"
            >
              <li>
                <span class="text-xs">备用地址：</span>
                <el-link
                  :href="store.configuration?.home_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-sm">
                    {{ store.configuration?.home_url }}
                  </span>
                </el-link>
              </li>
              <li>
                <span class="text-xs">备用地址：</span>
                <el-link
                  :href="store.configuration?.domain_next"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-sm">
                    {{ store.configuration?.domain_next }}
                  </span>
                </el-link>
              </li>
              <li>
                <span class="text-xs">永久域名：</span>
                <el-link
                  :href="store.configuration?.domain_latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-sm">
                    {{ store.configuration?.domain_latest }}
                  </span>
                </el-link>
              </li>
              <li>
                <span class="text-xs">防失联邮箱：</span>

                <el-link
                  :href="store.configuration?.email"
                  target="_blank"
                  rel="noopener noreferrer"
                  type="primary"
                >
                  <span class="text-sm">
                    {{ store.configuration?.email }}
                  </span>
                </el-link>
              </li>
            </ul>
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

      h4 {
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

    h4 {
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
