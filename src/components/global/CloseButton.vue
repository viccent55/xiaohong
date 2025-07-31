<script setup lang="ts">
  defineEmits(['click'])
</script>

<template>
  <div
    class="close"
    @click="$emit('click')">
    <Close />
  </div>
</template>

<style scoped lang="less">
  // 关闭按钮
  .close {
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    width: fit-content;

    &:hover {
      background-color: var(--background-color-dark);
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
</style>
