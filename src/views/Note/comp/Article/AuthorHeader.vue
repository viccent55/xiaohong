<script setup lang="ts">
  import Avatar from "@/components/Avatar.vue";
  import CloseButton from "@/components/global/CloseButton.vue";
  import FollowButton from "@/components/global/FollowButton.vue";
  import { type UserInfo } from "@/types/info";

  const props = defineProps<{ author: UserInfo }>();

  const emits = defineEmits(["click-close", "click-author", "click-follow"]);

  const clickFollow = () => {
    emits("click-follow", props.author.id);
  };
</script>

<template>
  <div class="author-header rounded-r-2xl">
    <CloseButton
      class="close-btn"
      @click="$emit('click-close')"
    />
    <a @click="$emit('click-author', props.author.id)">
      <Avatar :src="props.author?.avatar" />
      <span>{{ props.author?.nickname }}</span>
    </a>
    <FollowButton
      :is-follow="props.author?.isFollow"
      @click="clickFollow"
    />
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .author-header {
    position: sticky;
    top: 0;
    z-index: 90;
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    background-color: var(--background-color);

    a {
      display: flex;
      align-items: center;
    }

    img {
      width: 40px;
      height: 40px;
      border: 1px solid var(--border-color);
      border-radius: 50%;
    }

    span {
      margin-left: 12px;
      font-size: 16px;
      line-height: 16px;

      &:hover {
        color: var(--text-color-dark);
      }
    }

    .pc-mode({
      padding-right: 64px;
    });

    .mobile-mode({
      padding-left: 64px;
    });
  }

  // 关闭按钮
  .close-btn {
    position: absolute;
    right: 12px;
    top: 12px;

    .mobile-mode({
      left: 12px;
    });
  }
</style>
