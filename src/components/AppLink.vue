<script setup lang="ts">
  import { ElCard } from "element-plus";
  import AdvertSlot from "./AdvertSlot.vue";
  // props for dynamic apps
  defineProps<{
    apps: {
      name: string;
      image: string;
      url: string;
    }[];
  }>();
  defineEmits(["item-click"]);
</script>

<template>
  <el-card
    shadow="never"
    class="rounded-xl border border-gray-200 card"
  >
    <div class="grid grid-cols-2 gap-2 justify-items-center">
      <a
        v-for="(app, index) in apps"
        :key="index"
        :href="app.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col items-center space-y-2 hover:opacity-80"
        @click="$emit('item-click', app)"
      >
        <AdvertSlot
          :advert="{
            title: app.name,
            image: app.image,
            url: app?.url,
          }"
          fit="cover"
          style="width: 32px; height: 32px"
        />
        <span class="text-xs text-gray-700">{{ app.name }}</span>
      </a>
    </div>
  </el-card>
</template>
<style>
  .card .el-card__body {
    padding: 10px;
  }
</style>
