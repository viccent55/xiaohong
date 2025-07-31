<script setup lang="ts">
  const emits = defineEmits([
    'get-more', // 获取更多
  ])

  const on = () => {
    emits('get-more')
  }
</script>

<template>
  <!-- 列表容器 -->
  <!-- prettier-ignore -->
  <div 
    class="feeds-container"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="300"
    v-infinite-scroll="on">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .feeds-container {
    width: 100%;
    column-count: 4;
    column-gap: 20px;
    orphans: 1;
    widows: 1;
    // Responsive adjustments
    @media (min-width: 1400px) {
      column-count: 5;
    }

    @media (min-width: 1200px) and (max-width: 1400px) {
      column-count: 4;
    }

    @media (min-width: 695px) and (max-width: 1200px) {
      column-count: 3;
    }

    @media (max-width: 695px) {
      column-count: 2;
    }
  }
</style>
