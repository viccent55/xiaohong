<script setup lang="ts">
  const props = defineProps<{
    action: EmptyObjectType;
    total: number;
  }>();

  const emits = defineEmits(["click-like", "click-star", "click-share"]);
</script>

<template>
  <div class="bottom-action rounded-b-2xl">
    <div class="actions-container">
      <div
        class="action"
        :class="{ 'star-active': action?.isLike }"
        @click="$emit('click-like', action)"
      >
        <Heart />
        <span>{{ action?.like_count }}</span>
      </div>
      <div
        class="action"
        :class="{ 'star-active': action?.isStar }"
        @click="$emit('click-star', action)"
      >
        <Star />
        <span>{{ action?.star_count }}</span>
      </div>
      <div
        class="action"
        @click="$emit('click-share')"
      >
        <Share />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .bottom-action {
    background-color: var(--background-color);
    position: sticky;
    bottom: 0;
    padding: 16px;
    display: flex;
    margin-top: auto;
    height: max-content;
    justify-content: end;

    border-top: 1px solid var(--border-color);


    .mobile-mode({
      width: 100%;
    });
  }

  .actions-container {
    width: fit-content;
    display: flex;
  }

  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
      margin: 8px;
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 16px;
      color: var(--text-color-dark);
      transform: translateX(-4px);
    }
  }
</style>
