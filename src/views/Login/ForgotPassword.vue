<script setup lang="ts">
  import CloseButton from "@/components/global/CloseButton.vue";
  import { reactive, ref } from "vue";
  import { screenMode } from "@/hooks/useScreenMode";
  import { ElMessage } from "element-plus";
  import { forgotPassword, resetPassword } from "@/api/user";

  // state
  const state = reactive({
    email: "",
    code: "",
    password: "",
    password_repeat: "",
  });

  const getCode = async () => {
    if (!state.email) {
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    const response = await forgotPassword(state.email);
    if (response.errcode !== 0) {
      ElMessage.error(response.info);
      return;
    }
    ElMessage({
      type: "success",
      message: `邮件已发送至您的邮箱:${state.email}`,
    });
  };
  const forgotPasswordDialog = ref(false);
  const openDialog = () => {
    forgotPasswordDialog.value = true;
  };

  const emit = defineEmits(['open'])
  const onResetPassword = async () => {
    if (!state.email) {
      ElMessage.warning("请输入您的电子邮件");
      return;
    }
    if (!state.code) {
      ElMessage.warning("请输入您的代码");
      return;
    }
    if (!state.password) {
      ElMessage.warning("请输入您的密码");
      return;
    }
    if (state.password !== state.password_repeat) {
      ElMessage.warning("两次密码不一致");
      return;
    }
    const response = await resetPassword(state);
    if (response.errcode !== 0) {
      ElMessage.error(response.info);
      return;
    }
    ElMessage({
      type: "success",
      message: "密码重置成功",
    });
    forgotPasswordDialog.value = false;
    emit('open');
  };
  defineExpose({
    openDialog,
  });
</script>

<template>
  <el-dialog
    v-model="forgotPasswordDialog"
    :width="screenMode === 'phone' ? '90%' : 'fit-content'"
    style="border-radius: 16px"
    :show-close="false"
    align-center
  >
    <template #default>
      <!-- 关闭按钮 -->
      <CloseButton
        class="close-btn"
        @click="forgotPasswordDialog = false"
      />

      <h1 class="text-center">忘记密码！</h1>
      <el-form
        class="p-10 pb-0 w-full"
        ref="form"
        label-position="top"
        label-width="auto"
      >
        <el-form-item>
          <template #label>
            <span class="text-red-500 mr-1">*</span>
            电子邮件
          </template>
          <el-input
            v-model="state.email"
            type="email"
            label="电子邮件"
            size="large"
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
                @click="getCode"
              >
                获取
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item size="large">
          <template #label>
            <span class="text-red-500 mr-1">*</span>
            密码
          </template>
          <el-input
            v-model="state.password"
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
            v-model="state.password_repeat"
            type="password"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            size="large"
            class="w-full"
            round
            @click="onResetPassword()"
          >
            重置密码
          </el-button>
        </el-form-item>
      </el-form>
    </template>
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
      margin-top: 48px;
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
</style>
