<script setup lang="ts">
  import { type ActionInfo } from "@/types/info";

  defineProps<{
    action: ActionInfo;
  }>();

  defineEmits(["click-like", "click-comment"]);
</script>

<template>
  <div class="inter-action">
    <a
      @click="$emit('click-like')"
      :class="{ 'like-active': action?.isLike }"
    >
      <Heart />
      {{ action?.like_count }}
    </a>
    <a @click="$emit('click-comment')">
      <ChatSquare />
      回复
    </a>
  </div>
</template>

<style scoped lang="less">
  img {
    fill: var(--text-color);
    width: 12px;
    height: 12px;
  }

  svg {
    width: 12px;
    height: 12px;
    margin-right: 2px;
  }

  .inter-action {
    display: flex;
    a {
      display: flex;
      align-items: center;

      font-size: 12px;

      &:last-of-type {
        margin-left: 8px;
      }
    }
  }
</style>
