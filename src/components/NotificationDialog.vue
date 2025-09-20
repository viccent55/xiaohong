<script setup lang="ts">
  import { ref } from "vue";

  const emit = defineEmits(["retry"]);

  const dialogVisible = ref(false);

  const open = () => {
    dialogVisible.value = true;
  };

  const onRetry = () => {
    emit("retry");
    // The dialog will be closed by the parent component upon successful retry.
  };

  defineExpose({
    open,
  });
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="350px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
    align-center
  >
    <div class="mt-5">小红书正在维护 可能无法获取信息。请稍后重试</div>
    <template #footer>
      <el-button
        type="primary"
        @click="onRetry"
      >
        重试
      </el-button>
    </template>
  </el-dialog>
</template>
