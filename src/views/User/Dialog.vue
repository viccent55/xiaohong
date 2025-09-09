<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from "vue";
  import { ElMessage } from "element-plus";
  import { setUserInfo, changePassword } from "@/api/user";
  import AvatarUpload from "@/components/AvatarUpload.vue";
  import Qrcode from "qrcode";
  import { useRoute } from "vue-router";

  const dialogVisible = ref(false);
  const activeTab = ref("userinfo");
  import { screenMode } from "@/hooks/useScreenMode";

  const props = defineProps({
    user: {
      type: Object,
      default: () => {},
    },
  });
  // User info form
  const userInfo = reactive({
    avatar: "",
    nickname: "",
    slogan: "",
  });
  watch(
    () => dialogVisible.value,
    (v) => {
      if (v) {
        userInfo.nickname = props.user.nickname;
        userInfo.avatar = props.user.avatar || "/avatar/user/header.png";
        userInfo.slogan = props.user.slogan;
      }
    }
  );

  // QR Code logic
  const qrcodeDialogVisible = ref(false);
  const qrcodeUrl = ref("");
  const route = useRoute();
  const generateQrcode = async () => {
    const id = props.user.id || route.params?.id;
    if (id) {
      const url = `${window.location.origin}/#/user/${id}`;
      try {
        qrcodeUrl.value = await Qrcode.toDataURL(url, { width: 300 });
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    }
  };

  const openQrcode = () => {
    if (qrcodeUrl.value) {
      qrcodeDialogVisible.value = true;
    }
  };

  // Reset password form
  const resetForm = reactive({
    password_old: "",
    password: "",
    password_repeat: "",
  });
  const emit = defineEmits(["refresh"]);
  // Actions
  const updateUserInfo = async () => {
    try {
      const response = await setUserInfo(userInfo);
      if (response.errcode === 0) {
        ElMessage.success("用户信息已更新！");
      } else {
        ElMessage.error(response.info);
      }
      dialogVisible.value = false;
      emit("refresh");
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const resetPassword = async () => {
    try {
      const response = await changePassword(resetForm);
      if (response.errcode === 0) {
        ElMessage.success("密码重置成功！");
      } else {
        ElMessage.error(response.info);
      }
      dialogVisible.value = false;
      emit("refresh");
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  onMounted(() => {
    generateQrcode();
  });
</script>

<template>
  <div>
    <div class="flex flex-col align-middle items-center">
      <el-button
        round
        type="primary"
        :size="screenMode === 'phone' ? 'small' : 'default'"
        @click="dialogVisible = true"
      >
        编辑资料
      </el-button>
      <el-avatar
        @click="openQrcode"
        shape="square"
        :size="80"
        :src="qrcodeUrl"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="用户设置"
      :width="screenMode === 'phone' ? '90%' : '500px'"
      destroy-on-close
    >
      <el-tabs v-model="activeTab">
        <!-- Update User Info -->
        <el-tab-pane
          label="用户信息"
          name="userinfo"
        >
          <el-form-item>
            <div class="avatar-center">
              <AvatarUpload v-model="userInfo.avatar" />
            </div>
          </el-form-item>
          <el-form
            :model="userInfo"
            label-width="80px"
          >
            <el-form-item label="昵称">
              <el-input
                v-model="userInfo.nickname"
                placeholder="请输入昵称"
              />
            </el-form-item>

            <el-form-item label="签名">
              <el-input
                v-model="userInfo.slogan"
                placeholder="请输入签名"
              />
            </el-form-item>
          </el-form>

          <div class="flex justify-end gap-2 mt-4">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="updateUserInfo"
            >
              保存
            </el-button>
          </div>
        </el-tab-pane>

        <!-- Reset Password -->
        <el-tab-pane
          label="重置密码"
          name="resetpass"
        >
          <el-form
            :model="resetForm"
            label-width="100px"
          >
            <el-form-item label="旧密码">
              <el-input
                v-model="resetForm.password_old"
                type="password"
                show-password
              />
            </el-form-item>

            <el-form-item label="新密码">
              <el-input
                v-model="resetForm.password"
                type="password"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码">
              <el-input
                v-model="resetForm.password_repeat"
                type="password"
                show-password
              />
            </el-form-item>
          </el-form>

          <div class="flex justify-end gap-2 mt-4">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button
              type="danger"
              @click="resetPassword"
            >
              重置
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- QR Code Dialog -->
    <el-dialog
      v-model="qrcodeDialogVisible"
      width="fit-content"
      align-center
    >
      <img
        v-if="qrcodeUrl"
        :src="qrcodeUrl"
        alt="User Profile QR Code"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
  .flex {
    display: flex;
  }
  .gap-2 {
    gap: 8px;
  }
  .mt-4 {
    margin-top: 16px;
  }
  .avatar-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .el-button + .el-button {
    margin-left: 8px;
  }
  .flex-col {
    flex-direction: column;
    gap: 8px;
  }
</style>
