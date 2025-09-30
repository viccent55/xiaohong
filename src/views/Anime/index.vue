<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { animeList } from "@/api/anime";
  import Image from "@/components/Image.vue";
  import { useNoteAnimeDialog } from "@/hooks/useNoteAnimeDialog";
  import useVariable from "@/composables/useVariable";
  import ExploreLoading from "@/views/Explore/comp/ExploreLoading.vue";

  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
    page: 1,
    isNoMore: false,
  });
  const { clearQuery } = useVariable();
  const getData = async () => {
    state.loading = true;
    try {
      const request = {
        page: state.page,
        limit: 30,
      };
      const response = await animeList(request);
      if (response.errcode === 0 && response.data.items.length > 0) {
        console.log(response.data.items);
        state.data.push(...response.data.items);
      } else if (response.errcode == -1) {
        state.isNoMore = true;
      }
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  const noteDialog = useNoteAnimeDialog();
  const openDialog = (id: string) => {
    clearQuery();
    noteDialog.openNoteDialog(String(id));
  };

  const loadMore = async () => {
    if (state.loading || state.isNoMore) return;
    state.page++;
    await getData();
  };
  onMounted(() => {
    getData();
  });
</script>

<template>
  <div
    class="anime-wrapper pb-14 md:pb-0"
    v-infinite-scroll="loadMore"
    :loading="state.loading"
    :infinite-scroll-distance="300"
    :infinite-scroll-immediate="false"
  >
    <el-row
      :gutter="12"
      class="md:p-5 p-0"
    >
      <el-col
        :span="8"
        :sm="6"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <el-card
          shadow="never"
          class="news-card h-[120px] md:h-[260px]"
          body-style="padding:0"
          @click="openDialog(item.id)"
        >
          <!-- Cover Image -->
          <Image
            :src="item.cover"
            fit="cover"
          />
        </el-card>
        <!-- Content -->
        <div class="text-sm md:text-base">
          {{ item.title }}
        </div>
      </el-col>
      <el-col :span="24">
        <ExploreLoading :loading="state.loading" />
      </el-col>
    </el-row>
    <div
      class="flex justify-center text-xl py-2"
      v-if="!state.data.length"
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
  @import "@/assets/styles/base.less";
  .anime-wrapper {
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
    border: none;
    margin-bottom: 8px;
  }

  .card-cover {
    width: 100%;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .card-content .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }
</style>
