<script setup lang="ts">
  import { type DateInfo } from "@/types/info";
  import { formatTime } from "@/composables/useFormatTime";

  withDefaults(
    defineProps<{
      date: DateInfo;
      isAuthor?: boolean;
    }>(),
    {
      isAuthor: false,
    }
  );
</script>

<template>
  <div class="date">
    <span v-if="isAuthor">编辑于</span>
    <span>{{ formatTime(date?.date) }}</span>
    <span>{{ date?.location }}</span>
  </div>
</template>

<style scoped lang="less">
  .date {
    font-size: 12px;
    span {
      font-size: inherit;
      margin-right: 4px;
    }
  }
</style>
