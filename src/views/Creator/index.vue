<script setup lang="ts">
  import { onMounted } from "vue";
  const handleClick = () => {
    window.open("https://t.me/HFDHG9985", "_blank");
  };
  onMounted(() => {});
</script>

<template>
  <div class="py-3 px-5">
    <el-row gutter="8">
      <el-col :span="24">
        <el-card
          shadow="never"
          body-style="padding:0; "
          style="border: none; margin: 0"
          @click="handleClick"
        >
          <!-- Content -->
          <el-image
            lazy
            src="/creator.jpg"
            fit="contain"
          >
            <template #placeholder>
              <div class="image-slot">Loading...</div>
            </template>
          </el-image>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }
</style>
