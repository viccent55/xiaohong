<script setup lang="ts">
  import { onMounted, reactive } from "vue";
  import { articlList } from "@/api/article";
  const state = reactive({
    data: [] as EmptyArrayType,
    loading: false,
  });
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
  onMounted(() => {
    getData();
  });
</script>

<template>
  <div class="center-wrapper">
    <el-row>
      <el-col
        :span="24"
        v-for="(item, index) in state.data"
        :key="index"
      >
        <el-card
          shadow="hover"
          body-style="padding:0; border: none"
          class="mx-4 my-2 article-card"
          @click=""
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
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
  .center-wrapper {
    display: flex;
    justify-content: center;

    width: 100%;
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
    color: #333;
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
