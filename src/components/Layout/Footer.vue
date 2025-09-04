<script setup lang="ts">
  import type { NavigationItem } from "@/types/item";
  import { dropDownItems3 } from "@/common";

  defineEmits([
    "click-menu-item", // 点击选项
    "click-nav-item", // 点击选项
  ]);
  defineProps<{
    items: NavigationItem[];
    activeItem: NavigationItem;
  }>();
</script>

<template>
  <div class="footer">
    <template
      v-for="item in items"
      :key="item.name"
    >
      <div
        class="channel-wrapper"
        :class="{ active: activeItem?.mode === item.mode }"
      >
        <div v-if="item.icon == 'Setting'">
          <Dropdown
            @click-item="(item: NavigationItem) => $emit('click-menu-item', item)"
            :items="dropDownItems3"
            placement="top-start"
            trigger="click"
          >
            <el-icon :size="24"><component :is="item.icon" /></el-icon>
          </Dropdown>

          <span>{{ item.name }}</span>
        </div>
        <div
          v-else
          @click="$emit('click-nav-item', item)"
        >
          <el-icon :size="24"><component :is="item.icon"/></el-icon>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .footer {
    z-index: 16;
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

    &.active i{
      color: var(--primary-color)!important;
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
