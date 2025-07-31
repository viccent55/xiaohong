<script setup lang="ts">
  import type { ExploreFLoatSetItem } from '@/types/item'

  defineProps<{
    items: ExploreFLoatSetItem[]
  }>()

  defineEmits(['click-item'])
</script>

<template>
  <div class="float-set">
    <template
      v-for="item in items"
      :key="item.label">
      <div
        class="item"
        :class="{ active: item.active }"
        @click="$emit('click-item', item)">
        <component :is="item.icon" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .float-set {
    z-index: 16px;
    position: absolute;
    bottom: 24px;
    gap: 8px;
    display: flex;
    flex-direction: column;

    .pc-mode({
      right: @pc-right-padding;
    });

    .pad-mode({
      right: @pad-right-padding;
      bottom: 72px;
    });

    .phone-mode({
      right: @phone-right-padding;
      bottom: 72px;
    });
  }

  .item {
    width: 38px;
    height: 38px;
    border: 1px solid var(--border-color);
    border-radius: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background-color);

    &:hover {
      cursor: pointer;
      color: var(--text-color-dark);
    }

    &.active {
      border-color: black;
    }
  }
</style>
