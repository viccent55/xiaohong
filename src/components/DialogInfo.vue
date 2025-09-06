<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { ElDialog } from "element-plus";
  import { getPageInfo } from "@/api/pageinfo";
  import { Close } from "@element-plus/icons-vue";
  import { screenMode } from "@/hooks/useScreenMode";

  const dialogVisible = ref(false);
  const loading = ref(false);
  const state = reactive({
    name: "",
    title: "",
    content: "",
  });
  async function open(item: Record<string, string>) {
    dialogVisible.value = true;
    loading.value = true;
    // Reset previous state
    state.name = "Loading...";
    state.content = "";

    try {
      const response = await getPageInfo(item.page);
      state.name = response.data.name;
      state.title = response.data.title;
      state.content = response.data.content;
    } catch (error) {
      console.error("Failed to fetch dialog data:", error);
      state.name = "Error";
      state.content = "Failed to load content. Please try again later.";
    } finally {
      loading.value = false;
    }
  }

  const handleClose = (done: () => void) => {
    done();
  };

  defineExpose({
    open,
  });
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :before-close="handleClose"
    :show-close="false"
    :width="screenMode === 'phone' ? '90%' : ''"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="flex justify-end pr-1">
        <el-button
          @click="close"
          :icon="Close"
          circle
        />
      </div>
    </template>
    <el-row v-loading="loading">
      <el-col>
        <div
          class="text-2xl flex justify-center font-bold mb-2"
          tag="h1"
        >
          {{ state.name }}
        </div>
        <div class="flex justify-center">
          {{ state.title }}
        </div>
        <p
          class="mt-2"
          v-html="state.content"
        ></p>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped></style>
