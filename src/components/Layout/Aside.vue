<script setup lang="ts">
  import Dropdown from '../global/Dropdown.vue'
  import { dropDownItems3 } from '@/common'
  import { computed } from 'vue'
  import { useUserStore } from '@/store/user'
  import { openLoginDialog } from '@/hooks/useLoginDialog'
  import type { NavigationItem } from '@/types/item'

  const userStore = useUserStore()

  defineEmits([
    'click-menu-item', // 点击选项
    'click-nav-item', // 点击选项
  ])

  const props = defineProps<{
    items: NavigationItem[]
    activeItem?: NavigationItem
  }>()

  const items_ = computed(() => {
    if (props.items.length > 0)
      return props.items.slice(0, userStore.isLogin ? 4 : 3)
  })
</script>

<template>
  <div class="aside">
    <!-- 按钮组 -->
    <!-- prettier-ignore -->
    <template v-for="item in items_">
      <button :class="{ active: item === props.activeItem }" @click="$emit('click-nav-item', item)">
        <component :is="item.icon"></component>
        <span>{{ item.name }}</span>
      </button>
    </template>
    <!-- 登录按钮 -->
    <button
      class="login-btn"
      v-if="!userStore.isLogin"
      @click="openLoginDialog">
      <span>登录</span>
    </button>

    <!-- 浮动框 -->
    <div
      class="float-box"
      @click="openLoginDialog"
      v-if="!userStore.isLogin">
      <span >马上登录即可</span>
      <span class="flex ga-2"><Pointer />刷到更懂你的优质内容</span>
      <span class="flex ga-2"><Position />搜索最新种草、拔草信息</span>
      <span class="flex ga-2"><Star />查看收藏、点赞笔记</span>
      <span class="flex ga-2"><ChatSquare />与他人更好地互动、交流</span>
    </div>

    <!-- 更多菜单 -->
    <Dropdown
      @click-item="item => $emit('click-menu-item', item)"
      :items="dropDownItems3"
      placement="top-start"
      trigger="click">
      <button>
        <MoreFilled />
        <span>更多</span>
      </button>
    </Dropdown>
  </div class="aside">
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .aside {
    margin-top: 72px;
    margin-left: 16px;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    width: 270px;
    height: calc(100% - 72px);

    > :last-child {
      margin-top: auto;
      margin-bottom: 20px;
    }

    .mobile-mode({
      width: 0;
      display: none;
    });
  }

  // 按钮组样式
  button {
    font-size: 16px;
    font-weight: 1000;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .btn-large();

    color: var(--text-color-dark);

    svg {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &.active {
      background-color: var(--background-color-dark);
    }
  }

  // 登录按钮样式
  .login-btn {
    color: var(--background-color);
    background-color: var(--primary-color);
    justify-content: center;

    &:hover {
      color: var(--background-color) !important;
      background-color: var(--primary-color) !important;
    }
  }

  .float-box {
    padding: 16px;
    display: flex;
    flex-direction: column;

    border: 1px solid var(--border-color);
    border-radius: 16px;
    cursor: pointer;

    span {
      &:first-of-type {
        color: var(--text-color-dark);
        margin-bottom: 12px;
      }

      &:not(:last-of-type) {
        margin-bottom: 8px;
      }

      color: var(--text-color-light);
      font-size: 14px;
      line-height: 120%;

      svg {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }
</style>
