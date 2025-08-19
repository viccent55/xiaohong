<script setup lang="ts">
  import CloseButton from "@/components/global/CloseButton.vue";
  import Qrcode from "qrcode";
  import { reactive, ref, watch } from "vue";
  import { loginDialogVisible, closeLoginDialog } from "@/hooks/useLoginDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { getQrcode } from "@/api/login";
  import { useUserStore } from "@/store/user";
  import { ElMessage } from "element-plus";
  import { login, register, veryCode } from "@/api/user";

  // state
  const dialogMode = ref<"all" | "left" | "right">();
  // 表单
  const form = reactive({
    qrcode: "",
    phone: "",
    captcha: "",
    agreeProtocol: false,
    timer: 0,
  });
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
    },
    codeVerify: {
      isShowEmail: false,
      email: "",
      code: "",
    },
    isLogin: true,
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
    closeLoginDialog();
    form.agreeProtocol = false;
    form.qrcode = "";
    form.phone = "";
    form.captcha = "";
  };
  // 获取二维码
  const getQRCode = () => {
    console.log("获取验证码");
    getQrcode().then((res) => {
      Qrcode.toDataURL(res.data, (err, url) => {
        if (err) {
          console.error(err);
        } else {
          form.qrcode = url;
        }
      });
    });
  };
  // 获取验证码
  const onVerifyCode = async () => {
    if (!state.codeVerify.email) {
      state.codeVerify.isShowEmail = true;
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    if (!state.codeVerify.code) {
      return ElMessage.warning("请输入您的代码!");
    }
    const request = {
      email: state.codeVerify.email,
      code: state.codeVerify.code,
    };
    const response = await veryCode(request);
    if (response.errcode === 0) {
      ElMessage.success("代码验证成功!");
    } else {
      ElMessage.error(response.info);
    }
    console.log(response);
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
      console.log(response);
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
  const onRegister = async () => {
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
      const response = await register(state.register);
      if (response.errcode === 0) {
        ElMessage.success("代码已发送至您的邮箱!");
        state.codeVerify.email = state.register.email;
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
      onRegister();
    }
  };
  // 切换模式
  const switchDialogMode = () => {
    console.log("切换模式");
    dialogMode.value = dialogMode.value === "left" ? "right" : "left";
  };
</script>

<template>
  <el-dialog
    v-model="loginDialogVisible"
    width="fit-content"
    style="border-radius: 16px"
    :show-close="false"
    align-center
  >
    <div class="login-dialog">
      <!-- 关闭按钮 -->
      <CloseButton
        class="close-btn"
        @click="handleClose"
      />

      <!-- 扫码登录区域 -->
      <!-- prettier-ignore -->
      <div class="left" v-if="dialogMode !== 'right'">
        <div class="header">
          <h1>登录后推荐更懂你的笔记</h1>
          <img src="/logo.png">
        </div>

        <div class="code-area">
          <div class="qrcode-wrapper" @click.stop="getQRCode">
            <span v-if="!form.qrcode">获取二维码</span>
            <img v-else :src="form.qrcode"  />
          </div>
          <div class="tip flex gap-2  items-center">
           <div class="flex  gap-1">
            <span>可用 </span>
            <img width="18px" height="18px" src="@/assets/svg/小红书.svg" />
            <span> 小红书</span></div>
            或 
           <div class="flex gap-2 items-center">
            <img width="18px" height="18px"  src="@/assets/svg/微信.svg" /> 
             <span>微信</span>
           </div>
           <div>
             扫码
           </div>
          </div>
           <div class="mt-10">小红书如何扫码</div>
        </div>
        
      </div>

      <!-- 手机号登录区域 -->
      <div
        class="right"
        v-if="dialogMode !== 'left'"
      >
        <h1>手机号登录</h1>
        <el-form
          class="p-10 pb-0 w-full"
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
        </el-form>
        <el-form
          v-else
          class="p-10 pb-0 w-full"
          ref="form"
          label-position="left"
          label-width="auto"
        >
          <el-form-item label="电子邮件">
            <el-input
              v-model="state.register.email"
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
              v-model="state.register.password"
              size="large"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="重复密码">
            <el-input
              v-model="state.register.password_repeat"
              type="password"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item
            label="邀请码"
            size="large"
          >
            <el-input
              v-model="state.register.invite_code"
              size="large"
              type="password"
            />
          </el-form-item>
          <div class="flex justify-end text-end w-100 mb-5">
            <el-button
              type="danger"
              class="w-[100px]"
              @click="onRegister"
            >
              注册
            </el-button>
          </div>

          <el-form-item
            label="电子邮件"
            v-if="state.codeVerify.isShowEmail"
          >
            <el-input
              v-model="state.codeVerify.email"
              type="email"
              label="电子邮件"
              size="large"
            />
          </el-form-item>
          <el-form-item label="代码">
            <el-input
              v-model="state.codeVerify.code"
              placeholder="请输入您的代码"
              size="large"
              type="text"
            >
              <template #append>
                <el-button
                  type="danger"
                  @click="onVerifyCode"
                >
                  确认码
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <button
          class="input"
          v-if="state.isLogin"
          @click="onAuth()"
        >
          登录
        </button>
        <div class="flex justify-center my-3">
          <div>{{ state.isLogin ? "没有账号？" : "已有账户？" }}</div>
          <div
            @click="state.isLogin = !state.isLogin"
            class="text-blue cursor-pointer"
          >
            {{ state.isLogin ? "请注册" : "登录" }}
          </div>
        </div>
        <!-- <div class="other">
          <input
            type="checkbox"
            v-model="form.agreeProtocol"
          />
          <span>我已阅读并同意相关协议</span>
        </div> -->
        <span class="bottom-tip">新用户可直接登录</span>
      </div>

      <div class="bottom">
        <button @click="switchDialogMode">切换</button>
      </div>
    </div>
  </el-dialog>
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

    h1 {
      margin-top: 48px;
      font-size: 18px;
      color: var(--text-color-dark);
    }

    .input {
      width: 300px;
      height: 48px;
      .btn-large();

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

    @media (min-width: @pad-width) {
      border-left: 1px solid var(--border-color);
    }
  }

  .bottom-tip {
    margin-top: auto;
    font-size: 14px;
    margin-bottom: 36px;
  }
</style>
