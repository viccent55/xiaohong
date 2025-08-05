<script setup lang="ts">
  import CloseButton from "@/components/global/CloseButton.vue";
  import Qrcode from "qrcode";
  import { reactive, ref, watch } from "vue";
  import { loginDialogVisible, closeLoginDialog } from "@/hooks/useLoginDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { getCaptcha, getQrcode } from "@/api/login";
  import { useUserStore } from "@/store/user";
  import { ElMessage } from "element-plus";
  import { useRouter } from "vue-router";

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
  const router = useRouter();
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
  const getCode = () => {
    console.log("获取验证码");
    if (form.phone.length !== 11) {
      ElMessage.warning("请输入正确的手机号");
      return;
    }
    getCaptcha({ phone: form.phone }).then((res) => {
      if (res.code !== 200) return;
      ElMessage.success("验证码已发送");
      form.captcha = "123456";
      form.timer = 60;
      // 启动倒计时
      let countDown = setInterval(() => {
        if (form.timer <= 0) {
          clearInterval(countDown);
        } else {
          form.timer--;
        }
      }, 1000);
    });
  };
  // 登录
  const login = () => {
    if (form.phone == "" || form.captcha == "") {
      ElMessage.warning("请填写手机号和验证码");
      return;
    }
    if (!form.agreeProtocol) {
      ElMessage.warning("请阅读并同意相关协议");
      return;
    }
    router.push("/member");
    const userStore = useUserStore();
    userStore.login({
      phone: parseInt(form.phone),
      captcha: parseInt(form.captcha),
    });
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
        <div class="input">
          <span>+86</span>
          <input
            placeholder="输入手机号"
            v-model="form.phone"
          />
        </div>
        <div class="input">
          <input
            placeholder="输入验证码"
            v-model="form.captcha"
          />
          <button v-if="form.timer > 0">{{ form.timer }} 秒后重新获取</button>
          <button
            v-else
            @click.stop="getCode"
          >
            获取验证码
          </button>
        </div>
        <button
          class="input"
          @click="login"
        >
          登录
        </button>
        <div class="other">
          <input
            type="checkbox"
            v-model="form.agreeProtocol"
          />
          <span>我已阅读并同意相关协议</span>
        </div>
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
        margin-top: 32px;
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
      margin: 12px 0;

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
    margin-bottom: 32px;
  }
</style>
