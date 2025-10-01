<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { articlList } from "@/api/article";
  import Image from "@/components/Image.vue";
  import { useNoteArticleDialog } from "@/hooks/useNoteArticleDialog";
  import useVariable from "@/composables/useVariable";
  import ExploreLoading from "@/views/Explore/comp/ExploreLoading.vue";

  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
    page: 1,
    isNoMore: false,
    total: 0,
  });
  const { clearQuery } = useVariable();

  const getData = async () => {
    state.loading = true;
    try {
      const request = {
        page: state.page,
        limit: 30,
      };
      const response = await articlList(request);
      if (response.errcode === 0 && response.data.items.length > 0) {
        state.data.push(...response.data.items);
        state.total = response.data.count;
      } else if (response.errcode == -1) {
        state.isNoMore = true;
      }
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
  const loadMore = async () => {
    if (state.loading || state.isNoMore || state.data.length >= state.total)
      return;
    state.page++;
    await getData();
  };
  onMounted(() => {
    getData();
  });
</script>

<template>
  <div
    class="artile-wrapper mb-28 md:mb-0"
    v-infinite-scroll="loadMore"
    :loading="state.loading"
    :infinite-scroll-distance="300"
    :infinite-scroll-immediate="false"
  >
    <el-row
      :gutter="24"
      class="md:p-5 p-0 md:pt-0"
    >
      <el-col
        :span="24"
        :md="12"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <el-card
          shadow="never"
          body-style="padding:0; border: none"
          class="my-2 md:mt-5 md:mb-2 article-card cursor-pointer md:max-h-[260px] max-h-[140px]"
          @click="openDialog(item.id)"
        >
          <!-- Cover Image -->
          <Image
            :src="item.cover"
            fit="cover"
            class="card-cover"
          />
        </el-card>
        <div class="title text-center">
          {{ item.title }}
        </div>
      </el-col>
      <el-col :span="24">
        <ExploreLoading :loading="state.loading" />
      </el-col>
    </el-row>

    <div
      class="flex justify-center text-xl py-2"
      v-if="!state.data.length && !state.loading"
    >
      <el-empty
        :image-size="120"
        class="mt-0 pt-0"
        description="没有更多了"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
  .artile-wrapper {
    width: 100%;
    max-height: calc(100vh - 150px);
    overflow-y: auto;
    padding: 0 12px;
    scrollbar-width: none;
  }

  .news-card {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }

  .card-cover {
    width: 100%;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .title {
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
