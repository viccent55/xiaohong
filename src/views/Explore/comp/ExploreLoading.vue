<script setup lang="ts">
  defineProps<{
    loading: boolean
  }>()
</script>

<template>
  <div
    class="loading-wrapper"
    v-loading="loading"
    :class="{ active: loading }"></div>
</template>

<style scoped lang="less">
  .loading-wrapper {
    width: 100%;
    height: 0;
    transition: height 0.5s ease;
    position: sticky;
    top: 0;

    &.active {
      height: 100px;
    }
  }
</style>
