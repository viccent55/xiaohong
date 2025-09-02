<script setup lang="ts">
  import { reactive, ref, watch } from "vue";
  import { ElMessage } from "element-plus";
  import { setUserInfo, changePassword } from "@/api/user";

  const dialogVisible = ref(false);
  const activeTab = ref("userinfo");

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
        ElMessage.success("两次输入的密码不一致");
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
</script>

<template>
  <el-button
    type="primary"
    size="small"
    @click="dialogVisible = true"
  >
    打开设置
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="用户设置"
    width="500px"
    destroy-on-close
  >
    <el-tabs v-model="activeTab">
      <!-- Update User Info -->
      <el-tab-pane
        label="用户信息"
        name="userinfo"
      >
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

          <el-form-item label="头像">
            <el-input
              v-model="userInfo.avatar"
              placeholder="头像地址"
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
</style>
