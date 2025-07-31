<script setup lang="ts">
  import { useUserStore } from '@/store/user'
  const userStore = useUserStore()

  const props = withDefaults(
    defineProps<{
      total: number
      fulled: boolean
    }>(),
    {
      total: 0,
    },
  )

  const emits = defineEmits(['more-comments'])

  const on = () => {
    if (userStore.isLogin && !props.fulled) {
      console.log('get more comments')
      emits('more-comments')
    }
  }
</script>

<template>
  <div
    class="comments-container"
    v-infinite-scroll="on"
    :infinite-scroll-distance="500"
    :infinite-scroll-immediate="false">
    <slot name="content"></slot>
    <div class="total">共 {{ total }} 条评论</div>
    <slot></slot>
    <div
      class="gain-more"
      v-if="!userStore.isLogin">
      登录以查看更多评论
    </div>
    <div
      class="gain-more"
      v-if="fulled">
      --End--
    </div>
  </div>
</template>

<style scoped lang="less">
  .comments-container {
    width: 100%;
    // overflow: auto;
    scrollbar-width: none;
    padding: 16px 8px;
    border-top: 1px solid var(--border-color);
  }

  .total {
    margin-left: 8px;
    margin-bottom: 12px;
    font-size: 14px;
  }

  .gain-more {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: var(--text-color-dark);
    font-weight: 600;
  }
</style>
