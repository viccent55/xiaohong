<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { animeList } from "@/api/anime";
  import Image from "@/components/Image.vue";
  import { useNoteAnimeDialog } from "@/hooks/useNoteAnimeDialog";
  import useVariable from "@/composables/useVariable";

  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
  });
  const { clearQuery } = useVariable();
  const getData = async () => {
    state.loading = true;
    try {
      const response = await animeList({});
      state.data = response.data.items ?? [];
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

  onMounted(() => {
    getData();
  });
</script>

<template>
  <div class="anime-wrapper pb-14 md:pb-0">
    <el-row gutter="8">
      <el-col
        :span="8"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <el-card
          shadow="never"
          class="news-card"
          body-style="padding:0; height:120px "
          @click="openDialog(item.id)"
        >
          <!-- Cover Image -->
          <Image
            :src="item.cover"
            fit="cover"
            height="120px"
          />

          <!-- Content -->
          <div class="card-content">
            <p class="title mt-2">
              {{ item.title }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";
  .anime-wrapper {
    width: 100%;
    // max-height: calc(90vh - 160px);
    overflow-y: auto;
    padding: 0 12px;
    margin-top: 10px;
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
    margin-bottom: 6px;
  }
</style>
