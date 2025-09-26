<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { animeList } from "@/api/anime";
  import Image from "@/components/Image.vue";
  import ExploreFeed from "../Explore/comp/ExploreFeed.vue";

  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
  });
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
  onMounted(() => {
    getData();
  });
</script>

<template>
  <div class="py-3 px-5">
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

<style scoped>
  .news-card {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: none;
    height: 180px;
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
    color: #333;
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .card-content .meta {
    font-size: 12px;
    color: #999;
  }
</style>
