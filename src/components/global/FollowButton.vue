<script setup lang="ts">
  defineProps<{
    isFollow: boolean;
  }>();

  defineEmits(["click"]);
</script>

<template>
  <button
    size="small"
    @click="$emit('click')"
    :class="{ active: isFollow }"
  >
    {{ isFollow ? "已关注" : "关注" }}
  </button>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  button {
    margin-left: auto;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 600;
    width: 96px;
    height: 32px;
    border-radius: 100px;
    line-height: 32px;
    text-align: center;

    background-color: var(--primary-color);
    color: var(--background-color);

    &.active {
      color: var(--text-color);
      background-color: var(--background-color-dark);
    }

    .phone-mode({
      font-size: 14px;
      font-weight: 500;
      width: 80px;
      height: 32px;
      white-space: nowrap;
      display: flex;
      justify-content: center;
    });
  }
</style>
