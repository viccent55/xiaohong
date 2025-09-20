<script setup lang="ts">
  import useVariable from "@/composables/useVariable";
  import Date from "../Date.vue";

  defineProps<{
    article: EmptyObjectType;
  }>();

  defineEmits(["click-report", "click-ads"]);
  const { store } = useVariable();
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

      <!-- <ReportButton @click-report="$emit('click-report', article?.id)" /> -->
    </div>
    <div
      class="mt-2"
      :class="{
        'flex gap-8 justify-end': store?.detailAppAds.length <= 3,
        'grid grid-cols-4 gap-3 justify-end': store?.detailAppAds.length > 3,
      }"
    >
      <a
        v-for="(app, index) in store?.detailAppAds"
        :key="index"
        :href="app.url || '#'"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 hover:opacity-80"
        @click="$emit('click-ads', app.id)"
      >
        <AdvertSlot
          :advert="{
            title: app.name,
            image: app.image,
            url: app?.url,
          }"
          fit="cover"
          style="width: 28px; height: 28px"
        />
        <span class="text-xs info">{{ app.name }}</span>
      </a>
    </div>
    <!-- <div>{{ getCurrentDomain() }}</div> -->
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
      font-size: 14px;
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
