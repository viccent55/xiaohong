<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { articlList } from "@/api/article";
  import Image from "@/components/Image.vue";
  import { useNoteArticleDialog } from "@/hooks/useNoteArticleDialog";
  import useVariable from "@/composables/useVariable";

  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
  });
  const { clearQuery } = useVariable();

  const getData = async () => {
    state.loading = true;
    try {
      const response = await articlList({});
      state.data = response.data.items ?? [];
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  const noteDialog = useNoteArticleDialog();
  const openDialog = (id: string) => {
    clearQuery();
    noteDialog.openNoteDialog(String(id));
  };
  onMounted(() => {
    getData();
  });
</script>

<template>
  <div class="artile-wrapper mb-28 md:mb-0">
    <el-card
      v-for="(item, index) in state.data"
      :key="index"
      shadow="hover"
      body-style="padding:0; border: none"
      class="my-2 article-card"
      @click="openDialog(item.id)"
    >
      <!-- Cover Image -->
      <Image
        :src="item.cover"
        fit="cover"
        class="card-cover"
      />

      <!-- Content -->
      <div class="card-content">
        <span class="title">
          {{ item.title }}
        </span>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="less">
  .artile-wrapper {
    width: 100%;
    // max-height: calc(90vh - 160px);
    overflow-y: auto;
    padding: 0 12px;
  }

  .news-card {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }

  .card-cover {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .card-content .title {
    font-size: 16px;
    font-weight: 500;
    padding: 0 12px;
    // color: #333;
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .card-content .meta {
    font-size: 12px;
    color: #999;
  }
  .article-card {
    border: none;
  }
</style>
