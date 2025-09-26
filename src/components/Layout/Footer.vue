<script setup lang="ts">
  import type { NavigationItem } from "@/types/item";
  import { dropDownItems3 } from "@/common";
  import useVariable from "@/composables/useVariable";

  defineEmits([
    "click-menu-item", // 点击选项
    "click-nav-item", // 点击选项
  ]);
  defineProps<{
    items: NavigationItem[];
    activeItem: string;
  }>();
  const { store } = useVariable();
</script>

<template>
  <div class="footer">
    <template
      v-for="item in items"
      :key="item.name"
    >
      <div
        class="channel-wrapper"
        :class="{ active: store.mode === item.mode }"
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

          <div
            class="text-xs mt-1"
            :class="{ 'text-red-600': store.mode === item.mode }"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          v-else
          @click="$emit('click-nav-item', item)"
          class="flex justify-center items-center flex-col"
        >
          <el-icon :size="24"><component :is="item.icon" /></el-icon>
          <div
            class="text-xs mt-1"
            :class="{ 'text-red-600': store.mode === item.mode }"
          >
            {{ item.name }}
          </div>
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
    height: var(--footer-height-mobile, 80px);
    width: 100%;
    display: flex;
    background-color: var(--background-color);
    // padding: 12px 0;
    padding-bottom: 10px;
    .pc-mode({
      display: none;
    });
  }

  .channel-wrapper {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active i {
      color: var(--primary-color) !important;
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
