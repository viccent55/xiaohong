<script setup lang="ts">
  defineProps<{
    items: Record<string, string>[];
    activeValue: string;
  }>();

  defineEmits(["click-item"]);
</script>

<template>
  <div class="channel-container">
    <template
      v-for="item in items"
      :key="item.id"
    >
      <span
        @click="$emit('click-item', item)"
        :class="{ active: item.name === activeValue }"
      >
        {{ item.name }}
      </span>
    </template>
  </div>
</template>

<style scoped lang="less">
  .channel-container {
    height: 72px;
    width: 100%;
    display: flex;
    align-items: center;
    overflow: auto;
    scrollbar-width: none;

    span {
      height: 40px;
      padding: 0 16px;
      line-height: 40px;
      border-radius: 999px;
      font-weight: 400;
      white-space: nowrap;

      &:hover {
        cursor: pointer;
        background-color: var(--background-color-dark);
      }

      &.active {
        font-weight: 600;
        color: var(--text-color-dark);
        background-color: var(--background-color-dark);
      }
    }
  }
</style>
