<script setup lang="ts">
  import type { ArticleInfo } from "@/types/info";
  import Date from "../Date.vue";
  import ReportButton from "../ReportButton.vue";

  defineProps<{
    article: EmptyObjectType;
  }>();

  defineEmits(["click-report"]);
</script>

<template>
  <div class="note-content">
    <div class="title">{{ article?.title }}</div>
    <div class="content">{{ article?.content }}</div>
    <div class="date-wrapper">
      <Date
        isAuthor
        :date="{
          date: article?.created_at,
          location: article?.author?.location,
        }"
        class="date"
      />
      <ReportButton @click-report="$emit('click-report', article?.id)" />
    </div>
  </div>
</template>

<style scoped lang="less">
  .note-content {
    padding: 16px;

    .title {
      font-size: 18px;
      color: var(--text-color-dark);
      margin-bottom: 8px;
      font-weight: 800;
    }

    .content {
      font-size: 16px;
    }

    .date {
      font-size: 14px;
    }

    .date-wrapper {
      margin-top: 12px;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
</style>
