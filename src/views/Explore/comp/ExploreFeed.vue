<script setup lang="ts">
  import Heart from "@/components/global/Heart.vue";
  import Image from "@/components/Image.vue";
  import type { PropType } from "vue";

  defineProps({
    feed: {
      type: Object as PropType<EmptyObjectType>,
      default: () => [],
    },
  });
  defineEmits(["click", "clickAuthor", "clickLike"]);
</script>

<template>
  <!-- prettier-ignore -->
  <div class="feed-wrapper" @click="$emit('click')">
    <!-- 图片 -->
    <div class="media-container">
      <VideoPlay v-if="!feed.isPic" />
      <Image :src="feed.cover" :width="feed.cover_w" :height="feed.cover_h" fit="contain"/>
    </div>
    <!-- 信息 -->
    <div class="feed-footer">
      <!-- 标题 -->
      <a class="title">{{ feed.title }}</a>
      
      <div class="author-wrapper">
        <!-- 作者名称头像 -->
        <div class="info-wrapper" @click.stop="$emit('clickAuthor') /* 阻止冒泡 */">
          <Image :src="feed.author?.avatar" />
          <span>{{ feed.author?.name }}</span>
        </div>

        <!-- 点赞数 -->
        <div class="like-wrapper" @click.stop="$emit('clickLike') /* 阻止冒泡 */">
          <Heart :class="{ 'like-active': feed.isLiked }" />
          <span>{{ feed.like_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .feed-wrapper {
    width: 100%;
    height: fit-content;
    break-inside: avoid;
    margin-bottom: 16px;
    background: var(--background-color);
    border-radius: 16px;
    // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .media-container {
      width: 100%;
      height: auto;
      transition: filter 0.2s;
      border-radius: 16px;
      position: relative;
      overflow: hidden;

      &:hover {
        cursor: pointer;
        filter: brightness(80%);
      }

      img {
        width: 100%;
        height: auto;
      }

      svg {
        position: absolute;
        right: 16px;
        top: 16px;
      }
    }

    .feed-footer {
      padding: 12px;

      .title {
        display: block;
        font-size: 14px;
        width: 100%;
        margin-bottom: 8px;
        cursor: auto;
        color: var(--text-color-dark);
      }

      .author-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;

        span {
          font-size: 12px;
        }

        .info-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            border-radius: 50%;
          }
        }

        .like-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;

          svg {
            width: 14px;
            height: 14px;
            margin-right: 2px;
          }
        }
      }
    }
  }
</style>
