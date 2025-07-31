<script setup lang="ts">
  defineProps<{
    hasMore: boolean
  }>()

  defineEmits(['click-more'])
</script>

<template>
  <div class="bottom-wrapper">
    <button
      v-if="hasMore"
      @click="$emit('click-more')">
      获取更多
    </button>
    <span v-else> --END-- </span>
  </div>
</template>

<style scoped lang="less">
  .bottom-wrapper {
    font-weight: 700;
    color: var(--text-color-dark);
    display: flex;
    justify-content: center;

    button {
      cursor: pointer;
      background-color: transparent;
      padding: 8px 16px;
      font-weight: 700;
      color: var(--text-color-dark);
    }

    margin-bottom: 72px;
  }
</style>
