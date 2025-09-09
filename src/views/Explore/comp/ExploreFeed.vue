<script setup lang="ts">
  import { PERMISSION } from "@/common/permision";
  import AdvertSlot from "@/components/AdvertSlot.vue";
  import Avatar from "@/components/Avatar.vue";
  import Heart from "@/components/global/Heart.vue";
  import Image from "@/components/Image.vue";
  import { checkPermissions } from "@/hooks/usePermisions";
  import type { PropType } from "vue";
  import * as Api from "@/api/note";
  import { useStore } from "@/store";

  defineProps({
    feed: {
      type: Object as PropType<EmptyObjectType>,
      default: () => [],
    },
  });
  const store = useStore();
  const onClickLike = async (feed: EmptyObjectType) => {
    checkPermissions(PERMISSION.User, () => {
      const id_ = feed.id;
      Api.like(id_).then((res) => {
        if (res.errcode == 0) {
          feed.isLike = !feed.isLike;
          if (feed.isLike) {
            feed.like_count++;
          } else {
            feed.like_count--;
          }
        }
      });
    });
  };

  defineEmits(["click", "clickAuthor"]);
</script>

<template>
  <!-- prettier-ignore -->
  <div class="feed-wrapper" @click="$emit('click')">
    <div class="media-container">
      <video-play class="absolute z-10 text-white" v-if="feed.mode == 1" />
      <Picture class="absolute z-10 text-white" v-if="feed.mode == 2" />
      <div v-if="feed.mode === 3"
     class="absolute right-2 top-4 z-10 bg-yellow-400  text-xs font-semibold px-2 py-0.5 rounded-full shadow animate-bounce"> 广告</div>
      <AdvertSlot v-if="feed.mode === 3" :advert="{
        id: feed?.advert?.id,
        name: feed?.advert?.name,
        image: feed?.cover,
        url: feed?.advert?.value

      }" :width="`${feed.cover_w}`"  :height="`${feed.cover_h}`" />
      <Image v-else :src="feed.cover" :width="`${feed.cover_w}`"  :height="`${feed.cover_h}`" fit="cover"/>
    </div>
    <!-- 信息 -->
    <div class="feed-footer">
      <!-- 标题 -->
      <a class="title">{{ feed.title }}</a>
      
      <div class="author-wrapper">
        <!-- 作者名称头像 -->
        <div class="info-wrapper" @click.stop="() => {
          store.mode = '-1';
          $emit('clickAuthor');
        }">
          <a :href="feed.author?.id ? `/#/user/${feed.author.id}` : '#'" class="flex items-center gap-1">
          <Avatar :src="feed.author?.avatar" :id="feed.id"/>
          <span class="info">{{ feed.author?.name || feed.author?.nickname }}</span>
            </a>
        </div>

        <!-- 点赞数 -->
        <div class="like-wrapper" @click.stop="onClickLike(feed)">
          <Heart :class="{ 'text-red-500': feed.isLike }" />
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
        color: var(--text-color-secondary);

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
            fill: currentColor;
          }
        }
      }
    }
  }
</style>
