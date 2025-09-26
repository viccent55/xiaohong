<script setup lang="ts">
  import ContentArticle from "@/components/ContentArticle.vue";
  import Comment from "./comment.vue";
  import { computed, onMounted, reactive, ref, watchEffect } from "vue";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { articleDtail } from "@/api/article";
  import { useRoute } from "vue-router";

  const state = reactive({
    data: <EmptyObjectType>{},
    isCollected: false,
    isLiked: false,
    loading: false,
  });
  const route = useRoute();

  const commentRef = ref();

  const mainContentCol = ref();

  const routeId = computed(() => route.params.id);
  const getDetailArticle = async () => {
    state.loading = true;
    try {
      const response = await articleDtail(Number(routeId.value));
      state.data = response.data;
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };
  watchEffect(() => {
    getDetailArticle();
  });
  const handle = {
    onCollect() {},
    onLikeArticle() {},
    onCommentClick() {
      checkPermissions(PERMISSION.User, () => {
        commentRef.value?.$el?.scrollIntoView({ behavior: "smooth" });
      });
    },
  };
  onMounted(() => {});
</script>

<template>
  <div
    class="py-3 px-5"
    ref="mainContentCol"
  >
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/article' }">
        最新文章
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">文章</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="position-fixed">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1 items-center">
          <el-avatar
            :size="36"
            class="cursor-pointer"
            @click="handle.onLikeArticle()"
          >
            <Heart />
          </el-avatar>
          <span class="text-xs text-disabled">
            {{
              state.isLiked
                ? state.data?.like_count + 1
                : state.data?.like_count
            }}
          </span>
        </div>
        <div class="flex flex-col gap-1 items-center">
          <el-avatar
            :size="36"
            class="cursor-pointer"
            @click="handle.onCollect()"
            :color="state.isCollected ? 'primary' : 'info'"
          >
            <Star />
          </el-avatar>
          <span class="text-xs text-disabled">
            {{
              state.isCollected
                ? state.data?.star_count + 1
                : state.data?.star_count
            }}
          </span>
        </div>
        <div
          class="flex flex-col gap-1 items-center"
          @click="handle.onCommentClick()"
        >
          <el-avatar
            :size="36"
            class="cursor-pointer"
            @click="handle.onCommentClick()"
          >
            <ChatSquare />
          </el-avatar>
          <span class="text-xs text-disabled">
            {{ state.data?.comment_count }}
          </span>
        </div>
      </div>
    </div>
    <el-card
      shadow="never"
      style="border: none"
      body-style="padding: 5px"
    >
      <h1 class="text-xl border-none">
        {{ state.data.title }}
      </h1>
      <div class="flex justify-end mb-3">
        <el-tag
          type="info"
          round
          size="small"
        >
          {{ state.data.category_name }}
        </el-tag>
      </div>
      <div class="intro bg-red-100 p-4 rounded info">
        {{ state.data?.intro }}
        HidoriRose金发碧眼，巨乳傲然撑爆紧身装，携手闺蜜全裸相对，粉嫩小穴湿漉漉！双头龙水晶大棒互相抽插白虎嫩逼
      </div>
      <ContentArticle :content="state.data.content" />
      <div></div>
      <Comment ref="commentRef" />
    </el-card>
  </div>
</template>

<style scoped lang="less">
  .position-fixed {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    z-index: 11;
  }
</style>
