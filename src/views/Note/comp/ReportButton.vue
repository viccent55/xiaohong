<script setup lang="ts">
  defineEmits(['click-report'])
</script>

<template>
  <div class="report-wrapper">
    <el-dropdown trigger="click">
      <div class="more">
        <MoreFilled />
      </div>
      <template #dropdown>
        <el-dropdown-item @click="$emit('click-report')">
          <span>举报</span>
        </el-dropdown-item>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="less">
  .report-wrapper {
    width: fit-content;
    cursor: pointer;

    .more {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        background-color: var(--background-color-dark);
      }
    }
  }

  span {
    padding: 12px 16px;
    border-radius: 4px;
  }
</style>
