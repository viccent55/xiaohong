<script setup lang="ts">
  import { ElCard } from "element-plus";
  import Image from "./Image.vue";
  // props for dynamic apps
  defineProps<{
    apps: {
      name: string;
      image: string;
      url: string;
    }[];
  }>();
</script>

<template>
  <el-card
    shadow="never"
    class="rounded-xl border border-gray-200"
  >
    <div class="grid grid-cols-2 gap-2 justify-items-center">
      <a
        v-for="(app, index) in apps"
        :key="index"
        :href="app.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center space-y-2 hover:opacity-80"
      >
        <Image
          :src="app.image"
          :alt="app.name"
          style="width: 32px; height: 32px"
        />
        <span class="text-xs text-gray-700">{{ app.name }}</span>
      </a>
    </div>
  </el-card>
</template>
