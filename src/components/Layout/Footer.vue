<script setup lang="ts">
  import type { NavigationItem } from '@/types/item'

  defineEmits(['click-nav-item'])

  defineProps<{
    items: NavigationItem[]
    activeItem?: NavigationItem
  }>()
</script>

<template>
  <div class="footer">
    <template
      v-for="item in items"
      :key="item.label">
      <div
        class="channel-wrapper"
        :class="{ active: activeItem === item }"
        @click="$emit('click-nav-item', item)">
        <el-icon :size="24"><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .footer {
    z-index: 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 48px;
    width: 100%;
    display: flex;
    background-color: var(--background-color);

    .pc-mode({
      display: none;
    });
  }

  .channel-wrapper {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active {
      color: var(--text-color-dark);
      font-weight: 600;
    }

    svg {
      width: 24px;
      height: 24px;
    }

    span {
      margin-left: 8px;

      .phone-mode({
          display: none;
      });
    }
  }
</style>
